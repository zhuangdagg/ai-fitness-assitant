import { z } from 'zod'
import OpenAI from 'openai'

import { publicProcedure } from '../../trpc'
// import { PrismaClient } from '@prisma/client'

const client = new OpenAI({
    baseURL: 'http://localhost:11434/v1',
    apiKey: 'Empty'
})

// const prisma = new PrismaClient()

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
                ],
                // function_call: []
            })

            const a = await client.embeddings.create({
                input: ['heibao'],
                model: 'nomic-embed-text'
            })
            return chatCompletion.choices?.[0]?.message
        })
}