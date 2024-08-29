import { ChromaClient } from "chromadb"
import OpenAI from 'openai'

export const ollamaEmbeddingFunction = {
    client: new OpenAI({
        baseURL: 'http://localhost:11434/v1',
        apiKey: 'Empty'
    }),
    async generate(input) {
        console.log(input)
        const { data } = await this.client.embeddings.create({
            input, model: 'nomic-embed-text'
        })
        if(data && data.length) {
            return data.map(item => item.embedding)
        }
    }
}

const exec = async () => {
    const client = new ChromaClient({
        // path: 'http://localhost:8000'
        
    })

    const collect = await client.getOrCreateCollection({
        name: 'test1',
        embeddingFunction: ollamaEmbeddingFunction
    })

    // const res = await collect.add({
    //     documents: [
    //         "This is a document about pineapple",
    //         "This is a document about oranges"
    //     ],
    //     ids: ["id11", "id22"]
    // })

    const res = await collect.query({
        queryTexts: ["oranges"], // Chroma will embed this for you
        nResults: 2, // how many results to return
    });
    console.log(res.documents, '--res')



    console.log('done')
}

exec()

