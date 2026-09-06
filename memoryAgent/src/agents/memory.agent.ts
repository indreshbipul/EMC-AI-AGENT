import type { ChatCompletionMessageParam } from "openai/resources";
import memoryPrompt from "../prompts/memoryPrompt.js";
import model from "../config/model.config.js";
import toolManager from "../orchestrations/memortTool.orchestration.js";
import type OpenAI from "openai";
import { createMemory_toolDefination, decayMemory_toolDefination, deleteMemory_toolDefination, reinforceMemory_toolDefination, updateMemory_toolDefination } from "../orchestrations/memoryTool.defination.js";

export type Dbdata = {
    id: string;
    content: string;
    confidence: string;
    memoryType: "episodic" | "behavioral" | "semantic";
    status: "active" | "superseded";
}[]

let tools : OpenAI.Chat.Completions.ChatCompletionTool[] = [
    {"type" : "function", function : createMemory_toolDefination},
    {"type" : "function", function : updateMemory_toolDefination},
    {"type" : "function", function : deleteMemory_toolDefination},
    {"type" : "function", function : decayMemory_toolDefination},
    {"type" : "function", function : reinforceMemory_toolDefination}
]

const memoryAgent = async(query : string, dbData : Dbdata, userId : string)=>{
    try {
        const prevHistory : object[] = []
        dbData.forEach((ele, index) =>{
            prevHistory.push({
                index : index,
                content : ele.content,
                confidence : ele.confidence,
                memoryType : ele.memoryType
            })
        })
        const messages : ChatCompletionMessageParam[] = [
            {role : "system", content : memoryPrompt },
            {role : "user", content : `NEW MEMORY: ${query} EXISTING MEMORIES:${JSON.stringify(prevHistory)}}` }
        ]
        while(true){
            const response = await model(messages, tools)
            if(!response || !response.out){
                throw new Error(`LLM model not responded not responded`)
            }
            messages.push(response.out)
            if(response.out.tool_calls?.length){
                const toolCalls = response.out.tool_calls;
                for (const toocall of toolCalls){
                    if(toocall.type === "function"){
                        const response = await toolManager(toocall.function, dbData, userId);
                        if(!response){
                            throw new Error(`${toocall.function.name} not responded`)
                        }
                        messages.push({"role" : "tool", tool_call_id: toocall.id, content : JSON.stringify(response)})
                    }
                }
                continue;
            }
            return response.out.content ?? "";
        }
    } 
    catch (err) {
        console.log("Erorr while running the memory Agent")
        throw err
    }
}

export default memoryAgent;