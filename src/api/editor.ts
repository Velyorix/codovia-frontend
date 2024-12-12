export const getEditorStats = async () => {
    const response = await fetch(`${API_BASE_URL}/editor/stats`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    if (!response.ok) throw new Error("Erreur lors de la récupération des statistiques.");
    return await response.json();
};

export const getEditorArticles = async () => {
    const response = await fetch(`${API_BASE_URL}/articles`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    if (!response.ok) throw new Error("Erreur lors de la récupération des articles.");
    return await response.json();
};
