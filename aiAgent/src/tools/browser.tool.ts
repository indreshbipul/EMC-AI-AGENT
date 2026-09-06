import { clickService, fillService, getDomService, getErrorService, gotoService, screenshortService, scrollService } from "../services/browser.service.js";

class BrowserResponse{
    toolName : string;
    status : string;
    output : string;

    constructor(toolName : string, status : string, output : string){
        this.toolName = toolName
        this.status = status
        this.output = output
    }
}

export const browserGoto = async(uri : string)=>{
    try{
        const response = await gotoService(uri)
        if(response.status === 200){
            return new BrowserResponse("browserGoto", "success", response.res);
        }
        return new BrowserResponse("browserGoto", "failed", response.res);
    }
    catch(err){
        return new BrowserResponse("browserGoto", "failed", String(err));
    }
}

export const browserClick = async(selector : string)=>{
    try{
        const response = await clickService(selector)
        if(response.status === 200){
            return new BrowserResponse("browserClick", "success", response.res);
        }
        return new BrowserResponse("browserClick", "failed", response.res);
    }
    catch(err){
        return new BrowserResponse("browserClick", "failed", String(err));
    }
}

export const browserScroll = async(x : number, y : number)=>{
    try{
        const response = await scrollService(x,y)
        if(response.status === 200){
            return new BrowserResponse("browserScroll", "success", response.res);
        }
        return new BrowserResponse("browserScroll", "failed", response.res);
    }
    catch(err){
        return new BrowserResponse("browserScroll", "failed", String(err));
    }
}

export const browserGetDom = async()=>{
    try{
        const response = await getDomService()
        if(response.status === 200){
            return new BrowserResponse("browserGetDom", "success", response.res);
        }
        return new BrowserResponse("browserGetDom", "failed", response.res);
    }
    catch(err){
        return new BrowserResponse("browserGetDom", "failed", String(err));
    }
}

export const browserFill = async(selector : string , inputText : string)=>{
    try{
        const response = await fillService(selector, inputText);
        if(response.status === 200){
            return new BrowserResponse("browserFill", "success", response.res);
        }
        return new BrowserResponse("browserFill", "failed", response.res);
    }
    catch(err){
        return new BrowserResponse("browserFill", "failed", String(err));
    }
}

export const browserError = async()=>{
    try{
        const response = await getErrorService()
        if(response.status === 200){
            return new BrowserResponse("browserError", "success", response.res);
        }
        return new BrowserResponse("browserError", "failed", response.res);
    }
    catch(err){
        return new BrowserResponse("browserError", "failed", String(err));
    }
}

export const browserScreenshort = async()=>{
    try{
        const response = await screenshortService()
        if(response.status === 200){
            return new BrowserResponse("browserScreenshort", "success", response.res);
        }
        return new BrowserResponse("browserScreenshort", "failed", response.res);
    }
    catch(err){
        return new BrowserResponse("browserScreenshort", "failed", String(err));
    }
}
