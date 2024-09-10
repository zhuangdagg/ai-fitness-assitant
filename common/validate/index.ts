import { z } from "zod";


const createListQueryValidator = <T extends z.ZodObject<any>>(params: T) => {
    const result = z.object({
        pageIndex: z.number().default(1),
        pageSize: z.number().default(10),
    })
    return result.merge(params)
}

const ids = z.object({
    ids: z.array(z.number())
})

export {
    ids,
    createListQueryValidator
}

export * from './llm'