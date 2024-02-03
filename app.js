import { llmviz } from "./llmviz.js";

const $output = document.querySelector("#output");
const num3 = new Intl.NumberFormat("en-US", {
  style: "decimal",
  grouping: "always",
  maximumFractionDigits: 3,
  minimumFractionDigits: 3,
});

document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();

  $output.innerHTML = `<div class="spinner-border" role="status"></div>`;

  let result;
  try {
    const response = await fetch("https://gramener.com/llmproxy/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        "Authorization": `Bearer ${document.querySelector("#key").value}`,
      },
      credentials: "include",
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: document.querySelector("#system").value },
          { role: "user", content: document.querySelector("#user").value },
        ],
        logprobs: true,
        top_logprobs: 5,
        temperature: +document.querySelector("#temperature").value,
        top_p: +document.querySelector("#top_p").value,
      }),
    });
    result = await response.json();
    if (result.error) throw new Error(JSON.stringify(result.error));
  } catch (e) {
    $output.innerHTML = `<div class="alert alert-danger">${e}</div>`;
  }
  llmviz($output, result);
});

const showRangeValue = (el) => (el.parentElement.querySelector(".range-value").textContent = num3.format(+el.value));
for (const el of document.querySelectorAll(".form-range")) {
  showRangeValue(el);
  el.addEventListener("input", () => showRangeValue(el));
}
