<script lang="ts">
  import Title from "/src/components/Title.svelte";
  import Subtitle from "/src/components/Subtitle.svelte";
</script>

<div class="text-center items-center justify-center flex flex-col w-full">
  <p class="my-2 w-full px-4 lg:px-0 lg:w-2/3 text-center">
    This website does not use cookies and it does not collect any personal data.
  </p>

  <Title id="contact">Contact</Title>
  <Subtitle>
    Julian Freyberg<br />
    Mühlingstraße 1A<br />
    69121 Heidelberg
  </Subtitle>

  <div
    class="w-full text-center mt-4 mb-8 flex flex-row place-content-center gap-x-8"
  >
    <a href="https://github.com/jfreyberg" class=""
      ><svg
        class="w-16 h-16 my-2 "
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox="0 0 24 24"
        fill="currentColor"
        ><path
          d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
          class=""
        /></svg
      ></a
    >
    <a href="https://www.linkedin.com/in/julian-freyberg-02a651235/" class=""
      ><svg
        class="w-16 h-16 my-2 ml-2 "
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox="0 0 24 24"
        fill="currentColor"
        ><path
          d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z"
          class=""
        /></svg
      ></a
    >
    <a href="mailto:julian_freyberg@live.de" class=""
      ><svg
        class="w-16 h-16 my-2 ml-2 "
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        viewBox="0 0 512 512"
        ><circle
          cx="256"
          cy="256"
          r="256"
          style="fill: #202C59;"
          class=""
        /><path
          d="M317.536,379.904C295.408,391.568,272.88,396,245.936,396c-65.984,0-121.888-48.272-121.888-125.52
    c0-82.864,57.52-154.48,146.832-154.48c70,0,117.072,49.088,117.072,116.272c0,60.336-33.792,95.744-71.616,95.744
    c-16.096,0-30.976-10.864-29.776-35.408h-1.6c-14.08,23.744-32.592,35.408-56.736,35.408c-23.328,0-43.44-18.912-43.44-50.688
    c0-49.888,39.424-95.344,95.344-95.344c17.296,0,32.592,3.616,43.056,8.448l-13.68,72.816c-6.032,30.576-1.216,44.656,12.064,45.056
    c20.528,0.4,43.456-26.944,43.456-73.616c0-58.336-34.992-100.176-97.36-100.176c-65.584,0-120.688,51.904-120.688,133.568
    c0,67.184,43.84,108.624,103.376,108.624c22.928,0,44.256-4.816,60.752-14.08L317.536,379.904z M295.424,206.112
    c-4.016-1.216-10.864-2.816-20.112-2.816c-35.408,0-63.968,33.392-63.968,72.416c0,17.712,8.848,30.576,26.544,30.576
    c23.328,0,44.656-29.776,49.088-54.72L295.424,206.112z"
          style="fill:#FFFFFF;"
          class=""
        /></svg
      ></a
    >
  </div>
</div>
