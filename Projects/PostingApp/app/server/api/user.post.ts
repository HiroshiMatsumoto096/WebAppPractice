import { PrismaClient } from `@prisma/client` 
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    console.log("uesr.posts.ts.start")
    console.log(body)
    if(body instanceof(Array)){ // 配列入力の場合
        console.log("array が入力されました")
        const user = await prisma.user.createMany({
            data: body,
        })
    } else { // オブジェクト入力の場合
        console.log("object が入力されました")
        const user = await prisma.user.create({
            data: {
                name: body.name,
                email: body.email
            },
        })
    }
    /*
    const user = await prisma.user.create({
        data: {
            name: body.name,
            email: body.email
        },
    })
    const response = await prisma.$disconnect()
    console.log(response)
    */
    console.log("uesr.posts.ts.end")
})

