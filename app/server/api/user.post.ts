import { PrismaClient } from `@prisma/client` 
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    console.log("uesr.posts.ts.start")
    console.log(body)
    const user = await prisma.user.create({
        data: {
            name: body.name,
            email: body.email
        },
    })
    const response = await prisma.$disconnect()
    console.log(response)
    console.log("uesr.posts.ts.end")
})

