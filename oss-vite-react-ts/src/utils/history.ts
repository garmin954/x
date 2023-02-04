//页面跳转的封装。。
import { createHashHistory } from 'history'
import {  HashRouter } from 'react-router-dom'
const history = createHashHistory()

export function routerToWithParams(pathname:string, query:any='') {
    const history = createHashHistory();
    history.push(pathname, query);
}

export {
    HashRouter,//在App.js中代替<BrowserRouter><BrowserRouter/>
    history
}
