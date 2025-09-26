@echo off
color 0A
echo ========================================
echo    DIAGNOSTIC GITHUB PAGES
echo ========================================
echo.

REM Vérifier Git
echo [1/8] Vérification de Git...
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERREUR: Git n'est pas installé
    echo    Téléchargez Git: https://git-scm.com/
    goto :end
) else (
    echo ✅ Git installé
    git --version
)
echo.

REM Vérifier si on est dans un repo Git
echo [2/8] Vérification du repository Git...
if not exist ".git" (
    echo ❌ ERREUR: Pas un repository Git
    echo    Exécutez: git init
    goto :end
) else (
    echo ✅ Repository Git détecté
)
echo.

REM Vérifier les remotes
echo [3/8] Vérification des repositories distants...
git remote -v >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERREUR: Aucun repository distant configuré
    echo    Exécutez: git remote add origin https://github.com/aurelehawk/REPO.git
) else (
    echo ✅ Repository distant configuré:
    git remote -v
)
echo.

REM Vérifier le statut
echo [4/8] Statut du repository...
git status --porcelain >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Erreur lors de la vérification du statut
) else (
    echo ✅ Statut Git:
    git status --short
)
echo.

REM Vérifier les commits
echo [5/8] Historique des commits...
git log --oneline -3 >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Aucun commit trouvé
    echo    Exécutez: git add . && git commit -m "Initial commit"
) else (
    echo ✅ Derniers commits:
    git log --oneline -3
)
echo.

REM Vérifier la branche
echo [6/8] Branche actuelle...
for /f "tokens=*" %%i in ('git branch --show-current 2^>nul') do set current_branch=%%i
if "%current_branch%"=="" (
    echo ❌ Aucune branche active
) else (
    echo ✅ Branche actuelle: %current_branch%
    if not "%current_branch%"=="main" (
        echo ⚠️  ATTENTION: GitHub Pages utilise généralement 'main'
        echo    Considérez: git branch -M main
    )
)
echo.

REM Vérifier les fichiers essentiels
echo [7/8] Vérification des fichiers essentiels...
if exist "index.html" (
    echo ✅ index.html trouvé
) else (
    echo ❌ ERREUR: index.html manquant
    echo    GitHub Pages nécessite un fichier index.html
)

if exist "admin.html" (
    echo ✅ admin.html trouvé
) else (
    echo ⚠️  admin.html manquant
)

if exist "data\portfolio-data.json" (
    echo ✅ portfolio-data.json trouvé
) else (
    echo ⚠️  portfolio-data.json manquant
)
echo.

REM Recommandations
echo [8/8] Recommandations...
echo.
echo 📋 ACTIONS RECOMMANDÉES:
echo.

REM Vérifier si tout est commité
git diff-index --quiet HEAD -- >nul 2>&1
if %errorlevel% neq 0 (
    echo 1. 📤 Commiter les changements:
    echo    git add .
    echo    git commit -m "Update portfolio"
    echo.
)

REM Vérifier si on peut pusher
git log origin/main..HEAD >nul 2>&1
if %errorlevel% equ 0 (
    for /f %%i in ('git rev-list --count origin/main..HEAD 2^>nul') do set commits_ahead=%%i
    if not "!commits_ahead!"=="0" (
        echo 2. 🚀 Pusher vers GitHub:
        echo    git push origin main
        echo.
    )
)

echo 3. 🌐 Activer GitHub Pages:
 echo    - Aller sur: https://github.com/aurelehawk/VOTRE-REPO/settings/pages
 echo    - Source: Deploy from a branch
 echo    - Branch: main
 echo    - Folder: / (root)
 echo    - Save
echo.

echo 4. ⏰ Attendre 5-10 minutes
echo.

echo 5. 🔗 Tester l'URL:
echo    - Repository principal: https://aurelehawk.github.io
echo    - Repository projet: https://aurelehawk.github.io/nom-du-repo
echo.

:end
echo ========================================
echo    DIAGNOSTIC TERMINÉ
echo ========================================
echo.
echo Voulez-vous ouvrir GitHub pour configurer Pages? (o/n)
set /p open_github=""
if /i "%open_github%"=="o" (
    start https://github.com/aurelehawk
)

echo.
echo Appuyez sur une touche pour continuer...
pause >nul