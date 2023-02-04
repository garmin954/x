import React from 'react'
import { Link, Outlet } from 'react-router-dom'
export default function ShowOutlet() {
    
    return (

        <div>
            <div>
                <Link to='/'> 首页</Link>
                <Link to='/user'> 个人中心</Link>
            </div>
            <div>
                {/* 路由页面显示在这里 */}
                <Outlet />
            </div>
        </div>
    )
}