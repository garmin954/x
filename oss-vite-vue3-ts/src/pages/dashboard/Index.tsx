import { CreateAuthMenuApi } from "@/api";
import { Button, Descriptions } from "ant-design-vue";
import { defineComponent } from "vue";
export default defineComponent({
    setup:()=>{
        // 判断是否登录

        return ()=>(
            <div>
                <Descriptions title='Dashboard Page'/>
                <Button onClick={()=>{
                    CreateAuthMenuApi({
                        name: 'cs',
                        path: '/cs',
                        pid: 4,
                        redirect: '',
                        component: 'cs/Index',
                        meta:{title: '测试', icon:'cs'}
                    }).then(response=>{
                        console.log(response);
                        
                    })
                }}>添加数据</Button>
            </div>
        )
    }
})