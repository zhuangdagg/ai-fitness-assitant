import prisma from '~/lib/prisma'

export default defineEventHandler(async (evt) => {
    console.log('test mid') 
    const user = await prisma.user.findMany()

    console.log({user})
    return {
        user
    }

    // return 'test get'
})