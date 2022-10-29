import { route } from "quasar/wrappers";
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
  routerKey,
} from "vue-router";
import routes from "./routes";
import { useAuthStore } from "src/stores/auth";

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = createWebHistory; /*process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)*/

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach(async (to) => {
    const authStore = useAuthStore();
    console.log('router beforeEach function executing!');
    if (!authStore.user) {
      console.log('user not logged in! Path: ' + to.fullPath);
      authStore.returnUrl = to.fullPath;

      //only redirect to login ("/") if its not already the current route
      if (to.fullPath !== "/") {
        return '/';
      }
    } else {
      console.log('user is logged in!');
    }
  });

  return Router;
});
