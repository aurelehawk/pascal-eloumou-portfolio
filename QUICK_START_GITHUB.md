# 🚀 Guide de Démarrage Rapide - GitHub Pages

## Déploiement en 5 Minutes

### Étape 1 : Préparation GitHub

1. **Aller sur GitHub** : https://github.com/aurelehawk
2. **Créer un nouveau repository** :
   - Nom : `aurelehawk.github.io` (recommandé) ou `portfolio`
   - Public ✅
   - Ne pas initialiser avec README (on a déjà les fichiers)

### Étape 2 : Configuration Locale

1. **Ouvrir PowerShell** dans le dossier du projet :
   ```powershell
   cd "d:\Documents\site"
   ```

2. **Initialiser Git** (si pas déjà fait) :
   ```bash
   git init
   git branch -M main
   ```

3. **Configurer Git** (première fois seulement) :
   ```bash
   git config --global user.name "Votre Nom"
   git config --global user.email "votre.email@example.com"
   ```

4. **Ajouter le repository distant** :
   ```bash
   # Pour repository principal (recommandé)
   git remote add origin https://github.com/aurelehawk/aurelehawk.github.io.git
   
   # OU pour repository de projet
   git remote add origin https://github.com/aurelehawk/portfolio.git
   ```

### Étape 3 : Déploiement Automatique

**Option A : Script Automatique** ⭐
```powershell
.\deploy.bat
```

**Option B : Commandes Manuelles**
```bash
git add .
git commit -m "Initial portfolio deployment"
git push -u origin main
```

### Étape 4 : Activation GitHub Pages

1. **Aller dans Settings** du repository
2. **Scroll vers Pages** (menu gauche)
3. **Source** : Deploy from a branch
4. **Branch** : main / (root)
5. **Save** ✅

### Étape 5 : Accès au Site

**Attendre 5-10 minutes**, puis :
- **Site principal** : https://aurelehawk.github.io
- **Administration** : https://aurelehawk.github.io/admin.html

---

## 🔧 Configuration Rapide Admin

### Sécuriser l'Interface Admin

1. **Modifier les identifiants** dans `admin.js` :
   ```javascript
   // Ligne ~15
   if (username === 'VOTRE_NOUVEAU_LOGIN' && password === 'VOTRE_NOUVEAU_MDP') {
   ```

2. **Recommit après modification** :
   ```bash
   git add admin.js
   git commit -m "Update admin credentials"
   git push
   ```

---

## 📱 URLs Finales

| Service | URL |
|---------|-----|
| **Portfolio** | https://aurelehawk.github.io |
| **Admin** | https://aurelehawk.github.io/admin.html |
| **Repository** | https://github.com/aurelehawk/aurelehawk.github.io |

---

## 🆘 Dépannage Express

### Problème : "Repository not found"
```bash
git remote -v  # Vérifier l'URL
git remote set-url origin https://github.com/aurelehawk/CORRECT-REPO.git
```

### Problème : "Permission denied"
- Vérifier les identifiants GitHub
- Utiliser un token personnel si nécessaire

### Problème : "Site not loading"
- Attendre 10 minutes
- Vérifier GitHub Pages dans Settings
- Vérifier Actions (onglet du repository)

### Problème : "Admin not working"
- Vérifier la console (F12)
- Tester en local d'abord
- Vérifier les chemins des fichiers JS

---

## 🔄 Workflow de Mise à Jour

1. **Modifier via l'admin local** : http://localhost:8000/admin.html
2. **Exporter les données** depuis l'interface admin
3. **Remplacer** `data/portfolio-data.json`
4. **Déployer** : `./deploy.bat`
5. **Vérifier** : https://aurelehawk.github.io

---

## ✅ Checklist de Déploiement

- [ ] Repository créé sur GitHub
- [ ] Git configuré localement
- [ ] Remote origin ajouté
- [ ] Fichiers commitées et pushées
- [ ] GitHub Pages activé
- [ ] Site accessible
- [ ] Admin accessible et sécurisé
- [ ] Données de test chargées
- [ ] SEO configuré (robots.txt, sitemap.xml)

---

**🎉 Félicitations ! Votre portfolio est maintenant en ligne avec une interface d'administration complète !**