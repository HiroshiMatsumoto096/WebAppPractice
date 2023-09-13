import { PrismaClient } from '@prisma/client' 
const prisma = new PrismaClient()

export default defineEventHandler( async (event) => {
    console.log("account.post.ts")
    const body = await readBody(event)
    console.log(body)
    const account = await prisma.account.create({
        data: {
            amount: parseInt(body.amount),
            userId: parseInt(body.user_id)
        }
    })
    return account 
})
