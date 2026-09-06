import { Groq } from 'groq-sdk';
import visionAgentPrompt from '../prompts/visionAgentPrmopt.js';

const groq = new Groq({apiKey:process.env.apiKey!});
export async function agent(image : string) {
  const chatCompletion = await groq.chat.completions.create({
    "messages": [
      {
        "role" : "system",
        content : visionAgentPrompt,
      },
      {
        "role": "user",
        "content": [
          {
            "type": "image_url",
            "image_url": {"url": `data:image/png;base64,${image}`}
          }
        ]
      }
    ],
    "model": "qwen/qwen3.6-27b",
    "temperature": 1,
    "max_completion_tokens": 1024,
    "top_p": 1,
    "stream": false,
    "stop": null
  });
  return (chatCompletion.choices[0]?.message.content);
};