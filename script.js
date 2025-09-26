// Configuration et variables globales
const CONFIG = {
    animationDuration: 300,
    scrollOffset: 70,
    skillAnimationDelay: 100
};

// Utilitaires
const utils = {
    // Sélecteur d'éléments avec gestion d'erreur
    $(selector) {
        const element = document.querySelector(selector);
        if (!element) {
            console.warn(`Élément non trouvé: ${selector}`);
        }
        return element;
    },
    
    // Sélecteur multiple
    $$(selector) {
        return document.querySelectorAll(selector);
    },
    
    // Debounce pour optimiser les performances
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Throttle pour les événements de scroll
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    },
    
    // Animation smooth scroll
    smoothScrollTo(target, offset = CONFIG.scrollOffset) {
        const element = typeof target === 'string' ? utils.$(target) : target;
        if (element) {
            const targetPosition = element.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    },
    
    // Vérifier si un élément est visible
    isElementInViewport(el, threshold = 0.1) {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        return (
            rect.top <= windowHeight * (1 - threshold) &&
            rect.bottom >= windowHeight * threshold
        );
    },
    
    // Copier du texte dans le presse-papiers
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            // Fallback pour les navigateurs plus anciens
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
                document.body.removeChild(textArea);
                return true;
            } catch (err) {
                document.body.removeChild(textArea);
                return false;
            }
        }
    }
};

// Gestion de la navigation
class Navigation {
    constructor() {
        this.navbar = utils.$('.navbar');
        this.navMenu = utils.$('.nav-menu');
        this.hamburger = utils.$('.hamburger');
        this.navLinks = utils.$$('.nav-link');
        this.lastScrollY = window.scrollY;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.handleActiveLink();
    }
    
    bindEvents() {
        // Toggle menu mobile
        if (this.hamburger) {
            this.hamburger.addEventListener('click', () => this.toggleMobileMenu());
        }
        
        // Navigation smooth scroll
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e));
        });
        
        // Navbar scroll effect
        window.addEventListener('scroll', utils.throttle(() => this.handleScroll(), 10));
        
        // Fermer le menu mobile en cliquant à l'extérieur
        document.addEventListener('click', (e) => this.handleOutsideClick(e));
    }
    
    toggleMobileMenu() {
        this.hamburger.classList.toggle('active');
        this.navMenu.classList.toggle('active');
        document.body.style.overflow = this.navMenu.classList.contains('active') ? 'hidden' : '';
    }
    
    handleNavClick(e) {
        e.preventDefault();
        const href = e.target.getAttribute('href');
        
        if (href.startsWith('#')) {
            utils.smoothScrollTo(href);
            
            // Fermer le menu mobile après clic
            if (this.navMenu.classList.contains('active')) {
                this.toggleMobileMenu();
            }
        }
    }
    
    handleScroll() {
        const currentScrollY = window.scrollY;
        
        // Effet de transparence de la navbar
        if (currentScrollY > 50) {
            this.navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            this.navbar.style.backdropFilter = 'blur(20px)';
        } else {
            this.navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        }
        
        // Mise à jour du lien actif
        this.updateActiveLink();
        
        this.lastScrollY = currentScrollY;
    }
    
    handleOutsideClick(e) {
        if (!this.navbar.contains(e.target) && this.navMenu.classList.contains('active')) {
            this.toggleMobileMenu();
        }
    }
    
    updateActiveLink() {
        const sections = utils.$$('section[id]');
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - CONFIG.scrollOffset - 50;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
    
    handleActiveLink() {
        // Ajouter la classe active au lien correspondant à la section actuelle
        this.updateActiveLink();
    }
}

// Gestion des animations au scroll
class ScrollAnimations {
    constructor() {
        this.animatedElements = utils.$$('[data-animate], .stat-item, .timeline-item, .skill-category');
        this.skillBars = utils.$$('.skill-progress');
        this.animatedElementsSet = new Set();
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.checkAnimations();
    }
    
    bindEvents() {
        window.addEventListener('scroll', utils.throttle(() => this.checkAnimations(), 16));
        window.addEventListener('resize', utils.debounce(() => this.checkAnimations(), 250));
    }
    
    checkAnimations() {
        this.animatedElements.forEach(element => {
            if (utils.isElementInViewport(element, 0.1) && !this.animatedElementsSet.has(element)) {
                this.animateElement(element);
                this.animatedElementsSet.add(element);
            }
        });
        
        // Animation des barres de compétences
        this.skillBars.forEach(bar => {
            if (utils.isElementInViewport(bar, 0.2) && !bar.classList.contains('animated')) {
                this.animateSkillBar(bar);
            }
        });
    }
    
    animateElement(element) {
        element.classList.add('fade-in-up');
        
        // Animation spéciale pour les statistiques
        if (element.classList.contains('stat-item')) {
            this.animateCounter(element);
        }
    }
    
    animateSkillBar(bar) {
        const width = bar.getAttribute('data-width');
        if (width) {
            setTimeout(() => {
                bar.style.width = width + '%';
                bar.classList.add('animated');
            }, 200);
        }
    }
    
    animateCounter(statItem) {
        const numberElement = statItem.querySelector('.stat-number');
        if (!numberElement) return;
        
        const finalNumber = numberElement.textContent.replace(/[^0-9]/g, '');
        const suffix = numberElement.textContent.replace(/[0-9]/g, '');
        
        if (finalNumber) {
            this.countUp(numberElement, 0, parseInt(finalNumber), suffix, 2000);
        }
    }
    
    countUp(element, start, end, suffix, duration) {
        const startTime = performance.now();
        const range = end - start;
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Fonction d'easing
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(start + (range * easeOutQuart));
            
            element.textContent = current + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = end + suffix;
            }
        };
        
        requestAnimationFrame(animate);
    }
}

// Gestion du système de partage
class ShareSystem {
    constructor() {
        this.shareButton = utils.$('#shareButton');
        this.shareModal = utils.$('#shareModal');
        this.closeModal = utils.$('#closeModal');
        this.shareLink = utils.$('#shareLink');
        this.copyLink = utils.$('#copyLink');
        this.shareLinkedIn = utils.$('#shareLinkedIn');
        this.shareTwitter = utils.$('#shareTwitter');
        this.shareEmail = utils.$('#shareEmail');
        
        this.currentUrl = window.location.href;
        this.pageTitle = document.title;
        this.pageDescription = document.querySelector('meta[name="description"]')?.content || 'Découvrez mon CV professionnel';
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.setupShareLink();
    }
    
    bindEvents() {
        // Ouvrir le modal de partage
        if (this.shareButton) {
            this.shareButton.addEventListener('click', () => this.openShareModal());
        }
        
        // Fermer le modal
        if (this.closeModal) {
            this.closeModal.addEventListener('click', () => this.closeShareModal());
        }
        
        // Fermer en cliquant à l'extérieur
        if (this.shareModal) {
            this.shareModal.addEventListener('click', (e) => {
                if (e.target === this.shareModal) {
                    this.closeShareModal();
                }
            });
        }
        
        // Copier le lien
        if (this.copyLink) {
            this.copyLink.addEventListener('click', () => this.copyShareLink());
        }
        
        // Partage sur les réseaux sociaux
        if (this.shareLinkedIn) {
            this.shareLinkedIn.addEventListener('click', () => this.shareOnLinkedIn());
        }
        
        if (this.shareTwitter) {
            this.shareTwitter.addEventListener('click', () => this.shareOnTwitter());
        }
        
        if (this.shareEmail) {
            this.shareEmail.addEventListener('click', () => this.shareByEmail());
        }
        
        // Fermer avec Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.shareModal.style.display === 'flex') {
                this.closeShareModal();
            }
        });
    }
    
    setupShareLink() {
        if (this.shareLink) {
            this.shareLink.value = this.currentUrl;
        }
    }
    
    openShareModal() {
        if (this.shareModal) {
            this.shareModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            // Focus sur le champ de lien pour l'accessibilité
            setTimeout(() => {
                if (this.shareLink) {
                    this.shareLink.select();
                }
            }, 100);
        }
    }
    
    closeShareModal() {
        if (this.shareModal) {
            this.shareModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }
    
    async copyShareLink() {
        const success = await utils.copyToClipboard(this.currentUrl);
        
        if (success) {
            this.showNotification('Lien copié dans le presse-papiers !', 'success');
            
            // Animation du bouton
            if (this.copyLink) {
                const originalText = this.copyLink.innerHTML;
                this.copyLink.innerHTML = '<i class="fas fa-check"></i> Copié !';
                this.copyLink.style.background = '#48bb78';
                
                setTimeout(() => {
                    this.copyLink.innerHTML = originalText;
                    this.copyLink.style.background = '';
                }, 2000);
            }
        } else {
            this.showNotification('Erreur lors de la copie du lien', 'error');
        }
    }
    
    shareOnLinkedIn() {
        const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(this.currentUrl)}`;
        this.openShareWindow(url, 'LinkedIn');
    }
    
    shareOnTwitter() {
        const text = `Découvrez mon CV professionnel : ${this.pageTitle}`;
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(this.currentUrl)}`;
        this.openShareWindow(url, 'Twitter');
    }
    
    shareByEmail() {
        const subject = encodeURIComponent(`CV - ${this.pageTitle}`);
        const body = encodeURIComponent(`Bonjour,\n\nJe vous invite à consulter mon CV professionnel : ${this.currentUrl}\n\n${this.pageDescription}\n\nCordialement`);
        const url = `mailto:?subject=${subject}&body=${body}`;
        window.location.href = url;
    }
    
    openShareWindow(url, platform) {
        const width = 600;
        const height = 400;
        const left = (window.innerWidth - width) / 2;
        const top = (window.innerHeight - height) / 2;
        
        window.open(
            url,
            `share-${platform}`,
            `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
        );
    }
    
    showNotification(message, type = 'info') {
        // Créer une notification toast
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Styles inline pour la notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: type === 'success' ? '#48bb78' : '#f56565',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
            zIndex: '9999',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease-in-out',
            maxWidth: '300px'
        });
        
        document.body.appendChild(notification);
        
        // Animation d'entrée
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Suppression automatique
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Gestion du formulaire de contact
class ContactForm {
    constructor() {
        this.form = utils.$('#contactForm');
        this.init();
    }
    
    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };
        
        // Validation simple
        if (this.validateForm(data)) {
            this.submitForm(data);
        }
    }
    
    validateForm(data) {
        const errors = [];
        
        if (!data.name.trim()) errors.push('Le nom est requis');
        if (!data.email.trim()) errors.push('L\'email est requis');
        if (!this.isValidEmail(data.email)) errors.push('L\'email n\'est pas valide');
        if (!data.subject.trim()) errors.push('Le sujet est requis');
        if (!data.message.trim()) errors.push('Le message est requis');
        
        if (errors.length > 0) {
            this.showFormErrors(errors);
            return false;
        }
        
        return true;
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    showFormErrors(errors) {
        const errorMessage = errors.join('\n');
        alert(errorMessage); // Remplacer par une notification plus élégante si nécessaire
    }
    
    async submitForm(data) {
        const submitButton = this.form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        // État de chargement
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
        submitButton.disabled = true;
        
        try {
            // Simulation d'envoi (remplacer par votre logique d'envoi réelle)
            await this.simulateFormSubmission(data);
            
            // Succès
            this.showSuccessMessage();
            this.form.reset();
            
        } catch (error) {
            console.error('Erreur lors de l\'envoi:', error);
            this.showErrorMessage();
        } finally {
            // Restaurer le bouton
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    }
    
    simulateFormSubmission(data) {
        return new Promise((resolve, reject) => {
            // Simulation d'un délai d'envoi
            setTimeout(() => {
                // Ici, vous pouvez intégrer votre service d'envoi d'email
                // (EmailJS, Formspree, Netlify Forms, etc.)
                console.log('Données du formulaire:', data);
                resolve();
            }, 2000);
        });
    }
    
    showSuccessMessage() {
        const shareSystem = new ShareSystem();
        shareSystem.showNotification('Message envoyé avec succès !', 'success');
    }
    
    showErrorMessage() {
        const shareSystem = new ShareSystem();
        shareSystem.showNotification('Erreur lors de l\'envoi du message', 'error');
    }
}

// Gestion du téléchargement de CV
class CVDownload {
    constructor() {
        this.downloadButton = utils.$('#downloadCV');
        this.init();
    }
    
    init() {
        if (this.downloadButton) {
            this.downloadButton.addEventListener('click', (e) => this.handleDownload(e));
        }
    }
    
    handleDownload(e) {
        e.preventDefault();
        
        // Ici, vous pouvez soit :
        // 1. Rediriger vers un fichier PDF hébergé
        // 2. Générer un PDF dynamiquement
        // 3. Ouvrir une version imprimable
        
        // Exemple : redirection vers un fichier PDF
        // window.open('/path/to/your/cv.pdf', '_blank');
        
        // Pour cet exemple, on simule le téléchargement
        this.simulateDownload();
    }
    
    simulateDownload() {
        const shareSystem = new ShareSystem();
        shareSystem.showNotification('Fonctionnalité de téléchargement à configurer', 'info');
        
        // Exemple de génération d'un lien de téléchargement
        // const link = document.createElement('a');
        // link.href = 'path/to/cv.pdf';
        // link.download = 'Mon_CV.pdf';
        // link.click();
    }
}

// Gestion des performances et optimisations
class PerformanceOptimizer {
    constructor() {
        this.init();
    }
    
    init() {
        this.lazyLoadImages();
        this.preloadCriticalResources();
        this.optimizeScrollPerformance();
    }
    
    lazyLoadImages() {
        const images = utils.$$('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback pour les navigateurs plus anciens
            images.forEach(img => {
                img.src = img.dataset.src;
                img.classList.remove('lazy');
            });
        }
    }
    
    preloadCriticalResources() {
        // Précharger les ressources critiques
        const criticalResources = [
            // Ajoutez ici les ressources à précharger
        ];
        
        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource.href;
            link.as = resource.as;
            document.head.appendChild(link);
        });
    }
    
    optimizeScrollPerformance() {
        // Optimisation du scroll avec passive listeners
        const passiveEvents = ['scroll', 'touchstart', 'touchmove'];
        
        passiveEvents.forEach(event => {
            document.addEventListener(event, () => {}, { passive: true });
        });
    }
}

// Gestionnaire d'expansion des textes longs
class TextExpansion {
    constructor() {
        this.expandableContents = [];
        this.maxHeight = 300; // hauteur maximale avant troncature
    }

    init() {
        this.setupExpandableContent();
        this.bindEvents();
    }

    setupExpandableContent() {
        const timelineContents = utils.$$('.timeline-content');
        
        timelineContents.forEach((content, index) => {
            const description = content.querySelector('.timeline-description');
            if (!description) return;

            const actualHeight = description.scrollHeight;
            
            // Si le contenu dépasse la hauteur maximale, le rendre expandable
            if (actualHeight > this.maxHeight) {
                content.classList.add('expandable', 'collapsed');
                
                // Créer le bouton d'expansion
                const toggleButton = this.createToggleButton();
                content.appendChild(toggleButton);
                
                this.expandableContents.push({
                    content,
                    description,
                    button: toggleButton,
                    isExpanded: false
                });
            }
        });
    }

    createToggleButton() {
        const button = document.createElement('button');
        button.className = 'expand-toggle';
        button.innerHTML = `
            <span>Voir plus</span>
            <span class="icon">▼</span>
        `;
        return button;
    }

    bindEvents() {
        this.expandableContents.forEach(item => {
            item.button.addEventListener('click', () => {
                this.toggleExpansion(item);
            });
        });
    }

    toggleExpansion(item) {
        const { content, button, isExpanded } = item;
        
        if (isExpanded) {
            // Réduire
            content.classList.remove('expanded');
            content.classList.add('collapsed');
            button.querySelector('span').textContent = 'Voir plus';
            item.isExpanded = false;
            
            // Scroll vers le haut de l'élément
            content.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start',
                inline: 'nearest'
            });
        } else {
            // Étendre
            content.classList.remove('collapsed');
            content.classList.add('expanded');
            button.querySelector('span').textContent = 'Voir moins';
            item.isExpanded = true;
        }
    }
}

// Initialisation de l'application
class App {
    constructor() {
        this.components = {};
        this.init();
    }
    
    init() {
        // Attendre que le DOM soit chargé
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
    }
    
    initializeComponents() {
        try {
            // Initialiser tous les composants
            this.components.navigation = new Navigation();
            this.components.scrollAnimations = new ScrollAnimations();
            this.components.shareSystem = new ShareSystem();
            this.components.contactForm = new ContactForm();
            this.components.cvDownload = new CVDownload();
            this.components.performanceOptimizer = new PerformanceOptimizer();
            this.components.textExpansion = new TextExpansion();
            
            console.log('✅ Application initialisée avec succès');
            
            // Déclencher un événement personnalisé
            document.dispatchEvent(new CustomEvent('appInitialized'));
            
        } catch (error) {
            console.error('❌ Erreur lors de l\'initialisation:', error);
        }
    }
    
    // Méthode pour ajouter des composants dynamiquement
    addComponent(name, component) {
        this.components[name] = component;
    }
    
    // Méthode pour obtenir un composant
    getComponent(name) {
        return this.components[name];
    }
}

// Initialiser l'application
const app = new App();

// Exposer l'app globalement pour le débogage (en développement uniquement)
if (typeof window !== 'undefined') {
    window.portfolioApp = app;
}

// Gestion des erreurs globales
window.addEventListener('error', (event) => {
    console.error('Erreur JavaScript:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Promise rejetée:', event.reason);
});

// Service Worker pour la mise en cache (optionnel)
if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}