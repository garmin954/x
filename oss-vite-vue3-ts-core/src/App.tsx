import { Button, Card, Descriptions, Form, Input, message, Result, } from "ant-design-vue";
import { defineComponent, onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { useThrottleFn, useUrlSearchParams } from "@vueuse/core";
import { LoginApi, CheckLoginApi } from "./api";
import Storage from "@/utils/storage";
type StateForm = { username: string, password: string }

export default defineComponent({
    setup() {
        const route = useRoute()
        const routeParams = useUrlSearchParams('history')
        const isLogin = ref(Storage.get('TOKEN') || '')

        const stateForm = reactive<StateForm>({
            username: 'Garmin',
            password: 'gm123654',
        })
        onMounted(() => {
            checkLoginState()
            console.log('isLogin----', isLogin);
            
        })

        /**
         * 检查状态
         */
        const checkLoginState = () => {
            if (!Storage.has('TOKEN')) { // 需要登录
                return
            }

            CheckLoginApi().then(response => {
                if (response.data.code === 0) {
                    setTimeout(() => {
                    toBack(Storage.get('TOKEN'))
                    }, 1000);
                    return
                }

                Storage.remove('TOKEN')
                isLogin.value = ''
            })
        }

        function toBack(token:string) {
            if (routeParams.backurl) {
                // @ts-ignore
                location.href = `${routeParams.backurl}?token=${token}`
            }
        }
        /**
         * 登录
         */
        const submitLogin = useThrottleFn(() => {
            LoginApi({ ...stateForm }).then((response) => {

                const { data, msg, code } = response.data
                if (code === 0) {
                    return message.error(msg)
                }
                message.success('login success!')
                Storage.set('TOKEN', data?.token, 7 * 24 * 60 * 60 * 1000)
                console.log(data?.token);

                // Storage.set('TOKEN', data?.token, 3*1000)
                // 跳转回原来的页面
                toBack(data?.token ?? '')
            })
        }, 2000)
        return () => (
            <>
                {isLogin.value ? (
                    <Result
                        status="success"
                        title="Successfully Purchased Cloud Server ECS!"
                        sub-title="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
                    >
                        {/* <template #extra>
                            <a-button key="console" type="primary">Go Console</a-button>
                            <a-button key="buy">Buy Again</a-button>
                        </template> */}
                    </Result>
                ) : (
                    <Card style={{ width: '400px' }}>
                        <Descriptions title={'Login OSS'} />
                        <Form>
                            <Form.Item label='username'>
                                <Input value={stateForm.username} {...{ 'onUpdate:value': (v) => stateForm.username = v }} />
                            </Form.Item>
                            <Form.Item label='password'>
                                <Input type="password" value={stateForm.password} {...{ 'onUpdate:value': (v) => stateForm.password = v }} />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" onClick={() => submitLogin()} >Submit</Button>
                            </Form.Item>
                        </Form>
                    </Card>
                )}
            </>
        )
    }
})