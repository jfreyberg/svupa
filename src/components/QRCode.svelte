<script>
  // src: https://svelte.dev/repl/72d3ca877047468db8bb3a68f25a8b92?version=3.14.1

  import { onMount } from "svelte";

  export let value;
  export let size;

  let qrcode;

  onMount(() => {
    let script = document.createElement("script");
    script.src =
      "https://cdn.rawgit.com/davidshimjs/qrcodejs/gh-pages/qrcode.min.js";
    document.head.append(script);

    script.onload = function () {
      qrcode = new QRCode("qrcode-" + value, {
        text: value,
        width: size,
        height: size,
        colorDark: "#202C59",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
      });
    };
  });
</script>

<div id="qrcode-{value}" />
