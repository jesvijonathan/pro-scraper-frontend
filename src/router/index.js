import { createRouter, createWebHistory } from "vue-router";

import search from "../views/search.vue";

import cepher from "../views/cepher.vue";

import product from "../views/product.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: cepher,
    },
    {
      path: "/search",
      name: "search",
      component: search,
      props: (route) => ({ query: route.query.q }),
    },
    {
      path: "/product",
      name: "product",
      component: product,
    },
    {
      path: "/404",
      name: "404",
      return: "failed",
    },
    // {
    //   path: "/:pathMatch(.*)*",
    //   redirect: "/404",
    // },
  ],
});

// router.beforeEach((to, from, next) => {
//   if (to.matched.length === 0) {
//     next("/404");
//   } else {
//     next();
//   }
// });

// // render only PathNotFound component if path is not found, no need for a layout
// router.onError((error) => {
//   if (error.name === "NavigationDuplicated") {
//     router.push(error.location);
//   } else {
//     router.push("/404");
//   }
// });

export default router;
