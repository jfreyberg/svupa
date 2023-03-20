// Svelte
import { Writable, writable, Derived, derived } from "svelte/store";
// Supabase
import {} from "@supabase/supabase-js";

import { supabase } from "src/api/supabase.js";

/**
 * This store mirrors *some rows* of a supabase table.
 * It can basically be considered as a cache of a subset of the table's data.
 * Every time a change is made to a relevant row in the table, the store is updated.
 * If a row is requested that is not in the store, it is fetched from the table.
 */

export class TableStore {
  schema: string;
  table: string;
  primaryKeys: Array<string>;
  subscriptions: Map<string, Subscription>;
  default_conditions: Array<Condition>;
  row_store: Writable<Map<string, any>>;
  row_callback: Function | undefined | false;
  channel: any;

  constructor(
    table: string,
    primaryKeys: Array<string> | string,
    default_conditions: Array<Condition> | Condition | undefined,
    row_callback: Function | undefined | false
  ) {
    if (typeof primaryKeys === "string") {
      this.primaryKeys = [primaryKeys];
    } else {
      this.primaryKeys = primaryKeys;
    }

    if (!row_callback || typeof row_callback !== "function") {
      row_callback = false;
    }
    this.subscriptions = new Map();
    this.schema = "public";
    this.default_conditions = parseSubscriptionConditions(default_conditions);
    this.table = table;
    this.row_store = writable(new Map());
    this.row_callback = row_callback;

    this._subscribeToChannel();
  }

  _subscribeToChannel() {
    let channel_name = this._generateChannelName();
    this.channel = supabase
      .channel(channel_name)
      .on(
        "postgres_changes",
        { event: "*", schema: this.schema, table: this.table },
        (payload) => {
          //console.log('changes received!', payload);

          // get the new/deleted row and event type
          let { row, event } = parseSubscriptionPayload(payload);

          // check if payload is relevant for this store, i.e. if it contains the keys it is subscribed to
          // if it is not relevant, return
          if (!this._checkRowRelevance(row)) {
            return;
          }
          //console.log('updating!', payload);

          if (event === "INSERT" || event === "UPDATE") {
            // on INSERT or UPDATE: create/update row in store
            this._upsertRow(row);
          } else if (event === "DELETE") {
            // on DELETE: delete row from store
            this._deleteRow(row);
          }
        }
      )
      .subscribe();
  }

  _checkRowRelevanceForCondition(row: any, conditions: Array<Condition>) {
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
    let default_conditions = this.default_conditions;
    let is_relevant = false;
    this.subscriptions.forEach((subscribtion) => {
      let conditions = [...subscribtion.conditions, ...default_conditions];
      // if the row is relevant for any subscription, return true
      if (this._checkRowRelevanceForCondition(row, conditions)) {
        is_relevant = true;
        return false;
      }
    });
    // if the row is not relevant for any subscription, return false
    return is_relevant;
  }

  async _upsertRow(row) {
    let key = this._get_row_key(row);
    if (this.row_callback) {
      row = await this.row_callback(row);
    }

    this.row_store.upsert(key, row);
  }

  _deleteRow(row) {
    let key = this._get_row_key(row);
    this._deleteRow_by_key(key);
  }

  _get_row_key(row) {
    return this.primaryKeys.map((key) => row[key]).join("-");
  }

  _deleteRow_by_key(key) {
    this.row_store.remove(key);
  }

  generate_condition_name(condtions) {
    return `${this.schema}:${this.table}:${condtions
      .map(
        (condition) =>
          condition.column + "-" + condition.type + "-" + condition.value
      )
      .join("-")}`;
  }

  _generateChannelName() {
    return `${this.schema}:${this.table}`;
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

  async _addInitialRows(conditions: Array<Condition>) {
    let count_query = supabase
      .from(this.table)
      .select("*", { count: "exact", head: false });
    count_query = buildQueryFromConditions(count_query, [
      ...this.default_conditions,
      ...parseSubscriptionConditions(conditions),
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
    let query = supabase.from(this.table).select("*");
    query = buildQueryFromConditions(query, [
      ...this.default_conditions,
      ...parseSubscriptionConditions(conditions),
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

  _create_subscription_store(conditions) {
    let store = derived(
      this.row_store,
      ($rows, set) => {
        let subscription_store = [];
        Object.entries($rows).forEach(([id, row], idx) => {
          if (this._checkRowRelevanceForCondition(row, conditions)) {
            subscription_store.push(id);
          }
        });
        set(subscription_store);
      },
      []
    );
    return store;
  }

  _add_subscription(conditions) {
    conditions = parseSubscriptionConditions(conditions);
    let condition_name = this.generate_condition_name(conditions);
    let subscription_store = this._create_subscription_store(conditions);
    if (this.subscriptions.get(condition_name)) {
    }
    this.subscriptions.get(condition_name) = {
      conditions: conditions,
      store: subscription_store,
      name: condition_name,
    };
    return [condition_name, subscription_store];
  }

  release(condition_name) {
    if (this.subscriptions.get(condition_name)) {
      delete this.subscriptions.get(condition_name);
    }
  }

  request(conditions) {
    if (!conditions) {
      conditions = [];
    }
    let [condition_name, subscription] = this._add_subscription(conditions);
    this._addInitialRows(conditions);
    return [condition_name, subscription];
  }

  reset() {
    this.default_conditions = [];
    this.subscriptions = new Map();
    this.store.reset();
  }

  request_overwrite(conditions) {
    this.reset();
    return this.request(conditions);
  }
}

type Condition = {
  type: "eq" | "gt" | "lt" | "gte" | "lte" | "neq";
  column: string;
  value: string | number;
};

function isCondition(object: any): object is Condition {
  return "type" in object && "column" in object && "value" in object;
}

export function buildQueryFromConditions(query, conditions: Array<Condition>) {
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

function parseSubscriptionPayload(payload) {
  /**
   * Parses the subscription payload from a supabase event and returns the row and the event type
   *
   * @param payload - The payload received from a supabase subscription
   * @returns The row and the event type
   *
   */
  let row = payload.new;
  let event = payload.eventType;
  if (event === "DELETE") {
    row = payload.old;
  }
  return { row, event };
}

function parseSubscriptionConditions(
  conditions: Array<Condition> | undefined | Condition
): Array<Condition> {
  if (conditions === undefined) {
    conditions = [];
  } else if (conditions instanceof Array<Condition>) {
    conditions = conditions;
  } else if (isCondition(conditions)) {
    conditions = [conditions];
  } else {
    throw new Error("Invalid conditions!");
  }
  return conditions;
}
