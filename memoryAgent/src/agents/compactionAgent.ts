import type { ChatCompletionMessageParam } from "openai/resources";
import compactionPrompt from "../prompts/compectionPrompt.js";  
import model from "../config/model.config.js";

const compactionAgent = async(context : ChatCompletionMessageParam[], oldSummery : object)=>{
    try{
        console.log("🌪️ Compaction reached to compaction Agent")
        const messages : ChatCompletionMessageParam[] = [
            {"role" : "system", content : compactionPrompt}, 
            {role: "user", content: `EXISTING SUMMARY:\n${oldSummery}\n\nCONVERSATION TRANSCRIPT TO SUMMARIZE:\n${JSON.stringify(context)}`}
        ]
        const response = await model(messages, []);
        if (!response) {
            console.log("🌪️ Compaction failed: no response from model");
            return;
        }
        console.log("🌪️ Compacted")
        return response.out?.content?.split("</think>")[1];
            
    }
    catch(err){
        console.log(err)
    }
}

export default compactionAgent