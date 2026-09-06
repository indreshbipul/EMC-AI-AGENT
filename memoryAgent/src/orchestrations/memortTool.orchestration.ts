import type { ChatCompletionMessageFunctionToolCall} from "openai/resources";
import { createMemory_tool, decayMemory_tool, deleteMemory_tool, reinforceMemory_tool, updateMemory_tool } from "../tools/memory.tool.js";
import { createMemory_toolSchema, decayMemory_toolSchema, deleteMemory_toolSchema, reinforceMemory_toolSchema, updateMemory_toolSchema } from "../validators/memoryTool.validator.js";
import type { Dbdata } from "../agents/memory.agent.js";

class ToolManagerResponse {
    toolName : string;
    status : string;
    output : string;

    constructor(toolName : string, status : string, output : string){
        this.toolName = toolName;
        this.status = status;
        this.output = output
    }
}

const tools = {
    updateMemory : {tool : updateMemory_tool, schema : updateMemory_toolSchema},
    deleteMemory : {tool : deleteMemory_tool, schema : deleteMemory_toolSchema},
    decayMemory : {tool : decayMemory_tool, schema : decayMemory_toolSchema},
    createMemory : {tool : createMemory_tool, schema : createMemory_toolSchema },
    reinforceMemory : {tool : reinforceMemory_tool, schema : reinforceMemory_toolSchema}
};

const toolManager = async(tool : ChatCompletionMessageFunctionToolCall.Function, dbData : Dbdata, userId : string)=>{
    try{
        if(!(tool.name in tools)){
            return new ToolManagerResponse(tool.name, "failed",  "Invalid tool name");
        }
        const toolArgument = JSON.parse(tool.arguments);

        // Validation
        let validation;
        if(tool.name === "updateMemory"){
            validation = tools["updateMemory"].schema.safeParse(toolArgument);
        }
        else if(tool.name === "createMemory"){
            validation = tools["createMemory"].schema.safeParse(toolArgument);            
        }
        else if(tool.name === "deleteMemory"){
            validation = tools["deleteMemory"].schema.safeParse(toolArgument);
        }
        else if(tool.name === "decayMemory"){
            validation = tools["decayMemory"].schema.safeParse(toolArgument);
        }
        else if(tool.name === "reinforceMemory"){
            validation = tools["reinforceMemory"].schema.safeParse(toolArgument);
        }
        else{
            return new ToolManagerResponse(tool.name, "failed",  "Invalid tool name");
        }
        if(!validation.success){
            return new ToolManagerResponse(tool.name, "failed",  String(validation.error.message));
        }
        const validated_data : any = validation.data;

        //Calling required tool
        let response;
        if(tool.name === "updateMemory"){
            const memoryId = dbData[validated_data.index]?.id
            if(!memoryId){
                return new ToolManagerResponse(tool.name, "failed",  "Something went wrong");
            }
            response = await tools["updateMemory"].tool(memoryId, validated_data.content, validated_data.memoryType, validated_data.confidence)
        }
        else if(tool.name === "createMemory"){
            if(!userId){
                return new ToolManagerResponse(tool.name, "failed",  "Something went wrong");
            }
            response = await tools["createMemory"].tool(userId, validated_data.content, validated_data.memoryType, validated_data.confidence);        
        }
        else if(tool.name === "deleteMemory"){
            const memoryId = dbData[validated_data.index]?.id
            if(!memoryId){
                return new ToolManagerResponse(tool.name, "failed",  "Something went wrong");
            }
            response = await tools["deleteMemory"].tool(memoryId);
        }
        else if(tool.name === "decayMemory"){
            const memoryId = dbData[validated_data.index]?.id
            if(!memoryId){
                return new ToolManagerResponse(tool.name, "failed",  "Something went wrong");
            }
            response = await tools["decayMemory"].tool(memoryId, validated_data.confidence);
        }
        else if(tool.name === "reinforceMemory"){
            const memoryId = dbData[validated_data.index]?.id
            if(!memoryId){
                return new ToolManagerResponse(tool.name, "failed",  "Something went wrong");
            }
            response = await tools["reinforceMemory"].tool(memoryId, validated_data.confidence);
        }
        else{
            return new ToolManagerResponse(tool.name, "failed",  "Unhandeled Tool");
        }
        return  response;
    }   
    catch(err){
        return new ToolManagerResponse(tool.name, "failed",  String(err));
    }
}

export default toolManager;
