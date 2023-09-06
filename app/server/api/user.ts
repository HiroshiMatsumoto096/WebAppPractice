import { PrismaClient } from `@prisma/client` 
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => { 
    console.log('index.ts')
    const users = await prisma.user.findMany()
    return users
})
