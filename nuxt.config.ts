// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    devtools: {enabled: true},
    modules: ['@nuxtjs/tailwindcss', '@nuxt/content', '@pinia/nuxt'],
    css: [],
    // app: {
    //     head: {
    //         link: [{
    //             rel: 'stylesheet', href: 'https://unpkg.com/vue-multiselect/dist/vue-multiselect.min.css'
    //         }]
    //     }
    // },
    tailwindcss: {
        // cssPath: '~/assets/css/tailwind.css', // Path to your Tailwind CSS file
        config: {
            plugins: [
                require('@tailwindcss/typography') // Add the Typography plugin
            ]
        }
    }
})