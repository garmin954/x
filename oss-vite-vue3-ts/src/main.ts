import { createApp } from 'vue'
import './style.css'
import App from './App'
import router from "@/router/routes";
import store from "@/store";
import 'ant-design-vue/dist/antd.css';

const app = createApp(App)
app.use(router).use(store)

app.mount('#app')