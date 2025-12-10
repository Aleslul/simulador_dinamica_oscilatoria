# Script para hacer git push
$projectPath = "C:\Users\Fabricio\Desktop\César Acosta Vásquez\Fisica Simulador"

# Cambiar al directorio del proyecto
Set-Location $projectPath

# Inicializar git si no existe
if (-not (Test-Path ".git")) {
    git init
}

# Agregar todos los archivos
git add .

# Hacer commit
git commit -m "feat: first release"

# Agregar remoto si no existe
$remoteUrl = "https://github.com/FabriAV/Simulador-F-sica.git"
$remoteExists = git remote | Select-String -Pattern "origin"

if (-not $remoteExists) {
    git remote add origin $remoteUrl
} else {
    git remote set-url origin $remoteUrl
}

# Hacer push
git push -u origin master

