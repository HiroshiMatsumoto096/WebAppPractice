export default defineEventHandler((event) => {
    console.log('hello world')
    return {
        hello: 'world'
    }
})
