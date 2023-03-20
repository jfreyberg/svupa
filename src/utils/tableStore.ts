import { writable, get } from "svelte/store";
import type { Writable } from "svelte/store";

export type TableStore<T> = {
  subscribe: Writable<Map<String, T>>["subscribe"];
  reset: () => void;
  upsert: (id: String, data: Object) => void;
  remove: (id: String) => void;
  get: (id: String) => T | undefined;
};

export function tableStore(): TableStore<any> {
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
      update(($store) => {
        $store.delete(id);
        return $store;
      });
    },
    get(id: String) {
      return get(store).get(id);
    },
  };
}
