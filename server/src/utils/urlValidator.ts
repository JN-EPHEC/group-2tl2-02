// Valide les URLs de vidéos externes
export const isValidVideoUrl = (url: string): boolean => {
    if (!url || typeof url !== 'string') return false;
    
    try {
        const urlObj = new URL(url);
        const hostname = urlObj.hostname.toLowerCase();
        
        // Accepter YouTube, Vimeo, et autres URLs HTTPS valides
        const allowedDomains = ['youtube.com', 'youtu.be', 'vimeo.com', 'dailymotion.com'];
        const isAllowed = allowedDomains.some(domain => hostname.includes(domain));
        
        // Si ce n'est pas un domaine connu, accepter quand même les HTTPS valides
        return urlObj.protocol === 'https:' || isAllowed;
    } catch {
        return false;
    }
};
