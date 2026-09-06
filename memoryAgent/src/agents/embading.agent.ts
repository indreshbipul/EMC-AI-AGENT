const embadingAgent = async(query : string) =>{
    try {
        const response = await fetch("https://api.jina.ai/v1/embeddings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.JINA_API_KEY}`,
            },
            body: JSON.stringify({
                model: "jina-embeddings-v5-text-nano",
                input: [query],
            }),
            });

        const data = await response.json();

        const embedding = data.data[0].embedding;
        return embedding;
    } 
    catch (error) {
        console.log("embiding model is not working")
    }
}

export default embadingAgent