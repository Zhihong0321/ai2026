import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import DepartmentDetail from '../views/DepartmentDetail.vue'
import Admin from '../views/Admin.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'dashboard',
            component: Dashboard
        },
        {
            path: '/department/:id',
            name: 'department-detail',
            component: DepartmentDetail
        },
        {
            path: '/admin',
            name: 'admin',
            component: Admin
        }
    ]
})

export default router
