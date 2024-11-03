import { createRouter, createWebHistory } from "vue-router";
import Charts from "../Pages/ChartsPage.vue";
import HomePage from "../Pages/HomePage.vue";
import UploadPage from "../Pages/UploadPage.vue";
import MappingPage from "../Pages/MappingPage.vue";

const routes = [
  { path: "/", component: HomePage },
  { path: "/charts", component: Charts },
  { path: "/upload", component: UploadPage },
  { path: "/mapper", component: MappingPage },
];

const router = createRouter({
  history: createWebHistory(), // Use the history mode
  routes,
});

export default router;
