import type { IncomingMessage, ServerResponse } from "node:http"

const agent = async(req : IncomingMessage,res : ServerResponse)=>{
    let body = ""
    req.on("data", (chunk)=>{
        body += chunk.toString()
    })
    req.on("end", ()=>{
        const data = JSON.parse(body)
    })
    
}

export default agent