import { PrismaClient } from `@prisma/client` 
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    console.log("uesr.puts.ts.start")
    console.log(body)
    const user = await prisma.user.upsert({
        where: {
            id: body.user_id,
            email: body.email
        },
        update: {
            name: body.name,
            email: body.email            
        },
        create: {
            name: body.name,
            email: body.email            
        }
    })
    const response = await prisma.$disconnect()
    console.log(response)
    console.log("uesr.puts.ts.end")
})
/*


export default defineEventHandler(async (event) => {
    console.log('user.post.ts')
    const body = await readBody(event)
    console.log(body)
    const user = await prisma.user.create({
        data: {
            name: body.name,
            email: body.email
        },
    })
    const response = await prisma.$disconnect()
    console.log(response)
})
*/