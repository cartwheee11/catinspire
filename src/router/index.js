import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Auth from "../views/Auth.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/favourites",
    name: "Favourites",
    component: Home,
  },
  {
    path: "/auth",
    component: Auth,
    redirect: "/auth/login",
    children: [
      {
        path: "/auth/:action",
        component: Auth,
      },
    ],
  },

  // {
  //   path: "/login",
  //   redirect: "/login/login",
  // },

  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
