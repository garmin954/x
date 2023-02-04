import { defineComponent, computed, ref } from "vue";
import {  Menu } from "ant-design-vue";
import { RouterLink, useRoute} from "vue-router";
import { useUserStore } from "@/store/modules/user";
export default defineComponent({
    name: 'LeftMenu',
    setup: () => {

        const route = useRoute()
        const userStore = useUserStore()

        /**
         * 递归生成菜单
         * @param routesMenus d
         * @returns 
         */
        const menusTreeFnc = (routesMenus:any[]): any[]=>{
            return (routesMenus || []).map((rt)=>{
                if (rt.children && rt.children.length > 0) {
                    return (
                        <Menu.SubMenu title={rt.meta.title} key={rt.name}>
                            {menusTreeFnc(rt.children)}
                        </Menu.SubMenu>
                    )
                }
               
                return (
                    <RouterLink style={{display: 'block'}} to={ rt.path}>
                        <Menu.Item key={rt.name}>
                        {rt.meta.title} 
                        </Menu.Item>
                    </RouterLink>
                )
            })
        }
        const menusTreeTmp = computed((params:any[])=> {
            const routesMenus = userStore.asyncRoute
            return menusTreeFnc(routesMenus)
        })

        const selectedKeys = computed(()=> [route.name as string])
        const openKeys = computed(()=> {
            return route.matched.map((v)=>v.name) || []
        })

        return () => (
            <Menu 
                theme="dark"
                mode="inline" 
                selectedKeys={selectedKeys.value}
                openKeys={openKeys.value as string []}
                >
                   
                {menusTreeTmp.value}
            </Menu>
        )
    }
})