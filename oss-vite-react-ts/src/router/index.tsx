import { Navigate, RouteObject, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import * as React from "react";
import { useRoutes } from 'react-router-dom'
import Storage from '@/utils/storage'

import Login from '@/pages/login/Index'
import { useSelector } from 'react-redux';
import Container from '@/pages/public/Container';
import loadable from '@loadable/component'
import NotFound from '@/pages/public/NotFound';
import { AuthMenuAction } from '@/store/action';


const AuthComponent = ({children}:any) => {
    const token = Storage.get('token')
    console.log('AuthComponent -------', token);
    
    return token ? children : <Navigate to='/login' /> 
}

export const InterceptRoute:React.FC<any> = (props)=> {
    return props.element
}

const defaultRoute:RouteObject[] = [
  
]
const modules = import.meta.glob(['/src/pages/**/*.tsx'])
console.log(modules);


const filterAsyncRoute = (routes:AsyncRoutes[]):RouteObject[] => {
    return (routes ?? []).map(rt=>{
        const r = filterAsyncRoute(rt.children)
        const route:RouteObject = {
            path: rt.name,
        }

        if (r?.length) {
            route.children = r
        }else{
            const ComponentNode = loadable(modules[`/src/pages${rt.component}`])
            // console.log(rt.path, ComponentNode);
            route.element = <InterceptRoute element={<ComponentNode/>} />
        }
        return  route
    })
}
// 

const Routes: React.FC = () => {
    const state = useSelector((state:State)=>state.UserReducer)
    const asyncRoutes = React.useMemo<RouteObject[]>(()=>{
       return  filterAsyncRoute(state.asyncRoute)
    }, [state.asyncRoute])
    const {pathname} = useLocation()
    
    console.log('pathname', state.asyncRoute);
    
    if (state.asyncRoute.length <= 0 && window.location.hash !== '#/login') {
        console.log('asyncRoutes ------', state.asyncRoute, pathname, window.location.hash);
        AuthMenuAction()
        // debugger
    }
    const routes = useRoutes([
        {
            path: '/login',
            element: <Login/>
        },
        {
            path:'/',
            element: state.asyncRoute.length ? <Container /> :<div>loading</div>,
            children: [...defaultRoute, ...asyncRoutes]
        },
        {
            path: '*',
            element: <AuthComponent><NotFound /></AuthComponent>

        }
    ])
    return routes
}
export default Routes