import { z } from 'zod'
import { publicProcedure, router } from '../trpc'

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
        })
})


export type AppRouter = typeof appRouter