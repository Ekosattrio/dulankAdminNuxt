import FeatherIcon from '../components/Common/FeatherIcon.vue'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('FeatherIcon', FeatherIcon)
})

