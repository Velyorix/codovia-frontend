const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

    // Assurez-vous que les données contiennent bien le tableau d'articles
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

export const updateArticleStatus = async (id, status) => {
    const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error("Erreur lors de la mise à jour de l'article.");
};

export const removeArticle = async (id) => {
    const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    if (!response.ok) throw new Error("Erreur lors de la suppression de l'article.");
};