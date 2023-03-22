<script>
  import Frame from "/src/components/Frame.svelte";
  export let demoUrlOptimistic;
  export let demoUrlPesimisitic;
</script>

<div
  class="group/demoBox mt-4 mx-4 lg:mx-0 lg:w-full h-96 relative bg-gradient-to-br from-[#F19A3E] to-[#D81E5B] p-1 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
>
  <img
    alt="arrow"
    src="/arrow.png"
    class="w-32 h-32 dark:brightness-0 dark:invert absolute -left-24 -top-24 z-30 hidden 2xl:flex"
  />
  <div
    class="w-60 h-32 absolute -left-60 text-2xl -top-32 z-30 hidden 2xl:flex"
    style="font-family:Indie Flower;"
  >
    By the way, <br />these are iframes*.
  </div>
  <div
    class="w-60 p-4 h-32 absolute -left-60 text-lg font-semibold top-16 z-30 hidden 2xl:flex"
    style="font-family:Indie Flower;"
  >
    * Iframes are used to "display websites inside of a website". You are seeing
    two right now. Don't believe it? You can open them in seperate tabs.
  </div>

  <!--
  <div
    class="absolute z-10 top-0 left-0 bg-gray-200 rounded-md w-full h-full group-hover/demoBox:bg-opacity-0 transition-all duration-300"
  />
  -->
  <div class="flex absolute top-0 left-0 h-96 p-1 w-full z-20 mx-auto">
    <div
      class="w-full h-full flex flex-col lg:flex-row overflow-hidden rounded-md gap-1"
    >
      <Frame url={demoUrlPesimisitic} />
      <Frame url={demoUrlOptimistic} />
    </div>
  </div>
</div>
<div class="w-full hidden lg:flex flex-row my-4">
  <div class="w-1/2 px-8">
    <p class="my-4" />
    <h3 class="text-xl font-semibold my-4 text-center">
      The state of the database.
    </h3>
    <p class="my-2 text-justify w-full">
      The state of the database is the ground truth. The left iframe uses
      pessimistic updates, i.e. every click invokes a request to the server,
      which then updates the database. As the state of both instances is synced
      with the database, this will cause both instances to update <span
        class="italic">simoultenously</span
      >, but with a short <span class="italic">delay</span>.
    </p>
  </div>
  <div class="w-1/2 px-8">
    <h3 class="text-xl font-semibold my-4 text-center">
      The same thing but with optimistic updates.
    </h3>
    <p class="my-2 text-justify">
      With optimistic updates, the client that invokes a change of the data will
      see their state update <span class="italic">instantly</span>. If the
      change is rejected by the server, the client state will be reverted to the
      original ground truth state of the database. The state change for other
      clients is <span class="italic">asynchronous</span>.
    </p>
  </div>
</div>
<div class="flex lg:hidden w-2/3 mt-8 text-justify">
  Above you see two iframes connecting to the same data source using Svupa.
  The first one uses pessimistic updates, the second one uses optimistic updates.
</div>