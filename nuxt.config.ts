// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    devtools: {enabled: true},
    modules: ['@nuxtjs/tailwindcss', '@nuxt/content', '@pinia/nuxt', '@nuxthub/core'],
    css: [],
    nitro: {
        externals: {
            inline: ['@aws-sdk/credential-providers'],
        },
    },
    hub: {
        remote: true
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