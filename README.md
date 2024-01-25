# LLM Viz

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
        "content": "Write an essay on: Does cannibalism deserves leniency on the grounds that it is less wasteful?"
      }
    ]
  }' > response.json
```
