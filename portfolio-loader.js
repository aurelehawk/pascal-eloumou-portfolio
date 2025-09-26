class PortfolioLoader {
    constructor() {
        this.data = null;
        this.init();
    }

    async init() {
        try {
            await this.loadData();
            console.log('Data loaded:', this.data ? 'Success' : 'Failed');
            console.log('Data type:', typeof this.data);
            
            if (this.data && typeof this.data === 'object' && this.data !== null) {
                console.log('Valid data found, rendering portfolio...');
                this.renderPortfolio();
            } else {
                console.log('No valid data loaded, keeping static HTML');
            }
        } catch (error) {
            console.error('Erreur lors du chargement du portfolio:', error);
            // Fallback: garder le contenu statique existant
        }
    }

    async loadData() {
        try {
            console.log('Attempting to load portfolio data...');
            const response = await fetch('./data/portfolio-data.json');
            console.log('Response status:', response.status, response.statusText);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const jsonData = await response.json();
            console.log('JSON data loaded successfully:', jsonData ? 'Valid' : 'Invalid');
            
            if (jsonData && typeof jsonData === 'object' && Object.keys(jsonData).length > 0) {
                this.data = jsonData;
                console.log('Data assigned to this.data successfully');
            } else {
                console.error('Invalid JSON data structure or empty object');
                this.data = null;
            }
        } catch (error) {
            console.error('Error loading JSON data:', error);
            this.data = null;
        }
    }

    renderPortfolio() {
        if (!this.data) return;

        this.updateProfile();
        this.updateExperiences();
        this.updateEducation();
        this.updateCertifications();
        this.updateSkills();
        this.updateProjects();
        this.updateContact();
        this.updateSEO();
    }

    updateProfile() {
        if (!this.data || !this.data.profile) return;
        
        const profile = this.data.profile;
        
        // Mettre à jour le nom
        const nameElements = document.querySelectorAll('.hero-name, .profile-name');
        nameElements.forEach(el => {
            if (profile.name) el.textContent = profile.name;
        });

        // Mettre à jour le titre
        const titleElements = document.querySelectorAll('.hero-title, .profile-title');
        titleElements.forEach(el => {
            if (profile.title) el.textContent = profile.title;
        });

        // Mettre à jour la description
        const descElements = document.querySelectorAll('.hero-description, .about-text');
        descElements.forEach(el => {
            if (profile.description) el.innerHTML = profile.description;
        });

        // Mettre à jour la photo de profil
        const profileImages = document.querySelectorAll('.profile-image, .hero-image');
        profileImages.forEach(img => {
            if (profile.profileImage) {
                img.src = profile.profileImage;
                img.alt = `Photo de profil de ${profile.name}`;
            }
        });

        // Mettre à jour le CV
        const cvLinks = document.querySelectorAll('.cv-download');
        cvLinks.forEach(link => {
            if (profile.cvFile && profile.name) {
                link.href = profile.cvFile;
                link.download = `CV_${profile.name.replace(/\s+/g, '_')}.pdf`;
            }
        });
    }

    updateExperiences() {
        const container = document.querySelector('.experiences-container');
        if (!container || !this.data.experiences) return;

        container.innerHTML = '';
        
        this.data.experiences.forEach(exp => {
            const expElement = document.createElement('div');
            expElement.className = 'experience-item';
            expElement.innerHTML = `
                <div class="experience-header">
                    <h3 class="experience-title">${exp.title}</h3>
                    <span class="experience-company">${exp.company}</span>
                    <span class="experience-period">${exp.startDate} - ${exp.endDate}</span>
                </div>
                <div class="experience-description">
                    ${exp.description}
                </div>
                <div class="experience-technologies">
                    ${exp.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
            `;
            container.appendChild(expElement);
        });
    }

    updateEducation() {
        const container = document.querySelector('#education-content');
        if (!container) {
            console.log('Education container not found');
            return;
        }
        
        if (!this.data.education || !Array.isArray(this.data.education)) {
            console.log('Education data not available or invalid');
            container.innerHTML = '<p>Aucune formation disponible</p>';
            return;
        }

        container.innerHTML = '';
        
        this.data.education.forEach(edu => {
            const eduElement = document.createElement('div');
            eduElement.className = 'education-item';
            eduElement.innerHTML = `
                <div class="education-header">
                    <h3 class="education-degree">${edu.degree}</h3>
                    <span class="education-school">${edu.school}</span>
                    <span class="education-year">${edu.year}</span>
                </div>
                <div class="education-description">
                    ${edu.description || ''}
                </div>
            `;
            container.appendChild(eduElement);
        });
        
        console.log('Education updated successfully');
    }

    updateCertifications() {
        const container = document.querySelector('#certifications-content');
        if (!container) {
            // Try to find certifications within education content
            const educationContainer = document.querySelector('#education-content');
            if (educationContainer && this.data.certifications && Array.isArray(this.data.certifications)) {
                let certificationsHTML = '<div class="certifications-section"><h3>Certifications</h3>';
                
                this.data.certifications.forEach(cert => {
                    certificationsHTML += `
                        <div class="certification-item">
                            <div class="certification-header">
                                <h4 class="certification-name">${cert.name}</h4>
                                <span class="certification-issuer">${cert.issuer}</span>
                                <span class="certification-date">${cert.date}</span>
                            </div>
                            ${cert.credentialUrl ? `<a href="${cert.credentialUrl}" target="_blank" class="certification-link">Voir le certificat</a>` : ''}
                        </div>
                    `;
                });
                
                certificationsHTML += '</div>';
                educationContainer.insertAdjacentHTML('beforeend', certificationsHTML);
                console.log('Certifications added to education section');
            }
            return;
        }
        
        if (!this.data.certifications || !Array.isArray(this.data.certifications)) {
            console.log('Certifications data not available or invalid');
            return;
        }

        container.innerHTML = '';
        
        this.data.certifications.forEach(cert => {
            const certElement = document.createElement('div');
            certElement.className = 'certification-item';
            certElement.innerHTML = `
                <div class="certification-header">
                    <h3 class="certification-name">${cert.name}</h3>
                    <span class="certification-issuer">${cert.issuer}</span>
                    <span class="certification-date">${cert.date}</span>
                </div>
                ${cert.credentialUrl ? `<a href="${cert.credentialUrl}" target="_blank" class="certification-link">Voir le certificat</a>` : ''}
            `;
            container.appendChild(certElement);
        });
        
        console.log('Certifications updated successfully');
    }

    updateSkills() {
        const container = document.querySelector('#skills-container');
        if (!container) {
            console.log('Skills container not found');
            return;
        }
        
        // Vérifier que les données skills existent et sont un objet
        if (!this.data || !this.data.skills || typeof this.data.skills !== 'object') {
            console.log('Skills data not available or invalid, keeping static HTML');
            return;
        }

        // Créer le contenu des compétences dynamiquement
        try {
            let skillsHTML = '';
            
            Object.entries(this.data.skills).forEach(([categoryKey, categoryData]) => {
                if (categoryData && categoryData.name && categoryData.items && Array.isArray(categoryData.items)) {
                    skillsHTML += `
                        <div class="skill-category">
                            <h3 class="skill-category-title">${categoryData.name}</h3>
                            <div class="skills-grid">
                    `;
                    
                    categoryData.items.forEach(skill => {
                        if (skill && skill.name && skill.level) {
                            skillsHTML += `
                                <div class="skill-item" data-skill="${skill.name}">
                                    <div class="skill-info">
                                        <span class="skill-name">${skill.name}</span>
                                        <span class="skill-level">${skill.level}%</span>
                                    </div>
                                    <div class="skill-bar">
                                        <div class="skill-progress" style="width: ${skill.level}%"></div>
                                    </div>
                                    ${skill.description ? `<p class="skill-description">${skill.description}</p>` : ''}
                                </div>
                            `;
                        }
                    });
                    
                    skillsHTML += `
                            </div>
                        </div>
                    `;
                }
            });
            
            container.innerHTML = skillsHTML;
            console.log('Skills updated successfully');
            
        } catch (error) {
            console.error('Error updating skills:', error);
            container.innerHTML = '<p>Erreur lors du chargement des compétences</p>';
        }
    }

    updateProjects() {
        const container = document.querySelector('#projects-grid');
        if (!container) {
            console.log('Projects container not found');
            return;
        }
        
        if (!this.data.projects || !Array.isArray(this.data.projects)) {
            console.log('Projects data not available or invalid');
            container.innerHTML = '<p>Aucun projet disponible</p>';
            return;
        }

        container.innerHTML = '';
        
        this.data.projects.forEach(project => {
            const projectElement = document.createElement('div');
            projectElement.className = 'project-item';
            projectElement.innerHTML = `
                <div class="project-header">
                    <h3 class="project-title">${project.title}</h3>
                    <div class="project-links">
                        ${project.githubUrl ? `<a href="${project.githubUrl}" target="_blank" class="project-link">GitHub</a>` : ''}
                        ${project.liveUrl ? `<a href="${project.liveUrl}" target="_blank" class="project-link">Demo</a>` : ''}
                    </div>
                </div>
                <div class="project-description">
                    ${project.description}
                </div>
                <div class="project-technologies">
                    ${project.technologies && Array.isArray(project.technologies) ? 
                        project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('') : 
                        ''}
                </div>
            `;
            container.appendChild(projectElement);
        });
        
        console.log('Projects updated successfully');
    }

    updateContact() {
        const contact = this.data.contact;
        if (!contact) return;

        // Mettre à jour l'email
        const emailElements = document.querySelectorAll('.contact-email');
        emailElements.forEach(el => {
            el.textContent = contact.email;
            el.href = `mailto:${contact.email}`;
        });

        // Mettre à jour le téléphone
        const phoneElements = document.querySelectorAll('.contact-phone');
        phoneElements.forEach(el => {
            el.textContent = contact.phone;
            el.href = `tel:${contact.phone}`;
        });

        // Mettre à jour l'adresse
        const addressElements = document.querySelectorAll('.contact-address');
        addressElements.forEach(el => el.textContent = contact.address);

        // Mettre à jour les liens sociaux
        Object.entries(contact.social).forEach(([platform, url]) => {
            const socialLinks = document.querySelectorAll(`.social-${platform}`);
            socialLinks.forEach(link => link.href = url);
        });
    }

    updateSEO() {
        const seo = this.data.seo;
        if (!seo) return;

        // Mettre à jour le titre de la page
        document.title = seo.title;

        // Mettre à jour les meta tags
        this.updateMetaTag('description', seo.description);
        this.updateMetaTag('keywords', seo.keywords.join(', '));
        this.updateMetaTag('author', seo.author);
        
        // Open Graph
        this.updateMetaTag('og:title', seo.openGraph.title, 'property');
        this.updateMetaTag('og:description', seo.openGraph.description, 'property');
        this.updateMetaTag('og:image', seo.openGraph.image, 'property');
        this.updateMetaTag('og:url', seo.openGraph.url, 'property');
        
        // Twitter
        this.updateMetaTag('twitter:title', seo.twitter.title);
        this.updateMetaTag('twitter:description', seo.twitter.description);
        this.updateMetaTag('twitter:image', seo.twitter.image);
    }

    updateMetaTag(name, content, attribute = 'name') {
        let meta = document.querySelector(`meta[${attribute}="${name}"]`);
        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute(attribute, name);
            document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
    }
}

// Initialiser le chargeur de portfolio quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioLoader();
});