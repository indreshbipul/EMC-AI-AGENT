import type { IncomingMessage } from "node:http";

const getBody = async(req : IncomingMessage) =>{
    try{
        let body =  await new Promise((resolve,reject)=>{
            try{
                let data = "";
                req.on("data", (chunk)=>{
                    data += chunk.toString();
                })
                req.on("end", ()=>{
                    data = JSON.parse(data);
                    resolve(data);
                })
                req.on("error", (err)=>{
                    reject(err);
                })
            }
            catch(err){
                reject(err)
            }
        })
        return body;
    }
    catch(err){
        throw err;
    }
}

export default getBody;