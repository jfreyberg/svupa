import { writable, derived, get } from "svelte/store";
import type { Writable, Readable } from "svelte/store";

import { mapStore } from "./mapStore";
import type { MapStore } from "./mapStore";

type Subscription = {
  conditions: Conditions;
  store: Readable<Array<String>>;
  name: string;
  watchers: number;
};

export type Condition = {
  type: "eq" | "gt" | "lt" | "gte" | "lte" | "neq";
  column: string;
  value: string | number;
};

type Conditions = Array<Condition>;

class DB {
  supabase: any;
  schema: string;
  table: string;
  primaryKeys: Array<string>;
  constructor(
    supabase: any,
    schema: string,
    table: string,
    primaryKeys: Array<string>
  ) {
    this.supabase = supabase;
    this.schema = schema;
    this.table = table;
    this.primaryKeys = primaryKeys;
  }

  async insert(row) {
    return await this.supabase
      .from(this.table)
      .insert(row)
      .then(({ status, error }) => {
        if (status != 201) {
          return false;
        } else {
          return true;
        }
      });
  }

  async upsert(row) {
    let invokeTime = new Date();
    let status = await this.supabase
      .from(this.table)
      .upsert(row)
      .then(({ status }) => {
        if (status != 201) {
          return false;
        } else {
          return true;
        }
      });
    return {
      invokeTime: invokeTime,
      status: status,
    };
  }

  async delete(row) {
    let conditions = this.generatePrimaryKeyConditionsFromRow(row);
    return await this.deleteWithConditions(conditions);
  }

  async deleteWithConditions(conditions: Conditions) {
    conditions = parseConditions(conditions);
    let query = this.supabase.from(this.table).delete();
    query = buildQueryFromConditions(query, conditions);
    return await query.then(({ status }) => {
      if (status != 204) {
        return false;
      } else {
        return true;
      }
    });
  }

  generatePrimaryKeyConditionsFromRow(row) {
    let conditions = [];
    for (let key of this.primaryKeys) {
      conditions.push({
        type: "eq",
        column: key,
        value: row[key],
      });
    }
    return conditions;
  }
}

class svupaStore {
  // data stores
  _internalStore: MapStore<Object>;
  _externalStore: Readable<Array<Object>>;
  size: Readable<Number | false>;
  header: Writable<Array<String> | false>;
  _subscriptionsStore: MapStore<Subscription>;

  db: DB;
  defaultConditions: Conditions;
  table: string;
  row_callback: Function | false;
  channel: any;
  supabase: any;
  pessimisticBackup: Map<string, Object>;
  lastUpateChecker: Map<string, Date>;

  constructor(
    supabase: any,
    table: string,
    primaryKeys: Array<string> | string,
    defaultConditions: Conditions | Condition | undefined,
    row_callback: Function | undefined | false
  ) {
    let schema = "public";

    if (typeof primaryKeys === "string") {
      primaryKeys = [primaryKeys];
    }
    this.db = new DB(supabase, schema, table, primaryKeys);

    this.header = writable(false);
    this._internalStore = mapStore();
    this._externalStore = derived(this._internalStore, ($internalStore) => {
      //console.log("updating external store!");
      return [...$internalStore.values()];
    });
    this.size = derived(
      this._internalStore,
      ($internalStore, set) => {
        set($internalStore.size);
      },
      false
    );

    this.pessimisticBackup = new Map();
    this.lastUpateChecker = new Map();

    if (!row_callback || typeof row_callback !== "function") {
      row_callback = false;
    }
    this._subscriptionsStore = mapStore();
    this.defaultConditions = parseConditions(defaultConditions);
    this.row_callback = row_callback ? row_callback : false;

    //console.log("subscribing to channel!");
    this._subscribeToChannel();
  }

  subscribe(run) {
    return this._externalStore.subscribe(run);
  }

  async insert(row, optimistic = false) {
    if (optimistic) {
      let statusPromise = this.db.insert(row);
      this._upsertRow(row);
      if (!(await statusPromise)) {
        this._deleteRow(row);
        return false;
      }
      return true;
    } else {
      return await this.db.insert(row);
    }
  }

  async upsert(row: Object, optimistic = false) {
    if (optimistic) {
      this._createPessimisticRowBackup(row);
      let statusPromise = this.db.upsert(row);
      this._upsertRow(row);
      let { invokeTime, status } = await statusPromise;
      if (!status) {
        this._revokeRow(row);
        return {
          status: false,
          invokeTime: invokeTime,
        };
      }
      this._clearRow(row);
      return {
        status: true,
        invokeTime: invokeTime,
      };
    } else {
      let { invokeTime, status } = await this.db.upsert(row);
      return {
        status: status,
        invokeTime: invokeTime,
      };
    }
  }

  async delete(row, optimistic = false) {
    if (optimistic) {
      this._createPessimisticRowBackup(row);
      this._deleteRow(row);
      let statusPromise = this.db.delete(row);
      if (!(await statusPromise)) {
        this._revokeRow(row);
        return false;
      }
      this._clearRow(row);
      return true;
    }
    return await this.db.delete(row);
  }

  _createPessimisticRowBackup(newRow) {
    let key = this._getRowKey(newRow);
    if (this.pessimisticBackup.has(key)) {
      this.pessimisticBackup.get(key).__awaits++;
      return;
    }
    let currentRow = this._internalStore.get(key);
    this.pessimisticBackup.set(key, { ...currentRow, __awaits: 1 });
  }

  _revokeRow(revokeRow) {
    let key = this._getRowKey(revokeRow);
    let { __awaits, ...oldRow } = this.pessimisticBackup.get(key);
    this._upsertRow(oldRow);
    this._clearRow(revokeRow);

    //this.pessimisticBackup.delete(key);
    // TODO: maybe delete rows from pessimistic backup to reduce RAM usage and prevent overload in extreme cases
    // potential issues: race conditions with several operations applied on the same row?
  }

  _clearRow(clearRow) {
    let key = this._getRowKey(clearRow);
    let { __awaits, ...row } = this.pessimisticBackup.get(key);
    this.pessimisticBackup.set(key, { ...row, __awaits: __awaits - 1 });
    if (this.pessimisticBackup.get(key).__awaits == 0) {
      this.pessimisticBackup.delete(key);
    }
  }

  _subscribeToChannel() {
    let channel_name = this._generateChannelName();
    this.channel = this.db.supabase
      .channel(channel_name)
      .on(
        "postgres_changes",
        { event: "*", schema: this.db.schema, table: this.db.table },
        (payload) => {
          //console.log("changes received!", payload);

          // get the new/deleted row and event type
          let { row, event, timestamp } = parseSubscriptionPayload(payload);

          // check if payload is relevant for this store, i.e. if it actually is subscribed to
          // if it is not relevant, return
          if (!this._checkRowRelevance(row)) {
            return;
          }

          if (event === "INSERT" || event === "UPDATE") {
            // on INSERT or UPDATE: create/update row in store
            this._upsertRow(row, timestamp);
          } else if (event === "DELETE") {
            // on DELETE: delete row from store
            this._deleteRow(row);
          }
        }
      )
      .subscribe();
  }

  _subscribeToChannelWithConditions(conditions: Conditions) {
    let schema = {
      event: "*",
      schema: this.db.schema,
      table: this.db.table,
    };

    if (conditions.length === 1) {
      schema["condition"] = conditions[0];
    }

    else if (conditions.length > 1) {
      throw new Error(
        "Supabase currently only supports one condition per subscription!"
      );
    }

    let channel_name = this._generateChannelName();
    this.channel = this.db.supabase
      .channel(channel_name)
      .on("postgres_changes", schema, (payload) => {
        //console.log("changes received!", payload);

        // get the new/deleted row and event type
        let { row, event, timestamp } = parseSubscriptionPayload(payload);

        // check if payload is relevant for this store, i.e. if it actually is subscribed to
        // if it is not relevant, return
        if (!this._checkRowRelevance(row)) {
          return;
        }

        if (event === "INSERT" || event === "UPDATE") {
          // on INSERT or UPDATE: create/update row in store
          this._upsertRow(row, timestamp);
        } else if (event === "DELETE") {
          // on DELETE: delete row from store
          this._deleteRow(row);
        }
      })
      .subscribe();
  }

  _checkRowRelevanceForCondition(row: any, conditions: Conditions) {
    let relevant = true;
    conditions.forEach(function (condition) {
      if (row[condition.column] != condition.value) {
        relevant = false;
      }
    });
    return relevant;
  }

  _checkRowRelevance(row) {
    // for each subscribtion, check if the row is relevant
    let defaultConditions = this.defaultConditions;
    let is_relevant = false;
    get(this._subscriptionsStore).forEach((subscribtion) => {
      let conditions = [...subscribtion.conditions, ...defaultConditions];
      // if the row is relevant for any subscription, return true
      if (this._checkRowRelevanceForCondition(row, conditions)) {
        is_relevant = true;
        return false;
      }
    });
    // if the row is not relevant for any subscription, return false
    return is_relevant;
  }

  async _upsertRow(row, timestamp: Date | false = false) {
    let key = this._getRowKey(row);
    if (this.row_callback) {
      row = await this.row_callback(row);
    }

    if (get(this.header) === false) {
      // first row ever? set header
      this.header.set(Object.keys(row));
    }

    if (timestamp) {
      let prevTimestamp = this.lastUpateChecker.get(key);
      if (prevTimestamp && prevTimestamp > timestamp) {
        // this should never happen, but if it does, it is supabase sending messages in the wrong order
        console.log("supabase sent a message in the wrong order :o");
      } else {
        this.lastUpateChecker.set(key, timestamp);
      }
    }

    if (this.pessimisticBackup.get(key) && timestamp) {
      // if the row is still in pessimistic backup and the change is invoked by a regular subscription, ignore the change
      return;
    }
    this._internalStore.upsert(key, row);
  }

  _deleteRow(row) {
    let key = this._getRowKey(row);
    this._deleteRowByKey(key);
  }

  _getRowKey(row) {
    return this.db.primaryKeys.map((key) => row[key]).join("-");
  }

  _deleteRowByKey(key) {
    this._internalStore.remove(key);
  }

  _generateConditionName(condtions) {
    return `${this.db.schema}:${this.db.table}:${condtions
      .map((condition) =>
        [condition.column, condition.type, condition.value].join("-")
      )
      .join("-")}`;
  }

  _generateChannelName() {
    return `${this.db.schema}:${this.db.table}`;
  }

  async _addRowsFromRangeRequest(query, start: number, end: number) {
    let { data, error } = await query.range(start, end);
    if (error) {
      console.log("error", error);
    }
    for (let row of data) {
      this._upsertRow(row);
    }
  }

  async _addInitialRows(conditions: Conditions) {
    let count_query = this.db.supabase
      .from(this.db.table)
      .select("*", { count: "exact", head: false });
    count_query = buildQueryFromConditions(count_query, [
      ...this.defaultConditions,
      ...parseConditions(conditions),
    ]);
    const {
      data: count_data,
      error: count_error,
      count: count,
    } = await count_query;
    if (count_error) {
      console.log("error", count_error);
      return;
    }
    for (let row of count_data) {
      this._upsertRow(row);
    }

    // if there were less than 1000 rows we already fetched all of them
    if (!count || count < 1000) {
      return;
    }

    // otherwise, we need to use pagination/range to fetch the remaining rows
    let start = 1000;
    let end = 2000;
    let query = this.db.supabase.from(this.db.table).select("*");
    query = buildQueryFromConditions(query, [
      ...this.defaultConditions,
      ...parseConditions(conditions),
    ]);

    while (start < count) {
      if (end > count) {
        end = count;
      }
      this._addRowsFromRangeRequest(query, start, end);
      start = end;
      end += 1000;
    }
  }

  _createSubscriptionStore(conditions: Conditions) {
    let store = derived(
      this._internalStore,
      ($internalStore, set) => {
        set(
          [...$internalStore]
            .filter(([id, row]) =>
              this._checkRowRelevanceForCondition(row, conditions)
            )
            .map(([id, row]) => row)
        );
      },
      []
    );
    return store;
  }

  _addSubscription(conditions: Conditions) {
    let condition_name = this._generateConditionName(conditions);
    if (this._subscriptionsStore.get(condition_name)) {
      let condition = this._subscriptionsStore.get(condition_name);
      this._subscriptionsStore.upsert(condition_name, {
        watchers: condition.watchers + 1,
      });
      return [
        condition_name,
        this._subscriptionsStore.get(condition_name).store,
      ];
    }

    let subscription_store = this._createSubscriptionStore(conditions);

    this._subscriptionsStore.upsert(condition_name, {
      conditions: conditions,
      store: subscription_store,
      name: condition_name,
    });
    return [condition_name, subscription_store];
  }

  release(condition_name: string) {
    if (this._subscriptionsStore.get(condition_name)) {
      let condition = this._subscriptionsStore.get(condition_name);
      if (condition.watchers > 1) {
        this._subscriptionsStore.upsert(condition_name, {
          watchers: condition.watchers - 1,
        });
        return;
      }
      this._subscriptionsStore.remove(condition_name);
    }
  }

  request(conditions: Conditions | Condition | undefined) {
    conditions = parseConditions(conditions);
    let [condition_name, store] = this._addSubscription(conditions);
    this._addInitialRows(conditions);
    return { name: condition_name, store: store };
  }

  reset() {
    //this.defaultConditions = [];
    this._subscriptionsStore.reset();
    this._internalStore.reset();
  }

  request_overwrite(conditions) {
    this.reset();
    return this.request(conditions);
  }
}

function isCondition(object: any): object is Condition {
  return "type" in object && "column" in object && "value" in object;
}

function buildQueryFromConditions(query, conditions: Conditions) {
  conditions.forEach((condition: Condition) => {
    switch (condition.type) {
      case "eq":
        query = query.eq(condition.column, condition.value);
        break;
      case "gt":
        query = query.gt(condition.column, condition.value);
        break;
      case "lt":
        query = query.lt(condition.column, condition.value);
        break;
      case "gte":
        query = query.gte(condition.column, condition.value);
        break;
      case "lte":
        query = query.lte(condition.column, condition.value);
        break;
      case "neq":
        query = query.neq(condition.column, condition.value);
        break;
    }
  });
  return query;
}

function parseSubscriptionPayload(payload): {
  row: any;
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
  let event = payload.eventType;
  let timestamp = new Date(payload.commit_timestamp);
  if (event === "DELETE") {
    row = payload.old;
  }
  return { row, event, timestamp };
}

function parseConditions(
  conditions: Conditions | undefined | Condition
): Conditions {
  if (conditions === undefined) {
    conditions = [];
  } else if (isCondition(conditions)) {
    conditions = [conditions];
  }
  return conditions;
}

function filterStringFromCondition(condition: Condition) {
  return `${condition.column}:${condition.type}.${condition.value},`;
}

export const svupa = (
  supabase: any,
  table: string,
  primaryKeys: Array<string> | string,
  defaultConditions: Conditions | Condition | undefined,
  row_callback: Function | false | undefined
) =>
  new svupaStore(supabase, table, primaryKeys, defaultConditions, row_callback);
