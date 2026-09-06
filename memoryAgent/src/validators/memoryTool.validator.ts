import {z} from "zod";

export const updateMemory_toolSchema = z.object({
    index : z.number().min(0).describe("provide valid index"),
    content : z.string().nonempty(), 
    memoryType: z.enum(["episodic", "behavioral", "semantic"]),
    confidence: z.number().min(0).max(1).describe("Confidence score for this memory, between 0 and 1"),
})

export const createMemory_toolSchema = z.object({
    content : z.string().nonempty(), 
    memoryType: z.enum(["episodic", "behavioral", "semantic"]),
    confidence: z.number().min(0).max(1).describe("Confidence score for this memory, between 0 and 1"),
})

export const deleteMemory_toolSchema = z.object({
    index : z.number().min(0).describe("provide valid index"),
})

export const decayMemory_toolSchema = z.object({
    index : z.number().min(0).describe("provide valid index"),
    confidence: z.number().min(0).max(1).describe("Confidence score for this memory, between 0 and 1"),
})

export const reinforceMemory_toolSchema = z.object({
    index : z.number().min(0).describe("provide valid index"),
    confidence: z.number().min(0).max(1).describe("Confidence score for this memory, between 0 and 1"),
})