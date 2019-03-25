import user from './components/user/index.vue';
import cart from './components/cart/index.vue';
import cate from './components/cate/index.vue';
import comment from './components/comment/index.vue';
import help from './components/help/index.vue';
import info from './components/info/index.vue';
import order from './components/order/index.vue';
import product from './components/product/index.vue';
import home from './components/home';

export const routes = [
    { path: '/', component: home },
    { path: '/user', component: user },
    { path: '/cart', component: cart },
    { path: '/cate', component: cate },
    { path: '/comment', component: comment },
    { path: '/help', component: help },
    { path: '/info', component: info },
    { path: '/order', component: order },
    { path: '/product', component: product }
]