/* globals bootstrap */
import { scaleLinear } from "d3-scale";
import { pc } from "./node_modules/@gramex/ui/dist/format.js";

export function llmviz(target, data) {
  const color = scaleLinear().domain([0, 2]).range(["white", "orange"]);

  target.innerHTML = data.choices[0].logprobs.content
    .map(
      ({ token, logprob, top_logprobs }, i) => /* html */ `<span
          style="background-color:${color(
            -logprob,
          )};outline:1px solid rgba(0,0,0,0.1);"
          data-index="${i}"
          data-bs-toggle="popover"
          data-index="${i}"
          data-bs-content="${escape(
            top_logprobs
              .map(
                ({ token, logprob }) =>
                  `<div class="text-start px-2"  style="color:#000;background-color:${color(
                    -logprob,
                  )}">${token} (${pc(Math.exp(logprob))})</div>`,
              )
              .join("\n"),
          )}">${token}</span>`,
    )
    .join("");
  if (bootstrap)
    bootstrap.Popover.getOrCreateInstance("body", {
      selector: '[data-bs-toggle="popover"]',
      customClass: "logprob-alternatives",
      html: true,
      sanitize: false,
      trigger: "hover focus",
      placement: "top",
    });
}

const escape = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
