<script>
  import QRCode from "/src/components/QRCode.svelte";

  export let text;
  export let newWindow = false;
  let copied = false;

  function openInNewTab(url) {
    window.open(url, "_blank").focus();
  }

  function openInNewWindow(url) {
    window.open(url, "newWindow", "menubar=1,resizable=1,width=400,height=400");
  }
</script>

<div class="relative group/InputField my-4 w-80 lg:w-auto">
  <div
    class="truncate bg-white group-hover/InputField:shadow-md w-full group-hover/InputField:border-gray-300 p-2 outline-none text-sm shadow-sm hover:shadow-md text-gray-700 rounded-md border-2 border-gray-200 dark:border-[rgba(255,255,255,0.1)] flex transition duration-300 ease-in-out hover:border-gray-300 focus:border-gray-300"
  >
    {text}
  </div>
  <div
    class="absolute -right-3 -top-3 flex flex-row gap-x-2 text-xs font-semibold text-gray-500"
  >
    <div
      class="relative group/qr group-hover/InputField:shadow-md group-hover/InputField:border-gray-300 p-1 border-2 cursor-pointer shadow-sm hover:shadow-md border-gray-200 dark:border-[rgba(255,255,255,0.1)] bg-white rounded-md items-center hover:bg-gray-100 transition-all duration-200"
    >
      <img src="/qr.png" class="w-5 h-5 cursor-pointer" />
      {#if text && text.length > 0}
        <div
          class="p-2 border-gray-200 border-2 rounded-md absolute bottom-2 right-2 bg-white z-50 h-48 w-48 group-hover/qr:flex hidden"
        >
          <QRCode value={text} size="172" />
        </div>
      {/if}
    </div>
    <div
      on:keydown={() => {}}
      on:click={() => {
        copied = true;
        navigator.clipboard.writeText(text);
        setTimeout(() => {
          copied = false;
        }, 500);
      }}
      class="{copied
        ? 'bg-gray-200 hover:bg-gray-300'
        : 'bg-white hover:bg-gray-100'} group-hover/InputField:shadow-md group-hover/InputField:border-gray-300 p-1 border-2 cursor-pointer shadow-sm hover:shadow-md border-gray-200 rounded-md items-center transition-all duration-200"
    >
      <img src="/copy.png" class="w-5 h-5 cursor-pointer" alt="copy" />
    </div>
    <div
      on:keydown={() => {}}
      on:click={() => {
        if (newWindow) {
          openInNewWindow(text);
        } else {
          openInNewTab(text);
        }
      }}
      class="group-hover/InputField:shadow-md group-hover/InputField:border-gray-300 p-1 border-2 cursor-pointer shadow-sm hover:shadow-md border-gray-200 dark:border-[rgba(255,255,255,0.1)] bg-white rounded-md items-center hover:bg-gray-100 transition-all duration-200"
    >
      <img src="/link.png" class="w-5 h-5 cursor-pointer" />
    </div>
  </div>
</div>
