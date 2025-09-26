// Script pour mettre à jour le CV avec les données saisies

function updateCVWithData() {
    // Récupérer les données du localStorage
    const savedData = localStorage.getItem('cvData');
    
    if (!savedData) {
        console.log('Aucune donnée trouvée. Veuillez d\'abord remplir le formulaire.');
        return false;
    }
    
    const data = JSON.parse(savedData);
    console.log('Données récupérées:', data);
    
    // Mettre à jour les éléments du CV
    updateElement('hero-name', `${data.firstName} ${data.lastName}`);
    updateElement('hero-title', data.title);
    updateElement('hero-description', data.about);
    
    // Mettre à jour les informations de contact
    updateElement('contact-email', data.email);
    updateElement('contact-phone', data.phone);
    updateElement('contact-location', data.location);
    
    // Mettre à jour LinkedIn si fourni
    const linkedinLink = document.querySelector('a[href*="linkedin"]');
    if (linkedinLink && data.linkedin) {
        linkedinLink.href = data.linkedin;
    }
    
    // Mettre à jour la section À propos
    updateElement('about-text', data.about);
    
    // Mettre à jour l'expérience
    if (data.experience) {
        updateExperience(data.experience);
    }
    
    // Mettre à jour la formation
    if (data.education) {
        updateEducation(data.education);
    }
    
    // Mettre à jour les compétences
    if (data.skills) {
        updateSkills(data.skills);
    }
    
    return true;
}

function updateElement(id, content) {
    const element = document.getElementById(id);
    if (element && content) {
        element.textContent = content;
    }
}

function updateExperience(experienceText) {
    const experienceContainer = document.querySelector('#experience .experience-list');
    if (!experienceContainer) return;
    
    // Vider le contenu existant
    experienceContainer.innerHTML = '';
    
    // Traiter chaque ligne d'expérience
    const experiences = experienceText.split('\n').filter(line => line.trim());
    
    experiences.forEach(exp => {
        const parts = exp.split('|').map(part => part.trim());
        if (parts.length >= 3) {
            const [position, company, period, description = ''] = parts;
            
            const expElement = document.createElement('div');
            expElement.className = 'experience-item';
            expElement.innerHTML = `
                <div class="experience-header">
                    <h3>${position}</h3>
                    <span class="period">${period}</span>
                </div>
                <div class="company">${company}</div>
                ${description ? `<p class="description">${description}</p>` : ''}
            `;
            
            experienceContainer.appendChild(expElement);
        }
    });
}

function updateEducation(educationText) {
    const educationContainer = document.querySelector('#education .education-list');
    if (!educationContainer) return;
    
    // Vider le contenu existant
    educationContainer.innerHTML = '';
    
    // Traiter chaque ligne de formation
    const educations = educationText.split('\n').filter(line => line.trim());
    
    educations.forEach(edu => {
        const parts = edu.split('|').map(part => part.trim());
        if (parts.length >= 2) {
            const [degree, school, year = ''] = parts;
            
            const eduElement = document.createElement('div');
            eduElement.className = 'education-item';
            eduElement.innerHTML = `
                <div class="education-header">
                    <h3>${degree}</h3>
                    ${year ? `<span class="year">${year}</span>` : ''}
                </div>
                <div class="school">${school}</div>
            `;
            
            educationContainer.appendChild(eduElement);
        }
    });
}

function updateSkills(skillsText) {
    const skillsContainer = document.querySelector('#skills .skills-grid');
    if (!skillsContainer) return;
    
    // Vider le contenu existant
    skillsContainer.innerHTML = '';
    
    // Traiter les compétences
    const skills = skillsText.split(',').map(skill => skill.trim()).filter(skill => skill);
    
    skills.forEach(skill => {
        const skillElement = document.createElement('div');
        skillElement.className = 'skill-item';
        skillElement.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${skill}</span>
        `;
        
        skillsContainer.appendChild(skillElement);
    });
}

// Fonction pour vérifier et appliquer les données au chargement
function initializeCV() {
    // Attendre que le DOM soit chargé
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateCVWithData);
    } else {
        updateCVWithData();
    }
}

// Exporter les fonctions pour utilisation externe
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        updateCVWithData,
        initializeCV
    };
}

// Auto-initialisation
initializeCV();