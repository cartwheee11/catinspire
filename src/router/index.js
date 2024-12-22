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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
