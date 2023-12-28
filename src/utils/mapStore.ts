import { writable, get } from "svelte/store";
import type { Writable } from "svelte/store";

export type MapStore<T> = {
  subscribe: Writable<Map<string, T>>["subscribe"];
  reset: () => void;
  upsert: (id: string, data: Object) => void;
  remove: (id: string) => void;
  get: (id: string) => T | undefined;
  getFirstRow: (id: string) => T | undefined;
};

export function mapStore(): MapStore<any> {
  let store: Writable<Map<string, any>> = writable(new Map());
  let { subscribe, set, update } = store;
  return {
    subscribe: subscribe,
    reset: () => {
      set(new Map());
    },
    upsert: (id: string, data: any) => {
      update(($store) => {
        let current = $store.get(id);
        if (current) {
          if (typeof data === "object") $store.set(id, { ...current, ...data });
          else $store.set(id, data);
        } else {
          $store.set(id, data);
        }
        return $store;
      });
    },
    remove: (id: string) => {
      if (get(store).get(id) === undefined) {
        return;
      }
      update(($store) => {
        $store.delete(id);
        return $store;
      });
    },
    get(id: string) {
      return structuredClone(get(store).get(id));
    },
    getFirstRow() {
      const keys = get(store).keys();
      // sort keys alphabetically
      const sortedKeys = Array.from(keys).sort();
      if (sortedKeys.length === 0) {
        return undefined;
      }
      const firstKey = sortedKeys[0];
      return this.get(firstKey);
    },
  };
}
