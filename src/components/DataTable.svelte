<script>
  import { createClient } from "@supabase/supabase-js";
  import { svupa } from "/src/utils/svupa";
  import { v4 as uuidv4 } from "uuid";
  import Button from "./Button.svelte";

  let url = "https://hfvvrfrkhbkyqfkkxdsb.supabase.co";
  let key =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmdnZyZnJraGJreXFma2t4ZHNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzgzNzA2ODUsImV4cCI6MTk5Mzk0NjY4NX0.BEikWxuiQSPO6qtzrQlTzErWrJDJEDZcqR9CpHD7Zxg";

  let keys = "id";
  export let table;
  export let optimistic;

  /**
   * source: https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
   * Returns a random integer between min (inclusive) and max (inclusive).
   * The value is no lower than min (or the next integer greater than min
   * if min isn't an integer) and no greater than max (or the next integer
   * lower than max if max isn't an integer).
   * Using Math.round() will give you a non-uniform distribution!
   */
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

  const supabase = createClient(url, key);
  const a = svupa(supabase, table, keys.replaceAll(" ", "").split(","));
  let size = a._sizeStore;
  let header = a._headerStore;
  let { name: x, store: rows } = a.request();

  function insert(success = true) {
    let int = getRandomInt(0, 9);
    let text = intToStr[int];
    let bool = isEven(int);
    if (!success) {
      int = "NOT A NUMBER";
    }
    a.insert(
      {
        id: uuidv4(),
        number: int,
        plain: text,
        is_even: bool,
      },
      optimistic
    );
  }

  function upsert(success = true) {
    let max = $rows.length - 1;
    if (max == -1) {
      alert("no rows to upsert!");
      return;
    }
    let row = structuredClone($rows[getRandomInt(0, max)]);
    if (success) {
      row.number = (row.number += 1) % 10;
      row.plain = intToStr[row.number];
      row.is_even = isEven(row.number);
    } else {
      row.number = "NOT A NUMBER";
    }
    a.upsert(row, optimistic);
  }

  function deleteRow(id, success = true) {
    let row = structuredClone($rows.filter((row) => row.id == id)[0]);
    a.delete(row, optimistic);
  }

  function upsertRow(id, success = true) {
    let row = structuredClone($rows.filter((row) => row.id == id)[0]);
    if (success) {
      row.number = (row.number += 1) % 10;
      row.plain = intToStr[row.number];
      row.is_even = isEven(row.number);
    } else {
      row.number = "NOT A NUMBER";
    }
    a.upsert(row, optimistic);
  }

</script>

{#if $header}
  <div class="flex flex-col gap-y-2 overflow-auto">
    {#each $rows as row, i (row.id)}
      {#if i == 0}
        <div class="flex flex-row w-full">
          {#each $header as key (key)}
            {#if key != "id"}
              <div
                class="p-1 border-b-2 border-gray-200 dark:border-[rgba(255,255,255,0.1)] leading-6 text-sm font-bold text-gray-900 truncate"
                style="width:{100 / Object.entries(row).length}%"
              >
                {key}
              </div>
            {/if}
          {/each}
          <div
            class="p-1 border-b-2 border-gray-200 dark:border-[rgba(255,255,255,0.1)] leading-6 text-sm font-bold text-gray-900 truncate"
            style="width:{100 / Object.entries(row).length}%"
          >
            Options
          </div>
        </div>
      {/if}

      <div class="flex flex-row w-full">
        {#each $header as key (key)}
          {#if key != "id"}
            <div
              class="p-1 border-b border-gray-200 dark:border-[rgba(255,255,255,0.1)] leading-6 text-sm font-normal text-gray-900 truncate"
              style="width:{100 / Object.entries(row).length}%"
            >
              {row[key]}
            </div>
          {/if}
        {/each}
        <div
          class="p-1 border-b border-gray-200 dark:border-[rgba(255,255,255,0.1)] leading-6 text-sm font-normal text-gray-900 truncate flex flex-row gap-x-2"
          style="width:{100 / Object.entries(row).length}%"
        >
          <img
            src="/trash.png"
            class="w-6 h-6 cursor-pointer"
            on:click={() => {
              deleteRow(row.id);
            }}
          />
          <img
            src="/plus.png"
            class="w-6 h-6 cursor-pointer"
            on:click={() => {
              upsertRow(row.id);
            }}
          />
        </div>
      </div>
    {/each}
  </div>
  {#if $size < 5}
    <div
      class="flex absolute bottom-0 left-0 py-4 bg-white w-full items-center justify-center gap-x-4"
    >
      <Button on:click={insert} text="add row (success)" />
      <Button
        on:click={() => {
          insert(false);
        }}
        text="add row (fail)"
      />
      <Button
        on:click={() => {
          upsert(false);
        }}
        text="modify random row (fail)"
      />
    </div>
  {/if}
{/if}
