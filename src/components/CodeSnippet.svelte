<script>
  import Highlight from "svelte-highlight";
  import sql from "svelte-highlight/languages/sql";
  import javascript from "svelte-highlight/languages/javascript";
  import atomOneLight from "svelte-highlight/styles/atom-one-light";

  export let code;
  export let filename = false;
  export let lang = "javascript";
  let languages = new Map([
    ["sql", sql],
    ["javascript", javascript],
  ]);
  let copied = false;
</script>

<svelte:head>
  {@html atomOneLight}
</svelte:head>
<div
  class="relative mx-auto text-left rounded-md shadow-sm border-gray-200 dark:border-[rgba(255,255,255,0.1)] border-2 my-4 hover:shadow-md transition-all duration-300"
>
  <div class="rounded-md overflow-hidden">
    {#if filename}
      <div class="w-full bg-gray-100 h-8 leading-8 px-2 border-b border-gray-200">{filename}</div>
    {/if}
    <Highlight language={languages.get(lang)} {code} />
  </div>
  <div
    class="absolute -right-3 -top-3 flex flex-row gap-x-2 text-xs font-semibold text-gray-500"
  >
    <div
      on:keydown={() => {}}
      on:click={() => {
        copied = true;
        navigator.clipboard.writeText(code);
        setTimeout(() => {
          copied = false;
        }, 1000);
      }}
      class="{copied
        ? 'bg-gray-200 hover:bg-gray-300'
        : 'bg-white hover:bg-gray-100'} group-hover/InputField:shadow-md group-hover/InputField:border-gray-300 p-1 border-2 cursor-pointer shadow-sm hover:shadow-md border-gray-200 dark:border-[rgba(255,255,255,0.1)] rounded-md items-center transition-all duration-200"
    >
      <img alt="copy code" src="/copy.png" class="w-5 h-5 cursor-pointer" />
    </div>
  </div>
</div>
