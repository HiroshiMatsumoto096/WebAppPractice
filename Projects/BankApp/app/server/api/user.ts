import { PrismaClient } from '@prisma/client' 

const prisma = new PrismaClient()

export default defineEventHandler( async (event) => {
    console.log('user.ts')
    const users = await prisma.user.findMany()
    console.log(users)
    return users 
})
