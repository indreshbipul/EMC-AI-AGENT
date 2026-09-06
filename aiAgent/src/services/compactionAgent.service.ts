import type { ChatCompletionMessageParam } from "openai/resources.js";

const compactionAgentService = async(context : ChatCompletionMessageParam[], oldSummary : object)=>{
    try{
        const response = await fetch("http://localhost:3001/compactionagent",{
            method :  "POST",
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({context, oldSummary}),
        });
        const res = await response.json();
        return {res : res.data, status : response.status};
    }
    catch(err){
        throw err;
    }
}

export default compactionAgentService