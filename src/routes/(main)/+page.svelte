<script lang="ts">
  import FeatureCard from "/src/components/FeatureCard.svelte";
  import FeatureItem from "/src/components/FeatureItem.svelte";
  import Title from "/src/components/Title.svelte";
  import Markup from "/src/components/Markup.svelte";
  import Subtitle from "/src/components/Subtitle.svelte";
  import Button from "/src/components/Button.svelte";
  import CodeSnippet from "/src/components/CodeSnippet.svelte";
  import DemoBox from "/src/components/DemoBox.svelte";
  import { createClient } from "@supabase/supabase-js";
  import { onMount } from "svelte";
  import code from "/src/data/code.json";
  import { v4 as uuidv4 } from "uuid";
  import { svupa } from "/src/utils/svupa";
  import CopyInput from "/src/components/CopyInput.svelte";

  let url = "https://hfvvrfrkhbkyqfkkxdsb.supabase.co";
  let key =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmdnZyZnJraGJreXFma2t4ZHNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzgzNzA2ODUsImV4cCI6MTk5Mzk0NjY4NX0.BEikWxuiQSPO6qtzrQlTzErWrJDJEDZcqR9CpHD7Zxg";
  let keys = "id";

  const supabase = createClient(url, key);

  // Define the function to call the PostgreSQL function
  async function createNewTable() {
    const supabase = createClient(url, key);
    return await supabase.rpc("create_new_table").then(({ data, error }) => {
      return data;
    });
  }
  let table = "demo";
  let row_id = false;
  let demoUrl = false;
  let demoUrlOptimistic = false;
  let demoUrlPesimisitic = false;
  let svupa_client = false;
  onMount(async () => {
    svupa_client = svupa(supabase, "demo", keys);
    let int = 1;
    let text = "one";
    let bool = false;
    row_id = uuidv4();
    await svupa_client.insert(
      {
        id: row_id,
        number: int,
        plain: text,
        is_even: bool,
      },
      false
    );
    demoUrl = window.location.href.split("#")[0] + "demo/" + row_id + "/";
    demoUrlOptimistic = demoUrl + "optimistic";
    demoUrlPesimisitic = demoUrl + "pessimistic";
  });

  function openInNewTab(url) {
    window.open(url, "_blank").focus();
  }
</script>

<div class="w-full mx-auto flex flex-col gap-y-4">
  <!--
    <Input
      title="Project URL"
      bind:value={url}
      description="You find this on your Supabase Dashboard > Project Settings > API > API
Settings."
    />

    <Input
      title="Project API Key"
      bind:value={key}
      description="You can provide the public API key, but make sure RLS is disabled (or
  anonymous reads allowed) for the table you are going to use."
    />-->

  <!--
  <Input
    title="Table"
    bind:value={table}
    description="The name of the table you want to subscribe to. Make sure the table has realtime enabled and is set up for delete-subscriptions with 'alter table [name] replica identity full;'."
  />
  -->

  <!--
    <Input
      title="Primary Key(s)"
      bind:value={keys}
      description="Seperate by comma if you have a composite primary key."
    />
    -->
</div>

<div class="text-center items-center justify-center flex flex-col w-full">
  <Title id="project">
    <img src="/icon.png" class="h-32 p-4" />
    <span class="text-[#F19A3E]">Sv</span><span class="text-[#00A063]">upa</span
    >.js</Title
  >
  <Subtitle>
    A <a href="https://svelte.dev/" class="text-[#F19A3E]">Svelte</a>
    +
    <a href="https://supabase.com/" class="text-[#00A063]">Supabase</a>
    framework to create realtime apps with a single source of truth and optimistic
    updates.
  </Subtitle>

  <div
    class="relative md:w-[800px] w-full border-2 outline outline-0 hover:outline-2 outline-gray-200 border-gray-200 dark:border-[rgba(255,255,255,0.1)] rounded-md shadow-md hover:shadow-lg transition-all duration-300 my-8"
  >
    <img
      src="/arrow.png"
      class="w-32 h-32 dark:brightness-0 dark:invert absolute -right-24 -bottom-24 z-30 rotate-180 xl:flex hidden"
    />
    <div
      class="w-48 h-32 absolute -right-48 text-2xl -bottom-32 z-30 items-end xl:flex hidden"
      style="font-family:Indie Flower;"
    >
      This is what it does. Cool, huh?
    </div>
    <img src="/demo_hero.gif" class="" />
  </div>

  <Title id="features">Features</Title>
  <Subtitle>
    All the features you need to build realtime apps.
  </Subtitle>

  <div
    class="text-lg grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-16 my-8"
  >
    <FeatureCard title={"Single Source of Truth"}>
      Svupa considers Supabase's Postgres database as a
      <a
        href="https://en.wikipedia.org/wiki/Single_source_of_truth"
        class="underline">Single Source of Truth</a
      >.
    </FeatureCard>
    <FeatureCard title={"Optional Optimistic Updates"}>
      For some applications, <a
        href="https://en.wikipedia.org/wiki/Optimistic_replication"
        class="underline">optimistic updates</a
      > are a must have. Others require a consistent state. Svupa allows you to choose.
    </FeatureCard>
    <FeatureCard title={"Application-wide Data-Caching"}>
      Need the same data in multiple components? Svupa caches requested data. No
      need to fetch the same data multiple times.
    </FeatureCard>
    <FeatureCard title={"No Polling"}>
      Supabase Realtime uses websockets and server side notifications to push
      changes. No changes on your data, no traffic between client and server.
    </FeatureCard>
    <FeatureCard title={"Conflic Resolution"}>
      Svupa uses a variation of <a
        href="https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type"
        class="underline">Operation-based Conflict Resolution</a
      > to keep the data consistent across clients.
    </FeatureCard>
    <FeatureCard title={"Simple Usage"}>
      Svupa can be integrated into existing projects with minimal friction. If
      your stack is Svelte + Supabase already, Svupa can be integrated <a
        href="#usage"
        class="underline">in three LOC</a
      >.
    </FeatureCard>
    <FeatureCard title={"As scalable as Supabase"}>
      Svelte runs on the client side, hence it is not a bottleneck. Supabase
      slogan is: Build in a weekend. Scale to millions. Svupa leverages this
      ability.
    </FeatureCard>
    <FeatureCard title={"Minimal Footprint"}>
      Svupa is really not a lot of code. It will not bloat your bundle. <!--TODO: add actual package size: only x.x kb gzipped.-->
    </FeatureCard>
    <FeatureCard title={"Open-Source, built on Open-Source"}>
      Both, Svelte and Supabase are Open-Source. The Svupa framework is
      Open-Source too.
    </FeatureCard>
  </div>

  <Title id="demo">Demo</Title>

  <Subtitle>
    Try it yourself. Right here, right now. Everything is already set up.
  </Subtitle>
  <DemoBox {demoUrlOptimistic} {demoUrlPesimisitic} />

  <h3 class="text-xl mt-8">Share this very demo.</h3>

  <CopyInput text={demoUrl} />

  <p class="my-2 w-full px-4 lg:px-0 lg:w-2/3 text-justify">
    You can open this link in a new tab, another browser, your phone or send it
    to your friend on another continent. They will see the same data as you do,
    and they will see it update in realtime when you click - and you will see
    their changes in realtime too.
  </p>

  <Title id="usage">Usage</Title>

  <Subtitle>As convenient as it gets.</Subtitle>

  <p class="my-2 w-full px-4 lg:px-0 lg:w-2/3 text-justify">
    Using the Supabase API is low effort already. Svupa takes it to the next
    level. You can integrate it into your existing Svelte project with just a
    few LOC.
  </p>

  <div class="relative max-w-full">
    <img
      src="/arrow2.png"
      class="w-32 h-32 dark:brightness-0 dark:invert absolute -right-28 -top-20 z-10 xl:flex hidden"
    />
    <div
      class="w-48 h-32 absolute -right-48 text-2xl -top-32 z-30 flex items-start xl:flex hidden"
      style="font-family:Indie Flower;"
    >
      Click here to copy this code.
    </div>
    <div class="relative z-20">
      <CodeSnippet code={code.usage} filename={"Component.svelte"} />
    </div>
  </div>

  <p class="my-2 w-full px-4 lg:px-0 lg:w-2/3 text-justify">
    That's it. Your application is now subscribed to the state of
    <Markup>my_table</Markup> where <Markup>my_column = my_value</Markup>. As
    the data is directly streamed to a Svelte store, you can use it exactly as
    you would with any other store. And since this is working on top of
    Supabase, authentication and RLS are respected without any additional
    effort.
  </p>

  <Subtitle>Change it, tweak it, that's it.</Subtitle>
  <p class="my-2 w-full px-4 lg:px-0 lg:w-2/3 text-justify">
    Svupa has some built in metadata stores like <Markup>size</Markup> and <Markup
      >header</Markup
    > but you can also define your own
    <a
      href="https://svelte.dev/docs#run-time-svelte-store-derived"
      class="underline">derived stores</a
    >. For example, we can extend the above example to also show the sum of some
    value.
  </p>

  <div class="relative z-20 max-w-full">
    <CodeSnippet code={code.derived} filename={"AnotherComponent.svelte"} />
  </div>

  <p class="my-2 w-full px-4 lg:px-0 lg:w-2/3 text-justify">
    And - you probably already guessed it - this store and the dependent UI
    components are updated with any update to the underlying data. No matter if
    it's an optimistic update or an update in the database, your UI will always
    be up to date and consistent.
  </p>

  <Subtitle>Change the state from everywhere.</Subtitle>

  <p class="my-2 w-full px-4 lg:px-0 lg:w-2/3 text-justify">
    Updates of relevant rows will trigger a render of the component on all
    subscribed clients, no matter where they come from. Any microservice or
    cronjob can update the data and all clients will immediately see the change.
  </p>
  <div class="relative z-20 max-w-full">
    <CodeSnippet code={code.sql} filename={"request.sql"} />
  </div>

  <!--
  <Subtitle>Are you ready to try it?</Subtitle>

  <p class="my-2 w-full px-4 lg:px-0 lg:w-2/3 text-justify">Easily install using the package manager of your choice.</p>
  <div class="w-2/3 grid grid-cols-2">
    <CodeSnippet code={code.installNpm} />
    <CodeSnippet code={code.installYarn} />
  </div>
-->

  <Title id="alternatives">Alternatives</Title>

  <p class="my-2 w-full px-4 lg:px-0 lg:w-2/3 text-justify">
    There are other great, much more sophisticated and established frameworks
    that deal with client synchronization. Before you consider using Svupa,
    check out these frameworks to see if they better fit your usecase.
  </p>
  <div
    class="text-lg grid-cols-1 md:grid-cols-2 grid lg:grid-cols-3 w-full gap-16 my-8"
  >
    <a href="https://github.com/yjs/yjs">
      <FeatureCard title={"Yjs"} type="link">
        Due to its fast peer-to-peer nature Yjs is ideal for usecases that need
        fast and frequent synchronization like shared cursors.
      </FeatureCard>
    </a>
    <a href="https://doc.replicache.dev/">
      <FeatureCard title={"Replicache"} type="link">
        Replicache offers most of the features Svupa does, and much more. For
        example, Replicache has offline support.
      </FeatureCard>
    </a>
    <a href="https://sveltequery.vercel.app/">
      <FeatureCard title={"Svelte Query"} type="link">
        Backend agnostic, performant and powerful data synchronization for
        Svelte. Not using Supabase? You should check out Svelte Query instead of
        Svupa.
      </FeatureCard>
    </a>

    <a href="/contact">
      <FeatureCard title={"What else?"} type="plus">
        If you know of any other frameworks that are worth mentioning, please
        get in touch and let me know. I'd love to add them here.
      </FeatureCard>
    </a>
  </div>

  <Title id="status">Status</Title>

  <Subtitle>Svupa is in open alpha.</Subtitle>
  <p class="my-2 w-full px-4 lg:px-0 lg:w-2/3 text-justify">
    Currently, Svupa is in a proof of concept state and I am very happy about
    feedback. The framework is in open alpha (i.e. it works and is openly
    available on GitHub), but there is no npm release yet. While the majority of
    features seem to be running stable, it is strongly advised against using
    Svupa for anything other than playing around as of now. If you have
    questions, ideas or feedback, please get in touch.
  </p>

  <p class="my-2 w-full px-4 lg:px-0 lg:w-2/3 text-justify">
    This project is submitted to
    <a href="https://hack.sveltesociety.dev/" class="underline">SvelteHack</a> -
    a Hackaton organized by
    <a href="https://sveltesociety.dev/" class="underline">Svelte Society</a>.
    <!--
    Therefore, contributions of any kind will only be possible after the
    Hackaton is over.-->
  </p>

  <Subtitle>
    <span class="bg-gradient-to-br from-[#F19A3E] to-[#D81E5B] bg-clip-text"
      ><span
        on:click={() => {
          openInNewTab("https://github.com/jfreyberg/Svupa");
        }}
        class="text-transparent cursor-pointer"
        >If you like this project, please consider dropping a star on Github.</span
      >
    </span>
  </Subtitle>
  <!--
  <div class="w-1/2 mx-auto flex flex-row">
    <Button on:click={() => {
      openInNewTab("https://github.com/jfreyberg/Svupa");
    }}>Github</Button>
  </div>

  <Title>Dependencies</Title>

  <div class="w-full grid grid-cols-2 gap-8 text-left mt-8 mb-32">
    <div
      class="gap-y-4 flex flex-col border-gray-200 dark:border-[rgba(255,255,255,0.1)] border-2 p-4 rounded-md flex mx-auto"
    >
      <h3 class="text-xl">Why Svelte?</h3>
      <div>
        <FeatureItem
          text="Open Source, smaller and faster than React or Vue."
        />
        <FeatureItem text="Stores finally make state management a intuitive." />
        <FeatureItem
          text="Svelte's reactivity makes it an ideal fit for realtime apps."
        />
        <FeatureItem
          text="Most importantly, Svelte makes developing so much more fun."
        />
      </div>
    </div>
    <div
      class="gap-y-4 flex flex-col border-gray-200 dark:border-[rgba(255,255,255,0.1)] border-2 p-4 rounded-md flex mx-auto"
    >
      <h3 class="text-xl">Why Supabase?</h3>
      <div class="">
        <FeatureItem text="Open Source and offers a generous free tier." />
        <FeatureItem
          text="Build in authentication, serverless API and SQL support."
        />
        <FeatureItem
          text="The Realtime API is exactly what's needed for a framework like Svupa."
        />
        <FeatureItem
          text="Most importantly, Supabase makes developing so much more fun."
        />
      </div>
    </div>
  </div>
-->
</div>
