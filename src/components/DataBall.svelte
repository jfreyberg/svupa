<script>
  import { derived } from "svelte/store";
  import { createClient } from "@supabase/supabase-js";
  import { svupa } from "/src/utils/svupa";

  export let row_id;
  export let optimistic;
  let scale = 100;

  let url = "https://hfvvrfrkhbkyqfkkxdsb.supabase.co";
  let key =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmdnZyZnJraGJreXFma2t4ZHNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzgzNzA2ODUsImV4cCI6MTk5Mzk0NjY4NX0.BEikWxuiQSPO6qtzrQlTzErWrJDJEDZcqR9CpHD7Zxg";

  let keys = "id";
  const supabase = createClient(url, key);
  const a = svupa(supabase, "demo", keys);
  let { name: x, store: rows } = a.request({
    type: "eq",
    column: "id",
    value: row_id,
  });

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function isEven(n) {
    return n % 2 == 0;
  }

  let intToStr = {
    0: "zero",
    1: "one",
    2: "two",
    3: "three",
    4: "four",
    5: "five",
    6: "six",
    7: "seven",
    8: "eight",
    9: "nine",
  };

  async function upsertRow(invalid = false) {
    let row = structuredClone($rows.filter((row) => row.id == row_id)[0]);
    row.number = (row.number += 1) % 10;
    row.plain = intToStr[row.number];
    row.is_even = isEven(row.number);

    if (invalid) {
      row.number = "INVALID STATE";
    }

    await a.upsert(row, optimistic).then((res) => {
      //console.log(res);
    });
  }

  let element = derived(
    rows,
    ($rows, set) => {
      if ($rows.length > 0) {
        set($rows.sort()[0]);
      } else {
        set(false);
      }
    },
    false
  );
</script>

<div class="w-full h-full flex items-center justify-center">
  {#if $element}
    <div
      style={"border-width:" + ($element.number + 3) * 2 + "px !important;"}
      class="scale-{scale} {$element.is_even
        ? 'border-[#F19A3E] text-[#F19A3E]'
        : 'border-[#D81E5B] text-[#D81E5B]'} select-none rounded-full w-24 h-24 md:w-48 md:h-48 transition-all duration-200 cursor-pointer flex items-center justify-center text-4xl md:text-6xl font-extrabold"
      on:click={async () => {
        scale = 90;
        await upsertRow();
        if (!optimistic) {
          setTimeout(() => {
            scale = 100;
          }, 100);
        } else {
          scale = 100;
        }
      }}
    >
      {$element.number}
    </div>
  {/if}
</div>
