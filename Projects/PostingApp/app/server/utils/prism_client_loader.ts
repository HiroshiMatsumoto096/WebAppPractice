import { PrismaClient } from `@prisma/client` 
// singleton
let __instance:any = null
export const prisma = () => {
    if(! __instance )
        __instance = new PrismaClient()
    return __instance
}
