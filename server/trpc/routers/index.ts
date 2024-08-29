import { router } from '../trpc'

// module
import { testRouter } from './test'
import { llmRouter } from './llm'


export const appRouter = router(Object.assign(
    testRouter, llmRouter
))


export type AppRouter = typeof appRouter