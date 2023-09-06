import { PrismaClient } from `@prisma/client` 

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    console.log('user.update.ts')
    const body = await readBody(event)
    console.log(body)
    const user = await prisma.user.upsert({
        where: {
            id: body.user_id,
        },
        update: {
            name: body.name,
            email: body.email,
        },
        create: {
            name: body.name,
            email: body.email,
        }
    })
    const response = await prisma.$disconnect()
})
