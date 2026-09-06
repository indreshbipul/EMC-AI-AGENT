import OpenAI from "openai";
import type { ChatCompletion } from "openai/resources/chat";
import { browserClickDefinition, browserErrorDefinition, browserFillDefinition, browserGetDomDefinition, browserGotoDefinition, browserScreenshortDefinition, browserScrollDefinition, calculatorDefinition, createProjectDefinition, destroySandboxDefinition, getActiveProjectDefinition, getProjectsDefinition, retrieveMemoryToolDefinition, sandboxLogsDefinition, sandboxStatusDefinition, selectProjectDefinition, shellCommandDefinition, spinSandboxDefinition, timeDefinition, updateMemoryToolDefinition, uriSearchDefinition, webSearchDefinition } from "../orchestration/toolDefinitions.js";
import type { ChatCompletionMessageParam } from "openai/resources.js";

const client = new OpenAI({
  baseURL: "http://localhost:8000/v1",
  apiKey: "EMPTY",
});


const model = async(message : ChatCompletionMessageParam[]) =>{
    const response : ChatCompletion = await client.chat.completions.create({
        model: process.env.MODEL_NAME !,
        messages :message,
        tools: [
            {type: "function", function: calculatorDefinition},
            {type: "function", function: timeDefinition},
            {type: "function", function: shellCommandDefinition},
            {type: "function", function: spinSandboxDefinition},
            {type: "function", function: sandboxStatusDefinition},
            {type: "function", function: sandboxLogsDefinition},
            {type: "function", function: destroySandboxDefinition},
            {type: "function", function: webSearchDefinition},
            {type: "function", function: uriSearchDefinition},
            {type: "function", function: getProjectsDefinition},
            {type: "function", function: createProjectDefinition},
            {type: "function", function: selectProjectDefinition},
            {type: "function", function: getActiveProjectDefinition},
            {type: "function", function: browserClickDefinition},
            {type: "function", function: browserErrorDefinition},
            {type: "function", function: browserFillDefinition},
            {type: "function", function: browserGetDomDefinition},
            {type: "function", function: browserGotoDefinition},
            {type: "function", function: browserScrollDefinition},
            {type: "function", function: browserScreenshortDefinition},
            {type: "function", function: updateMemoryToolDefinition},
            {type: "function", function: retrieveMemoryToolDefinition},
        ],
        temperature: 0,
    });
    const out  = response?.choices[0]?.message;
    return {out : out, tokenUsed : response.usage};
}


export default model