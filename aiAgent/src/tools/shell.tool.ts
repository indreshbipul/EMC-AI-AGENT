import { getRecord } from "../utils/dbTools.js";
import docker from "../config/docker.config.js";
import { PassThrough } from "stream";

class ExecResponse {
    toolName : string;
    status: string;
    command: string;
    output: object;

    constructor(status: string, command: string, output: object) {
        this.toolName = "shell command";
        this.command = command;
        this.status = status;
        this.output = output;
    }
}

const shellCmd = async(projectId : string, cmd : string) =>{
    try{
        const record = await getRecord(projectId);
        if (!record) {
            return new ExecResponse("failed", cmd, {error: "No sandbox found for this project"});
        }
        const containerId = record.containerId; 
        const container = docker.getContainer(containerId);
        const exec = await container.exec({
            Cmd: ["sh", "-c", cmd],
            WorkingDir: "/workspace",
            AttachStdout: true,
            AttachStderr: true
        })
        const cmdStream = await exec.start({hijack: true, stdin: false});
        // PassThrough is the stram pipe of nodejs
        const stdout = new PassThrough();
        const stderr = new PassThrough();
        // demuxStram seperate stdout and stderr form stream and provide two different stream
        docker.modem.demuxStream(cmdStream, stdout, stderr);
        let stdoutData = "";
        let stderrData = "";
        stdout.on("data", (chunk) => {
            stdoutData += chunk.toString();
        });
        stderr.on("data", (chunk) => {
            stderrData += chunk.toString();
        });
        await new Promise((resolve,reject)=>{
            cmdStream.on("end", resolve);
            cmdStream.on("error", (err) => {
                reject(err)
            })
        })
        const info = await exec.inspect();
        if (info.ExitCode !== 0){
            return new ExecResponse("failed", cmd, {stderr : stderrData,stdout : stdoutData});
        }        
        return new ExecResponse("success", cmd, {stderr : stderrData,stdout : stdoutData});
    }
    catch(err){
        console.log(err);
        const response = new ExecResponse("failed", cmd, {error: String(err)});
        return response;
    }
}

export default shellCmd;