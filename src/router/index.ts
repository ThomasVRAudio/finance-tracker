import { createRouter, createWebHistory } from "vue-router";
import Charts from "../Charts/ChartsPage.vue";
import HomePage from "../Pages/HomePage.vue";

const routes = [
  { path: "/", component: HomePage },
  { path: "/charts", component: Charts },
];

const router = createRouter({
  history: createWebHistory(), // Use the history mode
  routes,
});

export default router;
