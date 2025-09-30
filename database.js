// Système de base de données simple avec localStorage
class PortfolioDatabase {
    constructor() {
        this.dbName = 'portfolioDB';
        this.initDatabase();
    }

    // Initialiser la base de données
    initDatabase() {
        if (!localStorage.getItem(this.dbName)) {
            const initialData = {
                visitors: {
                    total: 0,
                    daily: {},
                    monthly: {},
                    countries: {},
                    browsers: {},
                    lastVisit: null
                },
                admin: {
                    username: 'admin',
                    password: this.hashPassword('admin123'), // Mot de passe par défaut
                    lastLogin: null,
                    loginAttempts: 0
                },
                content: {
                    profile: {},
                    experiences: [],
                    education: [],
                    skills: {},
                    projects: [],
                    seo: {}
                },
                settings: {
                    maintenanceMode: false,
                    analyticsEnabled: true,
                    backupEnabled: true
                }
            };
            localStorage.setItem(this.dbName, JSON.stringify(initialData));
        }
    }

    // Hash simple du mot de passe (pour la démo)
    hashPassword(password) {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString();
    }

    // Obtenir toutes les données
    getData() {
        return JSON.parse(localStorage.getItem(this.dbName));
    }

    // Sauvegarder les données
    saveData(data) {
        localStorage.setItem(this.dbName, JSON.stringify(data));
    }

    // Enregistrer une visite
    recordVisit() {
        const data = this.getData();
        const now = new Date();
        const today = now.toISOString().split('T')[0];
        const month = now.toISOString().substring(0, 7);

        // Incrémenter le total
        data.visitors.total++;

        // Compteur quotidien
        if (!data.visitors.daily[today]) {
            data.visitors.daily[today] = 0;
        }
        data.visitors.daily[today]++;

        // Compteur mensuel
        if (!data.visitors.monthly[month]) {
            data.visitors.monthly[month] = 0;
        }
        data.visitors.monthly[month]++;

        // Détecter le navigateur
        const browser = this.detectBrowser();
        if (!data.visitors.browsers[browser]) {
            data.visitors.browsers[browser] = 0;
        }
        data.visitors.browsers[browser]++;

        // Dernière visite
        data.visitors.lastVisit = now.toISOString();

        this.saveData(data);
        return data.visitors;
    }

    // Détecter le navigateur
    detectBrowser() {
        const userAgent = navigator.userAgent;
        if (userAgent.includes('Chrome')) return 'Chrome';
        if (userAgent.includes('Firefox')) return 'Firefox';
        if (userAgent.includes('Safari')) return 'Safari';
        if (userAgent.includes('Edge')) return 'Edge';
        return 'Autre';
    }

    // Authentification admin
    authenticateAdmin(username, password) {
        const data = this.getData();
        const hashedPassword = this.hashPassword(password);
        
        if (data.admin.username === username && data.admin.password === hashedPassword) {
            data.admin.lastLogin = new Date().toISOString();
            data.admin.loginAttempts = 0;
            this.saveData(data);
            return true;
        } else {
            data.admin.loginAttempts++;
            this.saveData(data);
            return false;
        }
    }

    // Obtenir les statistiques des visiteurs
    getVisitorStats() {
        const data = this.getData();
        const visitors = data.visitors;
        
        // Calculer les statistiques
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        
        return {
            total: visitors.total,
            today: visitors.daily[today] || 0,
            yesterday: visitors.daily[yesterday] || 0,
            thisMonth: visitors.monthly[new Date().toISOString().substring(0, 7)] || 0,
            browsers: visitors.browsers,
            lastVisit: visitors.lastVisit,
            dailyStats: visitors.daily,
            monthlyStats: visitors.monthly
        };
    }

    // Sauvegarder le contenu du portfolio
    savePortfolioContent(section, content) {
        const data = this.getData();
        data.content[section] = content;
        this.saveData(data);
    }

    // Obtenir le contenu du portfolio
    getPortfolioContent(section) {
        const data = this.getData();
        return data.content[section] || {};
    }

    // Changer le mot de passe admin
    changeAdminPassword(oldPassword, newPassword) {
        const data = this.getData();
        const hashedOldPassword = this.hashPassword(oldPassword);
        
        if (data.admin.password === hashedOldPassword) {
            data.admin.password = this.hashPassword(newPassword);
            this.saveData(data);
            return true;
        }
        return false;
    }

    // Exporter les données
    exportData() {
        return JSON.stringify(this.getData(), null, 2);
    }

    // Importer les données
    importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            this.saveData(data);
            return true;
        } catch (error) {
            console.error('Erreur lors de l\'importation:', error);
            return false;
        }
    }

    // Nettoyer les anciennes données (garder seulement les 30 derniers jours)
    cleanOldData() {
        const data = this.getData();
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        
        // Nettoyer les données quotidiennes
        Object.keys(data.visitors.daily).forEach(date => {
            if (new Date(date) < thirtyDaysAgo) {
                delete data.visitors.daily[date];
            }
        });
        
        this.saveData(data);
    }
}

// Instance globale
window.portfolioDB = new PortfolioDatabase();