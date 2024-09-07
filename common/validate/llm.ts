import { z } from "zod";

const workspaceValidate = z.object({
    name: z.string().describe('工作区名称'),
    slug: z.string().min(6).describe('标识符')
})

export {
    workspaceValidate
}