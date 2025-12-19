# 🚀 Panduan Deploy ke Google Cloud Platform

## Persiapan

### 1. Install Google Cloud SDK
1. Download dari: https://cloud.google.com/sdk/docs/install
2. Pilih installer untuk Windows
3. Jalankan installer dan restart terminal

### 2. Setup GCP Account
```powershell
# Login ke Google Cloud
gcloud auth login

# Set project (ganti dengan Project ID Anda)
gcloud config set project YOUR_PROJECT_ID

# Enable required APIs
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

### 3. Setup Database (Cloud SQL atau External)
Pastikan database sudah running dan accessible dari GCP.

## Deploy Otomatis

Jalankan script deploy:
```powershell
cd ~/Documents/GitHub/inventori-project
.\deploy.ps1
```

Script akan:
1. Deploy backend Laravel ke Cloud Run
2. Deploy frontend React ke Cloud Run
3. Menampilkan URL untuk kedua service

## Deploy Manual

### Deploy Backend

```powershell
cd invetori-backend

# Deploy ke Cloud Run
gcloud run deploy inventori-backend \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --set-env-vars="DB_HOST=YOUR_DB_HOST,DB_DATABASE=inventori_db,DB_USERNAME=root,DB_PASSWORD=YOUR_PASSWORD"
```

### Deploy Frontend

```powershell
cd inventori-frontend

# Deploy ke Cloud Run
gcloud run deploy inventori-frontend \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080 \
  --memory 256Mi
```

## Update API URL di Frontend

Setelah backend deploy, update URL di [inventori-frontend/src/api.js](inventori-frontend/src/api.js):

```javascript
const api = axios.create({
  baseURL: "https://YOUR-BACKEND-URL.run.app/api"
});
```

Lalu deploy ulang frontend.

## Troubleshooting

### Error: "gcloud command not found"
- Install Google Cloud SDK
- Restart terminal
- Cek dengan: `gcloud --version`

### Error: "Permission denied"
- Run: `gcloud auth login`
- Pastikan akun memiliki akses ke project

### Error: "Database connection failed"
- Cek environment variables database
- Pastikan Cloud SQL instance running
- Cek firewall rules untuk allow GCP IPs

### Frontend tidak connect ke backend
- Update baseURL di `api.js` dengan URL backend yang benar
- Redeploy frontend

## Monitoring

Cek logs aplikasi:
```powershell
# Backend logs
gcloud run services logs read inventori-backend --region us-central1

# Frontend logs
gcloud run services logs read inventori-frontend --region us-central1
```

## Update Deployment

Untuk update setelah perubahan code:
```powershell
# Deploy backend
cd invetori-backend
gcloud run deploy inventori-backend --source . --region us-central1

# Deploy frontend
cd inventori-frontend
gcloud run deploy inventori-frontend --source . --region us-central1
```

## Estimasi Biaya

Cloud Run pricing (Free tier):
- 2 million requests/month
- 360,000 GB-seconds memory
- 180,000 vCPU-seconds compute

Untuk traffic rendah, biasanya masih dalam free tier.

## Support

Jika ada masalah, cek:
1. Cloud Console: https://console.cloud.google.com/run
2. Logs di Cloud Run dashboard
3. Dokumentasi GCP: https://cloud.google.com/run/docs
