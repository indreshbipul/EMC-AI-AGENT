import { eq } from "drizzle-orm";
import embadingAgent from "../agents/embading.agent.js"
import { db } from "../app.js";
import { memoryTable } from "../models/memory.schema.js";
import uuidGen from "../utils/uuidGen.js";
type MemoryType = "episodic" | "behavioral" | "semantic";

class MemoryResponse  {
    toolName : string;
    status : string;
    output : string;

    constructor(toolName : string, status : string, output : string){
        this.toolName = toolName;
        this.status = status;
        this.output = output;
    }
}

export const deleteMemory_tool = async(memoryId : string) =>{
    try{
        await db.delete(memoryTable).where(eq(memoryTable.id, memoryId));
        return new MemoryResponse("deleteMemory", "success", "memory is deleted ");
    }
    catch(err){
        console.log(err)
        return new MemoryResponse("deleteMemory", "failed", String(err))
    }
}

export const reinforceMemory_tool = async(memoryId : string, confidence : number) =>{
    try{
        const thresholdConfidence = 0.95;
        if(confidence >  thresholdConfidence){
            return new MemoryResponse("reinforceMemory", "success", "memory already have maximam confidence score");
        }
        confidence += 0.015;
        await db.update(memoryTable).set({confidence : String(confidence)}).where(eq(memoryTable.id, memoryId));
        return new MemoryResponse("reinforceMemory", "success", "memory confidende is Uped as its below threshold limit");
    }
    catch(err){
        console.log(err)
        return new MemoryResponse("reinforceMemory", "failed", String(err))
    }
}

export const decayMemory_tool = async(memoryId : string, confidence : number) =>{
    try{
        const thresholdConfidence = 0.35;
        if(confidence >  thresholdConfidence){
            confidence -= 0.015;
        }
        if(confidence < thresholdConfidence){
            await db.delete(memoryTable).where(eq(memoryTable.id, memoryId));
            return new MemoryResponse("decayMemory", "success", "memory is deleted as confidence is below threshold limit");
        }
        await db.update(memoryTable).set({confidence : String(confidence)}).where(eq(memoryTable.id, memoryId));
        return new MemoryResponse("decayMemory", "success", "memory confidende is downed as its above threshold limit");
    }
    catch(err){
        console.log(err)
        return new MemoryResponse("decayMemory", "failed", String(err))
    }
}

export const createMemory_tool = async(userId : string, content : string, memoryType : MemoryType, confidence : number) =>{
    try{
        const memoryId = `mem-${uuidGen().replaceAll("-", "")}`
        const queryEmbedding = await embadingAgent(content);
        if(!queryEmbedding){
            return new MemoryResponse("createMemory", "failed", "Retry failed to call Embading Agent")
        }
        await db.insert(memoryTable).values({
            id : memoryId,
            userId,
            embedding : queryEmbedding,
            memoryType : memoryType,
            content : content,
            confidence : String(confidence),
        });
        return new MemoryResponse("createMemory", "success", "Memory is Created")
    }
    catch(err){
        console.log(err)
        return new MemoryResponse("createMemory", "failed", String(err))
    }
}

export const updateMemory_tool = async(memoryId : string, content : string, memoryType : MemoryType, confidence : number) =>{
    try{
        if(confidence < 0.9){
            confidence += 0.005
        }
        const queryEmbedding = await embadingAgent(content);
        if(!queryEmbedding){
            return
        }
        await db.update(memoryTable).set({content : content, embedding : queryEmbedding, confidence : `${confidence}`, memoryType : memoryType}).where(eq(memoryTable.id, memoryId));
        return new MemoryResponse("updateMemory", "success", "Memory Update Successfully")
    }
    catch(err){
        console.log(err)
        return new MemoryResponse("updateMemory", "failed", String(err))
    }
}