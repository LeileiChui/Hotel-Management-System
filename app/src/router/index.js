import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginView from '@/views/Login.vue'

Vue.use(VueRouter);

const routes = [
    //默认界面为登陆页
    {
        path: '/',
        name: 'root',
        component: LoginView,
        meta: {
            hasNav: false
        }
    },
    {
        path: '/login',
        name: 'login',
        component: LoginView,
        meta: {
            hasNav: false
        }
    },
    {
        path: '/orderManager',
        name: 'orderManager',
        component: () => import('@/views/navigation/orderManager.vue'),
        meta: {
            hasNav: true
        }
    },
    {
        path: '/orderManagement/orderView',
        name: 'orderView',
        component: () => import('@/components/orderView.vue'),
        meta: {
            hasNav: true,
            hasHeader: true
        }
    },
    {
        path: '/emplyeeManager',
        name: 'emplyeeManager',
        component: () => import('@/views/navigation/emplyeeManager.vue'),
        meta: {
            hasNav: true
        }
    },
    {
        path: '/emplyeeView',
        name: 'employeeView',
        component: () => import('@/components/employeeView.vue'),
        meta: {
            hasNav: true,
            hasHeader: true
        }
    },
    {
        path: '/roomManager',
        name: 'roomManager',
        component: () => import('@/views/navigation/roomManager.vue'),
        meta: {
            hasNav: true
        }
    },
    {
        path: '/roomManager/roomView',
        name: 'roomView',
        component: () => import('@/components/roomView.vue'),
        meta: {
            hasNav: true,
            hasHeader: true
        }
    }
];

const router = new VueRouter({
    routes
});

router.beforeEach((to, from, next) => {

    if (to.name !== "root" && to.name !== "login" && !sessionStorage.getItem("isLogin")) {
        this.$router.push({
            path: "/login"
        })
    } else
        next()

});

export default router
