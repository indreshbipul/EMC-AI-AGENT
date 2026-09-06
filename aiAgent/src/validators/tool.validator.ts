import { z } from "zod";

export const calculatorSchema = z.object({
    expression: z.string().min(1)
});

export const timeSchema = z.object({
    timeZone: z.string().optional()
});

export const shellCommandSchema = z.object({
    projectId: z.string().min(3),
    cmd: z.string().min(1)
});

export const spinSandboxSchema = z.object({
    projectId: z.string().min(3)
});

export const sandboxStatusSchema = z.object({
    projectId: z.string().min(3)
});

export const sandboxLogsSchema = z.object({
    projectId: z.string().min(3)
});

export const destroySandboxSchema = z.object({
    projectId: z.string().min(1)
});

export const webSearchSchema = z.object({
    query: z.string().min(1)
});

export const uriSearchSchema = z.object({
    query: z.string().min(1)
});

export const getProjectsSchema = z.object({});

export const createProjectSchema = z.object({
    projectName: z.string().min(1)
});

export const selectProjectSchema = z.object({
    projectName: z.string().min(1)
});

export const browserGotoSchema = z.object({
    uri: z.string().url()
});

export const browserClickSchema = z.object({
    selector: z.string().min(1)
});

export const browserFillSchema = z.object({
    selector: z.string().min(1),
    inputText: z.string()
});

export const browserScrollSchema = z.object({
    x: z.number(),
    y: z.number()
});

export const browserCheckSchema = z.object({
    selector: z.string().min(1)
});

export const browserUncheckSchema = z.object({
    selector: z.string().min(1)
});

export const browserSelectSchema = z.object({
    selector: z.string().min(1),
    value: z.string().min(1)
});

export const browserScreenshotSchema = z.object({});

export const browserGetDomSchema = z.object({});

export const browserErrorSchema = z.object({});

export const getActiveProjectSchema = z.object({});

export const updateMemorySchema = z.object({
    memoryType : z.enum(["episodic", "behavioral", "semantic"]),
    confidence: z.number().min(0).max(1).describe("Confidence score for this memory, between 0 and 1"),
    content : z.string().nonempty(), 
})

export const retriveMemorySchema = z.object({
    memoryType : z.enum(["episodic", "behavioral", "semantic"]),
    content : z.string().nonempty(), 
})
