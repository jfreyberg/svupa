<a href="https://svupa.vercel.app/">
<p  align="center">
<img src="./header.png">
</p>
</a>

Svupa is a [Svelte](https://svelte.dev/) + [Supabase](https://supabase.com/) framework to create realtime apps with a single source of truth and optimistic updates. It leverages the power of Supabase to create Svelte stores that are synchronized across clients.


<b>Here's how it works</b><br>

Supabase is an open-source database built on top of PostgreSQL. Svupa synchronizes (part of) the data from this database directly into a Svelte store. Since multiple users can subscribe to the same data, all clients will see the same state. With Svupa, it's as easy to react to changes in your database as it is to react to changes in a Svelte store - and that's damn easy.


If you're still confused, don't worry! You can see an example right here:

<img src="https://svupa.vercel.app/demo_hero.gif"><br><br>
And a conceptual overview here:
<br><br>
<img src="https://svupa.vercel.app/concept.png"><br>

I also provide much more information on the <a href="https://svupa.vercel.app/">project website</a>, including a live demo.

<b>Why Supabase?</b><br>

Supabase and Svelte are an excellent fit because they are built on similar paradigms, are rapidly gaining popularity, and focus on developer experience. Svupa seamlessly combines the two to create a framework that enables developers to build realtime applications much faster and without headaches.

<b>Project Status and Submission to SvelteHack</b><br>

Currently, Svupa is in a proof-of-concept state. My submission is not a fully functional framework but a demo of what Svupa can achieve, which is presented on the demo website I am submitting. I plan to release Svupa as a framework in the future, but that is way beyond the scope of the two months intended for this hackathon, even if I were working full-time on this. Maybe this hackaton helps me find some contributors. Of course, I will not touch the repository after the deadline until the winners are announced, or switch to another repo if that is prefered by Svelte Society. Considering that there are multi-million-dollar-backed startups developing solutions that achieve things similar to Svupa, e.g., <a href="https://www.convex.dev">Convex</a>, I consider my submission a worthy contribution to the open-source community and a proper example of how Svelte can be integrated with other web technologies to create cool things.
