import { createImage, createContainer, searchImage, destroyContainer, getContainerCount, getContainerStatus, getContainerLogs } from "../services/sandbox.service.js";
import uuidGen from "../utils/uuidGen.js";
import {deleteRecord, createRecord, updatedRecord, getRecord} from '../utils/dbTools.js'
import projectConfig from "../config/project.config.js";

class SandboxResponse {
    toolName : string;
    status : string;
    output : object;

    constructor(toolName: string, status: string,  output : object){
        this.toolName = toolName;
        this.status = status;
        this.output = output;
    }
}

export const spinSandbox = async(projectId : string) =>{
    try{
        const count = await getContainerCount();
        // if(count.status == "success" && count.mesage  >3){

            
        // }
        const chekcDb = await getRecord(projectId);
        if(chekcDb){
            const containerId = chekcDb.containerId;
            const sandboxStatus = await getContainerStatus(containerId);
            if(sandboxStatus.status === "failed"){
                await deleteRecord(projectId);
            };
            if(sandboxStatus.running){
                projectConfig.updateState({status : "running", sandboxId : containerId })
                return new SandboxResponse("spinSandbox", "success", {message : "Sandbox Spinned sucessfully"})
            }
            else{
                await destroyContainer(containerId);
                await deleteRecord(projectId);
            }
        }
        const checkImage = await searchImage();
        if(checkImage.status == "failed"){
            const buildImage = await createImage();
            if(buildImage.status === "failed"){
                return new SandboxResponse("spinSandbox", "failed", {error : buildImage.message})
            }  
        };
        const id = uuidGen();
        const spinContainer = await createContainer(id, projectId);
        if(spinContainer.status === "failed"){
            return new SandboxResponse("spinSandbox", "failed", {error : spinContainer.message})
        }
        await createRecord(id, projectId)
        projectConfig.updateState({status : "running", sandboxId : id })
        return new SandboxResponse("spinSandbox", "success", {message : "Sandbox Spinned sucessfully"})
    }
    catch(err){
        return new SandboxResponse("spinSandbox", "failed", {error : String(err)})
    }
}

export const closeSandbox = async(projectId : string)=>{
    try{
        let containerId = projectConfig.getSandboxId()
        if(!containerId){
            const dbCheck = await getRecord(projectId);
            if(!dbCheck){
                return new SandboxResponse("closeSandbox", "failed", {error : "No sandbox found for this project"})
            }
            containerId  = dbCheck.containerId;
        }
        const containerCheck = await getContainerStatus(containerId);
        if(containerCheck.status === "success"){
            await destroyContainer(containerId)
        }
        return new SandboxResponse("closeSandbox", "success" , {message : "Sandbox closed Sucessfully"})
    }
    catch(err){
        return new SandboxResponse("closeSandbox", "failed", {error : String(err)})
    }
}

export const sandboxLogs = async(projectId : string)=>{
    try{
        let containerId = projectConfig.getSandboxId()
        if(!containerId){
            const dbCheck = await getRecord(projectId);
            if(!dbCheck){
                return new SandboxResponse("sandboxLogs", "failed", {error : "No sandbox found for this project"})
            }
            containerId  = dbCheck.containerId;
        }
        const log = await getContainerLogs(containerId);
        if(log.status === "failed"){
            return new SandboxResponse("sandboxLogs", "failed", {error : log.mesage});
        }
        return new SandboxResponse("sandboxLogs", "success", {logs: log.mesage});
    }
    catch(err){
        return new SandboxResponse("sandboxLogs", "failed", {error : String(err)});
    }
}

export const sandboxStatus = async(projectId : string) =>{
    let containerId = projectConfig.getSandboxId()
    if(!containerId){
        const dbCheck = await getRecord(projectId);
        if(!dbCheck){
            return new SandboxResponse("sandboxStatus", "failed", {error : "No sandbox found for this project"})
        }
        containerId  = dbCheck.containerId;
    }
    const status = await getContainerStatus(containerId);
    if(status.status === "failed"){
        return new SandboxResponse("sandboxStatus", "failed", {error : status.message})
    }
    if(status.running){
        return new SandboxResponse("sandboxStatus", "success" , {message : status.message})
    }

}

