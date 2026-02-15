import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import DepartmentDetail from '../views/DepartmentDetail.vue'
import Admin from '../views/Admin.vue'
import ReportDetail from '../views/ReportDetail.vue'
import EditReport from '../views/EditReport.vue'

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
        },
        {
            path: '/report/:id',
            name: 'report-detail',
            component: ReportDetail
        },
        {
            path: '/report/:id/edit',
            name: 'edit-report',
            component: EditReport
        }
    ]
})

export default router
