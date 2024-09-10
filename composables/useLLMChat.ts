import { TRPCClientError } from "@trpc/client";

import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "~/server/trpc/routers";

type RouterOutput = inferRouterOutputs<AppRouter>

type GetData = RouterOutput['chat']
type ErrorOutput = TRPCClientError<AppRouter>

export default async function useLLMChat(question: { role: 'user', content: string }) {
    const { $trpc } = useNuxtApp()

    await $trpc.chat.query(question)
}