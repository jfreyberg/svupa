<script>
  import FeatureCard from "/src/components/FeatureCard.svelte";
  import FeatureItem from "/src/components/FeatureItem.svelte";
  import Title from "/src/components/Title.svelte";
  import Subtitle from "/src/components/Subtitle.svelte";
  import Markup from "/src/components/Markup.svelte";
</script>

<div class="flex flex-col items-center justify-center">
  <Title id="idea">Idea</Title>
  <Subtitle>I built it, cause' I needed it.</Subtitle>
  <p class="my-2 w-full px-4 lg:px-0 lg:w-2/3 text-justify">
    I built Svupa to use it at my startup <a
      href="https://kmapp.io/"
      class="underline">kmapp.io</a
    >. We are building a modern, document-centric knowledge management platform.
    Building a multi-user web app is not easy, there are a lot of things to
    consider during development. One of the most important things is the state
    of the application. The state of the application is what the user sees, and
    ideally, it should be consistent for all users that are currently viewing
    the same content. If user A adds a comment, user B should see this comment
    in realtime. It is absolutely possible to achieve this with Supabase and
    Svelte, but doing it for many different parts of the application (comments,
    tags, etc.) requires a lot of boilerplate code. Abstraction is the key to
    success here, and that is when I came up with the idea for Svupa - an
    abstraction layer, that makes it easy to build realtime web apps.
  </p>
  <!--
  <Subtitle>The Status Quo.</Subtitle>
  <p class="my-2 w-full px-4 lg:px-0 lg:w-2/3 text-justify">
    Almost any modern webapp consists of frontend and backend componets. While
    the backend is responsible for actually doing things (e.g. payment
    processing, triggering the shipment of a product, etc.), the frontend is
    what the users sees and interacts with (e.g. clicking a button to order a
    product). A common issue of such platforms is the deviation of the actual
    state of things (backend) and what the user sees on the frotend. Let's keep
    the online store example. The user enters a search term: "winter boots",
    clicks on search and get's a list of results (which are pulled from the
    backend). Scrolling through the results, the user finally sees a pair of
    shoes they like and clicks on them, only to be shown a message telling them
    that these shoes are no longer available. But why are they in the list then?
    Well, the data has been pulled when the user started the search, but since
    then the shoes sold out. As we see, the user experience here is suboptimal
    because the state of backend and frontend are inconsistent.
  </p>
  <Subtitle>How can we solve this?</Subtitle>
  <p class="my-2 w-full px-4 lg:px-0 lg:w-2/3 text-justify">
    The most trivial approach would be to just request the current state from
    the backend at a short interval, e.g. once per second. This approach is
    called polling. But this means if we have 100 search results, we have to
    send data for all 100 of them every second. 100 objects, once per second,
    for every client, even if there are no changes. That's not feasible. It
    would be much better if just the changes were sent, right? Well, that is
    what Supabase Realtime does.
  </p>
  <Subtitle>Why do we need something else on top?</Subtitle>
  <p class="my-2 w-full px-4 lg:px-0 lg:w-2/3 text-justify">
    Using Supabase Realtime we are able to pull the initial data and then get
    updates on the data if it changes. But we still need to make our UI respond
    to these changes (i.e. are updated accordingly). It is not trivial to
    reflect these changes. Or is it? Reactivity has shaped most of the major
    Javascript frameworks, but, to cite the
    <a
      href="https://vercel.com/docs/beginner-sveltekit/reactivity"
      class="underline">Vercel Tutorial</a
    >, "Svelte almost feels like magic here". Changes received from the backend
    can be directly "streamed" into a Svelte store. Now Svelte can do its thing:
    Update data that depends on the update (derived stores) and show the results
    on the UI - at astonishing speed.
  </p>
-->
  <Title id="concept">Concept</Title>
  <Subtitle>What does it look like?</Subtitle>
  <img src="concept.png" class="max-w-[600px] m-8" />

  <p class="my-2 w-full px-4 lg:px-0 lg:w-2/3 text-justify">
    As a developer, one just just needs to define what data is needed, if (and
    how) it needs to be transformed and how the data should be displayed to the
    user and mutated by the user. Everything else is handled by Svupa. The data
    changes, the UI updates.
  </p>

  <Title id="dependencies">Dependencies</Title>

  <Subtitle>A very opinionated framework.</Subtitle>
  <p class="my-2 w-full px-4 lg:px-0 lg:w-2/3 text-justify">
    Svupa is built on top of Svelte and Supabase, which in turn is built on top
    of Postgres. This makes Svupa a heavily opinionated framework. Below you
    will see why I chose these dependencies, as well as explanations of how to
    understand Svupa if you are not familiar with Svelte or Supabase.
  </p>
  <Subtitle>Svelte Stores, but for the server.</Subtitle>
  <p class="my-2 w-full px-4 lg:px-0 lg:w-2/3 text-justify">
    If you are familiar with Svelte (especially stores and reactivity) you can
    think of Svupa like this: Using a Svelte store means you can see changes
    applyed to the store data immediately on the UI. With Svupa, the same thing
    happens but not just for one user, but all users who subscribe to a the data
    of a store.
  </p>

  <div
    class="gap-y-4 flex flex-col border-gray-200 dark:border-[rgba(255,255,255,0.1)] border-2 p-4 rounded-md mt-8 mx-auto"
  >
    <h3 class="text-xl">Why Svelte?</h3>
    <div>
      <FeatureItem text="Open Source, smaller and faster than React or Vue." />
      <FeatureItem text="Stores finally make state management a intuitive." />
      <FeatureItem
        text="Svelte's reactivity makes it an ideal fit for realtime apps."
      />
      <!--<FeatureItem text="Svelte makes developing so much more fun." />-->
    </div>
  </div>

  <Subtitle>Supabase Realtime, but for the frontend.</Subtitle>
  <p class="my-2 w-full px-4 lg:px-0 lg:w-2/3 text-justify">
    If you are familar with Supabase Realtime, you can think of Svupa like this:
    Using realtime, changes in your database are streamed to subscribed
    instances of your application (client browsers). Svupa now leverages Svelte
    to further "stream" this data inside the clients browser, transforming it if
    necessary and updating the UI to instantly reflect your changes.
  </p>
  <div
    class="gap-y-4 flex flex-col border-gray-200 dark:border-[rgba(255,255,255,0.1)] border-2 p-4 rounded-md mt-8 mx-auto"
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
      <!--<FeatureItem text="Supabase makes developing so much more fun." />-->
    </div>
  </div>

  <Title id="alternatives">Alternatives</Title>

  <p class="my-2 w-full px-4 lg:px-0 lg:w-2/3 text-justify">
    There are other great, much more sophisticated and established frameworks
    that deal with client synchronization. If you like Svupa, check out these
    frameworks to see if they fit your usecase.
  </p>
  <div
    class="text-lg grid-cols-1 md:grid-cols-2 grid lg:grid-cols-3 w-full gap-16 my-8"
  >
    <a href="https://www.convex.dev/">
      <FeatureCard title={"Convex"} type="link">
        Convex is a database that is built for realtime applications with a simple SDK.
        Convex seems to be a solid alternative to Supabase if realtime is
        an important relevant feature for your application.
      </FeatureCard>
    </a>
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
</div>
