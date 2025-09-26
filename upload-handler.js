class UploadHandler {
    constructor() {
        this.maxFileSize = 5 * 1024 * 1024; // 5MB
        this.allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        this.allowedDocTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        this.uploadDirectory = './uploads/';
    }

    // Créer un input file dynamique
    createFileInput(accept, multiple = false) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = accept;
        input.multiple = multiple;
        input.style.display = 'none';
        document.body.appendChild(input);
        return input;
    }

    // Upload d'image de profil
    async uploadProfileImage() {
        return new Promise((resolve, reject) => {
            const input = this.createFileInput(this.allowedImageTypes.join(','));
            
            input.onchange = async (e) => {
                const file = e.target.files[0];
                if (!file) {
                    reject('Aucun fichier sélectionné');
                    return;
                }

                try {
                    const result = await this.processImageFile(file, 'profile');
                    document.body.removeChild(input);
                    resolve(result);
                } catch (error) {
                    document.body.removeChild(input);
                    reject(error);
                }
            };

            input.click();
        });
    }

    // Upload de CV
    async uploadCV() {
        return new Promise((resolve, reject) => {
            const input = this.createFileInput(this.allowedDocTypes.join(','));
            
            input.onchange = async (e) => {
                const file = e.target.files[0];
                if (!file) {
                    reject('Aucun fichier sélectionné');
                    return;
                }

                try {
                    const result = await this.processDocumentFile(file, 'cv');
                    document.body.removeChild(input);
                    resolve(result);
                } catch (error) {
                    document.body.removeChild(input);
                    reject(error);
                }
            };

            input.click();
        });
    }

    // Upload d'images de projets
    async uploadProjectImages() {
        return new Promise((resolve, reject) => {
            const input = this.createFileInput(this.allowedImageTypes.join(','), true);
            
            input.onchange = async (e) => {
                const files = Array.from(e.target.files);
                if (files.length === 0) {
                    reject('Aucun fichier sélectionné');
                    return;
                }

                try {
                    const results = [];
                    for (const file of files) {
                        const result = await this.processImageFile(file, 'project');
                        results.push(result);
                    }
                    document.body.removeChild(input);
                    resolve(results);
                } catch (error) {
                    document.body.removeChild(input);
                    reject(error);
                }
            };

            input.click();
        });
    }

    // Traitement des fichiers image
    async processImageFile(file, type) {
        // Validation de la taille
        if (file.size > this.maxFileSize) {
            throw new Error(`Le fichier est trop volumineux. Taille maximum: ${this.maxFileSize / 1024 / 1024}MB`);
        }

        // Validation du type
        if (!this.allowedImageTypes.includes(file.type)) {
            throw new Error('Type de fichier non autorisé. Formats acceptés: JPEG, PNG, GIF, WebP');
        }

        // Créer un nom de fichier unique
        const timestamp = Date.now();
        const extension = file.name.split('.').pop();
        const fileName = `${type}_${timestamp}.${extension}`;

        // Convertir en base64 pour stockage local (simulation)
        const base64 = await this.fileToBase64(file);
        
        // Simuler le stockage (dans un vrai projet, on enverrait au serveur)
        const fileData = {
            name: fileName,
            originalName: file.name,
            size: file.size,
            type: file.type,
            base64: base64,
            url: `./uploads/${fileName}`,
            uploadDate: new Date().toISOString()
        };

        // Stocker dans localStorage pour simulation
        this.saveFileToStorage(fileName, fileData);

        return {
            fileName: fileName,
            url: fileData.url,
            size: file.size,
            type: file.type
        };
    }

    // Traitement des fichiers documents
    async processDocumentFile(file, type) {
        // Validation de la taille
        if (file.size > this.maxFileSize) {
            throw new Error(`Le fichier est trop volumineux. Taille maximum: ${this.maxFileSize / 1024 / 1024}MB`);
        }

        // Validation du type
        if (!this.allowedDocTypes.includes(file.type)) {
            throw new Error('Type de fichier non autorisé. Formats acceptés: PDF, DOC, DOCX');
        }

        // Créer un nom de fichier unique
        const timestamp = Date.now();
        const extension = file.name.split('.').pop();
        const fileName = `${type}_${timestamp}.${extension}`;

        // Convertir en base64 pour stockage local (simulation)
        const base64 = await this.fileToBase64(file);
        
        // Simuler le stockage
        const fileData = {
            name: fileName,
            originalName: file.name,
            size: file.size,
            type: file.type,
            base64: base64,
            url: `./uploads/${fileName}`,
            uploadDate: new Date().toISOString()
        };

        // Stocker dans localStorage pour simulation
        this.saveFileToStorage(fileName, fileData);

        return {
            fileName: fileName,
            url: fileData.url,
            size: file.size,
            type: file.type
        };
    }

    // Convertir fichier en base64
    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    // Sauvegarder fichier dans localStorage (simulation)
    saveFileToStorage(fileName, fileData) {
        const uploads = JSON.parse(localStorage.getItem('portfolio_uploads') || '{}');
        uploads[fileName] = fileData;
        localStorage.setItem('portfolio_uploads', JSON.stringify(uploads));
    }

    // Récupérer fichier depuis localStorage
    getFileFromStorage(fileName) {
        const uploads = JSON.parse(localStorage.getItem('portfolio_uploads') || '{}');
        return uploads[fileName] || null;
    }

    // Supprimer fichier
    deleteFile(fileName) {
        const uploads = JSON.parse(localStorage.getItem('portfolio_uploads') || '{}');
        delete uploads[fileName];
        localStorage.setItem('portfolio_uploads', JSON.stringify(uploads));
    }

    // Lister tous les fichiers uploadés
    listUploadedFiles() {
        const uploads = JSON.parse(localStorage.getItem('portfolio_uploads') || '{}');
        return Object.values(uploads);
    }

    // Créer une prévisualisation d'image
    createImagePreview(file, container) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = document.createElement('div');
            preview.className = 'image-preview';
            preview.innerHTML = `
                <img src="${e.target.result}" alt="Prévisualisation" style="max-width: 200px; max-height: 200px; object-fit: cover; border-radius: 8px;">
                <div class="preview-info">
                    <p><strong>Nom:</strong> ${file.name}</p>
                    <p><strong>Taille:</strong> ${(file.size / 1024).toFixed(2)} KB</p>
                    <p><strong>Type:</strong> ${file.type}</p>
                </div>
            `;
            container.appendChild(preview);
        };
        reader.readAsDataURL(file);
    }

    // Valider les dimensions d'image (optionnel)
    async validateImageDimensions(file, maxWidth = 2000, maxHeight = 2000) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const url = URL.createObjectURL(file);
            
            img.onload = () => {
                URL.revokeObjectURL(url);
                if (img.width > maxWidth || img.height > maxHeight) {
                    reject(new Error(`Image trop grande. Dimensions maximum: ${maxWidth}x${maxHeight}px`));
                } else {
                    resolve(true);
                }
            };
            
            img.onerror = () => {
                URL.revokeObjectURL(url);
                reject(new Error('Impossible de lire l\'image'));
            };
            
            img.src = url;
        });
    }

    // Redimensionner une image (optionnel)
    async resizeImage(file, maxWidth = 800, maxHeight = 600, quality = 0.8) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = () => {
                // Calculer les nouvelles dimensions
                let { width, height } = img;
                
                if (width > height) {
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = (width * maxHeight) / height;
                        height = maxHeight;
                    }
                }
                
                canvas.width = width;
                canvas.height = height;
                
                // Dessiner l'image redimensionnée
                ctx.drawImage(img, 0, 0, width, height);
                
                // Convertir en blob
                canvas.toBlob(resolve, file.type, quality);
            };
            
            img.src = URL.createObjectURL(file);
        });
    }
}

// Export pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UploadHandler;
}