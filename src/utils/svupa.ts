import type { SupabaseClient } from "@supabase/supabase-js";
import { Table } from "./table.js";

export class Svupa {
  supabase: SupabaseClient;
  tables: Map<string, Table>;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
    this.tables = new Map();
  }

  table(
    name: string,
    schema: string,
    keys: Array<string> | string,
    optimistic: boolean = false
  ): Table {
    let existingTable: Table = this.tables.get(`${schema}.${name}`);
    if (existingTable) return existingTable;

    const newTable = new Table(this, name, keys, schema, optimistic);
    this.tables.set(newTable.getFullTableName(), newTable);
    return newTable;
  }
}

import { writable, derived, get } from "svelte/store";
import type { Writable, Readable } from "svelte/store";

import { mapStore } from "./mapStore";
import type { MapStore } from "./mapStore";

import type {
  RealtimeChannel,
  RealtimePostgresChangesPayload,
} from "@supabase/supabase-js";

import type { Conditions, Condition, OptionalConditions } from "./condition";