import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// 导入全局样式
import './assets/css/main.css'

// 注册 PWA
import './utils/pwaRegister'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')