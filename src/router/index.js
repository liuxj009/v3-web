import { createRouter, createWebHashHistory } from "vue-router"

const routes = [
    {
        path: "/home",
        component: () => import("@/pages/home/index.vue")
    }
]
export const router = createRouter({
    history: createWebHashHistory(),
    routes
})