# 🚀 Guide de Déploiement Heroku - Portfolio Pascal Eloumou

## 📋 Prérequis

- ✅ Compte GitHub (aurelehawk)
- ✅ Repository GitHub créé (pascal-eloumou-portfolio)
- ✅ Code poussé sur GitHub
- 🔲 Compte Heroku (à créer)

## 🎯 Étape 1 : Créer un Compte Heroku

1. **Aller sur Heroku**
   - Visitez [https://heroku.com](https://heroku.com)
   - Cliquez sur "Sign up"

2. **Remplir le formulaire**
   - First name: Pascal
   - Last name: Eloumou
   - Email: eloumou86@gmail.com
   - Role: Student
   - Country: France
   - Primary development language: JavaScript

3. **Vérifier l'email**
   - Consultez votre boîte mail eloumou86@gmail.com
   - Cliquez sur le lien de vérification
   - Créez un mot de passe sécurisé

## 🏗️ Étape 2 : Créer une Nouvelle Application

1. **Dashboard Heroku**
   - Connectez-vous à votre compte Heroku
   - Cliquez sur "New" → "Create new app"

2. **Configuration de l'app**
   - **App name**: `pascal-eloumou-portfolio` (ou similaire si pris)
   - **Region**: Europe
   - Cliquez sur "Create app"

## 🔗 Étape 3 : Connecter GitHub

1. **Onglet Deploy**
   - Dans votre app Heroku, allez à l'onglet "Deploy"
   - Section "Deployment method"
   - Cliquez sur "GitHub"

2. **Autoriser Heroku**
   - Cliquez sur "Connect to GitHub"
   - Autorisez Heroku à accéder à votre GitHub
   - Entrez votre mot de passe GitHub si demandé

3. **Sélectionner le Repository**
   - Dans "Connect to GitHub", tapez: `pascal-eloumou-portfolio`
   - Cliquez sur "Search"
   - Cliquez sur "Connect" à côté de votre repository

## ⚙️ Étape 4 : Configuration du Déploiement

1. **Déploiement Automatique (Recommandé)**
   - Section "Automatic deploys"
   - Sélectionnez la branche "main"
   - Cochez "Wait for CI to pass before deploy" (si vous avez des tests)
   - Cliquez sur "Enable Automatic Deploys"

2. **Premier Déploiement Manuel**
   - Section "Manual deploy"
   - Sélectionnez la branche "main"
   - Cliquez sur "Deploy Branch"

## 📱 Étape 5 : Vérification du Déploiement

1. **Attendre le Build**
   - Le processus prend 1-3 minutes
   - Vous verrez les logs en temps réel
   - Attendez le message "Your app was successfully deployed"

2. **Tester l'Application**
   - Cliquez sur "View" ou "Open app"
   - Votre portfolio s'ouvre dans un nouvel onglet
   - URL type: `https://pascal-eloumou-portfolio.herokuapp.com`

## 🔧 Configuration Avancée (Optionnel)

### Variables d'Environnement
Si nécessaire, dans l'onglet "Settings" → "Config Vars":
```
NODE_ENV=production
```

### Domaine Personnalisé
Dans l'onglet "Settings" → "Domains":
- Ajoutez votre domaine personnalisé si vous en avez un

## 🚨 Résolution de Problèmes

### Erreur de Build
```bash
# Si erreur avec package.json
"engines": {
  "node": "18.x",
  "npm": "9.x"
}
```

### Erreur de Port
```javascript
// Dans server.js, vérifiez:
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

### Erreur de Fichiers Statiques
```javascript
// Dans server.js, vérifiez:
app.use(express.static('.'));
```

## 📊 Monitoring

1. **Logs en Temps Réel**
   - Onglet "More" → "View logs"
   - Ou utilisez Heroku CLI: `heroku logs --tail`

2. **Métriques**
   - Onglet "Metrics" pour voir les performances
   - Temps de réponse, throughput, erreurs

## 🔄 Mises à Jour

### Déploiement Automatique Activé
1. Modifiez votre code localement
2. Commitez et poussez sur GitHub:
   ```bash
   git add .
   git commit -m "Mise à jour du portfolio"
   git push origin main
   ```
3. Heroku déploie automatiquement

### Déploiement Manuel
1. Allez dans l'onglet "Deploy" de votre app Heroku
2. Cliquez sur "Deploy Branch" dans la section "Manual deploy"

## 🎉 Félicitations !

Votre portfolio est maintenant en ligne et accessible au monde entier !

**URL de votre portfolio**: `https://[nom-de-votre-app].herokuapp.com`

## 📞 Support

- **Documentation Heroku**: [https://devcenter.heroku.com](https://devcenter.heroku.com)
- **Support Heroku**: [https://help.heroku.com](https://help.heroku.com)
- **GitHub Issues**: Créez une issue dans votre repository pour les bugs

---
*Guide créé pour Pascal Aurele Eloumou - Portfolio Deployment*