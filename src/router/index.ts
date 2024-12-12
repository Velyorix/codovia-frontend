import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from "../stores/auth";


const routes = [
    { path: '/', name: 'Home', component: () => import("../views/HomePage.vue") },
    { path: '/login', name: 'LoginPage', component: () => import("../views/LoginPage.vue") },
    { path: '/register', name: 'RegisterPage', component: () => import("../views/RegisterPage.vue") },
    { path: '/reset-password', name: 'RequestPasswordReset', component: () => import("../views/RequestPasswordReset.vue") },
    { path: '/reset-password/update', name: 'ResetPasswordPage', component: () => import("../views/ResetPasswordPage.vue") },
    { path: '/maintenance', name: 'Maintenance', component: () => import("../views/MaintenancePage.vue") },
    { path: "/profile", component: () => import("../views/ProfilePage.vue"), meta: { requiresAuth: true } },
    { path: "/users/:username", component: () => import("../views/PublicProfilePage.vue") },
    { path: "/explorer", component: () => import("../views/ExplorerPage.vue") },
    {
        path: "/articles/:id",
        name: "ArticleDetails",
        component: () => import("../views/ArticlePage.vue"),
    },
    {
        path: "/editor",
        name: "EditorDashboard",
        component: () => import("../views/EditorDashboard.vue"),
        meta: { requiresAuth: true, requiresRole: ["editor", "admin"] },
    },
    {
        path: "/admin",
        name: "AdminDashboard",
        component: () => import("../views/AdminDashboard.vue"),
        meta: { requiresAuth: true, requiresRole: "admin" },
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to, from, next) => {
    const isMaintenance = import.meta.env.VITE_MAINTENANCE_MODE === "true";

    if (isMaintenance && to.path !== "/maintenance") {
        return next("/maintenance");
    }

    const authStore = useAuthStore();

    if (!authStore.user && authStore.token) {
        await authStore.fetchUser();
    }

    const requiresAuth = to.meta.requiresAuth as boolean | undefined;
    const requiresRole = to.meta.requiresRole as string | string[] | undefined;

    if (requiresAuth && !authStore.isAuthenticated) {
        authStore.setErrorMessage("Vous devez être connecté pour accéder à cette page.");
        return next("/login");
    }

    if (requiresRole) {
        const allowedRoles = Array.isArray(requiresRole) ? requiresRole : [requiresRole];
        if (!authStore.hasRole(allowedRoles)) {
            authStore.setErrorMessage("Vous n'avez pas les permissions nécessaires pour accéder à cette page.");
            return next("/");
        }
    }

    next();
});

export default router;
