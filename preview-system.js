class PreviewSystem {
    constructor(portfolioAdmin) {
        this.admin = portfolioAdmin;
        this.previewWindow = null;
        this.previewData = null;
        this.init();
    }

    init() {
        this.createPreviewButton();
    }

    // Créer le bouton de prévisualisation
    createPreviewButton() {
        const header = document.querySelector('.admin-header');
        if (!header) return;

        const previewBtn = document.createElement('button');
        previewBtn.className = 'btn btn-secondary';
        previewBtn.innerHTML = '<i class="fas fa-eye"></i> Prévisualiser';
        previewBtn.onclick = () => this.openPreview();
        
        // Insérer avant le bouton de sauvegarde
        const saveBtn = header.querySelector('.btn-primary');
        if (saveBtn) {
            header.insertBefore(previewBtn, saveBtn);
        } else {
            header.appendChild(previewBtn);
        }
    }

    // Ouvrir la prévisualisation
    async openPreview() {
        try {
            // Préparer les données de prévisualisation
            this.previewData = JSON.parse(JSON.stringify(this.admin.data));
            
            // Créer ou réutiliser la fenêtre de prévisualisation
            if (this.previewWindow && !this.previewWindow.closed) {
                this.previewWindow.focus();
                this.updatePreviewContent();
            } else {
                this.createPreviewWindow();
            }
        } catch (error) {
            console.error('Erreur lors de l\'ouverture de la prévisualisation:', error);
            this.admin.showAlert('contentArea', 'Erreur lors de l\'ouverture de la prévisualisation', 'error');
        }
    }

    // Créer la fenêtre de prévisualisation
    createPreviewWindow() {
        const width = Math.min(1200, window.screen.width * 0.8);
        const height = Math.min(800, window.screen.height * 0.8);
        const left = (window.screen.width - width) / 2;
        const top = (window.screen.height - height) / 2;

        this.previewWindow = window.open(
            '',
            'portfolio-preview',
            `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
        );

        if (this.previewWindow) {
            this.setupPreviewWindow();
        } else {
            this.admin.showAlert('contentArea', 'Impossible d\'ouvrir la fenêtre de prévisualisation. Vérifiez que les popups ne sont pas bloqués.', 'error');
        }
    }

    // Configurer la fenêtre de prévisualisation
    async setupPreviewWindow() {
        const doc = this.previewWindow.document;
        
        // Charger le HTML de base
        const baseHTML = await this.getBaseHTML();
        doc.open();
        doc.write(baseHTML);
        doc.close();

        // Attendre que le document soit prêt
        this.previewWindow.addEventListener('load', () => {
            this.updatePreviewContent();
            this.setupPreviewControls();
        });
    }

    // Obtenir le HTML de base du portfolio
    async getBaseHTML() {
        try {
            const response = await fetch('./index.html');
            let html = await response.text();
            
            // Modifier le HTML pour la prévisualisation
            html = html.replace('<title>', '<title>[PRÉVISUALISATION] ');
            
            // Ajouter un indicateur de prévisualisation
            const previewBanner = `
                <div id="preview-banner" style="
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    background: #ff6b35;
                    color: white;
                    text-align: center;
                    padding: 10px;
                    font-weight: bold;
                    z-index: 10000;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                ">
                    🔍 MODE PRÉVISUALISATION - Les modifications ne sont pas encore sauvegardées
                </div>
                <style>
                    body { margin-top: 50px !important; }
                </style>
            `;
            
            html = html.replace('<body>', '<body>' + previewBanner);
            
            return html;
        } catch (error) {
            console.error('Erreur lors du chargement du HTML de base:', error);
            return this.getFallbackHTML();
        }
    }

    // HTML de fallback si le chargement échoue
    getFallbackHTML() {
        return `
            <!DOCTYPE html>
            <html lang="fr">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>[PRÉVISUALISATION] Portfolio</title>
                <link rel="stylesheet" href="./styles.css">
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
            </head>
            <body>
                <div id="preview-banner" style="
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    background: #ff6b35;
                    color: white;
                    text-align: center;
                    padding: 10px;
                    font-weight: bold;
                    z-index: 10000;
                ">
                    🔍 MODE PRÉVISUALISATION - Les modifications ne sont pas encore sauvegardées
                </div>
                
                <div id="portfolio-content" style="margin-top: 50px;">
                    <!-- Le contenu sera injecté ici -->
                </div>
                
                <script src="./portfolio-loader.js"></script>
            </body>
            </html>
        `;
    }

    // Mettre à jour le contenu de la prévisualisation
    updatePreviewContent() {
        if (!this.previewWindow || this.previewWindow.closed) return;

        const doc = this.previewWindow.document;
        
        // Injecter les données de prévisualisation
        const script = doc.createElement('script');
        script.textContent = `
            // Remplacer les données du portfolio par les données de prévisualisation
            window.previewData = ${JSON.stringify(this.previewData)};
            
            // Classe de chargement pour la prévisualisation
            class PreviewPortfolioLoader extends PortfolioLoader {
                async loadData() {
                    this.data = window.previewData;
                }
            }
            
            // Initialiser avec les données de prévisualisation
            document.addEventListener('DOMContentLoaded', () => {
                new PreviewPortfolioLoader();
            });
            
            // Si le DOM est déjà prêt
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    new PreviewPortfolioLoader();
                });
            } else {
                new PreviewPortfolioLoader();
            }
        `;
        
        doc.head.appendChild(script);
    }

    // Configurer les contrôles de prévisualisation
    setupPreviewControls() {
        if (!this.previewWindow || this.previewWindow.closed) return;

        const doc = this.previewWindow.document;
        
        // Ajouter des contrôles de prévisualisation
        const controls = doc.createElement('div');
        controls.id = 'preview-controls';
        controls.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10001;
            display: flex;
            gap: 10px;
        `;
        
        controls.innerHTML = `
            <button id="refresh-preview" style="
                background: #007bff;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
            ">
                <i class="fas fa-sync-alt"></i> Actualiser
            </button>
            <button id="close-preview" style="
                background: #6c757d;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
            ">
                <i class="fas fa-times"></i> Fermer
            </button>
        `;
        
        doc.body.appendChild(controls);
        
        // Événements des contrôles
        doc.getElementById('refresh-preview').onclick = () => {
            this.previewData = JSON.parse(JSON.stringify(this.admin.data));
            this.previewWindow.location.reload();
        };
        
        doc.getElementById('close-preview').onclick = () => {
            this.previewWindow.close();
        };
    }

    // Actualiser la prévisualisation
    refreshPreview() {
        if (this.previewWindow && !this.previewWindow.closed) {
            this.previewData = JSON.parse(JSON.stringify(this.admin.data));
            this.updatePreviewContent();
        }
    }

    // Fermer la prévisualisation
    closePreview() {
        if (this.previewWindow && !this.previewWindow.closed) {
            this.previewWindow.close();
        }
    }

    // Vérifier si la prévisualisation est ouverte
    isPreviewOpen() {
        return this.previewWindow && !this.previewWindow.closed;
    }

    // Synchroniser automatiquement les modifications
    enableAutoSync() {
        // Observer les changements dans les formulaires
        const forms = document.querySelectorAll('.admin-form');
        forms.forEach(form => {
            form.addEventListener('input', () => {
                // Délai pour éviter trop d'actualisations
                clearTimeout(this.syncTimeout);
                this.syncTimeout = setTimeout(() => {
                    if (this.isPreviewOpen()) {
                        this.refreshPreview();
                    }
                }, 1000);
            });
        });
    }

    // Désactiver la synchronisation automatique
    disableAutoSync() {
        clearTimeout(this.syncTimeout);
    }

    // Comparer les données pour détecter les changements
    hasChanges() {
        if (!this.previewData) return false;
        
        const currentData = JSON.stringify(this.admin.data);
        const previewData = JSON.stringify(this.previewData);
        
        return currentData !== previewData;
    }

    // Obtenir un résumé des changements
    getChangesSummary() {
        if (!this.hasChanges()) return null;
        
        const changes = [];
        const current = this.admin.data;
        const preview = this.previewData;
        
        // Comparer les sections principales
        if (JSON.stringify(current.profile) !== JSON.stringify(preview.profile)) {
            changes.push('Profil');
        }
        if (JSON.stringify(current.experiences) !== JSON.stringify(preview.experiences)) {
            changes.push('Expériences');
        }
        if (JSON.stringify(current.education) !== JSON.stringify(preview.education)) {
            changes.push('Formation');
        }
        if (JSON.stringify(current.skills) !== JSON.stringify(preview.skills)) {
            changes.push('Compétences');
        }
        if (JSON.stringify(current.projects) !== JSON.stringify(preview.projects)) {
            changes.push('Projets');
        }
        if (JSON.stringify(current.contact) !== JSON.stringify(preview.contact)) {
            changes.push('Contact');
        }
        
        return changes;
    }
}

// Export pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PreviewSystem;
}