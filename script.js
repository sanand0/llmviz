import { llmviz } from "./llmviz.js";
window.$docsify = {
  auto2top: true,
  name: "Contents",
  themeColor: "red",
  plugins: [
    function (hook) {
      hook.ready(function () {
        // Render any JSON with a specific class via LLMViz. Append link to embed page.
        document.querySelectorAll('a[target^="llmviz"]').forEach(async (link) => {
          const container = link.closest("p, div");
          const html = [];
          // if (link.target == "llmviz-controls")
          //   html.push(`<input type="range" class="form-range" min="0" max="1" step="0.01" value="0.5">`);
          html.push(`<pre style="white-space:pre-wrap"></pre>`);
          container.innerHTML = html.join("");
          const data = await fetch(link.href).then((r) => r.json());
          llmviz(container.querySelector("pre"), data, { summary: true });
          container.addEventListener("input", () => llmviz(container.querySelector("pre"), data, { summary: true }));
        });
      });
    },
  ],
};
