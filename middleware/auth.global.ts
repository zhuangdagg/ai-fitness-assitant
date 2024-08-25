export default defineNuxtRouteMiddleware((to, from) => {
    console.log(to.path)
    if(to.path === '/config') {
        return abortNavigation('当前无配置可用')
    }
    console.log('auth mid')
})