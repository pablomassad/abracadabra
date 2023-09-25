import { main } from 'fwk-quasar'
import Home from 'src/pages/home/index.vue'
import Login from 'src/pages/login/index.vue'
import Clients from 'src/pages/clients/index.vue'
import Sales from 'src/pages/sales/index.vue'
import Accounts from 'src/pages/accounts/index.vue'
import Reports from 'src/pages/reports/index.vue'
import Summary from 'src/pages/summary/index.vue'
import Stock from 'src/pages/stock/index.vue'
import Settings from 'src/pages/settings/index.vue'

const routes = [
    {
        path: '/',
        component: () => import('layouts/MainLayout.vue'),
        children: [
            { path: '/home', component: Home },
            { path: '/clients', component: Clients },
            { path: '/sales', component: Sales },
            { path: '/accounts', component: Accounts },
            { path: '/reports', component: Reports },
            { path: '/summary', component: Summary },
            { path: '/stock', component: Stock },
            { path: '/settings', component: Settings }
        ]
    },
    { path: '/login', component: Login },
    {
        path: '/:catchAll(.*)*',
        component: () => import('pages/Error404.vue')
    }
]
main.actions.initBeforeRoutes(routes[0].children)
export default routes
