class PortfolioAdmin {
    constructor() {
        this.data = null;
        this.currentSection = 'dashboard';
        this.isAuthenticated = false;
        this.uploadHandler = new UploadHandler();
        this.previewSystem = null;
        this.database = window.portfolioDB;
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkAuthentication();
        // Enregistrer la visite si pas en mode admin
        if (!this.isAuthenticated) {
            this.database.recordVisit();
        }
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
        const alertDiv = document.getElementById('loginAlert');

        // Utiliser la base de données pour l'authentification
        if (this.database.authenticateAdmin(username, password)) {
            localStorage.setItem('admin_logged_in', 'true');
            this.isAuthenticated = true;
            this.showAdminInterface();
            alertDiv.innerHTML = '';
        } else {
            alertDiv.innerHTML = '<div class="alert alert-error">Nom d\'utilisateur ou mot de passe incorrect</div>';
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
            case 'dashboard':
                contentArea.innerHTML = this.renderDashboard();
                break;
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
            case 'visitors':
                contentArea.innerHTML = this.renderVisitorsStats();
                break;
            case 'seo':
                contentArea.innerHTML = this.renderSEOForm();
                break;
            case 'settings':
                contentArea.innerHTML = this.renderSettingsForm();
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
        const experiences = [];
        const experienceData = {};
        
        // Parse form data for experiences
        for (let [key, value] of formData.entries()) {
            if (key.startsWith('experiences[')) {
                const match = key.match(/experiences\[(\d+)\]\[(.+)\]/);
                if (match) {
                    const index = parseInt(match[1]);
                    const field = match[2];
                    
                    if (!experienceData[index]) {
                        experienceData[index] = {};
                    }
                    
                    if (field.includes('[')) {
                        // Handle nested fields like sections[context]
                        const nestedMatch = field.match(/(.+)\[(.+)\]/);
                        if (nestedMatch) {
                            const parentField = nestedMatch[1];
                            const childField = nestedMatch[2];
                            
                            if (!experienceData[index][parentField]) {
                                experienceData[index][parentField] = {};
                            }
                            experienceData[index][parentField][childField] = value;
                        }
                    } else {
                        experienceData[index][field] = value;
                    }
                }
            }
        }
        
        // Convert to array and update data
        Object.keys(experienceData).forEach(index => {
            if (this.data.experiences[index]) {
                Object.assign(this.data.experiences[index], experienceData[index]);
            }
        });
    }

    saveEducation(formData) {
        const educationData = {};
        const certificationData = {};
        
        // Parse form data for education and certifications
        for (let [key, value] of formData.entries()) {
            if (key.startsWith('education[')) {
                const match = key.match(/education\[(\d+)\]\[(.+)\]/);
                if (match) {
                    const index = parseInt(match[1]);
                    const field = match[2];
                    
                    if (!educationData[index]) {
                        educationData[index] = {};
                    }
                    educationData[index][field] = value;
                }
            } else if (key.startsWith('certifications[')) {
                const match = key.match(/certifications\[(\d+)\]\[(.+)\]/);
                if (match) {
                    const index = parseInt(match[1]);
                    const field = match[2];
                    
                    if (!certificationData[index]) {
                        certificationData[index] = {};
                    }
                    certificationData[index][field] = value;
                }
            }
        }
        
        // Update data
        Object.keys(educationData).forEach(index => {
            if (this.data.education[index]) {
                Object.assign(this.data.education[index], educationData[index]);
            }
        });
        
        Object.keys(certificationData).forEach(index => {
            if (this.data.certifications[index]) {
                Object.assign(this.data.certifications[index], certificationData[index]);
            }
        });
    }

    saveSkills(formData) {
        const skillsData = {};
        
        // Parse form data for skills
        for (let [key, value] of formData.entries()) {
            if (key.startsWith('skills[')) {
                const match = key.match(/skills\[(.+?)\]\[(.+)\]/);
                if (match) {
                    const category = match[1];
                    const field = match[2];
                    
                    if (!skillsData[category]) {
                        skillsData[category] = { items: {} };
                    }
                    
                    if (field === 'title') {
                        skillsData[category].title = value;
                    } else if (field.startsWith('items[')) {
                        const itemMatch = field.match(/items\[(\d+)\]\[(.+)\]/);
                        if (itemMatch) {
                            const index = parseInt(itemMatch[1]);
                            const itemField = itemMatch[2];
                            
                            if (!skillsData[category].items[index]) {
                                skillsData[category].items[index] = {};
                            }
                            
                            if (itemField === 'level') {
                                skillsData[category].items[index][itemField] = parseInt(value);
                            } else {
                                skillsData[category].items[index][itemField] = value;
                            }
                        }
                    }
                }
            }
        }
        
        // Update data
        Object.keys(skillsData).forEach(category => {
            if (this.data.skills[category]) {
                if (skillsData[category].title) {
                    this.data.skills[category].title = skillsData[category].title;
                }
                
                Object.keys(skillsData[category].items).forEach(index => {
                    if (this.data.skills[category].items[index]) {
                        Object.assign(this.data.skills[category].items[index], skillsData[category].items[index]);
                    }
                });
            }
        });
    }

    saveProjects(formData) {
        const projectsData = {};
        
        // Parse form data for projects
        for (let [key, value] of formData.entries()) {
            if (key.startsWith('projects[')) {
                const match = key.match(/projects\[(\d+)\]\[(.+)\]/);
                if (match) {
                    const index = parseInt(match[1]);
                    const field = match[2];
                    
                    if (!projectsData[index]) {
                        projectsData[index] = {};
                    }
                    
                    if (field === 'technologies') {
                        // Split technologies by comma and trim
                        projectsData[index][field] = value.split(',').map(tech => tech.trim());
                    } else {
                        projectsData[index][field] = value;
                    }
                }
            }
        }
        
        // Update data
        Object.keys(projectsData).forEach(index => {
            if (this.data.projects[index]) {
                Object.assign(this.data.projects[index], projectsData[index]);
            }
        });
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

// Nouvelles fonctions pour les sections ajoutées
PortfolioAdmin.prototype.renderDashboard = function() {
    const stats = this.database.getVisitorStats();
    const data = this.database.getData();
    
    return `
        <h2><i class="fas fa-chart-dashboard"></i> Tableau de Bord</h2>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px;">
                <h3><i class="fas fa-users"></i> Visiteurs Total</h3>
                <p style="font-size: 2rem; font-weight: bold; margin: 10px 0;">${stats.total}</p>
            </div>
            
            <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 20px; border-radius: 10px;">
                <h3><i class="fas fa-calendar-day"></i> Aujourd'hui</h3>
                <p style="font-size: 2rem; font-weight: bold; margin: 10px 0;">${stats.today}</p>
            </div>
            
            <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 20px; border-radius: 10px;">
                <h3><i class="fas fa-calendar-week"></i> Ce Mois</h3>
                <p style="font-size: 2rem; font-weight: bold; margin: 10px 0;">${stats.thisMonth}</p>
            </div>
            
            <div style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); color: white; padding: 20px; border-radius: 10px;">
                <h3><i class="fas fa-clock"></i> Dernière Visite</h3>
                <p style="font-size: 1rem; margin: 10px 0;">${stats.lastVisit ? new Date(stats.lastVisit).toLocaleString('fr-FR') : 'Aucune'}</p>
            </div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
            <div style="background: white; padding: 20px; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                <h3><i class="fas fa-browser"></i> Navigateurs</h3>
                <div style="margin-top: 15px;">
                    ${Object.entries(stats.browsers).map(([browser, count]) => `
                        <div style="display: flex; justify-content: space-between; margin: 10px 0; padding: 10px; background: #f8f9fa; border-radius: 5px;">
                            <span>${browser}</span>
                            <strong>${count}</strong>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                <h3><i class="fas fa-info-circle"></i> Informations Système</h3>
                <div style="margin-top: 15px;">
                    <p><strong>Mode Maintenance:</strong> ${data.settings.maintenanceMode ? 'Activé' : 'Désactivé'}</p>
                    <p><strong>Analytics:</strong> ${data.settings.analyticsEnabled ? 'Activé' : 'Désactivé'}</p>
                    <p><strong>Dernière Connexion Admin:</strong> ${data.admin.lastLogin ? new Date(data.admin.lastLogin).toLocaleString('fr-FR') : 'Jamais'}</p>
                </div>
            </div>
        </div>
    `;
};

PortfolioAdmin.prototype.renderVisitorsStats = function() {
    const stats = this.database.getVisitorStats();
    
    return `
        <h2><i class="fas fa-users"></i> Statistiques des Visiteurs</h2>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px;">
            <div style="background: #667eea; color: white; padding: 15px; border-radius: 8px; text-align: center;">
                <h4>Total</h4>
                <p style="font-size: 1.5rem; font-weight: bold;">${stats.total}</p>
            </div>
            <div style="background: #f093fb; color: white; padding: 15px; border-radius: 8px; text-align: center;">
                <h4>Aujourd'hui</h4>
                <p style="font-size: 1.5rem; font-weight: bold;">${stats.today}</p>
            </div>
            <div style="background: #4facfe; color: white; padding: 15px; border-radius: 8px; text-align: center;">
                <h4>Hier</h4>
                <p style="font-size: 1.5rem; font-weight: bold;">${stats.yesterday}</p>
            </div>
            <div style="background: #43e97b; color: white; padding: 15px; border-radius: 8px; text-align: center;">
                <h4>Ce Mois</h4>
                <p style="font-size: 1.5rem; font-weight: bold;">${stats.thisMonth}</p>
            </div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
            <div style="background: white; padding: 20px; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                <h3>Visiteurs par Jour (7 derniers jours)</h3>
                <div style="margin-top: 15px;">
                    ${Object.entries(stats.dailyStats).slice(-7).map(([date, count]) => `
                        <div style="display: flex; justify-content: space-between; margin: 8px 0; padding: 8px; background: #f8f9fa; border-radius: 5px;">
                            <span>${new Date(date).toLocaleDateString('fr-FR')}</span>
                            <strong>${count}</strong>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                <h3>Navigateurs Utilisés</h3>
                <div style="margin-top: 15px;">
                    ${Object.entries(stats.browsers).map(([browser, count]) => `
                        <div style="display: flex; justify-content: space-between; margin: 8px 0; padding: 8px; background: #f8f9fa; border-radius: 5px;">
                            <span>${browser}</span>
                            <strong>${count} (${Math.round((count/stats.total)*100)}%)</strong>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
        
        <div style="margin-top: 30px; text-align: center;">
            <button onclick="portfolioAdmin.cleanOldVisitorData()" class="btn btn-secondary">
                <i class="fas fa-trash"></i>
                Nettoyer les anciennes données (>30 jours)
            </button>
        </div>
    `;
};

PortfolioAdmin.prototype.renderSettingsForm = function() {
    const data = this.database.getData();
    
    return `
        <h2><i class="fas fa-cog"></i> Paramètres</h2>
        
        <form id="settingsForm">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
                <div>
                    <h3>Paramètres Généraux</h3>
                    
                    <div class="form-group">
                        <label class="form-label">
                            <input type="checkbox" ${data.settings.maintenanceMode ? 'checked' : ''} name="maintenanceMode">
                            Mode Maintenance
                        </label>
                        <small>Active le mode maintenance du site</small>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">
                            <input type="checkbox" ${data.settings.analyticsEnabled ? 'checked' : ''} name="analyticsEnabled">
                            Analytics Activé
                        </label>
                        <small>Active le suivi des visiteurs</small>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">
                            <input type="checkbox" ${data.settings.backupEnabled ? 'checked' : ''} name="backupEnabled">
                            Sauvegarde Automatique
                        </label>
                        <small>Active la sauvegarde automatique des données</small>
                    </div>
                </div>
                
                <div>
                    <h3>Sécurité</h3>
                    
                    <div class="form-group">
                        <label class="form-label">Nouveau Mot de Passe Admin</label>
                        <input type="password" class="form-input" name="newPassword" placeholder="Laisser vide pour ne pas changer">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Confirmer le Mot de Passe</label>
                        <input type="password" class="form-input" name="confirmPassword" placeholder="Confirmer le nouveau mot de passe">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Mot de Passe Actuel</label>
                        <input type="password" class="form-input" name="currentPassword" placeholder="Requis pour changer le mot de passe">
                    </div>
                </div>
            </div>
            
            <div style="margin-top: 30px; text-align: center;">
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-save"></i>
                    Sauvegarder les Paramètres
                </button>
            </div>
        </form>
        
        <hr style="margin: 40px 0;">
        
        <div>
            <h3>Gestion des Données</h3>
            <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                <button onclick="portfolioAdmin.exportData()" class="btn btn-secondary">
                    <i class="fas fa-download"></i>
                    Exporter les Données
                </button>
                
                <label class="btn btn-secondary" style="cursor: pointer;">
                    <i class="fas fa-upload"></i>
                    Importer les Données
                    <input type="file" accept=".json" onchange="portfolioAdmin.importData(this)" style="display: none;">
                </label>
                
                <button onclick="portfolioAdmin.resetData()" class="btn" style="background: #e53e3e; color: white;">
                    <i class="fas fa-exclamation-triangle"></i>
                    Réinitialiser Toutes les Données
                </button>
            </div>
        </div>
    `;
};

// Nouvelles méthodes utilitaires
PortfolioAdmin.prototype.cleanOldVisitorData = function() {
    if (confirm('Êtes-vous sûr de vouloir supprimer les données de visite de plus de 30 jours ?')) {
        this.database.cleanOldData();
        this.renderSection('visitors');
        this.showAlert('contentArea', 'Anciennes données supprimées avec succès', 'success');
    }
};

PortfolioAdmin.prototype.exportData = function() {
    const data = this.database.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    this.showAlert('contentArea', 'Données exportées avec succès', 'success');
};

PortfolioAdmin.prototype.importData = function(input) {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                if (this.database.importData(e.target.result)) {
                    this.showAlert('contentArea', 'Données importées avec succès', 'success');
                    this.renderSection(this.currentSection);
                } else {
                    this.showAlert('contentArea', 'Erreur lors de l\'importation des données', 'error');
                }
            } catch (error) {
                this.showAlert('contentArea', 'Fichier JSON invalide', 'error');
            }
        };
        reader.readAsText(file);
    }
};

PortfolioAdmin.prototype.resetData = function() {
    if (confirm('ATTENTION: Cette action supprimera TOUTES les données (visiteurs, contenu, paramètres). Êtes-vous absolument sûr ?')) {
        if (confirm('Dernière confirmation: Toutes les données seront perdues définitivement !')) {
            localStorage.removeItem('portfolioDB');
            this.database.initDatabase();
            this.showAlert('contentArea', 'Toutes les données ont été réinitialisées', 'success');
            this.renderSection(this.currentSection);
        }
    }
};

// Initialisation
const portfolioAdmin = new PortfolioAdmin();