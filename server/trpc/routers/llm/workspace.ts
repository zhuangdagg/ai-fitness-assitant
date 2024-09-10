import { z } from 'zod'

import { publicProcedure } from '../../trpc'
import { workspaceValidate, ids, createListQueryValidator } from '~/common/validate'
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
    deleteWorkspace: publicProcedure.input(ids).mutation(async({ input }) => {
        return prisma.workspaces.deleteMany({
            where: {
                id: {
                    in: input.ids
                }
            }
        })
    }),
    listWorkspace: publicProcedure.input(
        createListQueryValidator(z.object({
            id: z.unknown().default(''),
            name: z.string().default(''),
            slug: z.string().default(''),
        }))
    ).query(async({ input }) => {
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