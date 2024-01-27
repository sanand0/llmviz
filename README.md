# Visualizing LLM hallucinations

Large language models generate tokens (chunks of text) one at a time. Given text, it:

1. Guesses possible next tokens (from training)
2. Picks one randomly with a high probability
3. Repeats

![Funny picture: dog on a train quickly laying tracks in front of it. That's kind of how LLMs generate tokens.](dog-train-llm-next-word.gif ".mx-auto .d-block")

Each token has an associated probability. For example, when prompted **Suggest 4 wrong and 1 correct answer to "What is the Capital of France"**, GPT 3.5 suggests:

<!-- use :ignore :target=llmviz to identify which links to render as an LLMViz -->

[See JSON response to the prompt](data/capital-of-france.json ":ignore :target=llmviz")

1. Each box above is a token.
2. Dark colors indicate low probabilities.
3. **Hover on each token** to see alternatives tokens.

## LLMs generate multiple tokens

At every step, an LLM generates multiple tokens. Each token has a "probability" based on past training. For example, after `5. Correct:`, it generated these tokens as alternatives:

| Token        | Logprob | Probability |
| :----------- | ------: | ----------: |
| ` Paris` ⭐  |   -0.08 |       91.9% |
| ` The`       |   -3.50 |        3.0% |
| ` Rome`      |   -3.51 |        3.0% |
| ` Berlin`    |   -5.23 |        0.5% |
| ` Marseille` |   -6.04 |        0.2% |

The "logprob" is natural logarithm (base `e`) of the probability. -0.08 means a 91.9% probability. -3.50 is a 3% probability. 5.23 is a 0.5% probability. And so on.

It stops generating alternatives when the sum of probabilities reaches [`top_p`](https://platform.openai.com/docs/api-reference/chat/create#chat-create-top_p ":ignore :target=_blank") which defaults to 1.0 (100%). If you set `top_p` to 0.5, it would have generated only 1 alternative in this case, ` Paris`.

From past training, ` Paris` is the most likely token. But it needn't always pick the most likely token.

## LLMs pick tokens randomly

In the first line, after `1. Wrong:`, it generated these tokens as alternatives:

| Token       | Logprob | Probability |
| :---------- | ------: | ----------: |
| ` London`   |   -0.95 |         38% |
| ` Paris` ⭐ |   -1.24 |         29% |
| ` Berlin`   |   -1.54 |         21% |
| ` New`      |   -3.28 |          4% |
| ` The`      |   -3.57 |          3% |

But instead of choosing ` London` (38%), it (wrongly) picked ` Paris` (29%) because it **picks randomly** using the probability column.

You can pass a `temperature` parameter. This [scales down the logprobs](https://github.com/openai/gpt-2/blob/9b63575ef42771a015060c964af2c3da4cf7c8ab/src/sample.py#L64 ":ignore :target=_blank") by the `temperature` (e.g. `temperature=2` halves logprobs and `temperature=0.5` doubles them.)

| Token     | Logprob (t=2) | Prob | Logprob (t=0.5) | Prob |
| :-------- | ------------: | ---: | --------------: | ---: |
| ` London` |         -0.48 |  62% |           -1.91 |  15% |
| ` Paris`  |         -0.62 |  54% |           -2.48 |   8% |
| ` Berlin` |         -0.77 |  46% |           -3.08 |   5% |
| ` New`    |         -1.64 |  19% |           -6.56 |   0% |
| ` The`    |         -1.79 |  17% |           -7.14 |   0% |

When `temperature=2`, there's less difference between ` London` and ` Paris`. `temperature=0.5` makes that difference much bigger.

![How temperature affects probabilities](temperature-impact.png)

The lower the temperature, the more likely the first token is picked. That's good for accuracy and bad for creativity.

A visual demonstration of how LLMs work.

```bash
curl https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-3.5-turbo",
    "logprobs": true,
    "top_logprobs": 5,
    "messages": [
      {
        "role": "system",
        "content": "You are a helpful assistant."
      },
      {
        "role": "user",
        "content": "Suggest 4 wrong and 1 correct answer to \"What is the Capital of France\""
      }
    ]
  }' > response.json
```
