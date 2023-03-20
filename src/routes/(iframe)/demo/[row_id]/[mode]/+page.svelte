<script>
  import DataBall from "/src/components/DataBall.svelte";
  export let data;
</script>

<DataBall row_id={data.row_id} optimistic={data.mode === 'optimistic'} />
