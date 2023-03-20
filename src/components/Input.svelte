<script>
  export let title;
  export let value;
  export let description;
  let copied = false;
</script>

<div class="text-gray-900 flex flex-col justify-center gap-y-2">
  <div class="text-left w-48 flex-none font-semibold">{title}</div>
  <div class="text-sm">
    {description}
  </div>
  <div class="relative">
    <input
      bind:value
      type="text"
      class="p-2 outline-none text-md rounded-md border-2 border-gray-200 dark:border-[rgba(255,255,255,0.1)] w-full transition duration-300 ease-in-out hover:border-gray-400 focus:border-gray-400"
    />
    <div
      class="absolute -right-2 -top-2 flex flex-row gap-x-2 text-xs font-semibold text-gray-700"
    >
      <div
        on:click={() => {
          copied = true;
          navigator.clipboard.writeText(value);
          setTimeout(() => {
            copied = false;
          }, 1000);
        }}
        class="p-1 border-2 cursor-pointer border-gray-300 bg-white rounded-md items-center hover:border-gray-400 transition-all duration-200"
      >
        {#if copied}
          copied
        {:else}
          copy
        {/if}
      </div>
      <!--
      <div
        class="p-1 border-2 text-xs border-gray-300 bg-white rounded-md items-center"
      >
        share
      </div>-->
    </div>
  </div>
</div>
