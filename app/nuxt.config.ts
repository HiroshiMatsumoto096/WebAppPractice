// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  devtools: { enabled: true },
  build: {
    transpile: ['vuetify'],
  },
  vite: {
    define: {
      'process.env.DEBUG': false,
    },
  },
  // https://reffect.co.jp/vue/vuetify3/
  css: ['@/assets/main.scss'], // パレットカラーを利用するためには Global CSS の”vuetify/styles"
})
