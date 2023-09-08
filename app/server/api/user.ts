import { PrismaClient } from `@prisma/client` 
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => { 
    console.log('index.ts')
    const users = await prisma.user.findMany()
    // const query = getQuery(event)
    // console.log(query)
    console.log(prisma)
    /*
    let return_value
    if(! query.id){
        console.log("id not specified")
        return_value = await prisma.user.findMany()
    } else {
        console.log("id specified")
        console.log(query)
        return_value = prisma.user.findUnique({
            where: {
                id: parseInt(query.id)
            }
        })
    }
    return return_value
    */
   // return prisma
})
