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
    // editWorkspace: publicProcedure.input().mutation()
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
        slug: z.string()
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
        const data = await prisma.workspaces.findMany({
            where
        })
        return data 
        
    })
}