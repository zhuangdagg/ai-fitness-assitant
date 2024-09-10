import { z } from 'zod';
import { publicProcedure } from '../../trpc'
import { documentValidate, createListQueryValidator, ids } from "~/common/validate";
import prisma from '~/lib/prisma'
import { Chroma } from '~/server/utils/vectorDbProvider/chroma'

export const documentRouter = {
    createDocument: publicProcedure.input(documentValidate)
        .mutation(async({input}) => {
            return prisma.workspace_documents.create({
                data: input
            })
        }),
    deleteDocument: publicProcedure.input(ids).mutation(async({ input }) => {
            return prisma.workspace_documents.deleteMany({
                where: {
                    id: {
                        in: input.ids
                    }
                }
            })
        }),
    listDocument: publicProcedure
        .input(createListQueryValidator(z.object({
            workspaceId: z.number().nullable()
        })))
        .query(async ({ input }) => {
            const where: any = {}
            if(input.workspaceId) {
                where.workspaceId = input.workspaceId
            }
            return prisma.workspace_documents.findMany({
                where,
                include: {
                    workspace: true
                }
            })
        }),
    embeddingDocument: publicProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input: { id }}) => {
            const file = await prisma.workspace_documents.findUnique({
                where: { id },
                include: {
                    workspace: true
                }
            })
            const { docId, filename, metadata, docpath, workspace } = file!
            const { content } = JSON.parse(metadata!)
            const documentData = {
                docId,
                pageContent: content,
                filename,
                docpath
            }
            const { vectorized, error } = await Chroma.addDocumentToNamespace({
                namespace: workspace.slug,
                documentData,
                fullFilePath: docpath,
                skipCache: false
            })
            if(!vectorized) return error
            return prisma.workspace_documents.update({
                where: { id },
                data: {
                    watched: true
                }
            })
        }),
    totalVectors: publicProcedure
        .input(z.object({}))
        .query(async () => {
            return Chroma.totalVectors()
        }),
    listVectors: publicProcedure
        .input(z.object({
            namespace: z.string()
        }))
        .query(async ({ input: {namespace}}) => {
            return Chroma.listVectors({ namespace })
        }),
    deleteVectors: publicProcedure
        .input(z.object({
            namespace: z.string(),
            ids: z.array(z.string())
        }))
        .mutation(async ({ input }) => {
            return Chroma.deleteVectorsByIds(input)
        })
}