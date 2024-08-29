import { z } from 'zod'
import { publicProcedure, router } from '../trpc'
import { llmRouter } from './llm'

export const appRouter = router({
    test: publicProcedure
        // .meta({ openapi: { method: 'POST', path: '/test'}})
        .input(
            z.object({
                text: z.string().nullish(),
            })
        )
        .output(z.object({
            data: z.string()
        }))
        .query(({ input }) => {
            return {
                data: 'test trpc'
            }
        })
        ,
    ...llmRouter,
})


export type AppRouter = typeof appRouter