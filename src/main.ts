import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import axios from 'axios'
import { loginStore } from './stores/login'

import piniaPlupiniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPlupiniaPluginPersistedstate)

axios.defaults.baseURL = 'http://localhost:8080/'

axios.interceptors.request.use(config => {
  const store = loginStore();
  if(store.token) {
    config.headers.Authorization = store.token
  }
  return config
})

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const store = loginStore();
    store.token = undefined;
    return Promise.reject(error);
  }
);

const app = createApp(App)

app.use(pinia)
app.use(router)

app.mount('#app')
