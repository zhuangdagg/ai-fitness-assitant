import { z } from "zod";

const workspaceValidate = z.object({
    name: z.string().describe('工作区名称'),
    slug: z.string().min(6, '至少6个字符').describe('标识符')
})

const documentValidate = z.object({
    docId: z.string().describe('文本ID'),
    filename: z.string(),
    docpath: z.string(),
    metadata: z.string().default(''),
    workspaceId: z.number()
})

export {
    workspaceValidate,
    documentValidate
}