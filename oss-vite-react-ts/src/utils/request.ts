import store from '@/store';
import axios, { AxiosRequestConfig, Method } from 'axios';
import Storage from "@/utils/storage";
import {history, routerToWithParams} from '@/utils/history'
import { message } from 'antd';


// import { ElLoadingComponent } from 'element-ui/types/loading';



// export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE'
export type ResponseType = 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream'

export interface AxiosRequest {
    baseURL?: string;
    url: string;
    data?: any;
    params?: any;
    method?: Method;
    headers?: any;
    timeout?: number;
    responseType?: ResponseType;
}

export interface AxiosResponse {
    data: any;
    headers: any;
    request?: any;
    status: number;
    statusText: string;
    config: AxiosRequest;
}

export interface CustomResponse {
    readonly status: boolean;
    readonly message: string;
    data: any;
    origin?: any;
}

export interface GetDemo {
    id: number;
    str: string;
}

export interface PostDemo {
    id: number;
    list: Array<{
        id: number;
        version: number;
    }>;
}

// 定义接口
interface PendingType {
    url?: string;
    method?: Method;
    params: any;
    data: any;
    cancel: Function;
}

// 取消重复请求
const pending: Array<PendingType> = [];
const CancelToken = axios.CancelToken;
// axios 实例
const instance = axios.create({
    // timeout: 10000,
    responseType: 'json',
    // baseURL: 'http://192.168.1.5:8080/',
    headers: {
        // "Access-Control-Allow-Credentials": "true",
        // "Access-Control-Allow-Headers": "Authorization, Content-Length, X-CSRF-Token, Content-Type",
        // "Access-Control-Allow-Methods": "POST, GET, OPTIONS, PUT, DELETE, UPDATE",
        // "Access-Control-Allow-Origin": "*",
        // "Access-Control-Expose-Headers": "Authorization, Content-Length, Access-Control-Allow-Origin, Access-Control-Allow-Headers",
        // "Access-Control-Max-Age": "172800",
        'Content-Type': 'multipart/form-data',
        // "Authorization": `Bearer ${Storage.get("TOKEN")}`

    }
});
// let loadingInstance: ElLoadingComponent;

// 移除重复请求
const removePending = (config: AxiosRequestConfig) => {
    for (const key in pending) {
        const item: number = +key;
        const list: PendingType = pending[key];
        // 当前请求在数组中存在时执行函数体
        if (list.url === config.url && list.method === config.method && JSON.stringify(list.params) === JSON.stringify(config.params) && JSON.stringify(list.data) === JSON.stringify(config.data)) {
            // 执行取消操作
            list.cancel('操作太频繁，请稍后再试');
            // 从数组中移除记录
            pending.splice(item, 1);
        }
    }
};

// 添加请求拦截器
instance.interceptors.request.use(
    request => {
        // loadingInstance = Loading.service({
        //     text: '加载中',
        //     background: 'rgba(0, 0, 0, 0.3)'
        // });

        const {token} = store.getState().UserReducer
        if (token) {
            // @ts-ignore
            request.headers['Authorization'] = `Bearer ${token}` // 让每个请求携带自定义token 请根据实际情况自行修改
          }
        removePending(request);
        request.cancelToken = new CancelToken((c) => {
            pending.push({ url: request.url, method: request.method as Method, params: request.params, data: request.data, cancel: c });
        });
        return request;
    },
    error => {
        return Promise.reject(error);
    }
);

// 添加响应拦截器
instance.interceptors.response.use(
    response => {
        console.log('response', response);
        if (response?.status === 500) {
            message.warning('服务器错误！')
        }
        
        // loadingInstance.close();
        removePending(response.config);
        const errorCode = response?.data.code;
        switch (errorCode) {
            case 4100:
            case 4104:
            store.dispatch({type: 'DELETE_TOKEN'})
            routerToWithParams('/login')
            message.warning(response.data.msg)
            return Promise.reject('401')
                // 根据errorCode，对业务做异常处理(和后端约定)
                break;
            default:
                break;
        }

        return response;
    },
    error => {
        // loadingInstance.close();
        const response = error.response;

        // 根据返回的http状态码做不同的处理
        switch (response?.status) {
            case 401:
                // token失效
                break;
            case 403:
                // 没有权限
                break;
            case 500:
                // 服务端错误
                break;
            case 503:
                // 服务端错误
                break;
            default:
                break;
        }

        // 超时重新请求
        const config = error.config;
        // 全局的请求次数,请求的间隙
        const [RETRY_COUNT, RETRY_DELAY] = [0, 1000];

        if (config && RETRY_COUNT) {
            // 设置用于跟踪重试计数的变量
            config.__retryCount = config.__retryCount || 0;
            // 检查是否已经把重试的总数用完
            if (config.__retryCount >= RETRY_COUNT) {
                return Promise.reject(response || { message: error.message });
            }
            // 增加重试计数
            config.__retryCount++;
            // 创造新的Promise来处理指数后退
            const backoff = new Promise((resolve) => {
                setTimeout(() => {
                    resolve('fail');
                }, RETRY_DELAY || 1);
            });
            // instance重试请求的Promise
            return backoff.then(() => {
                return instance(config);
            });
        }

        // eslint-disable-next-line
        return Promise.reject(response || { message: error.message });
    }
);

export default instance;
