# ✅ Checklist Deploy ke GCP

## Persiapan (Sebelum Deploy)

- [ ] **Install Google Cloud SDK**
  - Download: https://cloud.google.com/sdk/docs/install
  - Restart terminal setelah install
  - Verifikasi: `gcloud --version`

- [ ] **Buat/Pilih GCP Project**
  - Buka: https://console.cloud.google.com
  - Buat project baru atau pilih existing
  - Catat Project ID

- [ ] **Enable Billing**
  - Project harus punya billing account aktif
  - Check di: https://console.cloud.google.com/billing

- [ ] **Setup Database**
  - [ ] Cloud SQL sudah running, ATAU
  - [ ] External database sudah accessible
  - [ ] Catat credentials (host, user, password, database name)

- [ ] **Update Environment Variables**
  - [ ] Backend: Update .env dengan database production
  - [ ] Frontend: Update API URL di src/api.js (setelah backend deploy)

## Deploy Process

- [ ] **Login ke GCP**
  ```powershell
  gcloud auth login
  gcloud config set project YOUR_PROJECT_ID
  ```

- [ ] **Enable APIs**
  ```powershell
  gcloud services enable run.googleapis.com
  gcloud services enable cloudbuild.googleapis.com
  ```

- [ ] **Deploy Backend**
  ```powershell
  cd ~/Documents/GitHub/inventori-project/invetori-backend
  gcloud run deploy inventori-backend \
    --source . \
    --region us-central1 \
    --allow-unauthenticated \
    --port 8080
  ```
  - [ ] Catat Backend URL yang muncul

- [ ] **Update Frontend API URL**
  - [ ] Edit `inventori-frontend/src/api.js`
  - [ ] Ganti baseURL dengan Backend URL + "/api"

- [ ] **Deploy Frontend**
  ```powershell
  cd ~/Documents/GitHub/inventori-project/inventori-frontend
  gcloud run deploy inventori-frontend \
    --source . \
    --region us-central1 \
    --allow-unauthenticated \
    --port 8080
  ```
  - [ ] Catat Frontend URL yang muncul

- [ ] **Run Database Migrations** (jika perlu)
  - Akses backend container dan run: `php artisan migrate`

## Testing

- [ ] **Test Backend API**
  - Buka: https://YOUR-BACKEND-URL.run.app/api
  - Test endpoint: /api/products, /api/login

- [ ] **Test Frontend**
  - Buka: https://YOUR-FRONTEND-URL.run.app
  - Test login
  - Test create/read/update/delete data

- [ ] **Check Logs**
  ```powershell
  gcloud run services logs read inventori-backend --region us-central1
  gcloud run services logs read inventori-frontend --region us-central1
  ```

## Post-Deploy

- [ ] **Update DNS** (optional)
  - Map custom domain ke Cloud Run URLs
  - Setup SSL certificate

- [ ] **Setup Monitoring**
  - Enable Cloud Monitoring di GCP Console
  - Setup alerts untuk errors/downtime

- [ ] **Backup Strategy**
  - Setup automated database backups
  - Export configurations

- [ ] **Documentation**
  - Update README dengan production URLs
  - Document any environment-specific configs

## Troubleshooting

Jika ada masalah:
1. Check logs: `gcloud run services logs read SERVICE_NAME --region us-central1`
2. Check Cloud Console: https://console.cloud.google.com/run
3. Verify environment variables
4. Test database connectivity
5. Check firewall/network settings

---

**Status Deployment:**
- Backend URL: _______________________________________________
- Frontend URL: _______________________________________________
- Deploy Date: _______________________________________________
- Deployed By: _______________________________________________
