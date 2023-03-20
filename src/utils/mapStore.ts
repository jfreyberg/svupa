import { writable, get } from "svelte/store";
import type { Writable } from "svelte/store";

export type MapStore<T> = {
  subscribe: Writable<Map<String, T>>["subscribe"];
  reset: () => void;
  upsert: (id: String, data: Object) => void;
  remove: (id: String) => void;
  get: (id: String) => T | undefined;
};

export function mapStore(): MapStore<any> {
  let store: Writable<Map<String, any>> = writable(new Map());
  let { subscribe, set, update } = store;
  return {
    subscribe: subscribe,
    reset: () => {
      set(new Map());
    },
    upsert: (id: String, data: any) => {
      update(($store) => {
        let current = $store.get(id);
        if (current) {
          $store.set(id, { ...current, ...data });
        } else {
          $store.set(id, data);
        }
        return $store;
      });
    },
    remove: (id: String) => {
      if (get(store).get(id) === undefined) {
        return;
      }
      update(($store) => {
        $store.delete(id);
        return $store;
      });
    },
    get(id: String) {
      return structuredClone(get(store).get(id));
    },
  };
}
