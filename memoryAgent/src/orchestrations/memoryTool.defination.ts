export const createMemory_toolDefination = {
    name: "createMemory",
    description: "Create a new long-term memory when the new information is useful and is not already represented by an existing memory.",
    parameters: {
        type: "object",
        properties: {
            content: {
                type: "string",
                description: "A concise, self-contained statement containing the information that should be remembered."
            },
            memoryType: {
                type: "string",
                enum: ["episodic", "behavioral", "semantic"],
                description: "The type of memory being created."
            },
            confidence: {
                type: "number",
                minimum: 0,
                maximum: 1,
                description: "Confidence that this information is accurate and useful as a long-term memory."
            }
        },
        required: ["content", "memoryType", "confidence"],
        additionalProperties: false
    }
}

export const updateMemory_toolDefination = {
    name: "updateMemory",
    description: "Update an existing memory when the new information corrects, replaces, or meaningfully extends it. Use the index of the matching memory candidate.",
    parameters: {
        type: "object",
        properties: {
            index: {
                type: "integer",
                minimum: 0,
                description: "The index of the existing memory candidate that should be updated."
            },
            content: {
                type: "string",
                description: "The complete updated memory content. Preserve useful information from the existing memory and incorporate the new information."
            },
            memoryType: {
                type: "string",
                enum: ["episodic", "behavioral", "semantic"],
                description: "The memory type of the updated memory."
            },
            confidence: {
                type: "number",
                minimum: 0,
                maximum: 1,
                description: "Confidence that this information if you feel it may change or provide the same"
            }
        },
        required: ["index", "content", "memoryType"],
        additionalProperties: false
    }
}

export const decayMemory_toolDefination = {
    name: "decayMemory",
    description: "Reduce the confidence of an existing memory when new information weakens, contradicts, or makes the memory less reliable. The backend automatically decreases confidence and permanently deletes the memory if its confidence falls below the configured threshold.",
    parameters: {
        type: "object",
        properties: {
            index: {
                type: "integer",
                minimum: 0,
                description: "The index of the existing memory candidate whose confidence should be reduced."
            }
        },
        required: ["index"],
        additionalProperties: false
    }
};

export const deleteMemory_toolDefination = {
    name: "deleteMemory",
    description: "Permanently delete an existing memory when it is clearly invalid, obsolete, or definitively contradicted by new information. Use this only when the memory should no longer exist.",
    parameters: {
        type: "object",
        properties: {
            index: {
                type: "integer",
                minimum: 0,
                description: "The index of the existing memory candidate that should be permanently deleted."
            }
        },
        required: ["index"],
        additionalProperties: false
    }
};

export const reinforceMemory_toolDefination = {
    name: "reinforceMemory",
    description: "Increase the confidence of an existing memory when the new information confirms that the memory is still correct. Use this when the memory is a duplicate or semantically equivalent to the new information and does not require a content update.",
    parameters: {
        type: "object",
        properties: {
            index: {
                type: "integer",
                minimum: 0,
                description: "The index of the existing memory candidate whose confidence should be increased."
            },
            confidence: {
                type: "number",
                minimum: 0,
                maximum: 1,
                description: "The current confidence of the selected memory candidate."
            }
        },
        required: ["index", "confidence"],
        additionalProperties: false
    }
};

 

 