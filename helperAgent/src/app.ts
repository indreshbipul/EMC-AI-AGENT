import http from 'http';
import {config} from 'dotenv'
config()
import agent from './controllers/vesionAgent.controller.js';
import { click, fill, getDOM, getError, goto, screenshorts, scroll } from './controllers/browser.controller.js';
import { errorCaptureService } from './services/browser.service.js';

const app = http.createServer(async(req,res)=>{
    if(req.url === "/" && req.method === "GET"){
        res.writeHead(200, {"content-type" : "text/plain"});
        res.end("Helper agent Server is running");
    }
    else if(req.url === "/api/helperAgent" && req.method === "POST"){
        await agent(req,res);
    }
    else if(req.url === "/api/browser/goto" && req.method === "POST"){
        
        await goto(req,res)
    }
    else if(req.url === "/api/browser/click" && req.method === "POST"){
        await click(req,res)
    }
    else if(req.url === "/api/browser/fill" && req.method === "POST"){
        await fill(req,res)
    }
    else if(req.url === "/api/browser/getdom" && req.method === "GET"){
        await getDOM(req,res)
    }
    else if(req.url === "/api/browser/screenshort" && req.method === "GET"){
        await screenshorts(req,res)
    }
    else if(req.url === "/api/browser/scroll" && req.method === "POST"){
        await scroll(req,res)
    }
    else if(req.url === "/api/browser/error" && req.method === "GET"){
        await getError(req,res)
    }
    
    else{
        res.writeHead(400,{"content-type" : "application/json"});
        res.end("Invalid Route");
    }
})

app.listen(3000, ()=>{
    errorCaptureService()
    console.log("Server is running on port 3000");
})