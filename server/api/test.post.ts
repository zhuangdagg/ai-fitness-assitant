export default defineEventHandler((req) => {
    console.log(req.context.matchedRoute?.path, '--req')
    return 'test'
})