export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      base: process.env.BASE_URL || 'http://localhost:3000',
      apiBase: process.env.API_URL || 'http://localhost:8000'
    },
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'id'
      },
      titleTemplate: '%s — overhous',
      title: 'overhous',
      meta: [
        { charset: 'utf-8' },
        { name: 'keywords', content: 'kasir digital, pesan makanan, reservasi restoran' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'googlebot', content: 'notranslate' },
        { name: 'msapplication-TileColor', content: '#ffa84c' },
        { name: 'theme-color', content: '#ffffff' },
        { hid: 'description', name: 'description', content: 'overhous' }
      ],
      link: [
        { rel: 'preconnect', href: process.env.API_URL, crossorigin: 'use-credentials' }
      ]
    },
  },
  css: [
    '~/assets/fonts.scss',
  ],
})