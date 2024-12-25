import { llmviz } from "./llmviz.js";

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
  let key = document.querySelector("#key").value;
  // OpenAI keys start with sk_. LLMProxy keys don't, and require a :app-name at the end
  if (!key.startsWith("sk_")) key += ":llmviz";
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        Authorization: `Bearer ${key}`,
      },
      credentials: "include",
      body: JSON.stringify({
        model: "gpt-4o-mini",
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

const showRangeValue = (el) => (el.parentElement.querySelector(".range-value").textContent = num1.format(+el.value));
for (const el of document.querySelectorAll(".form-range")) {
  showRangeValue(el);
  el.addEventListener("input", () => showRangeValue(el));
}
