# CephasGM VPN Dashboard Starter Script for Windows
Write-Host "🚀 Starting CephasGM VPN Dashboard..." -ForegroundColor Green

# Check if .env file exists
if (-not (Test-Path "..\.env")) {
    Write-Host "⚠️  No .env file found. Copying from .env.example..." -ForegroundColor Yellow
    Copy-Item "..\.env.example" "..\.env"
    Write-Host "📝 Please edit ..\.env file with your configuration" -ForegroundColor Yellow
}

# Navigate to dashboard directory
Set-Location "..\dashboard"

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Green
    npm install
}

Write-Host "🎯 Starting Dashboard Server..." -ForegroundColor Green
Write-Host "🌐 Dashboard will be available at: http://localhost:3001" -ForegroundColor Cyan
Write-Host "⏹️  Press Ctrl+C to stop the server" -ForegroundColor Yellow

# Start the server
npm start