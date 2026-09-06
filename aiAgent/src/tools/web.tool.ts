import { link } from "node:fs";
import {quarySearch, uriSearch} from "../services/web.service.js";

type webServiceType = {
    status : Number;
    res : string;
}

class SerchResponse{
    toolName : string;
    status : string;
    query: string;
    output : string;


    constructor(status : string, query : string, output : string){
        this.toolName = "web search";
        this.status = status;
        this.query = query;
        this.output  = output;
    }
}

export const webSearch = async(quary : string) =>{
    try{
        const search : webServiceType = await quarySearch(quary);
        if(search.status !== 200){
            return new SerchResponse("Failed",quary,"");
        }
        return new SerchResponse("sucess",quary,search.res)
    }
    catch(err){
        console.log(err)
        return new SerchResponse("Failed",quary,"");
    }
}

export const linkSearch = async(uri : string) =>{
    try{
        const search : webServiceType = await uriSearch(uri);
        if(search.status !== 200){
            return new SerchResponse("Failed",uri,"");
        }
        return new SerchResponse("sucess",uri,search.res)
    }
    catch(err){
        console.log(err)
        return new SerchResponse("Failed",uri,"");
    }
}

