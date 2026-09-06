import model from "../config/model.config.js";
import systemPrompt from "../prompts/systemPrompt.js";
import devloperPrompt from "../prompts/developerPrompt.js";
import type { ChatCompletionMessageParam, Completions } from "openai/resources";
import { messageQueue } from "../app.js";
import { toolCaller } from "../orchestration/toolOrchestrator.js";
import contextManager from "../context/contextManager.js";
import memoryPrompt from "../prompts/memoryPrompt.js";


let messages : ChatCompletionMessageParam[] = [
        {role :"system", content : systemPrompt},
        {role : "developer", content :  devloperPrompt + memoryPrompt},
    ]

const max_token = Number(process.env.MAX_MODEL_LEN!);
const compact_threshold_percentage = 0.9;  
const compact_threshold_chat = 235;
let tokenUsed : Completions.CompletionUsage | null;
let chatCount = 0
let contextMessage  : any = []
const oldSummary : object[] = []

const contextWindowChecker = async(tokenUsed : Completions.CompletionUsage)=>{
    console.log(`tokenUsed: ${JSON.stringify(tokenUsed)}`);
    const totalUsedToken = tokenUsed.total_tokens
    if(totalUsedToken >= ( compact_threshold_percentage * max_token ) || chatCount >= compact_threshold_chat){
        console.log("🌪️ Compaction started")
        chatCount = 0;
        const  compactedContext  = await contextManager(contextMessage, oldSummary);
        if(compactedContext && compactedContext.tail && compactedContext.status === "success"){
            console.log("🌪️ Compaction merging....");
            oldSummary.push(compactedContext.compactedContent?.res);
            messages = [
                {role :"system", content : systemPrompt},
                {role : "developer", content :  devloperPrompt}, 
                {role: "system", content: `Conversation state from previous context:\n${compactedContext.compactedContent?.res}`},
                 ...compactedContext.tail
            ];
            contextMessage =  [ 
                {role: "system", content: `Conversation state from previous context:\n${compactedContext.compactedContent?.res}`},
                 ...compactedContext.tail
            ]
            return true
        }
        else{
            console.log("🌪️ Compaction merging failed");
            return false
        }
    }
    else{
        return false
    }       
}

export const runAgentLoop = async(userInput : string, onOutput: (printMessage: string) => void)=>{
    try{
        messages.push({role: "user", content: userInput});
        contextMessage.push({role: "user", content: userInput});
        while(true){
            if(tokenUsed){
                const compacted = await contextWindowChecker(tokenUsed);
                if (compacted) {
                    tokenUsed = null;
                }
            }
            const response = await model(messages);
            if (!response || !response.out || !response.tokenUsed) {
                return;
            }
            tokenUsed = response.tokenUsed;
            if(response.out.content){
                onOutput(response.out.content.split('</think>')[1]?.trim() !);
            }
            chatCount += 1
            contextMessage.push(response.out)
            messages.push(response.out);
            const toolCall = response.out.tool_calls;
            if(toolCall && toolCall.length > 0){
                for (const tool of toolCall) {
                    if (tool.type === "function") {
                        const toolResponse : any = await toolCaller(tool.id,tool.function);
                        messages.push(toolResponse);
                        contextMessage.push(toolResponse);
                    }
                }
                continue;
            }
            if(messageQueue.length >0){
                while (messageQueue.length > 0) {
                    const msg = messageQueue.shift()
                    if(msg){
                        contextMessage.push({role: "user", content: msg})
                        messages.push({role: "user", content: msg});
                    }
                }
                continue;
            }
            return response.out.content ?? "";
        }
    }
    catch(err){
        onOutput("Unable to Connect to EMC agent Please restart");
    }
}