import { createApp } from "vue";
import { watch, nextTick } from "vue";

import App from "./App.vue";
import { createRouter, createWebHistory } from "vue-router";
import router from "./router";

import productcont from "./components/productcont.vue";
import "font-awesome/css/font-awesome.css";

import "./style.css";

const app = createApp(App);
app.use(router);

app.mount("#app");
