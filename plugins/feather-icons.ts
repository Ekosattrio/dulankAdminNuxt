import FeatherIcon from '~/components/common/FeatherIcon.vue'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('FeatherIcon', FeatherIcon)
})

