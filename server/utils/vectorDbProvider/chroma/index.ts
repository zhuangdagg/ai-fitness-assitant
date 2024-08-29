import { ChromaClient } from 'chromadb'

export const Chroma = {
    name: 'Chroma',

    connect: async function () {
        const client = new ChromaClient()
        
        return { client }
    }
}

