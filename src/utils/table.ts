import { primaryKeys } from "./primaryKeys.js";
import { TableRow } from "./tableRow.js";
import type { Svupa } from "./svupa.js";
import { Conditions, Condition } from "./condition.js";
import { TableStore } from "./tableStore.js";

export class Table {
  name: string;
  schema: string;
  primaryKeys: primaryKeys;
  __store: TableStore;
  conditions: Conditions;
  svupa: Svupa;
  channel: any;
  rowCallback: Function;
  pessimisticBackup: PessimisticBackup;
  optimisticUpdates: boolean;

  constructor(
    svupa: Svupa,
    name: string,
    keys: primaryKeys | Array<string> | string,
    schema: string = "public",
    optimistic: boolean = false
  ) {
    this.svupa = svupa;
    this.name = name;
    this.schema = schema;
    this.optimisticUpdates = optimistic;
    this.pessimisticBackup = new PessimisticBackup(this);
    this.primaryKeys =
      keys instanceof primaryKeys ? keys : new primaryKeys(keys);
    this.__store = new TableStore(this);
    this.conditions = new Conditions();
    this.rowCallback = (row: TableRow) => {
      return row;
    };
  }

  async init() {
    await this._addInitialRows();
    await this._subscribeToChannel();
    return this;
  }

  async _subscribeToChannel() {
    let channel_name = `realtime_${this.schema}_${this.name}`;
    this.channel = this.svupa.supabase
      .channel(channel_name)
      .on(
        "postgres_changes",
        { event: "*", schema: this.schema, table: this.name },
        /*
                Filters are not applied for two reasons:
                    1.  There is no AND operator in Supabase Realtime, so only filtering for single conditions is possible.
                    2.  We need updates on rows that are not relevant anymore (according to the filter) to delete them from the store.
                        For example, if only rows with score < 5 should be displayed and an update causes the score to increase beyond 5 in the database, the row must be deleted from the store.
                */
        (payload) => {
          // get the new/deleted row and event type
          const { tableRow, event, timestamp } =
            this.__parseSubscriptionPayload(payload);

          // check if payload is relevant for this store, i.e. if it actually is subscribed to
          if (tableRow.checkConditions(this.conditions) === false) {
            // if it is not relevant anymore, delete it from the store
            this._deleteInternal(tableRow);
          } else if (event === "INSERT" || event === "UPDATE") {
            this._upsertInternal(tableRow, timestamp);
          } else if (event === "DELETE") {
            this._deleteInternal(tableRow);
          }
        }
      )
      .subscribe();
  }

  _createPessimisticRowBackup(row) {
    this.pessimisticBackup.backup(row);
  }

  _releasePessimisticRowBackup(row) {
    return this.pessimisticBackup.release(row);
  }

  _getPessimisticRowBackup(row) {
    return this.pessimisticBackup.get(row.id);
  }

  addCondition(condition: Condition) {
    this.conditions.add(condition);
  }

  filter(condition: Condition) {
    this.addCondition(condition);
    return this;
  }

  getRow(keys: Record<string, any>): TableRow | undefined {
    return this.__store.getRow(keys);
  }

  getFirstRow(): TableRow | undefined {
    return this.__store.getFirstRow();
  }

  callback(callback: Function) {
    this.rowCallback = callback;
    return this;
  }

  __parseSubscriptionPayload(payload: any): {
    tableRow: TableRow;
    event: string;
    timestamp: Date;
  } {
    /**
     * Parses the subscription payload from a supabase event and returns the row and the event type
     *
     * @param payload - The payload received from a supabase subscription
     * @returns The row and the event type
     *
     */
    let row = payload.new;
    const event = payload.eventType;
    const timestamp = new Date(payload.commit_timestamp);
    if (event === "DELETE") {
      row = payload.old;
    }

    const tableRow = new TableRow(row, this.primaryKeys);

    return { tableRow, event, timestamp };
  }

  /**
   * Retrieves all rows from the table and adds them to the store.
   */
  async _addInitialRows() {
    let count_query = this.svupa.supabase
      .from(this.name)
      .select("*", { count: "exact", head: false });
    count_query = this.conditions.toQuery(count_query);
    const {
      data: count_data,
      error: count_error,
      count: count,
    } = await count_query;
    if (count_error) {
      console.warn("error", count_error);
      return;
    }
    for (let row of count_data) {
      this._upsertInternal(row);
    }

    // if there were less than 1000 rows we already fetched all of them
    if (!count || count < 1000) {
      return;
    }

    // otherwise, we need to use pagination/range to fetch the remaining rows
    let start = 1000;
    let end = 2000;
    let query = this.conditions.toQuery(
      this.svupa.supabase.from(this.name).select("*")
    );

    while (start < count) {
      if (end > count) {
        end = count;
      }
      this._addRowsFromRangeRequest(query, start, end);
      start = end;
      end += 1000;
    }
  }

  async _addRowsFromRangeRequest(query, start: number, end: number) {
    let { data, error } = await query.range(start, end);
    if (error) {
      console.warn("error", error);
    }
    for (let row of data) {
      this._upsertInternal(row);
    }
  }

  subscribe(run) {
    // Svelte Store contract: Subscribe to changes in the table.
    return this.__store.subscribe(run);
  }

  // Handle CRUD operations

  // Supabase
  async insert(row: Record<string, any>): Promise<boolean> {
    return await this.svupa.supabase
      .from(this.name)
      .insert(row)
      .then(({ status }) => {
        if (status && status != 201) {
          return false;
        } else {
          return true;
        }
      });
  }

  async update(
    row: Record<string, any>
  ): Promise<{ invokeTime: Date; status: boolean }> {
    let invokeTime = new Date();
    if (this.optimisticUpdates) {
      this._createPessimisticRowBackup(row);
      this._upsertInternal(row);
    }
    const success = await this.svupa.supabase
      .from(this.name)
      .upsert(row)
      .then(({ status }) => {
        if (status != 201) {
          return false;
        } else {
          return true;
        }
      });
    if (this.optimisticUpdates && success) {
      this._releasePessimisticRowBackup(row);
    } else {
      const revokedRow = this._getPessimisticRowBackup(row);
      this._upsertInternal(revokedRow);
    }

    return {
      invokeTime: invokeTime,
      status: success,
    };
  }

  async delete(row: Record<string, any>): Promise<boolean> {
    if (this.optimisticUpdates) {
      this._createPessimisticRowBackup(row);
      this._deleteInternal(row);
    }
    const success = await this.svupa.supabase
      .from(this.name)
      .delete()
      .match(row)
      .then(({ status }) => {
        if (status && status != 201) {
          return false;
        } else {
          return true;
        }
      });
    if (this.optimisticUpdates) {
      if (success) {
        this._releasePessimisticRowBackup(row);
        return true;
      } else {
        const revokedRow = this._getPessimisticRowBackup(row);
        this._upsertInternal(revokedRow);
        return false;
      }
    } else {
      this._releasePessimisticRowBackup(row);

      return success;
    }
  }

  // internal

  _upsertInternal(row: Object | TableRow, timestamp?: Date) {
    const tableRow = row instanceof TableRow ? row : new TableRow(row, this.primaryKeys);
    if (timestamp && this.pessimisticBackup.has(tableRow.id)) {
        // if the row is still in pessimistic backup and the change is invoked by a regular subscription, ignore the change
        return;
      }
    this.__store.upsert(row);
  }

  _deleteInternal(row: Object | TableRow) {
    this.__store.delete(row);
  }

  // Basic getters

  getName() {
    return this.name;
  }

  getSchema() {
    return this.schema;
  }

  getFullTableName() {
    return `${this.schema}.${this.name}`;
  }

  getPrimaryKeys() {
    return this.primaryKeys;
  }

  getNumberOfPrimaryKeys() {
    return this.primaryKeys.getNumberOfKeys();
  }

  getPrimaryKeysstring() {
    return this.primaryKeys.getKeysstring();
  }

  getPrimaryKeysArray() {
    return this.primaryKeys.getKeys();
  }
}

type BackupRow = {
  row: TableRow;
  subscribers: number;
};

class PessimisticBackup {
  data: Map<string, BackupRow>;
  table: Table;

  constructor(table: Table) {
    this.table = table;
    this.data = new Map();
  }

  backup(row: TableRow) {
    if (this.has(row.id)) {
      this.data.get(row.id).subscribers++;
      return;
    }
    const backupRow: BackupRow = { row: structuredClone(row), subscribers: 1 };
    this.data.set(row.id, backupRow);
  }

  release(row: TableRow) {
    if (!this.has(row.id)) {
      throw new Error("Row not found in backup");
    }
    let backupRow = this.data.get(row.id);
    backupRow.subscribers--;
    if (backupRow.subscribers === 0) {
      this.data.delete(row.id);
    }
    return backupRow.row;
  }

  has(id: string) {
    return this.data.has(id);
  }

  get(id: string) {
    return this.data.get(id);
  }

  subscribers(id: string) {
    return this.data.get(id).subscribers;
  }
}
