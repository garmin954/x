import React from 'react'
import { Card, Descriptions, Button } from 'antd'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { AuthMenuApi } from '@/api'
import { AuthMenuAction } from '@/store/action'
const Login: React.FC = () => {

    const navigate = useNavigate()
    const toOssLogin = () => {
        window.location.href = 'http://192.168.31.180:3101?backurl=' + encodeURIComponent(`http://192.168.31.180:3103/#/login`)
    }

    // 是否登录
    const state = useSelector((state: State) => state.UserReducer)
    const dispatch = useDispatch()
    const [searchParams] = useSearchParams()
    const t = searchParams.get('token')
    // 设置token并缓存
    if (t && !state.token) {
        dispatch({ type: "SET_TOKEN", token: t })
        return null
    }

    //自动跳转到oss授权
    if (!state.token) {
        toOssLogin()
        return null
    }

    // 判断是否存在路由
    if (state.asyncRoute.length <= 0) {
        AuthMenuAction().then(()=>{
            navigate('/dashboard')
        })
        return <div>你等等。。。。</div>
    }else{
        navigate('/dashboard')
    }
    

    return (
        <div style={{ alignContent: 'center' }}>
            <Card style={{ width: '450px', margin: '200px auto' }}>
                <Button type='primary' onClick={() => {
                    navigate('/dashboard')
                }}>OSS Login</Button>
            </Card>
        </div>
    )
}

export default Login