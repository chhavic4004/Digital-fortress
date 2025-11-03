# Backend Startup Script
Write-Host "🚀 Starting Digital Fortress Backend..." -ForegroundColor Cyan
Write-Host ""

cd digital-fortress-backend

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  .env file not found. Creating..." -ForegroundColor Yellow
    npm run setup-env
    Write-Host "⚠️  Please edit .env file with your MongoDB URI!" -ForegroundColor Red
    pause
}

Write-Host "✅ Starting backend server on port 5000..." -ForegroundColor Green
Write-Host ""

npm run dev

