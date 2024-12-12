import {defineStore} from "pinia";
import {computed, ref} from "vue";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface User {
    id: number;
    name: string;
    email: string;
    role: "admin" | "editor" | "user";
    bio?: string;
    avatar_url?: string;
    created_at: string;
}

export const useAuthStore = defineStore("auth", () => {
    const user = ref<User | null>(null);
    const token = ref(localStorage.getItem("token") || "");
    const refreshToken = ref(localStorage.getItem("refreshToken") || "");
    const errorMessage = ref<string | null>(null);

    const isAuthenticated = computed(() => !!token.value);

    const setErrorMessage = (message: string): void => {
        errorMessage.value = message;
        setTimeout(() => (errorMessage.value = null), 5000);
    };

    const updateProfile = async (profileData: Partial<User>): Promise<string> => {
        const response = await fetch(`${API_BASE_URL}/profile/update`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token.value}`,
            },
            body: JSON.stringify(profileData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Erreur lors de la mise à jour du profil.");
        }

        const data = await response.json();
        user.value = { ...user.value, ...profileData };
        return data.message;
    };

    const login = async (email: string, password: string): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Erreur lors de la connexion.");
        }

        const data = await response.json();
        token.value = data.token;
        refreshToken.value = data.refresh_token || "";
        localStorage.setItem("token", token.value);
        if (data.refresh_token) {
            localStorage.setItem("refreshToken", refreshToken.value);
        }
        await fetchUser();
    };

    const register = async (
        name: string,
        email: string,
        password: string,
        passwordConfirmation: string
    ): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name,
                email,
                password,
                password_confirmation: passwordConfirmation,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Erreur lors de l'inscription.");
        }

        const data = await response.json();
        token.value = data.token;
        refreshToken.value = data.refresh_token || "";

        localStorage.setItem("token", token.value);
        if (data.refresh_token) {
            localStorage.setItem("refreshToken", refreshToken.value);
        }

        await fetchUser();
    };

    const fetchUser = async (): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/user/details`, {
            headers: { Authorization: `Bearer ${token.value}` },
        });

        if (response.ok) {
            const data = await response.json();
            user.value = data.data;
            console.log("User fetched:", user.value);
        } else {
            logout();
        }
    };

    const refreshAuthToken = async () => {
        if (!refreshToken.value) return logout();

        const response = await fetch(`${API_BASE_URL}/token/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh_token: refreshToken.value }),
        });

        if (!response.ok) {
            logout();
            throw new Error("Échec du rafraîchissement du token.");
        }

        const data = await response.json();
        token.value = data.token;
        localStorage.setItem("token", token.value);
    };

    const resetPassword = async (
        email: string,
        tokenParam: string,
        password: string,
        passwordConfirmation: string
    ) => {
        const response = await fetch(`${API_BASE_URL}/password/update`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email,
                token: tokenParam,
                password,
                password_confirmation: passwordConfirmation,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Erreur lors de la réinitialisation.");
        }
    };

    const logout = (): void => {
        token.value = "";
        refreshToken.value = "";
        user.value = null;
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
    };

    const hasRole = (roles: "admin" | "editor" | ("admin" | "editor")[]): boolean => {
        if (!user.value?.role) return false;
        const roleList = Array.isArray(roles) ? roles : [roles];
        return roleList.includes(user.value.role);
    };

    if (token.value) fetchUser();

    return { user, token, refreshToken, isAuthenticated, login, register, resetPassword, logout, updateProfile, hasRole, fetchUser, setErrorMessage, errorMessage };
});
