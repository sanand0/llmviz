/* globals bootstrap */
import { scaleLinear } from "https://cdn.skypack.dev/d3-scale@4";

// const data = await fetch("data/program-vowels.json").then((r) => r.json());
const data = await fetch("data/cannibalism.json").then((r) => r.json());
const $output = document.getElementById("output");
const color = scaleLinear().domain([0, 5]).range(["white", "orange"]);

data.choices[0].logprobs.content.forEach(({ token, logprob }, i) => {
  $output.insertAdjacentHTML(
    "beforeend",
    /* html */ `<span
        style="background-color:${color(-logprob)}"
        data-index="${i}"
        data-bs-toggle="tooltip">${token}</span>`,
  );
});
new bootstrap.Popover("#output", {
  selector: '[data-bs-toggle="tooltip"]',
  customClass: "logprob-alternatives",
  html: true,
  sanitize: false,
  trigger: "hover focus",
  placement: "top",
  content: (el) =>
    data.choices[0].logprobs.content[+el.dataset.index].top_logprobs
      .map(
        ({ token, logprob }) =>
          `<div class="text-start px-2" style="color:#000;background-color:${color(
            -logprob,
          )}">${token}</div>`,
      )
      .join(""),
});
