import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import '@/assets/styles/base.css'
import HQObserver from '@/lib/HQObserver'

Vue.use(HQObserver)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
