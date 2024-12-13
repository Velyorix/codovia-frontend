const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const getArticleById = async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });

    if (!response.ok) throw new Error("Erreur lors de la récupération de l'article.");
    return await response.json();
};

export const getAdminStats = async () => {
    const response = await fetch(`${API_BASE_URL}/admin/stats`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    if (!response.ok) throw new Error("Erreur lors de la récupération des statistiques.");
    const data = await response.json();
    if (!data) throw new Error("Les statistiques sont vides.");
    return data;
};

export const getArticlesUnderReview = async () => {
    const response = await fetch(`${API_BASE_URL}/admin/articles/under_review`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    if (!response.ok) throw new Error("Erreur lors de la récupération des articles en revue.");

    const data = await response.json();
    console.log("Articles en revue API Response:", data);

    if (!data || !data.data || !data.data.data || !Array.isArray(data.data.data)) {
        console.error("Format attendu: { data: { data: [ { id, title, user, created_at } ] } }");
        throw new Error("Format incorrect des articles en revue.");
    }

    const articles = data.data.data;
    articles.forEach((article, index) => {
        console.log(`Article ${index}:`, article);
    });

    return articles;
};

export const getArticles = async (page = 1) => {
    const response = await fetch(`${API_BASE_URL}/articles?page=${page}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
    if (!response.ok) throw new Error("Erreur lors de la récupération des articles.");
    return await response.json();
};

export const updateArticleStatus = async (id, status) => {
    const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error("Erreur lors de la mise à jour du statut.");
};

export const deleteArticle = async (id) => {
    const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
    if (!response.ok) throw new Error("Erreur lors de la suppression de l'article.");
};

export const acceptArticle = async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/articles/${id}/accept`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
    if (!response.ok) throw new Error(await response.json());
    return (await response.json()).message;
};

export const rejectArticle = async (id: number, reason: string) => {
    const response = await fetch(`${API_BASE_URL}/articles/${id}/reject`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, reason }),
    });
    if (!response.ok) throw new Error(await response.json());
    return (await response.json()).message;
};

export const updateArticle = async (article: { id: number; title: string; content: string; status: string }) => {
    const response = await fetch(`${API_BASE_URL}/articles/${article.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
            title: article.title,
            content: article.content,
            status: article.status,
        }),
    });

    if (!response.ok) throw new Error("Erreur lors de la mise à jour de l'article.");
    return await response.json();
};

export const getCategories = async () => {
    const response = await fetch(`${API_BASE_URL}/categories`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });

    if (!response.ok) throw new Error("Erreur lors de la récupération des catégories.");
    return await response.json();
};

export const createCategory = async ({ name, description, parent_id }: { name: string; description: string; parent_id: number | null }) => {
    const response = await fetch(`${API_BASE_URL}/categories`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ name, description, parent_id }),
    });

    if (!response.ok) {
        console.error("Erreur backend : ", await response.text());
        throw new Error("Erreur lors de la création de la catégorie.");
    }

    return await response.json();
};

export const updateCategory = async ({
                                         id,
                                         name,
                                         description,
                                         parent_id,
                                     }: {
    id: number;
    name: string;
    description: string;
    parent_id: number | null;
}) => {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, description, parent_id }),
    });

    if (!response.ok) {
        console.error("Erreur backend : ", await response.text());
        throw new Error("Erreur lors de la mise à jour de la catégorie.");
    }

    return await response.json();
};

export const deleteCategory = async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });

    if (!response.ok) throw new Error("Erreur lors de la suppression de la catégorie.");
};

export const getTags = async () => {
    const response = await fetch(`${API_BASE_URL}/tags`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
    if (!response.ok) throw new Error("Erreur lors de la récupération des tags.");
    return await response.json();
};

export const createTag = async ({ name, description }: { name: string; description: string }) => {
    const response = await fetch(`${API_BASE_URL}/tags`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ name, description }),
    });
    if (!response.ok) throw new Error("Erreur lors de la création du tag.");
    return await response.json();
};

export const updateTag = async ({ id, name, description }: { id: number; name: string; description: string }) => {
    const response = await fetch(`${API_BASE_URL}/tags/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ name, description }),
    });
    if (!response.ok) throw new Error("Erreur lors de la mise à jour du tag.");
    return await response.json();
};

export const deleteTag = async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/tags/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
    if (!response.ok) throw new Error("Erreur lors de la suppression du tag.");
};
