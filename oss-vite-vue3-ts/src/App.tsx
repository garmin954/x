import { Breadcrumb, Button, Descriptions, Layout, Menu } from "ant-design-vue";
import { computed, defineComponent } from "vue";
import { RouterView, useRoute, useRouter } from "vue-router";
import { useUserStore } from "@/store/modules/user";
import LeftMenu from '@/components/layout/LeftMenu';

export default defineComponent({
    setup: () => {
        const route  = useRoute()
        const userStore = useUserStore()

        const breadcrumb = computed(()=>{
            return route.matched.map(({meta})=>(<Breadcrumb.Item>{meta.title}</Breadcrumb.Item>))
        })
   
        // 判断是否登录
        return () => (
            <Layout>
                <Layout.Header>
                    <div style={{ float: "left", color: "#ffffff" }} >子系统A</div>
                    <Menu theme="dark" mode="horizontal">
                        <Menu.Item>
                            user
                        </Menu.Item>
                    </Menu>
                </Layout.Header>
                <Layout>
                    <Layout.Sider width="200" style="background: #00152">
                        <LeftMenu />
                    </Layout.Sider>
                    <Layout style={{ padding: "0 50px" }}>
                        <Breadcrumb style={{ margin: "16px 0" }}>
                           {breadcrumb.value}
                        </Breadcrumb>
                        <Layout.Content >
                            {/* <RouterLink to={'/user'}>
                            <Button>User</Button>
                            </RouterLink>
                            <RouterLink to={'/dashboard'}>
                            <Button>Dashboard</Button>
                            </RouterLink> */}

                            <div style={{ background: '#fff', padding: '24px', minHeight: '620px' }}>
                                <RouterView />
                            </div>
                        </Layout.Content>
                    </Layout>
                </Layout>
            </Layout>
        )
    }
})