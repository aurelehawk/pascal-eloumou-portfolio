@echo off
echo ========================================
echo    DEPLOIEMENT PORTFOLIO SUR GITHUB
echo ========================================
echo.

REM Vérifier si Git est installé
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERREUR: Git n'est pas installé ou pas dans le PATH
    echo Veuillez installer Git depuis https://git-scm.com/
    pause
    exit /b 1
)

REM Vérifier si on est dans un repository Git
if not exist ".git" (
    echo Initialisation du repository Git...
    git init
    echo.
    echo Veuillez configurer votre repository distant:
    echo git remote add origin https://github.com/aurelehawk/VOTRE-REPO.git
    echo.
    echo Puis relancez ce script.
    pause
    exit /b 1
)

echo Préparation des fichiers pour le déploiement...
echo.

REM Ajouter tous les fichiers
echo Ajout des fichiers...
git add .

REM Demander un message de commit
set /p commit_message="Entrez un message de commit (ou appuyez sur Entrée pour un message par défaut): "
if "%commit_message%"=="" set commit_message=Update portfolio - %date% %time%

echo.
echo Création du commit...
git commit -m "%commit_message%"

if %errorlevel% neq 0 (
    echo Aucun changement à commiter ou erreur lors du commit.
    echo Vérifiez l'état de votre repository avec: git status
    pause
    exit /b 1
)

echo.
echo Envoi vers GitHub...
git push origin main

if %errorlevel% neq 0 (
    echo.
    echo ERREUR lors de l'envoi vers GitHub.
    echo Vérifiez:
    echo - Votre connexion internet
    echo - Vos identifiants GitHub
    echo - L'URL du repository distant
    echo.
    echo Commandes utiles:
    echo git remote -v  (voir les repositories distants)
    echo git status     (voir l'état du repository)
    echo git log --oneline -5  (voir les derniers commits)
    pause
    exit /b 1
)

echo.
echo ========================================
echo       DEPLOIEMENT REUSSI !
echo ========================================
echo.
echo Votre portfolio est maintenant en ligne !
echo.
echo URLs d'accès:
echo - Site principal: https://aurelehawk.github.io
echo - Administration: https://aurelehawk.github.io/admin.html
echo.
echo Note: Il peut y avoir un délai de 5-10 minutes
echo avant que les changements soient visibles.
echo.
echo Appuyez sur une touche pour ouvrir GitHub...
pause >nul
start https://github.com/aurelehawk

echo.
echo Voulez-vous ouvrir le site déployé ? (o/n)
set /p open_site=""
if /i "%open_site%"=="o" (
    start https://aurelehawk.github.io
)

echo.
echo Déploiement terminé !
pause