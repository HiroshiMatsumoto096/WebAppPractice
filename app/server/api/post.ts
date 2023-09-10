import { PrismaClient } from `@prisma/client` 
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => { 
    /*
    console.log('index.ts')
    const query = getQuery(event)
    let return_value
    if(! query.id){
        console.log("id not specified")
        return_value = await prisma.post.findMany()
    } else {
        console.log("id specified")
        console.log(query)
        return_value = prisma.post.findUnique({
            where: {
                id: parseInt(query.id)
            }
        })
    }
    return return_value
    */
   return 
})
