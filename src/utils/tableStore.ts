import { TableRow } from "./tableRow.js";
import { mapStore, type MapStore } from "./mapStore.js";
import type { Table } from "./table.js";
import { derived, type Readable } from "svelte/store";

export class TableStore {
  __store: MapStore<TableRow>;
  __table: Table;
  __externalStore: Readable<TableRow[]>;

  constructor(table: Table) {
    this.__store = mapStore();
    this.__table = table;
    this.__externalStore = derived(this.__store, ($store) => {
      return [...$store.values()];
    });
  }

  __convertRow(row: TableRow | Object): TableRow {
    return row instanceof TableRow
      ? row
      : new TableRow(row, this.__table.primaryKeys);
  }

  upsert(row: TableRow | Object) {
    const tableRow = this.__convertRow(row);
    this.__store.upsert(tableRow.id, tableRow.data);
  }

  delete(row: TableRow | Object) {
    const tableRow = this.__convertRow(row);
    this.__store.remove(tableRow.id);
  }

  getRow(id: string | Record<string, any>): TableRow | undefined {
    if (typeof id === "string") return this.__store.get(id);
    return this.getRow(this.__table.primaryKeys.generateRowID(id));
  }

  getFirstRow(): TableRow | undefined {
    return this.__store.getFirstRow();
  }

  subscribe(run: (value: Map<string, TableRow>) => unknown) {
    return this.__externalStore.subscribe(run);
  }
}
