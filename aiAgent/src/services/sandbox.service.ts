import path from "path";
import docker from "../config/docker.config.js";
import fs from "fs";

const currPath = process.cwd();
const projectsPath = path.join(currPath, "src" ,"projects");
const sandboxPath = path.join(currPath, "src", "sandbox");

export const searchImage = async () => {
    try {
        const images = await docker.listImages();
        const found = images.some(img => img.RepoTags?.includes("ai-agent-sandbox:latest"));
        return {status: found ? "success" : "failed", message: found ? "Image found" : "Image not found"};
    }
    catch (err) {
        console.log("SEARCH IMAGE ERROR:", err);
        return {status: "failed", message: String(err)};
    }
};

export const createImage = async()=>{
    try{
        const stream = await docker.buildImage(
            {
                context: sandboxPath,
                src: fs.readdirSync(sandboxPath), 
            },
            { t: "ai-agent-sandbox" }
        );
        const status = await new Promise((resolve,reject)=>{
            docker.modem.followProgress(stream,(err,result)=>{
                if(err){
                    reject(err);
                    return;
                }
                resolve(result);
            })
        })
        return {status : "success", message : String(status)};
    }
    catch(err){
        console.log(err);
        return {status : "failed",  mesage : String(err)};
    }
}

export const createContainer = async(containerId : string, projectId : string)=>{
    try{
        const container = await docker.createContainer({
            Image : "ai-agent-sandbox",
            name : containerId,
            WorkingDir : "/workspace",
            HostConfig : {
                Binds : [
                    `${path.join(projectsPath,projectId)}:/workspace`
                ]
            },       
        });
        await container.start();
        return {status : "success", message : "Container Started"};
    }
    catch(err){
        console.log(err);
        return {status : "failed",  mesage : String(err)};
    }
} 

export const getContainerCount = async()=>{
    try{
        const list = await docker.listContainers();
        const sandboxes = list.filter(ele => ele.Image.includes("ai-agent-sandbox"));
        return {status : "success" , count : sandboxes.length};
    }
    catch(err){
        console.log(err);
        return {status : "failed",  mesage : String(err)};
    }
    
}

export const getContainerLogs = async(containerId : string)=>{
    try{
        const container = await docker.getContainer(containerId);
        const logs = await container.logs({
            stdout: true,
            stderr: true
        });
        return {status : "success",  mesage : String(logs)};
    }
    catch(err){
        console.log(err);
        return {status : "failed",  mesage : String(err)};
    }
}

export const getContainerStatus = async (containerId: string) => {
    try {
        const container = docker.getContainer(containerId);
        const info = await container.inspect();
        return {status: "success", running: info.State.Running, message: info.State.Status};
    }
    catch (err) {
        console.log(err);
        return {status: "failed", running : false,  message: String(err)};
    }
};

export const destroyContainer = async (containerId: string) => {
    try {
        const container = docker.getContainer(containerId);
        await container.remove({ force: true });
        return {status: "success", message: "Sandbox destroyed"};
    }
    catch (err) {
        console.log(err);
        return {status: "failed", message: String(err)};
    }
};
