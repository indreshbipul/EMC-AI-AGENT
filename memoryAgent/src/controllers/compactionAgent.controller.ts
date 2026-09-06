import type { IncomingMessage, ServerResponse } from "node:http";
import getBody from "../utils/getBody.js";
import compactionAgent from "../agents/compactionAgent.js";

const compactionAgentController = async(req : IncomingMessage, res : ServerResponse) =>{
    try{
        const body : any = await getBody(req);
        const context = body.context;
        const oldSummary : object[]= body.oldSummary;
        console.log(oldSummary)
        const compactedContext = await compactionAgent(context,oldSummary)
        if(!compactedContext){
            res.writeHead(400, {"content-type" : "application/json"});
            return
        }
        res.writeHead(202, {"content-type" : "application/json"});
        res.end(JSON.stringify({message : "succes", data :  compactedContext}));
    }
    catch(err){
        res.writeHead(400, {"content-type" : "application/json"});
        res.end(JSON.stringify({message : "Error", data : String(err)}));
        return
    }
}

export default compactionAgentController;