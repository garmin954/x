import React, { useMemo } from 'react'
import { Menu, MenuProps } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';


export default function AuthMenu() {
    const state = useSelector((state:State)=>state.UserReducer)

    const filterAsyncRoute = (routes:AsyncRoutes[]):MenuProps['items'] => {
      
        return (routes ?? []).map(rt=>{
            const r = filterAsyncRoute(rt.children)
            let children = null
            if (r?.length) {
                children = r
            }
            return {
                key: rt.path,
                // icon: React.createElement(''),
                label: rt.meta.title,
                path: rt.path,
                children
            }
        })
    }

    const menuItems: MenuProps['items'] = useMemo(()=>{
        return filterAsyncRoute(state.asyncRoute)
    }, [state.asyncRoute])


    const navigate = useNavigate()

    const clickMenuItem = (e:any)=>{
        navigate(e.key)
    }
    return (
        <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            style={{ height: 'calc(100vh - 64px)', overflowY: 'scroll', borderRight: 0 }}
            onClick={clickMenuItem}
            items={menuItems}
        />
    )
}
