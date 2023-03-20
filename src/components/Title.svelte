<script>
  export let id;
</script>

<div class="w-full items-center justify-center flex" id={id}>
  <h3 class="text-5xl font-extrabold mt-4 py-4 flex flex-row items-center">
    <slot />
  </h3>
</div>