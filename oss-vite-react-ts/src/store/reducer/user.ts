import { AnyAction } from 'redux'
import Storage, { SesStorage } from '@/utils/storage'

const initState = {
    token: Storage.get("TOKEN") ?? '',
    asyncRoute: SesStorage.get("ASYNC_ROUTE") || []
}
export const userReducer = (state = initState, action: AnyAction) => {
    switch (action.type) {
        case 'SET_TOKEN':
            Storage.set("TOKEN", action.token, 7 * 24 * 60 * 60 * 1000)
            return Object.assign({}, state, { token: action.token })
            break;
        case 'DELETE_TOKEN':
            Storage.remove("TOKEN")
            return Object.assign({}, state, { token: '' })
            break;
        case 'SET_ASYNC_ROUTE':
            SesStorage.set("ASYNC_ROUTE", action.routes, 7 * 24 * 60 * 60 * 1000)
            return Object.assign({}, state, { asyncRoute: action.routes ?? [] })
            break;
        default:
            return state
            break;
    }
}

export default userReducer