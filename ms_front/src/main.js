import Vue from 'vue';
import App from './App.vue';

import VueRouter from 'vue-router';
import { routes } from './routes';
import iView from 'iview';
import axios from 'axios';
import VueAxios from 'vue-axios';
import VueQuillEditor from 'vue-quill-editor';
import{store} from './store';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';


import 'iview/dist/styles/iview.css';

Vue.use(VueQuillEditor);
Vue.use(VueAxios, axios);

Vue.use(VueRouter);
Vue.use(iView);
Vue.use(VueQuillEditor);

const router = new VueRouter({
    routes: routes,
    mode: 'hash'
});
axios.interceptors.request.use(
    config=>{
        if(store.state.token){
            config.headers.Authorization=`Bearer ${store.state.token}`;
        }
       return config;
    },
   err=>{
       return Promise.reject(err);
   }
);

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
});