import { PrismaClient } from '@prisma/client' 

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const newUser = await prisma.user.create({
        data: {
            name: body.name,
            email: body.email
        }
    })
    return newUser
})
