<script>
  import CopyInput from "/src/components/CopyInput.svelte";
  export let url;
</script>

<div class="lg:w-1/2 w-full h-full relative bg-white group/iframe">
  {#if url}
    <div
      class="absolute top-0 left-0 w-full h-8 bg-gray-100 px-2 gap-x-2 flex items-center"
    >
      <div class="w-3 h-3 rounded-full bg-[#D81E5B] flex-none" />
      <div class="w-3 h-3 rounded-full bg-[#F19A3E] flex-none" />
      <div class="w-3 h-3 rounded-full bg-[#00A063] flex-none" />
      <div class="text-xs overflow-hidden truncate bg-white border-gray-200 border rounded-md p-1 w-full text-left">{url}</div>
    </div>
    <iframe class="w-full h-full" src={url} title="Demo" />
    <div
      class="absolute bottom-4 left-0 hidden group-hover/iframe:flex items-center justify-center w-full"
    >
      <div class="hidden 2xl:flex">
        <CopyInput text={url} newWindow={true} />
      </div>
    </div>
  {/if}
</div>
