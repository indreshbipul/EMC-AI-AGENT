import type { IncomingMessage, ServerResponse } from "node:http";
import { clickService, fillService, getDOMService, getErrorsService, gotoService, screenshortService, scrollService} from "../services/browser.service.js";
import { getBody } from "../utils/getBody.js";

export const goto = async(req : IncomingMessage, res : ServerResponse) =>{
    try{
        const body : any = await getBody(req)
        if(!body){
            res.writeHead(400, {"content-type" : "application/json"});
            res.end("Invalid request");
        }
        const data = await gotoService(body.uri);
        res.writeHead(200, {"content-type" : "application/json"});
        res.end(JSON.stringify(data))
    }
    catch(err){
        res.writeHead(500, {"content-type" : "application/json"});
        res.end("Please try again after sometime");
    }
}

export const screenshorts = async(req : IncomingMessage, res : ServerResponse) =>{
    try{
        const data = await screenshortService();
        res.writeHead(200, {"content-type" : "application/json"});
        res.end(JSON.stringify(data))
    }
    catch(err){
        res.writeHead(500, {"content-type" : "application/json"});
        res.end("Please try again after sometime");
    }
}

export const getDOM = async(req : IncomingMessage, res : ServerResponse) =>{
    try{
        const data = await getDOMService();
        res.writeHead(200, {"content-type" : "application/json"});
        res.end(JSON.stringify(data))
    }
    catch(err){
        res.writeHead(500, {"content-type" : "application/json"});
        res.end("Please try again after sometime");
    }
}

export const click = async(req : IncomingMessage, res : ServerResponse) =>{
    try{
        const body : any = await getBody(req)
        if(!body){
            res.writeHead(400, {"content-type" : "application/json"});
            res.end("Invalid request");
        }
        const data = await clickService(body.selector);
        res.writeHead(200, {"content-type" : "application/json"});
        res.end(JSON.stringify(data))
    }
    catch(err){
        res.writeHead(500, {"content-type" : "application/json"});
        res.end("Please try again after sometime");
    }
}

export const getError = async(req : IncomingMessage, res : ServerResponse) =>{
    try{
        const data = getErrorsService();
        res.writeHead(200, {"content-type" : "application/json"});
        res.end(JSON.stringify(data))
    }
    catch(err){
        res.writeHead(500, {"content-type" : "application/json"});
        res.end("Please try again after sometime");
    }
}

export const scroll = async(req : IncomingMessage, res : ServerResponse) =>{
    try{
        const body : any = await getBody(req)
        if(!body){
            res.writeHead(400, {"content-type" : "application/json"});
            res.end("Invalid request");
        }
        const data = await scrollService(body.x, body.y);
        res.writeHead(200, {"content-type" : "application/json"});
        res.end(JSON.stringify(data))
    }
    catch(err){
        res.writeHead(500, {"content-type" : "application/json"});
        res.end("Please try again after sometime");
    }
}

export const fill = async(req : IncomingMessage, res : ServerResponse) =>{
    try{
        const body : any = await getBody(req)
        if(!body){
            res.writeHead(400, {"content-type" : "application/json"});
            res.end("Invalid request");
        }
        const data = await fillService(body.selector, body.inputText);
        res.writeHead(200, {"content-type" : "application/json"});
        res.end(JSON.stringify(data))
    }
    catch(err){
        res.writeHead(500, {"content-type" : "application/json"});
        res.end("Please try again after sometime");
    }
}