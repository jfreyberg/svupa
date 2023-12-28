<script>
  import DemoBox from "/src/components/DemoBox.svelte";
  export let data;
</script>

<div class="flex items-center justify-center h-full">
  <div class="w-full lg:w-2/3">
    <DemoBox
    demoUrlPesimisitic={data.row_id + "/pessimistic"}
    demoUrlOptimistic={data.row_id + "/optimistic"}
    />
  </div>
</div>
