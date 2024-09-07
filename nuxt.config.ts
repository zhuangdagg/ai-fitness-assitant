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
    ['@nuxt/ui', { notifications: { position: 'top-0 right-0'}}]
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
  },
  vite: {
    server: {
      hmr: {
        overlay: false
      }
    }
  }

  // module config
})