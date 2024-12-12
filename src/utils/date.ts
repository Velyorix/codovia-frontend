/**
 * @param date
 * @returns
 */
export const formatDate = (date: string | null): string => {
    if (!date) return "Date inconnue";
    const parsedDate = new Date(date);
    return isNaN(parsedDate.getTime()) ? "Date invalide" : parsedDate.toLocaleDateString();
};