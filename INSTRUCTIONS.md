# Instructions pour personnaliser votre CV

## 📋 Comment utiliser le système de saisie de données

### Étape 1: Accéder au formulaire de saisie
1. Ouvrez votre navigateur
2. Allez à l'adresse: `http://localhost:8000/data-entry.html`
3. Vous verrez un formulaire élégant pour saisir vos informations

### Étape 2: Remplir vos informations
Remplissez tous les champs du formulaire:

#### Informations personnelles
- **Prénom** et **Nom** (pré-remplis avec Pascal Aurèle Eloumou)
- **Titre professionnel** (ex: Développeur Full Stack, Ingénieur Logiciel)
- **Email** et **Téléphone**
- **Localisation** (Ville, Pays)
- **LinkedIn** (URL complète)

#### À propos
- **Description professionnelle**: Un résumé de votre profil, compétences et objectifs

#### Expérience professionnelle
Format pour chaque expérience (une par ligne):
```
Poste | Entreprise | Période | Description
```
Exemple:
```
Développeur Senior | TechCorp | 2020-2023 | Développement d'applications web avec React et Node.js
Développeur Junior | StartupXYZ | 2018-2020 | Création de sites web responsives et APIs REST
```

#### Formation
Format pour chaque formation (une par ligne):
```
Diplôme | École | Année
```
Exemple:
```
Master Informatique | Université de Paris | 2018
Licence Informatique | Université de Lyon | 2016
```

#### Compétences
Listez vos compétences séparées par des virgules:
```
JavaScript, Python, React, Node.js, SQL, Git, Docker, AWS
```

### Étape 3: Sauvegarder et appliquer
1. Cliquez sur **"Générer mon CV"**
2. Vos données sont automatiquement sauvegardées
3. Vous serez redirigé vers votre CV mis à jour

### Étape 4: Vérifier le résultat
1. Allez à `http://localhost:8000/` pour voir votre CV personnalisé
2. Toutes vos informations devraient maintenant apparaître

## 🔄 Modifier vos informations

Pour modifier vos informations:
1. Retournez sur `http://localhost:8000/data-entry.html`
2. Le formulaire se remplira automatiquement avec vos données précédentes
3. Modifiez ce que vous voulez
4. Cliquez à nouveau sur "Générer mon CV"

## 📱 Fonctionnalités du CV

Votre CV inclut:
- ✅ Design moderne et responsive
- ✅ Animations fluides
- ✅ Système de partage (email, réseaux sociaux)
- ✅ Bouton de téléchargement PDF
- ✅ Formulaire de contact fonctionnel
- ✅ Mode sombre automatique
- ✅ Optimisé pour mobile et desktop

## 🚀 Déploiement

Pour partager votre CV en ligne:
1. Utilisez des services comme Netlify, Vercel, ou GitHub Pages
2. Uploadez tous les fichiers du dossier `site`
3. Votre CV sera accessible via une URL publique

## 🛠️ Personnalisation avancée

Pour des modifications plus poussées:
- **Couleurs**: Modifiez les variables CSS dans `styles.css`
- **Contenu**: Éditez directement `index.html`
- **Fonctionnalités**: Ajoutez du code dans `script.js`

## 📞 Support

Si vous rencontrez des problèmes:
1. Vérifiez que le serveur local fonctionne (`python -m http.server 8000`)
2. Ouvrez la console du navigateur (F12) pour voir les erreurs
3. Assurez-vous que JavaScript est activé dans votre navigateur

---

**Bon CV ! 🎉**