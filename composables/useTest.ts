import { TRPCClientError } from '@trpc/client'
import type { inferRouterOutputs } from '@trpc/server'
import type { AppRouter } from '@/server/trpc/routers'

type RouterOutput = inferRouterOutputs<AppRouter>
type GetTestData = RouterOutput['test']

type ErrorOutput = TRPCClientError<AppRouter>

export default function useTest() {
    const { $trpc } = useNuxtApp()
    return useAsyncData<GetTestData, ErrorOutput>(() => $trpc.test.query({ text: 'client' }))
}

