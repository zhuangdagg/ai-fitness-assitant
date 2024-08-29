// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [['@nuxtjs/apollo', {
    clients: {
      default: {
        httpEndpoint: 'http://localhost:3000/graphql',
        httpLinkOptions: {
        }
      }
    }
  }], 
  '@nuxt/ui'
],
  build: {
    transpile: ['trpc-nuxt'],
  },
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  imports: {
    dirs: []
  },
  nitro: {
    experimental: {
      openAPI: true,
    },
  }

  // module config
})