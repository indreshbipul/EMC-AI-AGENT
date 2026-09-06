export const shellCommandDefinition = {
    name: "shellCommand",
    description: "Execute a shell command inside the isolated sandbox of the current project. Use this to inspect files, install dependencies, run programs, build the project, or diagnose command errors.",
    parameters: {
        type: "object",
        properties: {
            cmd: {
                type: "string",
                description: "The shell command to execute inside the project sandbox."
            }
        },
        required: ["cmd"]
    }
};

export const calculatorDefinition = {
    name: "calculator",
    description: "Perform mathematical calculations when a precise numerical result is required.",
    parameters: {
        type: "object",
        properties: {
            expression: {
                type: "string",
                description: "The mathematical expression to calculate."
            }
        },
        required: ["expression"]
    }
};

export const timeDefinition = {
    name: "time",
    description: "Get the current time for a specific timezone.",
    parameters: {
        type: "object",
        properties: {
            timeZone: {
                type: "string",
                description: "The IANA timezone, such as Asia/Kolkata or America/New_York."
            }
        },
        required: []
    }
};

export const spinSandboxDefinition = {
    name: "spinSandbox",
    description: "Start an isolated sandbox for the current project when a running sandbox is required to perform project operations.",
    parameters: {
        type: "object",
        properties: {},
        required: []
    }
};

export const sandboxStatusDefinition = {
    name: "sandboxStatus",
    description: "Check whether the current project's sandbox is running and available.",
    parameters: {
        type: "object",
        properties: {},
        required: []
    }
};

export const sandboxLogsDefinition = {
    name: "sandboxLogs",
    description: "Retrieve logs from the current project's sandbox for diagnosing or inspecting sandbox activity.",
    parameters: {
        type: "object",
        properties: {},
        required: []
    }
};

export const destroySandboxDefinition = {
    name: "destroySandbox",
    description: "Destroy and remove the sandbox associated with the current project.",
    parameters: {
        type: "object",
        properties: {},
        required: []
    }
};

export const webSearchDefinition = {
    name: "webSearch",
    description: "Search the web for information when external or up-to-date information is required. Use this tool when the answer cannot be reliably obtained from the current conversation or available project context.",
    parameters: {
        type: "object",
        properties: {
            query: {
                type: "string",
                description: "The search query describing the information you need to find."
            }
        },
        required: ["query"]
    }
};

export const uriSearchDefinition = {
    name: "uriSearch",
    description: "Find a specific web resource or URI using a search query.",
    parameters: {
        type: "object",
        properties: {
            query: {
                type: "string",
                description: "The query describing the web resource or URI to find."
            }
        },
        required: ["query"]
    }
};

export const getProjectsDefinition = {
    name: "getProjects",
    description: "Retrieve the projects available to the current user.",
    parameters: {
        type: "object",
        properties: {},
        required: []
    }
};

export const createProjectDefinition = {
    name: "createProject",
    description: "Create a new project for the user.",
    parameters: {
        type: "object",
        properties: {
            projectName: {
                type: "string",
                description: "The name of the project to create."
            }
        },
        required: ["projectName"]
    }
};

export const selectProjectDefinition = {
    name: "selectProject",
    description: "Select an existing project as the active project. Use this when the user wants to work on or switch to an existing project. The project must already exist.",
    parameters: {
        type: "object",
        properties: {
            "projectName": {
                type: "string",
                description: "The name of the existing project to select."
            }
        },
        required: ["projectName"]
    }
};

export const getActiveProjectDefinition = {
    name: "getActiveProject",
    description: "Retrieve the project which is selected by the current user.",
    parameters: {
        type: "object",
        properties: {},
        required: []
    }
};

export const browserGotoDefinition = {
    name: "browserGoto",
    description: "Navigate the persistent browser page to the specified URI. Use this when you need to open a website or navigate the current browser page to a new URL.",
    parameters: {
        type: "object",
        properties: {
            uri: {
                type: "string",
                description: "The complete URI to navigate to."
            }
        },
        required: ["uri"]
    }
};


export const browserClickDefinition = {
    name: "browserClick",
    description: "Click an element on the current browser page using its CSS selector. Use this to interact with buttons, links, checkboxes, or other clickable elements.",
    parameters: {
        type: "object",
        properties: {
            selector: {
                type: "string",
                description: "The CSS selector identifying the element to click."
            }

        },
        required: ["selector"]
    }
};


export const browserFillDefinition = {
    name: "browserFill",
    description: "Fill a text or form input on the current browser page. Use this when you need to enter text into an input, textarea, or similar form field.",
    parameters: {
        type: "object",
        properties: {
            selector: {
                type: "string",
                description: "The CSS selector identifying the input element."
            },
            inputText: {
                type: "string",
                description: "The text that should be entered into the input."
            }
        },
        required: ["selector", "inputText"]
    }
};


export const browserScrollDefinition = {
    name: "browserScroll",
    description: "Scroll the current browser page by the specified horizontal and vertical amount. Use a positive y value to scroll down and a negative y value to scroll up.",
    parameters: {
        type: "object",
        properties: {
            x: {
                type: "number",
                description: "Horizontal scroll amount. Use 0 when horizontal scrolling is not required."
            },
            y: {
                type: "number",
                description: "Vertical scroll amount. Positive values scroll down and negative values scroll up."
            }
        },
        required: ["x", "y"]
    }
};


export const browserScreenshortDefinition = {
    name: "browserScreenshort",
    description: "Capture a screenshot of the current browser page. Use this when visual inspection of the page is required, especially when DOM information is insufficient.",
    parameters: {
        type: "object",
        properties: {},
        required: []
    }
};


export const browserGetDomDefinition = {
    name: "browserGetDom",
    description: "Retrieve structured information about interactive elements currently present on the browser page, including buttons, links, inputs, textareas, selects, roles, element state, and screen position. Use this when you need to understand or locate elements in the current page.",
    parameters: {
        type: "object",
        properties: {},
        required: []
    }
};


export const browserErrorDefinition = {
    name: "browserError",
    description:"Retrieve console errors and JavaScript page errors captured from the current browser page. Use this when debugging or verifying whether the page produced runtime errors. Retrieved errors are cleared after they are returned.",
    parameters: {
        type: "object",
        properties: {},
        required: []
    }
};

export const updateMemoryToolDefinition = {
    name: "updateMemory",
    description: "Trigger an asynchronous memory update when the user's message contains information that should be persisted, such as a correction, preference, explicit feedback, important event, identity or relationship fact, repeated behavior, changed goal, or information that makes an existing memory stale or contradictory. The memory service determines the relevant existing memory and performs the actual update. Do not provide memory IDs.",
    parameters: {
        type: "object",
        properties: {
            memoryType: {
                type: "string",
                enum: ["episodic", "behavioral", "semantic"],
                description: "The type of information being updated: semantic for stable facts/preferences, episodic for events or experiences, behavioral for recurring patterns or behavior."
            },
            confidence: {
                type: "number",
                minimum: 0,
                maximum: 1,
                description: "Confidence that the new information is valid and should be retained."
            },
            content: {
                type: "string",
                description: "The normalized memory content that should replace or update the relevant existing memory."
            }
        },
        required: ["memoryType", "confidence", "content"],
        additionalProperties: false
    }
};

export const retrieveMemoryToolDefinition = {
    name: "retrieveMemory",
    description: "Trigger memory retrieval when existing user context is needed to answer the current request. Use this when the task depends on previously stored preferences, facts, events, behavior, goals, or other persistent context. The memory service performs semantic retrieval and returns relevant memories; do not provide memory IDs.",
    parameters: {
        type: "object",
        properties: {
            memoryType: {
                type: "string",
                enum: ["episodic", "behavioral", "semantic"],
                description: "Optional memory category to prioritize when retrieving context."
            },
            content: {
                type: "string",
                description: "A concise description of the information needed from memory, used as the semantic retrieval query."
            }
        },
        required: ["memoryType", "content"],
        additionalProperties: false
    }
};