import { z } from 'zod'
import { publicProcedure } from '../trpc'

import { Chroma } from '~/server/utils/vectorDbProvider/chroma'

export const testRouter = {
    test: publicProcedure
        .meta({ description: '测试tRPC'})
        .input(
            z.object({
                text: z.string().nullish().describe('输入参数'),
            })
        )
        .output(z.object({
            data: z.string().describe('输出数据格式')
        }))
        .query(async ({ input }) => {
            console.log(input, '--test')
            const { client } = await Chroma.connect()
            try {
                const collection = await client.getOrCreateCollection({
                    name: "test",
                });
                collection.add({
                    ids: ['id1', 'id2'],
                    embeddings: [[1,2,3], [4, 5, 6]],
                    documents: ["document1", "document2"]
                })
                const results = await collection.query({
                    queryTexts: ["This is a query document about hawaii"], // Chroma will embed this for you
                    nResults: 2, // how many results to return
                });
                console.log({ results })
            } catch(err) {
                console.error(err)
            }
            
            // await collection.add({
            //     documents: [
            //         "This is a document about pineapple",
            //         "This is a document about oranges"
            //     ],
            //     ids: ["id1", "id2"],
            // });
            
            return {
                data: 'test trpc'
            }
        })
}