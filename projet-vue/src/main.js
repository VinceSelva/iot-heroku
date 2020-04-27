import Vue from 'vue'
import App from './App.vue'
import VueMaterial from 'vue-material';
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'
import VueRouter from 'vue-router'
import HighchartsVue from "highcharts-vue";
import Accueil from "./components/Accueil.vue"
import Piscine from "./components/Piscine.vue"
import Graphiques from "./components/Graphiques.vue"
import Poulailler from "./components/Poulailler.vue"
import Login from "./components/Login.vue"

Vue.use(HighchartsVue);
Vue.use(VueMaterial);
Vue.config.productionTip = false
Vue.use(VueRouter)

const router = new VueRouter({
  routes:[
    {
      path: '/',
      component: Login
    },
    {
      path: '/piscine',
      component: Piscine
    },
    {
      path: '/graphiques',
      component: Graphiques
    },
    {
      path: '/poulailler',
      component: Poulailler
    },
    {
      path: "/accueil",
      component: Accueil
  },
  ],
  mode:'history'
});


new Vue({
  router,
  render: h => h(App),
}).$mount('#app')