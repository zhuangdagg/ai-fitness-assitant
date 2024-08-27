import { createTRPCNuxtClient, httpBatchLink } from "trpc-nuxt/client";

import type { AppRouter } from '~/server/trpc/routers'

export default defineNuxtPlugin(() => {
    const trpc = createTRPCNuxtClient<AppRouter>({
        links: [
            httpBatchLink({
                url: '/api/trpc'
            })
        ]
    }) as object

    return {
        provide: {
            trpc
        }
    }
})

export type TRPCClient = ReturnType<typeof createTRPCNuxtClient<AppRouter>>
