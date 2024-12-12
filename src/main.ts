import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from "./router/index.ts";
import AOS from 'aos';
import 'aos/dist/aos.css';
import FontAwesomeIcon from './plugins/fontawesome';
import { createMetaManager } from "vue-meta";
import { getActivePinia, setActivePinia } from "pinia";
import { createPinia } from "pinia";


AOS.init();
const metaManager = createMetaManager();

const pinia = createPinia();



createApp(App).component('FontAwesomeIcon', FontAwesomeIcon).use(router).use(metaManager).use(pinia).mount('#app');