import { z } from 'zod'
import { publicProcedure, router } from '../trpc'
import { llmRouter } from './llm'

export const appRouter = router({
    test: publicProcedure
        .input(
            z.object({
                text: z.string().nullish(),
            })
        )
        .query(({ input }) => {
            return {
                input,
                data: 'test trpc'
            }
        }),
    ...llmRouter,
})


export type AppRouter = typeof appRouter