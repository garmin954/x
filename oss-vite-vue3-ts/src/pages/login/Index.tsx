import { Button, Descriptions } from "ant-design-vue";
import { defineComponent } from "vue";
import { useRoute, useRouter } from "vue-router";
export default defineComponent({
    setup:()=>{
        // 判断是否登录
        const router = useRouter()

        return ()=>(
            <div>
                <Descriptions title='Login Page'/>
                <Button type="primary" onClick={()=>{
                    router.push('/dashboard')
                }}>OSS Login</Button>
            </div>
        )
    }
})