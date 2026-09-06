const build_uri = (quary : string) : string=>{
    return `http://localhost:8080/search?q=${quary}&format=json`
}

export const quarySearch = async(quary : string) =>{
    try{
        const response = await fetch(build_uri(quary))
        const res : string = await response.json();
        return {res,status: response.status};
    }
    catch(err){
        return {res: String(err), status: 400};
    }
}

export const uriSearch = async(uri : string) =>{
    try{
        const response = await fetch("",{
            method : "POST",
            headers : {
                "content-Type" : "application/json",
            },
            body : JSON.stringify({uri, key: process.env.WEBSERVICE_KEY !})
        })
        const res : string = await response.json();
        return {res,status: response.status};
    }
    catch(err){
        return {res: String(err), status: 400};
    }
}
