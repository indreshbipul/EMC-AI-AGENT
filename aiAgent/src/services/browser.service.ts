import dotenv from 'dotenv';
dotenv.config()

const browserServiceURI = process.env.BROWSERSERVICE_URI!

export const gotoService = async(uri : string) =>{
    try{
        const response = await fetch(`${browserServiceURI}/goto`,{
            method : "POST",
            headers : {
                "content-Type" : "application/json",
            },
            body : JSON.stringify({uri})
        })
        const res : string = await response.json();
        return {res,status: response.status};
    }
    catch(err){
        throw err
    }
}
export const screenshortService = async() =>{
    try{
        const response = await fetch(`${browserServiceURI}/screenshort`,{
            method : "GET",
            headers : {
                "content-Type" : "application/json",
            },
        })
        const res : string = await response.json();
        return {res,status: response.status};
    }
    catch(err){
        throw err
    }
}
export const getErrorService = async() =>{
    try{
        const response = await fetch(`${browserServiceURI}/error`,{
            method : "GET",
            headers : {
                "content-Type" : "application/json",
            },
            
        })
        const res : string = await response.json();
        return {res,status: response.status};
    }
    catch(err){
        throw err
    }
}
export const scrollService = async(x : number, y : number) =>{
    try{
        const response = await fetch(`${browserServiceURI}/scroll`,{
            method : "POST",
            headers : {
                "content-Type" : "application/json",
            },
            body : JSON.stringify({x,y})
        })
        const res : string = await response.json();
        return {res,status: response.status};
    }
    catch(err){
        throw err
    }
}
export const clickService = async(selector : string) =>{
    try{
        const response = await fetch(`${browserServiceURI}/click`,{
            method : "POST",
            headers : {
                "content-Type" : "application/json",
            },
            body : JSON.stringify({selector})
        })
        const res : string = await response.json();
        return {res,status: response.status};
    }
    catch(err){
        throw err
    }
}
export const fillService = async(selector : string, inputText : string) =>{
    try{
        const response = await fetch(`${browserServiceURI}/fill`,{
            method : "POST",
            headers : {
                "content-Type" : "application/json",
            },
            body : JSON.stringify({selector, inputText})
        })
        const res : string = await response.json();
        return {res,status: response.status};
    }
    catch(err){
        throw err
    }
}
export const getDomService = async() =>{
    try{
        const response = await fetch(`${browserServiceURI}/getdom`,{
            method : "GET",
            headers : {
                "content-Type" : "application/json",
            },
        })
        const res : string = await response.json();
        return {res,status: response.status};
    }
    catch(err){
        throw err
    }
}
