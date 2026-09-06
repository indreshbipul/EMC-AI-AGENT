import embadingAgent from "../agents/embading.agent.js";
import { db } from "../app.js";
import { memoryTable } from "../models/memory.schema.js";
import { and, eq, sql } from "drizzle-orm";
import memoryAgent from "../agents/memory.agent.js";
import { createWorker } from "../config/bullMq.config.js";


export const memoryWorker = createWorker("memory_queue", async(job :any)=>{
    try{
        const { content, userId, memoryType, confidence } = job.data;
        const queryEmbedding = await embadingAgent(content);
        if (!queryEmbedding) {
            throw new Error("Embedding not received");
        }
        const search = await db
            .select({
                id: memoryTable.id,
                content: memoryTable.content,
                confidence: memoryTable.confidence,
                memoryType: memoryTable.memoryType,
                status: memoryTable.status,
            })
            .from(memoryTable)
            .where(and(eq(memoryTable.userId, userId),eq(memoryTable.status, "active")))
            .orderBy(sql`${memoryTable.embedding} <=> ${JSON.stringify(queryEmbedding)}::vector`).limit(10);

        const result = await memoryAgent(content, search, userId);

        console.log("MEMORY AGENT RESULT:", result);

    }
    catch(err){
        console.error("Memory worker failed:", err);
        throw err;
    }
})
