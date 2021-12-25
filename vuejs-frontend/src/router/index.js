import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/signup/Login.vue";
import Logout from "../views/signup/Logout.vue";
import Signup from "../views/signup/Signup.vue";
import StocksIndex from "../views/stocks/StocksIndex.vue";
import StocksNew from "../views/stocks/StocksNew.vue";
import StocksShow from "../views/stocks/StocksShow.vue";
import StocksEdit from "../views/stocks/StocksEdit.vue";
import SectorsIndex from "../views/sectors/SectorsIndex.vue";
import SectorsNew from "../views/sectors/SectorsNew.vue";
import SectorsShow from "../views/sectors/SectorsShow.vue";
import IndustriesIndex from "../views/industries/IndustriesIndex.vue";
import IndustriesNew from "../views/industries/IndustriesNew.vue";
import IndustriesShow from "../views/industries/IndustriesShow.vue";
import Welcome from "../views/Welcome.vue";
import Profile from "../views/Profile.vue";

Vue.use(VueRouter);

const routes = [
  { path: "/", name: "Welcome", component: Welcome },
  {
    path: "/home",
    name: "Home",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/logout",
    name: "Logout",
    component: Logout,
  },
  {
    path: "/signup",
    name: "Signup",
    component: Signup,
  },
  // {
  //   path: "/pie",
  //   name: "Pie",
  //   component: () => import("../views/stocks/Pie.vue"),
  // },
  { path: "/stocks", name: "StocksIndex", component: StocksIndex },
  { path: "/stocks/new", name: "StocksNew", component: StocksNew },
  { path: "/stocks/:id", name: "StocksShow", component: StocksShow },
  { path: "/stocks/:id/edit", name: "StocksEdit", component: StocksEdit },
  { path: "/sectors", name: "SectorsIndex", component: SectorsIndex },
  { path: "/sectors/new", name: "SectorsNew", component: SectorsNew },
  { path: "/sectors/:id", name: "SectorsShow", component: SectorsShow },
  { path: "/industries", name: "IndustriesIndex", component: IndustriesIndex },
  { path: "/industries/new", name: "IndustriesNew", component: IndustriesNew },
  { path: "/industries/:id", name: "IndustriesShow", component: IndustriesShow },

  { path: "/profile", name: "Profile", component: Profile },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
