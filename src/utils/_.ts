import { writable, derived, Writable, Readable } from "svelte/store";

export function createTableStore(
  table: string,
  keys: Array<string>,
  default_conditions: Array<any>,
  row_callback: Function
) {
  let internal_store: Writable<Map<string, Object>> = writable(new Map());
  const { subscribe, set, update } = internal_store;

  let size = derived(internal_store, ($internal_store) => $internal_store.size);
  let values = derived(internal_store, ($internal_store) => {
    return [...$internal_store.values()];
  });
  let subsetstores = new Map();

  function _create_subscription_store(conditions: Array<Condition>) {
    let store = derived(
      values,
      ($rows, set) => {
        let subscription_store = [];
        Object.entries($rows).forEach(([id, row], idx) => {
          if (this._check_row_relevance_for_condition(row, conditions)) {
            subscription_store.push(id);
          }
        });
        set(subscription_store);
      },
      []
    );
    return store;
  }

  let store = {
    subscribe: vals.subscribe,
    reset: () => {
      set(new Map());
    },
    upsert: (id, data) => {
      update(($internal_store) => $internal_store.set(id, data));
    },
    remove: (id) => {
      update(($internal_store) => $internal_store.delete(id));
    },
    size: size,
    values: values,
    item(id) {
      return derived(store, ($store) => $store.get(id));
    },
  };
  let manager = new TableStoreManager(
    table,
    keys,
    default_conditions,
    row_callback,
    store
  );
  return store;
}
