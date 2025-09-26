class PortfolioAdmin {
    constructor() {
        this.data = null;
        this.currentSection = 'profile';
        this.isAuthenticated = false;
        this.uploadHandler = new UploadHandler();
        this.previewSystem = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkAuthentication();
    }

    bindEvents() {
        // Login form
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Logout button
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.handleLogout();
        });

        // Sidebar navigation
        document.querySelectorAll('.sidebar-menu a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchSection(e.target.closest('a').dataset.section);
            });
        });

        // Save all button
        document.getElementById('saveAllBtn').addEventListener('click', () => {
            this.saveAllData();
        });
    }

    checkAuthentication() {
        const isLoggedIn = localStorage.getItem('admin_logged_in');
        if (isLoggedIn === 'true') {
            this.showAdminInterface();
        }
    }

    handleLogin() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Simple authentication (à remplacer par une vraie authentification)
        if (username === 'admin' && password === 'portfolio2024') {
            localStorage.setItem('admin_logged_in', 'true');
            this.showAdminInterface();
        } else {
            this.showAlert('loginAlert', 'Nom d\'utilisateur ou mot de passe incorrect', 'error');
        }
    }

    handleLogout() {
        localStorage.removeItem('admin_logged_in');
        document.getElementById('loginContainer').classList.remove('hidden');
        document.getElementById('adminInterface').classList.add('hidden');
        this.isAuthenticated = false;
    }

    async showAdminInterface() {
        this.isAuthenticated = true;
        document.getElementById('loginContainer').classList.add('hidden');
        document.getElementById('adminInterface').classList.remove('hidden');
        
        await this.loadData();
        this.switchSection('profile');
        
        // Initialiser le système de prévisualisation après le chargement
        setTimeout(() => {
            this.previewSystem = new PreviewSystem(this);
        }, 1000);
    }

    async loadData() {
        try {
            const response = await fetch('data/portfolio-data.json');
            this.data = await response.json();
        } catch (error) {
            console.error('Erreur lors du chargement des données:', error);
            this.showAlert('contentArea', 'Erreur lors du chargement des données', 'error');
        }
    }

    switchSection(section) {
        // Update active menu item
        document.querySelectorAll('.sidebar-menu a').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-section="${section}"]`).classList.add('active');
        
        this.currentSection = section;
        this.renderSection(section);
    }

    renderSection(section) {
        const contentArea = document.getElementById('contentArea');
        
        switch(section) {
            case 'profile':
                contentArea.innerHTML = this.renderProfileForm();
                break;
            case 'experiences':
                contentArea.innerHTML = this.renderExperiencesForm();
                break;
            case 'education':
                contentArea.innerHTML = this.renderEducationForm();
                break;
            case 'skills':
                contentArea.innerHTML = this.renderSkillsForm();
                break;
            case 'projects':
                contentArea.innerHTML = this.renderProjectsForm();
                break;
            case 'seo':
                contentArea.innerHTML = this.renderSEOForm();
                break;
        }
        
        this.bindSectionEvents();
    }

    renderProfileForm() {
        const profile = this.data.profile;
        return `
            <h2><i class="fas fa-user"></i> Informations Profil</h2>
            <form id="profileForm">
                <div class="form-group">
                    <label class="form-label">Nom complet</label>
                    <input type="text" class="form-input" name="name" value="${profile.name}">
                </div>
                <div class="form-group">
                    <label class="form-label">Titre professionnel</label>
                    <input type="text" class="form-input" name="title" value="${profile.title}">
                </div>
                <div class="form-group">
                    <label class="form-label">Description courte</label>
                    <textarea class="form-textarea" name="description">${profile.description}</textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">À propos (description longue)</label>
                    <textarea class="form-textarea" name="about" style="min-height: 150px;">${profile.about}</textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">Photo de profil</label>
                    <div class="file-upload">
                        <input type="file" accept="image/*" name="photo">
                        <div class="file-upload-label">
                            <i class="fas fa-cloud-upload-alt"></i>
                            <span>Cliquez pour uploader une photo</span>
                        </div>
                    </div>
                    <small>Fichier actuel: ${profile.photo}</small>
                </div>
                <div class="form-group">
                    <label class="form-label">Email</label>
                    <input type="email" class="form-input" name="email" value="${profile.email}">
                </div>
                <div class="form-group">
                    <label class="form-label">Téléphone</label>
                    <input type="text" class="form-input" name="phone" value="${profile.phone}">
                </div>
                <div class="form-group">
                    <label class="form-label">Localisation</label>
                    <input type="text" class="form-input" name="location" value="${profile.location}">
                </div>
                <div class="form-group">
                    <label class="form-label">LinkedIn</label>
                    <input type="url" class="form-input" name="linkedin" value="${profile.linkedin}">
                </div>
                <div class="form-group">
                    <label class="form-label">GitHub</label>
                    <input type="url" class="form-input" name="github" value="${profile.github}">
                </div>
                <div class="form-group">
                    <label class="form-label">Twitter</label>
                    <input type="url" class="form-input" name="twitter" value="${profile.twitter}">
                </div>
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-save"></i>
                    Sauvegarder le profil
                </button>
            </form>
        `;
    }

    renderExperiencesForm() {
        let html = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                <h2><i class="fas fa-briefcase"></i> Expériences Professionnelles</h2>
                <button id="addExperienceBtn" class="btn btn-primary">
                    <i class="fas fa-plus"></i>
                    Ajouter une expérience
                </button>
            </div>
            <div id="experiencesList">
        `;
        
        this.data.experiences.forEach((exp, index) => {
            html += this.renderExperienceItem(exp, index);
        });
        
        html += `</div>`;
        return html;
    }

    renderExperienceItem(exp, index) {
        return `
            <div class="experience-item" style="border: 2px solid #e2e8f0; border-radius: 10px; padding: 25px; margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h3>${exp.company} - ${exp.position}</h3>
                    <button class="btn btn-secondary" onclick="admin.removeExperience(${index})">
                        <i class="fas fa-trash"></i>
                        Supprimer
                    </button>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div class="form-group">
                        <label class="form-label">Entreprise</label>
                        <input type="text" class="form-input" name="experiences[${index}][company]" value="${exp.company}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Poste</label>
                        <input type="text" class="form-input" name="experiences[${index}][position]" value="${exp.position}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Période</label>
                        <input type="text" class="form-input" name="experiences[${index}][period]" value="${exp.period}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Lieu</label>
                        <input type="text" class="form-input" name="experiences[${index}][location]" value="${exp.location}">
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Type de contrat</label>
                    <select class="form-select" name="experiences[${index}][type]">
                        <option value="CDI" ${exp.type === 'CDI' ? 'selected' : ''}>CDI</option>
                        <option value="CDD" ${exp.type === 'CDD' ? 'selected' : ''}>CDD</option>
                        <option value="Stage" ${exp.type === 'Stage' ? 'selected' : ''}>Stage</option>
                        <option value="Alternance" ${exp.type === 'Alternance' ? 'selected' : ''}>Alternance</option>
                        <option value="Freelance" ${exp.type === 'Freelance' ? 'selected' : ''}>Freelance</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Contexte</label>
                    <textarea class="form-textarea" name="experiences[${index}][sections][context]">${exp.sections.context}</textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">Missions principales</label>
                    <textarea class="form-textarea" name="experiences[${index}][sections][missions]">${exp.sections.missions}</textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">Projets spécialisés</label>
                    <textarea class="form-textarea" name="experiences[${index}][sections][projects]">${exp.sections.projects}</textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">Résultats obtenus</label>
                    <textarea class="form-textarea" name="experiences[${index}][sections][results]">${exp.sections.results}</textarea>
                </div>
            </div>
        `;
    }

    renderEducationForm() {
        let html = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                <h2><i class="fas fa-graduation-cap"></i> Formation & Certifications</h2>
                <div>
                    <button id="addEducationBtn" class="btn btn-primary" style="margin-right: 10px;">
                        <i class="fas fa-plus"></i>
                        Ajouter formation
                    </button>
                    <button id="addCertificationBtn" class="btn btn-secondary">
                        <i class="fas fa-certificate"></i>
                        Ajouter certification
                    </button>
                </div>
            </div>
            
            <h3>Formations</h3>
            <div id="educationList">
        `;
        
        this.data.education.forEach((edu, index) => {
            html += this.renderEducationItem(edu, index);
        });
        
        html += `</div><h3 style="margin-top: 40px;">Certifications</h3><div id="certificationsList">`;
        
        this.data.certifications.forEach((cert, index) => {
            html += this.renderCertificationItem(cert, index);
        });
        
        html += `</div>`;
        return html;
    }

    renderEducationItem(edu, index) {
        return `
            <div class="education-item" style="border: 2px solid #e2e8f0; border-radius: 10px; padding: 25px; margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h4>${edu.degree}</h4>
                    <button class="btn btn-secondary" onclick="admin.removeEducation(${index})">
                        <i class="fas fa-trash"></i>
                        Supprimer
                    </button>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div class="form-group">
                        <label class="form-label">Institution</label>
                        <input type="text" class="form-input" name="education[${index}][institution]" value="${edu.institution}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Diplôme</label>
                        <input type="text" class="form-input" name="education[${index}][degree]" value="${edu.degree}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Période</label>
                        <input type="text" class="form-input" name="education[${index}][period]" value="${edu.period}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Lieu</label>
                        <input type="text" class="form-input" name="education[${index}][location]" value="${edu.location}">
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Description</label>
                    <textarea class="form-textarea" name="education[${index}][description]">${edu.description}</textarea>
                </div>
            </div>
        `;
    }

    renderCertificationItem(cert, index) {
        return `
            <div class="certification-item" style="border: 2px solid #e2e8f0; border-radius: 10px; padding: 25px; margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h4>${cert.name}</h4>
                    <button class="btn btn-secondary" onclick="admin.removeCertification(${index})">
                        <i class="fas fa-trash"></i>
                        Supprimer
                    </button>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div class="form-group">
                        <label class="form-label">Nom de la certification</label>
                        <input type="text" class="form-input" name="certifications[${index}][name]" value="${cert.name}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Organisme</label>
                        <input type="text" class="form-input" name="certifications[${index}][issuer]" value="${cert.issuer}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Date d'obtention</label>
                        <input type="text" class="form-input" name="certifications[${index}][date]" value="${cert.date}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">ID de certification</label>
                        <input type="text" class="form-input" name="certifications[${index}][credential_id]" value="${cert.credential_id}">
                    </div>
                </div>
            </div>
        `;
    }

    renderSkillsForm() {
        let html = `
            <h2><i class="fas fa-code"></i> Compétences Techniques</h2>
            <p style="margin-bottom: 30px; color: #666;">Gérez vos compétences par catégorie. Le niveau est sur 100.</p>
        `;
        
        Object.keys(this.data.skills).forEach(category => {
            const skillCategory = this.data.skills[category];
            html += `
                <div class="skill-category" style="border: 2px solid #e2e8f0; border-radius: 10px; padding: 25px; margin-bottom: 30px;">
                    <h3>${skillCategory.title}</h3>
                    <div class="form-group">
                        <label class="form-label">Titre de la catégorie</label>
                        <input type="text" class="form-input" name="skills[${category}][title]" value="${skillCategory.title}">
                    </div>
                    <div id="skills-${category}">
            `;
            
            skillCategory.items.forEach((skill, index) => {
                html += `
                    <div class="skill-item" style="display: grid; grid-template-columns: 2fr 1fr 2fr 1fr; gap: 15px; align-items: center; margin-bottom: 15px; padding: 15px; background: #f7fafc; border-radius: 8px;">
                        <div class="form-group" style="margin: 0;">
                            <label class="form-label">Compétence</label>
                            <input type="text" class="form-input" name="skills[${category}][items][${index}][name]" value="${skill.name}">
                        </div>
                        <div class="form-group" style="margin: 0;">
                            <label class="form-label">Niveau (%)</label>
                            <input type="number" class="form-input" min="0" max="100" name="skills[${category}][items][${index}][level]" value="${skill.level}">
                        </div>
                        <div class="form-group" style="margin: 0;">
                            <label class="form-label">Icône (FontAwesome)</label>
                            <input type="text" class="form-input" name="skills[${category}][items][${index}][icon]" value="${skill.icon}">
                        </div>
                        <button type="button" class="btn btn-secondary" onclick="admin.removeSkill('${category}', ${index})" style="margin-top: 20px;">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
            });
            
            html += `
                    </div>
                    <button type="button" class="btn btn-primary" onclick="admin.addSkill('${category}')">
                        <i class="fas fa-plus"></i>
                        Ajouter une compétence
                    </button>
                </div>
            `;
        });
        
        return html;
    }

    renderProjectsForm() {
        let html = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                <h2><i class="fas fa-project-diagram"></i> Projets</h2>
                <button id="addProjectBtn" class="btn btn-primary">
                    <i class="fas fa-plus"></i>
                    Ajouter un projet
                </button>
            </div>
            <div id="projectsList">
        `;
        
        this.data.projects.forEach((project, index) => {
            html += this.renderProjectItem(project, index);
        });
        
        html += `</div>`;
        return html;
    }

    renderProjectItem(project, index) {
        return `
            <div class="project-item" style="border: 2px solid #e2e8f0; border-radius: 10px; padding: 25px; margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h3>${project.title}</h3>
                    <button class="btn btn-secondary" onclick="admin.removeProject(${index})">
                        <i class="fas fa-trash"></i>
                        Supprimer
                    </button>
                </div>
                <div class="form-group">
                    <label class="form-label">Titre du projet</label>
                    <input type="text" class="form-input" name="projects[${index}][title]" value="${project.title}">
                </div>
                <div class="form-group">
                    <label class="form-label">Description</label>
                    <textarea class="form-textarea" name="projects[${index}][description]">${project.description}</textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">Technologies (séparées par des virgules)</label>
                    <input type="text" class="form-input" name="projects[${index}][technologies]" value="${project.technologies.join(', ')}">
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div class="form-group">
                        <label class="form-label">Lien GitHub</label>
                        <input type="url" class="form-input" name="projects[${index}][github]" value="${project.github || ''}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Lien démo</label>
                        <input type="url" class="form-input" name="projects[${index}][demo]" value="${project.demo || ''}">
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Image du projet</label>
                    <div class="file-upload">
                        <input type="file" accept="image/*" name="projects[${index}][image]">
                        <div class="file-upload-label">
                            <i class="fas fa-cloud-upload-alt"></i>
                            <span>Cliquez pour uploader une image</span>
                        </div>
                    </div>
                    <small>Fichier actuel: ${project.image}</small>
                </div>
            </div>
        `;
    }

    renderSEOForm() {
        const seo = this.data.seo;
        return `
            <h2><i class="fas fa-search"></i> Configuration SEO</h2>
            <form id="seoForm">
                <div class="form-group">
                    <label class="form-label">Titre de la page (Title)</label>
                    <input type="text" class="form-input" name="title" value="${seo.title}">
                    <small>Recommandé: 50-60 caractères</small>
                </div>
                <div class="form-group">
                    <label class="form-label">Description meta</label>
                    <textarea class="form-textarea" name="description">${seo.description}</textarea>
                    <small>Recommandé: 150-160 caractères</small>
                </div>
                <div class="form-group">
                    <label class="form-label">Mots-clés (séparés par des virgules)</label>
                    <textarea class="form-textarea" name="keywords">${seo.keywords}</textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">URL canonique</label>
                    <input type="url" class="form-input" name="canonical_url" value="${seo.canonical_url}">
                </div>
                <div class="form-group">
                    <label class="form-label">Image Open Graph</label>
                    <div class="file-upload">
                        <input type="file" accept="image/*" name="og_image">
                        <div class="file-upload-label">
                            <i class="fas fa-cloud-upload-alt"></i>
                            <span>Cliquez pour uploader l'image OG</span>
                        </div>
                    </div>
                    <small>Fichier actuel: ${seo.og_image}</small>
                </div>
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-save"></i>
                    Sauvegarder SEO
                </button>
            </form>
        `;
    }

    bindSectionEvents() {
        // Bind form submissions
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveSection(this.currentSection, form);
            });
        });

        // Bind add buttons
        const addExperienceBtn = document.getElementById('addExperienceBtn');
        if (addExperienceBtn) {
            addExperienceBtn.addEventListener('click', () => this.addExperience());
        }

        const addEducationBtn = document.getElementById('addEducationBtn');
        if (addEducationBtn) {
            addEducationBtn.addEventListener('click', () => this.addEducation());
        }

        const addCertificationBtn = document.getElementById('addCertificationBtn');
        if (addCertificationBtn) {
            addCertificationBtn.addEventListener('click', () => this.addCertification());
        }

        const addProjectBtn = document.getElementById('addProjectBtn');
        if (addProjectBtn) {
            addProjectBtn.addEventListener('click', () => this.addProject());
        }
    }

    saveSection(section, form) {
        const formData = new FormData(form);
        
        switch(section) {
            case 'profile':
                this.saveProfile(formData);
                break;
            case 'experiences':
                this.saveExperiences(formData);
                break;
            case 'education':
                this.saveEducation(formData);
                break;
            case 'skills':
                this.saveSkills(formData);
                break;
            case 'projects':
                this.saveProjects(formData);
                break;
            case 'seo':
                this.saveSEO(formData);
                break;
        }
        
        this.showAlert('contentArea', 'Section sauvegardée avec succès!', 'success');
    }

    saveProfile(formData) {
        for (let [key, value] of formData.entries()) {
            if (key !== 'photo') {
                this.data.profile[key] = value;
            }
        }
    }

    saveExperiences(formData) {
        // Implementation for saving experiences
        // This would parse the form data and update this.data.experiences
    }

    saveEducation(formData) {
        // Implementation for saving education
    }

    saveSkills(formData) {
        // Implementation for saving skills
    }

    saveProjects(formData) {
        // Implementation for saving projects
    }

    saveSEO(formData) {
        for (let [key, value] of formData.entries()) {
            if (key !== 'og_image') {
                this.data.seo[key] = value;
            }
        }
    }

    async saveAllData() {
        try {
            // In a real application, this would send data to a server
            // For now, we'll save to localStorage and show a download link
            localStorage.setItem('portfolio_data', JSON.stringify(this.data, null, 2));
            
            // Create download link
            const dataStr = JSON.stringify(this.data, null, 2);
            const dataBlob = new Blob([dataStr], {type: 'application/json'});
            const url = URL.createObjectURL(dataBlob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = 'portfolio-data.json';
            link.click();
            
            this.showAlert('contentArea', 'Données sauvegardées! Fichier téléchargé.', 'success');
        } catch (error) {
            this.showAlert('contentArea', 'Erreur lors de la sauvegarde', 'error');
        }
    }

    // Helper methods for adding/removing items
    addExperience() {
        const newExp = {
            id: `exp_${Date.now()}`,
            company: '',
            position: '',
            period: '',
            location: '',
            type: 'CDI',
            sections: {
                context: '',
                missions: '',
                projects: '',
                results: ''
            }
        };
        this.data.experiences.push(newExp);
        this.renderSection('experiences');
    }

    removeExperience(index) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette expérience?')) {
            this.data.experiences.splice(index, 1);
            this.renderSection('experiences');
        }
    }

    addEducation() {
        const newEdu = {
            id: `edu_${Date.now()}`,
            institution: '',
            degree: '',
            period: '',
            location: '',
            description: ''
        };
        this.data.education.push(newEdu);
        this.renderSection('education');
    }

    removeEducation(index) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette formation?')) {
            this.data.education.splice(index, 1);
            this.renderSection('education');
        }
    }

    addCertification() {
        const newCert = {
            id: `cert_${Date.now()}`,
            name: '',
            issuer: '',
            date: '',
            credential_id: ''
        };
        this.data.certifications.push(newCert);
        this.renderSection('education');
    }

    removeCertification(index) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette certification?')) {
            this.data.certifications.splice(index, 1);
            this.renderSection('education');
        }
    }

    addProject() {
        const newProject = {
            id: `proj_${Date.now()}`,
            title: '',
            description: '',
            technologies: [],
            github: '',
            demo: '',
            image: ''
        };
        this.data.projects.push(newProject);
        this.renderSection('projects');
    }

    // Upload d'image de profil
    async uploadProfileImage() {
        try {
            const result = await this.uploadHandler.uploadProfileImage();
            this.data.profile.profileImage = result.url;
            
            // Mettre à jour l'aperçu
            const preview = document.querySelector('#profile-image-preview');
            if (preview) {
                preview.src = result.url;
            }
            
            this.showAlert('contentArea', 'Image de profil uploadée avec succès!', 'success');
            return result;
        } catch (error) {
            this.showAlert('contentArea', `Erreur lors de l'upload: ${error}`, 'error');
            throw error;
        }
    }

    // Upload de CV
    async uploadCV() {
        try {
            const result = await this.uploadHandler.uploadCV();
            this.data.profile.cvFile = result.url;
            
            // Mettre à jour le lien
            const link = document.querySelector('#cv-link-preview');
            if (link) {
                link.href = result.url;
                link.textContent = result.fileName;
            }
            
            this.showAlert('contentArea', 'CV uploadé avec succès!', 'success');
            return result;
        } catch (error) {
            this.showAlert('contentArea', `Erreur lors de l'upload: ${error}`, 'error');
            throw error;
        }
    }

    // Upload d'images de projets
    async uploadProjectImages(projectId) {
        try {
            const results = await this.uploadHandler.uploadProjectImages();
            const project = this.data.projects.find(p => p.id === projectId);
            
            if (project && results.length > 0) {
                project.image = results[0].url; // Prendre la première image
                this.renderSection('projects');
                this.showAlert('contentArea', 'Images de projet uploadées avec succès!', 'success');
            }
            
            return results;
        } catch (error) {
            this.showAlert('contentArea', `Erreur lors de l'upload: ${error}`, 'error');
            throw error;
        }
    }

    removeProject(index) {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce projet?')) {
            this.data.projects.splice(index, 1);
            this.renderSection('projects');
        }
    }

    addSkill(category) {
        const newSkill = {
            name: '',
            level: 50,
            icon: 'fas fa-code'
        };
        this.data.skills[category].items.push(newSkill);
        this.renderSection('skills');
    }

    removeSkill(category, index) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette compétence?')) {
            this.data.skills[category].items.splice(index, 1);
            this.renderSection('skills');
        }
    }

    showAlert(containerId, message, type) {
        const container = document.getElementById(containerId);
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            ${message}
        `;
        
        container.insertBefore(alert, container.firstChild);
        
        setTimeout(() => {
            alert.remove();
        }, 5000);
    }
}

// Initialize admin interface
const admin = new PortfolioAdmin();