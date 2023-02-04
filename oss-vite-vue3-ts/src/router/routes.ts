import { AuthMenuApi, Routes } from '@/api/index';
import * as VueRouter from 'vue-router'
import Storage from "@/utils/storage";
import QueryString from 'query-string'
import { useUserStore } from '@/store/modules/user';
const routes = [
    {
        path: '/',
        redirect: '/login',
        meta:{
            noAuth: true,
        }
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import(/* webpackChunkName: "login" */ '@/pages/login/Index'),
        mate: {
            title: '登录',
            auth: false
        },
        meta:{
            noAuth: true,
        }
    },
]

const router = VueRouter.createRouter({
    // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: VueRouter.createWebHashHistory(),
    routes,
})

router.beforeEach(async (form, to, next) => {
    // console.log(form, to, next);
    // 判断路由白名单
    if (form.meta.noAuth) {
        return next()
    }

    // 获取是否已经登录
    const { token: t } = QueryString.parse(location.hash.slice(location.hash.indexOf("?token=e"), location.hash.length))
    const state = useUserStore()
    t && state.$patch({token : `${t}`})
    if (!state.token) {
        return toOssLogin(form)
    }

    if (state.asyncRoute.length <= 0) {
        // 获取权限路
        const response = await AuthMenuApi()
        const {data} = response.data
        const routes = analyseRoutes(data as any)
        state.$patch({
            asyncRoute: routes
        })
        routes?.forEach((element:any) => {
            // console.log(element);
            router.addRoute(element.name, element as any)
        });

        if (response.data.code === 4104) {
            return toOssLogin(form)
        }

        next({...form, replace: true})
    }
    
    return next()
})

const modules = import.meta.glob(['/src/pages/**/*.tsx', '/src/pages/**/*.vue'])

/**
 * 接口路由解析页面组件
 * @param routes 
 * @returns 
 */
const analyseRoutes = (routes: Routes[]):any =>{
    return routes.map((rt)=>{
        let children = null
        if (rt.children) {
            children = analyseRoutes(rt.children)
        }
        let component = null
        if (rt.component && !rt.children ) {
            /* @vite-ignore */
            component = modules[`/src/pages${rt.component}`]
        }
        return {
            ...rt,
            component,
            route: `/src/pages${rt.component}`,
            children
        }
    
    })
}

/**
 * 跳转oss授权
 * @param form 
 */
const toOssLogin = (form) => {
    window.location.href = 'http://192.168.1.5:3101?backurl=' + encodeURIComponent(`http://192.168.1.5:3102/#${form.path}`)
}


export default router