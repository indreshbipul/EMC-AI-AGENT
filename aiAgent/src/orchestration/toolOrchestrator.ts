import calculator from "../tools/calculator.tool.js";
import { createProject, getActiveProject, getProjects, selectProject } from "../tools/project.tool.js";
import { closeSandbox, sandboxLogs, sandboxStatus, spinSandbox } from "../tools/sandbox.tool.js";
import shellCmd from "../tools/shell.tool.js";
import getCurrentTime from "../tools/time.tool.js";
import { linkSearch, webSearch } from "../tools/web.tool.js";
import { browserClickSchema, browserErrorSchema, browserFillSchema, browserGetDomSchema, browserGotoSchema, browserScreenshotSchema, browserScrollSchema, calculatorSchema, createProjectSchema, destroySandboxSchema, getActiveProjectSchema, getProjectsSchema, retriveMemorySchema, sandboxLogsSchema, sandboxStatusSchema, selectProjectSchema, shellCommandSchema, spinSandboxSchema, timeSchema, updateMemorySchema, uriSearchSchema, webSearchSchema } from "../validators/tool.validator.js";
import { browserClick, browserError, browserFill, browserGetDom, browserGoto, browserScreenshort, browserScroll } from "../tools/browser.tool.js";
import { retrieveMemory, updateMemory } from "../tools/memory.tool.js";

export const tools = {
    calculator : {execute: calculator, schema: calculatorSchema},
    time : {execute: getCurrentTime, schema: timeSchema},
    shellCommand : {execute: shellCmd, schema: shellCommandSchema},
    spinSandbox : {execute: spinSandbox, schema: spinSandboxSchema},
    sandboxStatus : {execute: sandboxStatus, schema: sandboxStatusSchema},
    sandboxLogs : {execute: sandboxLogs, schema: sandboxLogsSchema},
    destroySandbox : {execute: closeSandbox, schema: destroySandboxSchema},
    webSearch : {execute: webSearch, schema: webSearchSchema},
    uriSearch : {execute: linkSearch, schema: uriSearchSchema},
    getProjects : {execute: getProjects, schema: getProjectsSchema},
    createProject : {execute: createProject, schema: createProjectSchema},
    selectProject : {execute: selectProject, schema: selectProjectSchema},
    getActiveProject : {execute : getActiveProject, schema : getActiveProjectSchema},
    browserClick : {execute: browserClick, schema: browserClickSchema},
    browserError : {execute: browserError, schema: browserErrorSchema},
    browserFill : {execute: browserFill, schema: browserFillSchema},
    browserGetDom : {execute: browserGetDom, schema: browserGetDomSchema},
    browserScroll: {execute: browserScroll, schema: browserScrollSchema},
    browserGoto: {execute: browserGoto, schema: browserGotoSchema},
    browserScreenshort: {execute: browserScreenshort, schema: browserScreenshotSchema},
    retrieveMemory : {execute : retrieveMemory, schema : retriveMemorySchema},
    updateMemory : {execute : updateMemory, schema : updateMemorySchema},
};


import type { ChatCompletionMessageFunctionToolCall } from "openai/resources";
import projectConfig from "../config/project.config.js";


export const toolCaller = async (id: string, fun: ChatCompletionMessageFunctionToolCall.Function) => {
    const projectId = projectConfig.getProjectId();
    const toolName = fun.name;
    if (!toolName) {
        return {tool_call_id: id, role: "tool" as const, content: JSON.stringify({ error: "Tool name missing in function call" })};
    }
    if (!(toolName in tools)) {
        return {tool_call_id: id, role: "tool" as const, content: JSON.stringify({ error: `Unknown tool: ${toolName}` })};
    }
    try {
        //  Tool Validation
        const toolArgument = JSON.parse(fun.arguments);
        let validation: any;
        if (toolName === "calculator") {
            validation = calculatorSchema.safeParse(toolArgument);
        } 
        else if (toolName === "time") {
            validation = timeSchema.safeParse(toolArgument);
        } 
        else if (toolName === "shellCommand") {
            validation = shellCommandSchema.safeParse({ projectId, cmd: toolArgument.cmd });
        } 
        else if (toolName === "spinSandbox") {
            validation = spinSandboxSchema.safeParse({projectId});
        }
        else if (toolName === "sandboxStatus") {
            validation = sandboxStatusSchema.safeParse({projectId});
        } 
        else if (toolName === "sandboxLogs") {
            validation = sandboxLogsSchema.safeParse({projectId});
        } 
        else if (toolName === "destroySandbox") {
            validation = destroySandboxSchema.safeParse({projectId});
        } 
        else if (toolName === "webSearch") {
            validation = webSearchSchema.safeParse(toolArgument);
        } 
        else if (toolName === "uriSearch") {
            validation = uriSearchSchema.safeParse(toolArgument);
        } 
        else if (toolName === "getProjects") {
            validation = getProjectsSchema.safeParse(toolArgument);
        } 
        else if (toolName === "createProject") {
            validation = createProjectSchema.safeParse(toolArgument);
        } 
        else if (toolName === "selectProject") {
            validation = selectProjectSchema.safeParse(toolArgument);
        } 
        else if (toolName === "getActiveProject") {
            validation = getActiveProjectSchema.safeParse(toolArgument);
        }
        else if (toolName === "browserClick"){
            validation = browserClickSchema.safeParse(toolArgument);
        }
        else if (toolName === "browserScroll"){
            validation = browserScrollSchema.safeParse(toolArgument);
        }
        else if (toolName === "browserScreenshort"){
            validation = browserScreenshotSchema.safeParse(toolArgument);
        }
        else if (toolName === "browserGoto"){
            validation = browserGotoSchema.safeParse(toolArgument);
        }
        else if (toolName === "browserError"){
            validation = browserErrorSchema.safeParse(toolArgument);
        }
        else if (toolName === "browserFill"){
            validation = browserFillSchema.safeParse(toolArgument);
        }
        else if (toolName === "browserGetDom"){
            validation = browserGetDomSchema.safeParse(toolArgument);
        }
        else if(toolName === "updateMemory"){
            validation = updateMemorySchema.safeParse(toolArgument);
        }
        else if(toolName === "retrieveMemory"){
            validation = retriveMemorySchema.safeParse(toolArgument);
        }
        else {
            return { tool_call_id: id, role: "tool" as const, content: JSON.stringify({ error: `Unhandled tool: ${toolName}` }),};
        }
        if (!validation.success) {
            return { tool_call_id: id, role: "tool" as const, content: JSON.stringify({ error: validation.error.message }),};
        }

        // Tool calling
        const data = validation.data as any;
        let result;
        if (toolName === "calculator") {
            console.log(`Calculating....`)
            result = await calculator(data.expression);
        } 
        else if (toolName === "time") {
            console.log(`Fetching time....`)
            result = await getCurrentTime(data.timeZone);
        } 
        else if (toolName === "shellCommand") {
            console.log(`Building....`);
            result = await shellCmd(data.projectId, data.cmd);
        } 
        else if (toolName === "spinSandbox") {
            console.log(`Create Project Envorment....`)
            result = await spinSandbox(data.projectId);
        } 
        else if (toolName === "sandboxStatus") {
            console.log(`Checking Envorment Stats....`)
            result = await sandboxStatus(data.projectId);
        } 
        else if (toolName === "sandboxLogs") {
            console.log(`Fetching the Logs....`)
            result = await sandboxLogs(data.projectId);
        } 
        else if (toolName === "destroySandbox") {
            console.log(`Closing the envorment....`)
            result = await closeSandbox(data.projectId);
        } 
        else if (toolName === "webSearch") {
            console.log(`Fetching The results....`)
            result = await webSearch(data.query);
        } 
        else if (toolName === "uriSearch") {
            console.log(`Fetching The results....`)
            result = await linkSearch(data.query);
        } 
        else if (toolName === "getProjects") {
            console.log(`Getting all projects....`)
            result = await getProjects();
        } 
        else if (toolName === "createProject") {
            console.log(`Creating the project....`)
            result = await createProject(data.projectName);
        } 
        else if (toolName === "selectProject") {
            console.log(`Selecting the project....`)
            result = await selectProject(data.projectName);
        } 
        else if (toolName === "getActiveProject") {
            result = getActiveProject();
        } 
        else if (toolName === "browserClick"){
            result = await browserClick(data.selector)
        }
        else if (toolName === "browserScroll"){
            result = await browserScroll(data.x,data.y)
        }
        else if (toolName === "browserScreenshort"){
            result = await browserScreenshort();
        }
        else if (toolName === "browserGoto"){
            result = browserGoto(data.uri);
        }
        else if (toolName === "browserError"){
            result = await browserError();
        }
        else if (toolName === "browserFill"){
            result = await browserFill(data.selector, data.inputText)
        }
        else if (toolName === "browserGetDom"){
            result = await browserGetDom();
        }
         else if(toolName === "updateMemory"){
            result = await updateMemory(data.memoryType, data.content, data.confidence);
        }
        else if(toolName === "retrieveMemory"){
            result = await retrieveMemory(data.memoryType, data.content);
        }
        else {
            return {tool_call_id: id, role: "tool" as const, content: JSON.stringify({ error: `Unhandled tool: ${toolName}` })};
        }
        return {tool_call_id: id, role: "tool" as const, content: JSON.stringify(result),};
    } 
    catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return {tool_call_id: id, role: "tool" as const, content: JSON.stringify({ error: `Something went wrong: ${message}` }),};
    }
};