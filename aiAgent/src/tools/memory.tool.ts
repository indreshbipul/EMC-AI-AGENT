import { retriveMemoryService, updateMemoryService } from "../services/memeory.service.js"

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


export const retrieveMemory = async(memoryType : string, content : string) =>{
    try{
        const memory = await retriveMemoryService(memoryType, content);
        if(memory.status == 200){
            return new MemoryResponse("retriveMemory", "success", memory.res.data);
        }
        else{
            console.log("Memory Retrive Service is down with response coede",memory.status)
            return new MemoryResponse("retriveMemory", "failed", "Retrive Service is down try after sometime")
        }
    }
    catch(err){
        return new MemoryResponse("retriveMemory", "failed", String(err))
    }
}

export const updateMemory = async(memoryType : string, content : string, confidence : number) =>{
    try{
        const memory = await updateMemoryService(memoryType, content, confidence);
        if(memory.status == 202){
            return new MemoryResponse("updateMemory", "success", String(memory.res.data));
        }
        else{
            console.log("Memory update Service is down with response coede",memory.status)
            return new MemoryResponse("updateMemory", "failed", "update Service is down try after sometime")
        }
    }
    catch(err){
        return new MemoryResponse("updateMemory", "failed", String(err))
    }
}