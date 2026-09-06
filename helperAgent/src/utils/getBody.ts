import type { IncomingMessage } from "node:http";

export const getBody = async(req : IncomingMessage)=>{
    try{
        let body : any = ""
        body = await new Promise((resolve,reject)=>{
            req.on("data", (chunk)=>{
                body += chunk.toString();
            })
            req.on("end", async()=>{
                body = await JSON.parse(body);
                resolve(body)
            })
            req.on("error", (err)=>{
                reject(err)
            })
        })
        return body
    }
    catch(err){
        throw err
    }
}