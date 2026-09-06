import { and, eq, sql } from "drizzle-orm";
import { db } from "../app.js";
import { memoryTable } from "../models/memory.schema.js";
import type {IncomingMessage, ServerResponse} from 'http'
import getBody from "../utils/getBody.js";
import embadingAgent from "../agents/embading.agent.js";
import { createQueue } from "../config/bullMq.config.js";

const memoryQueue = createQueue("memory_queue");

export const getMemory = async(req : IncomingMessage, res : ServerResponse)=>{
    try{
        const body : any = await getBody(req);
        console.log("retrive memory",body)
        const {content, userId, memoryType} = body;
        if (!content || !memoryType){
            res.writeHead(400, {
                "content-type": "application/json"
            });
            res.end(JSON.stringify({
                message: "query and memoryType are required"
            }));
            return;
        }
        const queryEmbedding = await embadingAgent(content);
        const search = await db
            .select({
                id: memoryTable.id,
                content: memoryTable.content,
                confidence: memoryTable.confidence,
                memoryType: memoryTable.memoryType,
            })
            .from(memoryTable)
            .where(
                and(
                    eq(memoryTable.userId, userId),
                    eq(memoryTable.status, "active")
                )
            )
            .orderBy(
                sql`${memoryTable.embedding} <=> ${JSON.stringify(queryEmbedding)}::vector`
            )
            .limit(15);
        const data : object[] = []
        search.forEach(ele =>{
            data.push({
                content : ele.content,
                confidence : ele.confidence,
                memoryType : ele.memoryType
            })
        })
        res.writeHead(200, {"content-type" : "application/json"});
        res.end(JSON.stringify({message : "succes", data : data}));
        return ;
    }
    catch(err){
        console.log(err)
        res.writeHead(400, {"content-type" : "application/json"});
        res.end(JSON.stringify({message : "Error", data : String(err)}));
        return
    }
}

export const createMemory = async(req: IncomingMessage, res : ServerResponse) =>{
    try{
        const body : any = await getBody(req);
        console.log("update memory",body)
        const {content, userId, memoryType, confidence} = body;
        if (!content || !memoryType || !confidence){
            res.writeHead(400, {"content-type": "application/json"});
            res.end(JSON.stringify({message: "query and memoryType are required"}));
            return;
        }
        await memoryQueue.add("memoryUpdate",{content,userId,memoryType,confidence})
        res.writeHead(202, {"content-type" : "application/json"});
        res.end(JSON.stringify({message : "succes", data : "data will update soon"}));
    }
    catch(err){
        console.log(err)
        res.writeHead(400, {"content-type" : "application/json"});
        res.end(JSON.stringify({message : "Error", data : String(err)}));
        return
    }
}