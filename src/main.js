import { createApp } from "vue";
import { watch, nextTick } from "vue";

import App from "./App.vue";
import { createRouter, createWebHistory } from "vue-router";
import router from "./router";

import JOS from "jos-animation";

import productcont from "./components/productcont.vue";
import "font-awesome/css/font-awesome.css";

import "./style.css";

const app = createApp(App);
app.use(router);

app.mount("#app");

JOS.version();
JOS.init({
  debugMode: true,
  duration: 0.5,
  //rootMargin: "10% 0% 10% 0%"
});

watch(
  () => router.currentRoute.value,
  () => {
    nextTick(() => {
      setTimeout(() => {
        JOS.refresh();
      }, 1000);
    });
  }
);
