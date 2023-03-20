<script>
  export let title;
  export let type = "check";
</script>

<div
  class="shadow-sm hover:outline-2 outline-0 outline outline-gray-200 transition-all duration-100 cursor-pointer flex flex-col items-center justify-center gap-y-4 border-2 border-gray-200 dark:border-[rgba(255,255,255,0.1)] w-auto rounded-md p-4"
>
  <img src="/{type}.png" class="w-8 h-8 dark:brightness-0 dark:invert" />
  <div class="text-lg">{title}</div>
  <p class="text-sm"><slot /></p>
</div>
