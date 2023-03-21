<script>
  import { derived } from "svelte/store";
  export let client;
  const size = client.size;
  const my_store = derived(
    client._externalStore,
    ($all_rows) => {
      if (!$all_rows || $all_rows.length == 0) {
        return 0;
      }
      return $all_rows.reduce((acc, curr) => {
        console.log(acc);
        return acc.number + curr.number;
      });
    },
    0
  );
</script>

There are {$size} rows with an aggregate value of {$my_store} for some_number.