import { PrismaClient } from `@prisma/client` 
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    console.log("uesr.delete.ts.start")
    console.log(body)
    const user = await prisma.user.delete({where:{id:body.user_id}})
    console.log("uesr.delete.ts.end")
})
