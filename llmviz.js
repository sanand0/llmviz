/* globals bootstrap */
import { scaleLinear } from "d3-scale";
import { pc } from "./node_modules/@gramex/ui/dist/format.js";

export function llmviz(target, data, { summary } = {}) {
  const color = scaleLinear().domain([0, 2]).range(["white", "orange"]);
  const content = data.choices[0].logprobs.content;

  const html = content.map(
    ({ token, logprob, top_logprobs }, i) => /* html */ `<span
          style="background-color:${color(-logprob)};outline:1px solid rgba(0,0,0,0.1);"
          data-index="${i}"
          data-bs-toggle="popover"
          data-index="${i}"
          data-bs-content="${escape(
            top_logprobs
              .map(
                ({ token, logprob }) =>
                  `<div class="text-start px-2" style="color:#000;background-color:${color(-logprob)}">${token} (${pc(Math.exp(logprob))})</div>`,
              )
              .join("\n"),
          )}">${token}</span>`,
  );
  if (summary) {
    const seqLogProb = content.reduce((a, { logprob }) => a + logprob, 0) / content.length;
    html.push(
      /* html */ `<p>Seq-LogProb: <span style="color:#000;background-color:${color(-seqLogProb)}">${pc(Math.exp(seqLogProb))}</span></div>`,
    );
  }

  target.innerHTML = html.join("");
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

const escape = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
