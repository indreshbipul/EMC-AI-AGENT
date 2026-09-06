import type { ChatCompletionMessageParam } from "openai/resources";
import compactionAgentService from "../services/compactionAgent.service.js";

const keep_tail_percentage = 0.30;         // keep last 30% of history verbatim
const minimum_tail_message  = 4;        // floor so short sessions don't over-compact

function findSafeCutIndex(entries : any, desiredCut : number) {
    console.log("🌪️ Compaction reached to cut the tail")
    let cut = desiredCut;
    while (cut > 0) {
        const prev = entries[cut - 1];
        const isDanglingToolCall = !Array.isArray(prev) && prev.role === "assistant" && prev.tool_calls?.length > 0;
        if (!isDanglingToolCall) break;
        cut--; 
    }
    return cut;
}

const contextManager = async (contextMessage: ChatCompletionMessageParam[], oldSummary : object) => {
    console.log("🌪️ Compaction reached to contextManager", oldSummary)
    if (contextMessage.length <= minimum_tail_message) {
        return {status : "failed"};
    }
    const desiredCut = Math.min(Math.floor(contextMessage.length * (1 - keep_tail_percentage)), contextMessage.length - minimum_tail_message);
    if (desiredCut <= 0) {
        return {status : "failed"};
    }
    const compactCount = findSafeCutIndex(contextMessage, desiredCut);
    const toCompact = contextMessage.slice(0, compactCount);
    const tail = contextMessage.slice(compactCount);
    if (toCompact.length === 0) {
        return {status : "failed"};
    }
    const compactedContent  = await compactionAgentService(toCompact, oldSummary);
    if (!compactedContent ) {
        console.log("⚠️ Compaction failed — skipping this round, context left unchanged");
        return {status : "failed"};
    }
    if(compactedContent.status != 202){
        console.log("⚠️ Compaction failed — due to Compaction service, skipping this round, context left unchanged");
        return {status : "failed"};
    }
    console.log("🌪️ Compaction Checking....", compactedContent);
    return {status : "success", compactedContent, tail}
};

export default contextManager;