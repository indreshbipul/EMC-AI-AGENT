import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import http from "http";
import compactionAgentController from './controllers/compactionAgent.controller.js';
import { createMemory, getMemory } from './controllers/memory.controller.js';
import { memoryWorker } from './workers/memory.worker.js';

export const db = drizzle(process.env.DATABASE_URL!);
const app = http.createServer(async(req,res)=>{
    if(req.url === "/" ){
        res.writeHead(200, {"content-type" : "application/json"});
        res.end("Memory server is running");
    }
    else if(req.url === "/compactionagent" && req.method == "POST"){
        await compactionAgentController(req,res)
    }
    else if(req.url === "/getmemory" && req.method == "POST"){
        await getMemory(req,res)
    }
    else if(req.url === "/updatememory" && req.method == "POST"){
        await createMemory(req,res)
    }
    else{
        res.writeHead(400, {"content-type" : "application/json"});
        res.end("Invalid Route");
    }
})

app.listen(3001, ()=>{
    console.log("Server is running on port 3001");
})

