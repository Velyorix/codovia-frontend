import { createRouter, createWebHistory } from 'vue-router';
import HomePage from "../views/HomePage.vue";
import MaintenancePage from "../views/MaintenancePage.vue";
import LoginPage from "../views/LoginPage.vue";
import RegisterPage from "../views/RegisterPage.vue";
import ResetPasswordPage from "../views/ResetPasswordPage.vue";
import RequestPasswordReset from "../views/RequestPasswordReset.vue";
import ProfilePage from "../views/ProfilePage.vue";
import PublicProfilePage from "../views/PublicProfilePage.vue";
import ExplorerPage from "../views/ExplorerPage.vue";

const routes = [
    { path: '/', name: 'Home', component: HomePage },
    { path: '/login', name: 'LoginPage', component: LoginPage },
    { path: '/register', name: 'RegisterPage', component: RegisterPage },
    { path: '/reset-password', name: 'RequestPasswordReset', component: RequestPasswordReset },
    { path: '/reset-password/update', name: 'ResetPasswordPage', component: ResetPasswordPage },
    { path: '/maintenance', name: 'Maintenance', component: MaintenancePage },
    { path: "/profile", component: ProfilePage, meta: { requiresAuth: true } },
    { path: "/users/:username", component: PublicProfilePage },
    { path: "/explorer", component: ExplorerPage },
    {
        path: "/articles/:id", // ou /articles/:name
        name: "ArticleDetails",
        component: () => import("../views/ArticlePage.vue"),
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const isMaintenance = import.meta.env.VITE_MAINTENANCE_MODE === 'true';

    if (isMaintenance && to.path !== '/maintenance') {
        return next('/maintenance');
    }

    next();
});

export default router;
