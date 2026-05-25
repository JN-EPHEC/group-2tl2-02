# Documentation - Gestion des Vidéos (Approche 4)

## Structure de la Table `video`

```typescript
{
  VId: number;              // ID unique
  type: 'link' | 'local';   // Type: lien externe ou fichier local
  lien: string | null;      // URL de la vidéo externe (YouTube, Vimeo, etc.)
  mp4: string | null;       // Chemin local du fichier mp4 uploadé (futur)
  titre: string;            // Titre/description de la vidéo
}
```

## 2 Cas d'Utilisation Actuels

### **Cas 1 : Ajouter un lien de vidéo externe**

```bash
curl -X POST http://localhost:3000/api/users/NewProject \
  -F "title=Mon Projet" \
  -F "description=Description..." \
  -F "difficulty=Facile" \
  -F "duration=30" \
  -F "date=2024-05-25" \
  -F "isPublic=true" \
  -F "image=@/chemin/vers/image.jpg" \
  -F "videoLink=https://www.youtube.com/embed/dQw4w9WgXcQ" \
  -F "videoTitle=Ma Vidéo YouTube"
```

**Réponse:**
```json
{
  "type": "link",
  "lien": "https://www.youtube.com/embed/dQw4w9WgXcQ",
  "titre": "Ma Vidéo YouTube",
  "mp4": null
}
```

### **Cas 2 : Utiliser une vidéo existante**

```bash
curl -X POST http://localhost:3000/api/users/NewProject \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mon Projet",
    "description": "Description...",
    "difficulty": "Facile",
    "duration": 30,
    "date": "2024-05-25",
    "isPublic": true,
    "VId": 5
  }'
```

## Formats de Vidéos Acceptés

- **Liens:** YouTube, Vimeo, Dailymotion, HTTPS génériques
- **Taille maximale pour upload futur:** 100 MB

## Attributs Retournés

Lors de la récupération d'un projet:

```json
{
  "video": [
    {
      "VId": 1,
      "type": "link",
      "mp4": null,
      "lien": "https://www.youtube.com/embed/dQw4w9WgXcQ",
      "titre": "Mon Vidéo YouTube"
    }
  ]
}
```

## Exemple en Front-End (JavaScript/TypeScript)

```typescript
// Ajouter un lien externe
const formData = new FormData();
formData.append('title', 'Mon Projet');
formData.append('description', 'Description...');
formData.append('difficulty', 'Facile');
formData.append('duration', '30');
formData.append('date', '2024-05-25');
formData.append('isPublic', 'true');
formData.append('image', imageFile); // File object
formData.append('videoLink', 'https://www.youtube.com/embed/dQw4w9WgXcQ');
formData.append('videoTitle', 'Ma Vidéo YouTube');

const response = await fetch('/api/users/NewProject', {
  method: 'POST',
  body: formData
});

// Ou avec ID vidéo existante
const response = await fetch('/api/users/NewProject', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Mon Projet',
    description: 'Description...',
    difficulty: 'Facile',
    duration: 30,
    date: '2024-05-25',
    isPublic: true,
    VId: 5
  })
});
```

## Validation des URLs

- Les URLs HTTPS valides sont acceptées
- Validation supplémentaire pour YouTube, Vimeo, Dailymotion
- Erreur 400 si l'URL n'est pas valide

## Notes

- **Image du projet:** Via le champ `image` (multipart/form-data)
- **Vidéo du projet:** Via `videoLink` + `videoTitle` (URL validée)
- **Upload local de vidéo:** À développer dans une prochaine version
