// Valide les URLs de vidéos externes ou liens de projet
export const isValidVideoUrl = (url: string): boolean => {
    if (!url || typeof url !== 'string') return false;
    
    try {
        const urlObj = new URL(url);
        return urlObj.protocol === 'https:' || urlObj.protocol === 'http:';
    } catch {
        return false;
    }
};
