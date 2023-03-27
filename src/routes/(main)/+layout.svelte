<script>
  function openInNewTab(url) {
    window.open(url, "_blank").focus();
  }
  let header_open = true;
</script>

<div
  class="w-screen h-screen bg-white text-[#202C59] dark:text-white dark:bg-[#202C59] overflow-x dark overflow-y-scroll"
>
  {#if header_open}
    <div
      class="flex flex-row leading-6 w-full shadow-xl text-center text-sm p-1 items-center justify-center bg-gradient-to-r from-[#F19A3E] via-[#D81E5B] to-[#F19A3E] text-white"
    >
      <p>
        This project is submitted to
        <span
          on:click={() => {
            openInNewTab("https://hack.sveltesociety.dev/");
          }}
          class="underline cursor-pointer">SvelteHack</span
        >.
        If you like it, please consider dropping a star on <span
          on:click={() => {
            openInNewTab("https://github.com/jfreyberg/Svupa");
          }}
          class="underline cursor-pointer">Github</span
        >.
      </p>
      <img
        src="/x.png"
        class="w-4 h-4 ml-2 cursor-pointer"
        on:click={() => {
          header_open = false;
        }}
      />
    </div>
  {/if}
  <div class="w-full md:w-2/3 mx-auto md:px-0 px-4">
    <slot />
  </div>

  <div
    class="w-full text-gray-400 flex flex-row items-center justify-center py-8 gap-x-4 lg:gap-x-8 text-sm"
  >
    <a
      class="hover:text-gray-600 transition-all duration-300"
      href="https://svupa.vercel.app/#project">project</a
    >
    <a
      class="hover:text-gray-600 transition-all duration-300"
      href="https://svupa.vercel.app/#features">features</a
    >
    <a
      class="hover:text-gray-600 transition-all duration-300"
      href="https://svupa.vercel.app/#demo">demo</a
    >
    <a
      class="hover:text-gray-600 transition-all duration-300"
      href="https://github.com/jfreyberg/Svupa">github</a
    >
    <a class="hover:text-gray-600 transition-all duration-300" href="/contact"
      >contact & legal</a
    >
  </div>
</div>
