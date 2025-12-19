# Setup Database Cloud SQL - Step by Step

## Step 1: Verifikasi Cloud SQL Instance
```bash
gcloud sql instances describe mysql-inventori --project=koma2025
```

## Step 2: Set Password untuk Root User (jika belum)
```bash
gcloud sql users set-password root --host=% --instance=mysql-inventori --password="8,/IgL,^:3SqKjhx" --project=koma2025
```

## Step 3: Buat Database (jika belum ada)
```bash
gcloud sql databases create inventori_db --instance=mysql-inventori --project=koma2025
```

## Step 4: Connect ke Cloud SQL menggunakan Cloud SQL Proxy

### 4a. Download Cloud SQL Proxy (Windows)
Download dari: https://dl.google.com/cloudsql/cloud_sql_proxy_x64.exe
Atau via PowerShell:
```powershell
Invoke-WebRequest -Uri "https://dl.google.com/cloudsql/cloud_sql_proxy_x64.exe" -OutFile "cloud_sql_proxy.exe"
```

### 4b. Dapatkan Connection Name
```bash
gcloud sql instances describe mysql-inventori --format="value(connectionName)" --project=koma2025
```

### 4c. Jalankan Cloud SQL Proxy
```powershell
.\cloud_sql_proxy.exe -instances=CONNECTION_NAME=tcp:3306
```

## Step 5: Connect dengan MySQL Client dan Run Migrations

### Opsi A: Jika punya MySQL Client lokal
```bash
mysql -h 127.0.0.1 -u root -p inventori_db
```
Password: `8,/IgL,^:3SqKjhx`

### Opsi B: Langsung dari Laravel (RECOMMENDED)
Update `.env` sementara untuk point ke Cloud SQL Proxy:
```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=inventori_db
DB_USERNAME=root
DB_PASSWORD=8,/IgL,^:3SqKjhx
```

Lalu jalankan:
```bash
php artisan migrate:fresh --seed
```

## Step 6: Verifikasi Data
```bash
php artisan tinker
# Lalu coba:
User::count()
Product::count()
```

## Alternative: Upload SQL File Langsung ke Cloud SQL

Jika punya file .sql, upload via gcloud:
```bash
gcloud sql import sql mysql-inventori gs://YOUR_BUCKET/inventori_db.sql --database=inventori_db --project=koma2025
```

## Untuk Setup Cepat (Tanpa Proxy):

1. Allow IP kamu untuk akses Cloud SQL:
```bash
gcloud sql instances patch mysql-inventori --authorized-networks=YOUR_PUBLIC_IP --project=koma2025
```

2. Connect langsung:
```bash
mysql -h 136.119.226.222 -u root -p inventori_db
```

3. Import data atau jalankan migrations dari Laravel:
```bash
# Update .env ke Cloud SQL
DB_HOST=136.119.226.222
DB_PORT=3306
DB_DATABASE=inventori_db

# Run migrations
php artisan migrate:fresh --seed
```
