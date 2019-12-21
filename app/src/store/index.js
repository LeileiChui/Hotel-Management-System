import Vue from 'vue'
import Vuex from 'vuex'

import createPersistedState from 'vuex-persistedstate'
import da from "element-ui/src/locale/lang/da";
import el from "element-ui/src/locale/lang/el";

Vue.use(Vuex);


export default new Vuex.Store({
    state: {
        env: {
            "ServerHost": "http://127.0.0.1:3001"
        },
        headPortraitURL: require("@/assets/defaultHead.png"),
        currentRoomManagerPageID: null,
        currentOrderManagerType: null,
        currentEmployeeManagerType: null,
        isLogin: false,
        userInfo: null,
        routerTable: null,
        formatDate: (now) => {
            const year = now.getFullYear(); //取得4位数的年份
            const month = now.getMonth() + 1; //取得日期中的月份，其中0表示1月，11表示12月
            const date = now.getDate(); //返回日期月份中的天数（1到31）
            let temp = "";
            if (date < 10)
                temp = "-0";
            else
                temp = "-";
            return year + "-" + month + temp + date
        }
    },
    mutations: {
        CHANGE_HEAD(state, url) {
            state.headPortraitURL = url
        },
        CHANGE_ROUTER(state, table) {
            state.routerTable = table
        }
    },
    actions: {},
    modules: {},
    plugins: [createPersistedState({
        storage: window.sessionStorage
    })]
})
