const memoryServiceUrl = "http://localhost:3001/"
export const updateMemoryService = async(memoryType : string, content : string, confidence : number)=>{
    try{
        const response = await fetch(`${memoryServiceUrl}updatememory`,{
            method : "POST",
            headers : {
                "content-Type" : "application/json",
            },
            body : JSON.stringify({content, memoryType, userId : "indresh-723847hjdfiuy38r", confidence}),
        })
        const res = await response.json();
        return {res, status : response.status};
    }
    catch(err){
        throw err;
    }
}

export const retriveMemoryService = async(memoryType : string, content : string) =>{
    try{
        const response = await fetch(`${memoryServiceUrl}getmemory`,{
            method : "POST",
            headers : {
                "content-Type" : "application/json",
            },
            body : JSON.stringify({content, memoryType, userId : "indresh-723847hjdfiuy38r"}),
        })
        const res = await response.json();
        return {res : res, status : response.status};
    }
    catch(err){
        throw err;
    }
}