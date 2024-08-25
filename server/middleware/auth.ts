export default defineEventHandler((evt) => {
    evt.context.auth = { user: 'zhuang', id: '123' }
    console.log('server auth mid')
    // throw new Error('auth failure')
})