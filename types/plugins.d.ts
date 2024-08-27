import { TRPCClient } from '../plugins/trpc'

declare module '#app' {
    interface NuxtApp {
        $trpc: TRPCClient
    }
}

declare module 'vue' {
    interface ComponentCustomProperties {
        $trpc: TRPCClient
    } 
}

export {}