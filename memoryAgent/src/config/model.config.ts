import OpenAI from "openai";
import type { ChatCompletion } from "openai/resources/chat";
import type { ChatCompletionMessageParam } from "openai/resources.js";

const client = new OpenAI({
  baseURL: "http://localhost:8000/v1",
  apiKey: "EMPTY",
});


const model = async(message : ChatCompletionMessageParam[], tools : OpenAI.Chat.Completions.ChatCompletionTool[]) =>{
    const response : ChatCompletion = await client.chat.completions.create({
        model: process.env.MODEL_NAME !,
        messages :message,
         ...(tools?.length ? { tools } : {}),
        temperature: 0,
    });
    const out  = response?.choices[0]?.message;
    return {out : out, tokenUsed : response.usage};
}


export default model