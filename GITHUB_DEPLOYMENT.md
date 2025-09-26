# Déploiement du Portfolio sur GitHub Pages

## Vue d'ensemble

Ce guide vous explique comment déployer votre portfolio avec l'interface d'administration sur GitHub Pages en utilisant votre repository existant `https://github.com/aurelehawk`.

## Prérequis

- Compte GitHub actif
- Repository GitHub existant : `https://github.com/aurelehawk`
- Git installé sur votre machine
- Portfolio développé localement

## Étapes de Déploiement

### 1. Préparation du Repository

#### Cloner le repository existant
```bash
git clone https://github.com/aurelehawk/aurelehawk.github.io.git
cd aurelehawk.github.io
```

#### Ou initialiser un nouveau repository
```bash
git init
git remote add origin https://github.com/aurelehawk/portfolio.git
```

### 2. Structure des Fichiers pour GitHub Pages

#### Fichiers à inclure dans le repository :
```
/
├── index.html              # Page principale du portfolio
├── admin.html              # Interface d'administration
├── styles.css              # Styles CSS
├── script.js               # Scripts JavaScript principaux
├── admin.js                # Logique d'administration
├── portfolio-loader.js     # Chargement dynamique
├── upload-handler.js       # Gestion des uploads
├── preview-system.js       # Système de prévisualisation
├── update-cv.js           # Scripts de mise à jour CV
├── data/
│   ├── portfolio-data.json # Données du portfolio
│   └── PP.jpeg            # Photo de profil
├── robots.txt             # Configuration SEO
├── sitemap.xml            # Plan du site
└── README.md              # Documentation
```

### 3. Configuration GitHub Pages

#### Option 1 : Repository Principal (recommandé)
1. Créer un repository nommé `aurelehawk.github.io`
2. Pousser tous les fichiers dans la branche `main`
3. Le site sera accessible à : `https://aurelehawk.github.io`

#### Option 2 : Repository de Projet
1. Utiliser un repository existant ou en créer un nouveau
2. Activer GitHub Pages dans Settings > Pages
3. Sélectionner la branche `main` comme source
4. Le site sera accessible à : `https://aurelehawk.github.io/nom-du-repo`

### 4. Commandes Git pour le Déploiement

#### Première fois
```bash
# Ajouter tous les fichiers
git add .

# Commit initial
git commit -m "Initial portfolio deployment with admin interface"

# Pousser vers GitHub
git push -u origin main
```

#### Mises à jour ultérieures
```bash
# Ajouter les modifications
git add .

# Commit avec message descriptif
git commit -m "Update portfolio content via admin interface"

# Pousser les changements
git push origin main
```

### 5. Configuration Spécifique pour l'Administration

#### Sécurité de l'Interface Admin

**⚠️ IMPORTANT :** L'interface d'administration sera publiquement accessible. Pour la sécurité :

1. **Changer les identifiants par défaut** dans `admin.js` :
```javascript
// Remplacer les identifiants par défaut
const ADMIN_CREDENTIALS = {
    username: 'votre_nom_utilisateur',
    password: 'votre_mot_de_passe_securise'
};
```

2. **Considérer un sous-domaine privé** :
   - Créer un repository privé pour l'admin
   - Utiliser GitHub Actions pour synchroniser

#### Adaptation des Chemins

Si vous utilisez un repository de projet (pas `username.github.io`), modifier les chemins dans les fichiers :

```javascript
// Dans portfolio-loader.js et admin.js
const BASE_PATH = '/nom-du-repository'; // Ajouter le nom du repo
const DATA_URL = `${BASE_PATH}/data/portfolio-data.json`;
```

### 6. Automatisation avec GitHub Actions

#### Créer `.github/workflows/deploy.yml` :
```yaml
name: Deploy Portfolio

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./
```

### 7. Gestion des Données

#### Stockage des Données
- Les données sont stockées dans `data/portfolio-data.json`
- Les modifications via l'admin sont sauvegardées localement
- Pour synchroniser : exporter depuis l'admin et commiter le JSON

#### Workflow de Mise à Jour
1. Modifier le contenu via l'interface admin locale
2. Exporter les données depuis l'admin
3. Remplacer `data/portfolio-data.json`
4. Commiter et pousser les changements

### 8. URLs d'Accès

#### Site Principal
- Repository principal : `https://aurelehawk.github.io`
- Repository de projet : `https://aurelehawk.github.io/nom-du-repo`

#### Interface d'Administration
- Repository principal : `https://aurelehawk.github.io/admin.html`
- Repository de projet : `https://aurelehawk.github.io/nom-du-repo/admin.html`

### 9. Optimisations pour la Production

#### Performance
- Minifier les fichiers CSS et JavaScript
- Optimiser les images
- Activer la compression GZIP

#### SEO
- Vérifier que `robots.txt` et `sitemap.xml` sont corrects
- Tester les meta tags avec les outils de développement
- Valider le markup HTML

### 10. Monitoring et Analytics

#### Google Analytics
Ajouter le code de suivi dans `index.html` :
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

#### GitHub Pages Analytics
- Utiliser les insights du repository
- Monitorer le trafic et les performances

### 11. Dépannage

#### Problèmes Courants

**Le site ne se charge pas :**
- Vérifier que GitHub Pages est activé
- Attendre 5-10 minutes après le push
- Vérifier les erreurs dans Actions

**L'admin ne fonctionne pas :**
- Vérifier les chemins des fichiers JavaScript
- Tester en local d'abord
- Vérifier la console pour les erreurs

**Les données ne se sauvegardent pas :**
- GitHub Pages est statique, pas de sauvegarde serveur
- Utiliser localStorage pour les tests
- Implémenter un système de synchronisation

### 12. Commandes Rapides

#### Script de Déploiement
Créer `deploy.sh` :
```bash
#!/bin/bash
echo "Déploiement du portfolio..."
git add .
git commit -m "Update portfolio - $(date)"
git push origin main
echo "Déploiement terminé !"
echo "Site accessible à : https://aurelehawk.github.io"
```

#### Utilisation
```bash
chmod +x deploy.sh
./deploy.sh
```

## Résumé

1. ✅ Préparer les fichiers du portfolio
2. ✅ Configurer le repository GitHub
3. ✅ Activer GitHub Pages
4. ✅ Sécuriser l'interface d'administration
5. ✅ Tester le déploiement
6. ✅ Configurer le monitoring
7. ✅ Automatiser les mises à jour

**URL finale :** `https://aurelehawk.github.io`  
**Admin :** `https://aurelehawk.github.io/admin.html`

---

**Note :** GitHub Pages est gratuit pour les repositories publics et offre un excellent hébergement pour les portfolios statiques avec une interface d'administration côté client.