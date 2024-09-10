import { z } from 'zod'
import OpenAI from 'openai'

import { publicProcedure } from '../../trpc'
// import { PrismaClient } from '@prisma/client'
import { workspaceRouter } from './workspace'
import { documentRouter } from './document'
import { sseEvent } from '~/server/utils/helper'
import { createReadable } from '~/server/utils/helper'

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
                stream: true
                // function_call: []
            })
            sseEvent.emit(`chat123`, createReadable(chatCompletion))
            return 'success'
        }),

    ...workspaceRouter,
    ...documentRouter,
}

