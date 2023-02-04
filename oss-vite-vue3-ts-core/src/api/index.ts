import { AxiosResponse } from './../utils/request';
import Request from "@/utils/request";

interface IResponseType<P = {}> {
    code?: number;
    msg: string;
    data?: P;
}

type LoginParams = { username: string, password: string }
type UserInfo = {
    avatar: string,
    create_at: string,
    id: number,
    mobile: string,
    nickname: string,
    update_at: string,
    username: string,
}
type LoginResponse = {
    expired: number,
    token: string
    userInfo: UserInfo
}
export const LoginApi = (data: LoginParams) => {
    return Request.post<IResponseType<LoginResponse>>('/api/login', data)
}

export const CheckLoginApi = () => {
    return Request.post<IResponseType<UserInfo>>('/api/user/check_login')
}