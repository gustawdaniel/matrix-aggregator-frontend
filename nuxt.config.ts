// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    devtools: {enabled: true},
    modules: ['@nuxtjs/tailwindcss', '@nuxt/content', '@pinia/nuxt'],
    css: [],
    nitro: {
        externals: {
            inline: ['@aws-sdk/credential-providers'],
        },
    },
    hub: {
        database: true
    },
    tailwindcss: {
        // cssPath: '~/assets/css/tailwind.css', // Path to your Tailwind CSS file
        config: {
            plugins: [
                require('@tailwindcss/typography') // Add the Typography plugin
            ]
        }
    }
})