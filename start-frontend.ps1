# Frontend Startup Script
Write-Host "🚀 Starting Digital Fortress Frontend..." -ForegroundColor Cyan
Write-Host ""

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
}

Write-Host "✅ Starting frontend server on port 8080..." -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Open http://localhost:8080 in your browser" -ForegroundColor Cyan
Write-Host ""

npm run dev

