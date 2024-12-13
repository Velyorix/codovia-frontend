import { reactive } from "vue";

const toasts = reactive([]);

export const useToast = () => {
    const addToast = (message, type = "bg-blue-500") => {
        const id = Date.now();
        toasts.push({ id, message, type });

        setTimeout(() => {
            const index = toasts.findIndex((t) => t.id === id);
            if (index !== -1) toasts.splice(index, 1);
        }, 3000);
    };

    return {
        toasts,
        success: (msg) => addToast(msg, "bg-green-500"),
        error: (msg) => addToast(msg, "bg-red-500"),
    };
};
