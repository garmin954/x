import { AuthMenuApi } from '@/api/index';
import { useDispatch } from 'react-redux';
export const setAction = () =>{
    return {
        type: 'send_type',
        value: '我是一个action'
    }
}


export const AuthMenuAction = () =>{
    const dispatch = useDispatch()
    // @ts-ignore
    return dispatch((dp: any) => {
        return new Promise((resolve, reject)=>{
            AuthMenuApi().then((response) => {
                dp({
                    type: 'SET_ASYNC_ROUTE',
                    routes: response.data.data
                })
                resolve('')
            }).catch((err)=>{
                reject(err)
            })
        })
        
    })
}
export default {
    setAction
}