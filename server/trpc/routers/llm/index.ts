import { z } from 'zod'
import OpenAI from 'openai'

import { publicProcedure } from '../../trpc'

const client = new OpenAI({
    baseURL: 'http://localhost:11434/v1',
    apiKey: 'Empty'
})

export const llmRouter = {
    chat: publicProcedure
        .input(z.object({
            role: z.enum(['user', 'assistant', 'system']),
            content: z.string()
        }))
        .query(async({ input }) => {
            const chatCompletion = await client.chat.completions.create({
                model: 'qwen2:1.5b',
                messages: [
                    input
                ]
            })
            return chatCompletion.choices?.[0]?.message
        })
}