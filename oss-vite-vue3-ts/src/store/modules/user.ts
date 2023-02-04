import { Routes } from './../../api/index';
import { AuthMenuApi } from '@/api/index';
import { defineStore } from "pinia";
import { RouteRecordNormalized } from "vue-router";
export const useUserStore = defineStore<string, {
    token: string,
    asyncRoute: Routes[]
}>('user',{
    state:()=>({
            token: '',
            asyncRoute: [],
    }),
    getters:{
        // asyncRoute:(state)=>{
        //     return state.asyncRoute ?? []
        // }
    },
    actions:{
        getUserMenuTree(){
            AuthMenuApi().then(response=>{
                console.log(response.data.data);
            })
        }
    },
    persist: [
        {
            key:`TOKEN`,
            paths: ['token'],
            storage: localStorage,
         
        },
        // {
        //     key:`ASYNC_ROUTE`,
        //     paths: ['asyncRoute'],
        //     storage: sessionStorage,
        // }
    ],
})