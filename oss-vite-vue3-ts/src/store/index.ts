import { createPinia } from "pinia";

import {createPersistedState} from 'pinia-plugin-persistedstate'
// import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import { parse, stringify } from 'zipson'

const pinia = createPinia()
// pinia.use(piniaPluginPersistedstate)
pinia.use(createPersistedState({
    key: id => `ADMIN_${id.toLocaleUpperCase()}`,
    serializer: {
        deserialize: parse,
        serialize: stringify
      }
}))

export default pinia