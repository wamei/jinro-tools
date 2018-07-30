import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import App from './components/app.vue';
import Store from './stores/index.js';

const store = new Vuex.Store(
    Store
);

new Vue({
    el: '#app',
    components: { App },
    template: '<App></App>',
    store,
})
