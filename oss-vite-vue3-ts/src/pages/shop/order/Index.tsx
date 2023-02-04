import { Descriptions } from "ant-design-vue";
import { defineComponent } from "vue";
export default defineComponent({
    setup:()=>{
        // 判断是否登录

        return ()=>(
            <div>
                <Descriptions title='Order Page'/>
            </div>
        )
    }
})