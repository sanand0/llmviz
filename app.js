import { getProfile } from "https://aipipe.org/aipipe.js";
import { llmviz } from "./llmviz.js";

const { token, email } = getProfile();
if (!token) window.location = `https://aipipe.org/login?redirect=${window.location.href}`;

const $output = document.querySelector("#output");
const num1 = new Intl.NumberFormat("en-US", {
  style: "decimal",
  grouping: "always",
  maximumFractionDigits: 1,
  minimumFractionDigits: 1,
});

document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();

  $output.innerHTML = `<div class="spinner-border" role="status"></div>`;

  let result;
  try {
    const response = await fetch("https://aipipe.org/openrouter/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-4.1-nano",
        messages: [
          { role: "user", content: document.querySelector("#user").value },
        ],
        logprobs: true,
        top_logprobs: 5,
        max_tokens: 200,
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

const showRangeValue = (el) => (el.parentElement.querySelector(".range-value").textContent = num1.format(+el.value));
for (const el of document.querySelectorAll(".form-range")) {
  showRangeValue(el);
  el.addEventListener("input", () => showRangeValue(el));
}
