import { z } from 'zod'

import { publicProcedure } from '../../trpc'
import { workspaceValidate } from '~/common/validate/llm'
import prisma from '~/lib/prisma'

export const workspaceRouter = {
    createWorkspace: publicProcedure
        .input(workspaceValidate)
        .mutation(async ({ input }) => {
            return prisma.workspaces.create({
                data: input
            })
        }),
    editWorkspace: publicProcedure.input(z.object({
        id: z.number(),
        name: z.string(),
        chatMode: z.string(),
        openAiHistory: z.number()
    })).mutation(({ input }) => {
        console.log(input, '--e')
        return prisma.workspaces.update({
            where: {
                id: input.id
            },
            data: {
                ...input,
                lastUpdatedAt: new Date()
            }
        })
    }),
    deleteWorkspace: publicProcedure.input(z.object({
        ids: z.array(z.number())
    })).mutation(async({ input }) => {
        return prisma.workspaces.deleteMany({
            where: {
                id: {
                    in: input.ids
                }
            }
        })
    }),
    listWorkspace: publicProcedure.input(z.object({
        id: z.unknown(),
        name: z.string(),
        slug: z.string(),
        pageIndex: z.number().default(1),
        pageSize: z.number().default(10),
    })).query(async({ input }) => {
        console.log(input, '--input')
        const where: any = {
            name: {
                contains: input.name
            },
            slug: {
                contains: input.slug
            }
        }
        if(input.id) {
            where['id'] = input.id
        }
        const filter = {
            where,
            skip: (input.pageIndex - 1) * input.pageSize,
            take: input.pageSize,
        }
        const [data, total] = await prisma.$transaction([
            prisma.workspaces.findMany(filter),
            prisma.workspaces.count(filter)
        ])
        return {data, total} 
        
    })
}