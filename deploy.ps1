# Deploy Script untuk Google Cloud Platform
# Pastikan sudah install gcloud CLI dan login

Write-Host "=== Deploy Inventori Project ke GCP ===" -ForegroundColor Green

# Konfigurasi
$PROJECT_ID = Read-Host "Masukkan Project ID GCP Anda"
$REGION = "us-central1"

Write-Host "`nSetting project to: $PROJECT_ID" -ForegroundColor Yellow
gcloud config set project $PROJECT_ID

# Deploy Backend
Write-Host "`n=== Deploying Backend ===" -ForegroundColor Cyan
Set-Location -Path "invetori-backend"

Write-Host "Building and deploying backend to Cloud Run..." -ForegroundColor Yellow
gcloud run deploy inventori-backend `
  --source . `
  --region $REGION `
  --allow-unauthenticated `
  --platform managed `
  --port 8080 `
  --memory 512Mi

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Backend deployed successfully!" -ForegroundColor Green
    $BACKEND_URL = gcloud run services describe inventori-backend --region $REGION --format="value(status.url)"
    Write-Host "Backend URL: $BACKEND_URL" -ForegroundColor Green
} else {
    Write-Host "✗ Backend deployment failed!" -ForegroundColor Red
    exit 1
}

Set-Location -Path ".."

# Deploy Frontend
Write-Host "`n=== Deploying Frontend ===" -ForegroundColor Cyan
Set-Location -Path "inventori-frontend"

# Update API URL di .env jika perlu
if ($BACKEND_URL) {
    Write-Host "Updating API URL in source..." -ForegroundColor Yellow
    # Note: Anda mungkin perlu update api.js dengan $BACKEND_URL/api
}

Write-Host "Building and deploying frontend to Cloud Run..." -ForegroundColor Yellow
gcloud run deploy inventori-frontend `
  --source . `
  --region $REGION `
  --allow-unauthenticated `
  --platform managed `
  --port 8080 `
  --memory 256Mi

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Frontend deployed successfully!" -ForegroundColor Green
    $FRONTEND_URL = gcloud run services describe inventori-frontend --region $REGION --format="value(status.url)"
    Write-Host "Frontend URL: $FRONTEND_URL" -ForegroundColor Green
} else {
    Write-Host "✗ Frontend deployment failed!" -ForegroundColor Red
    exit 1
}

Set-Location -Path ".."

# Summary
Write-Host "`n=== Deployment Summary ===" -ForegroundColor Green
Write-Host "Backend URL:  $BACKEND_URL" -ForegroundColor Cyan
Write-Host "Frontend URL: $FRONTEND_URL" -ForegroundColor Cyan
Write-Host "`nDone! 🚀" -ForegroundColor Green
