// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxt/ui"],
  runtimeConfig: {
    API_KEY: process.env.API_KEY,
    API_URL: `http://${process.env.API_URL}`,
    API_WS: `ws://${process.env.API_URL}`,
    public: {
      REFRESH_TIME: 2500,
    },
  },
});
