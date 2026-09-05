import { createApp } from 'vue'
import App from "./src/app.vue"
import { router } from "./src/router/index.js"
const app = createApp(App)
app.use(router)
app.mount("#app")