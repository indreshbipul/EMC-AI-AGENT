import path from "path";
import fs from "fs/promises";
import uuidGen from "../utils/uuidGen.js";
import projectState from '../config/project.config.js'
import projectConfig from "../config/project.config.js";

class ProjectResponse{
    toolName : string;
    status : string;
    output : object;

    constructor(toolName : string, status : string, output : object){
        this.toolName = toolName;
        this.status = status;
        this.output = output;
    }
    
}

const currPath = process.cwd();
const projectsPath = path.join(currPath, "src" ,"projects");

export const getProjects = async()=>{
    try{
        const projects = await fs.readdir(projectsPath, {withFileTypes: true});
        const dirList : string[] = [];
        projects.forEach((file) => {
            if(file.isDirectory()){
                dirList.push(file.name);
            }
        })
        return new ProjectResponse("getProjects", "success" , dirList);
    }
    catch(err){
        console.log(err);
        return new ProjectResponse("getProjects", "failed" , {"error": String(err)});
    }

} 

export const createProject = async(projectName : string)=>{
    try{
        const id = `${projectName}_${uuidGen().replaceAll("-", "").slice(0,12)}`;
        await fs.mkdir(path.join(projectsPath,id));
        projectState.updateState({projectId : id})
        return new ProjectResponse("createProject", "success" , {projectName : `${projectName} is created`});
    }
    catch(err){
        console.log(err);
        return new ProjectResponse("createProject", "failed" , {"error": String(err)})
    }
}

export const selectProject = async(projectName : string) => {
    try{
        if(!projectName){
            return new ProjectResponse("selectProject", "failed" , {"error": "project name is undefined"})
        }
        projectState.updateState({projectId : projectName})
        return new ProjectResponse("selectProject", "success" , {projectName : `${projectName} is selected`});
    }
    catch(err){
        return new ProjectResponse("selectProject", "failed" , {"error": String(err)})
    }
}

export const getActiveProject = ()=>{
    try{
        const projectId = projectConfig.getProjectId()
        if(!projectId){
            return new ProjectResponse("getActiveProject", "success" , {projectName : `No project is selected yet please select first`});
        }
        return new ProjectResponse("getActiveProject", "success" , {projectName : `${projectId} is selected`});
    }
    catch(err){
        console.log(err);
        return new ProjectResponse("getActiveProject", "failed" , {"error": String(err)})
    }
}


