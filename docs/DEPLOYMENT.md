# Setup & Deployment Guide

## Development (Lokal)

### Backend Setup
```bash
cd invetori-backend

# Install dependencies
composer install

# Setup environment
cp .env.example .env
php artisan key:generate

# Configure database di .env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=inventori_db
DB_USERNAME=root
DB_PASSWORD=

# Run migrations
php artisan migrate

# Start server
php artisan serve
```

### Frontend Setup
```bash
cd inventori-frontend

# Install dependencies
npm install

# Configure API URL di .env
VITE_API_URL=http://localhost:8000/api

# Start development server
npm run dev
```

## Production - Deploy ke Cloud Run

### Persiapan

1. **Install Google Cloud SDK**
   ```bash
   # Download dari: https://cloud.google.com/sdk/docs/install
   gcloud init
   ```

2. **Login ke GCP**
   ```bash
   gcloud auth login
   gcloud config set project koma2025
   ```

### Deploy Backend Laravel

1. **Buat Dockerfile** (sudah ada di `invetori-backend/Dockerfile`):
   ```dockerfile
   FROM php:8.2-fpm
   
   # Install dependencies
   RUN apt-get update && apt-get install -y \
       git \
       curl \
       libpng-dev \
       libonig-dev \
       libxml2-dev \
       zip \
       unzip
   
   # Install PHP extensions
   RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd
   
   # Install Composer
   COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
   
   # Set working directory
   WORKDIR /app
   
   # Copy application
   COPY . .
   
   # Install dependencies
   RUN composer install --no-dev --optimize-autoloader
   
   # Expose port
   EXPOSE 8080
   
   # Start server
   CMD php artisan serve --host=0.0.0.0 --port=8080
   ```

2. **Update `.env` untuk production**:
   ```env
   APP_ENV=production
   APP_DEBUG=false
   APP_URL=https://your-backend-url.run.app
   
   DB_CONNECTION=mysql
   DB_HOST=136.119.226.222
   DB_PORT=3306
   DB_DATABASE=inventori-db
   DB_USERNAME=root
   DB_PASSWORD=your-password
   ```

3. **Deploy ke Cloud Run**:
   ```bash
   cd invetori-backend
   
   # Build and deploy
   gcloud run deploy inventori-backend \
     --source . \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars="DB_HOST=136.119.226.222,DB_DATABASE=inventori-db,DB_USERNAME=root,DB_PASSWORD=your-password"
   ```

### Deploy Frontend React

1. **Update environment variables**:
   ```env
   # .env.production
   VITE_API_URL=https://inventori-backend-xxx.run.app/api
   ```

2. **Build production**:
   ```bash
   cd inventori-frontend
   npm run build
   ```

3. **Deploy ke Cloud Run** (dengan nginx):
   
   Buat `Dockerfile`:
   ```dockerfile
   FROM node:18 AS build
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npm run build
   
   FROM nginx:alpine
   COPY --from=build /app/dist /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/nginx.conf
   EXPOSE 8080
   CMD ["nginx", "-g", "daemon off;"]
   ```
   
   Deploy:
   ```bash
   gcloud run deploy inventori-frontend \
     --source . \
     --region us-central1 \
     --allow-unauthenticated
   ```

## API Endpoints

### Authentication
- `POST /api/register` - Register user baru
- `POST /api/login` - Login
- `POST /api/logout` - Logout (auth required)
- `GET /api/me` - Get current user (auth required)
- `PUT /api/profile` - Update profile (auth required)

### Products (Barang)
- `GET /api/products` - List products
- `GET /api/products/{id}` - Detail product
- `POST /api/products` - Create product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product
- `GET /api/products-categories` - Get categories

### Incoming Items (Barang Masuk)
- `GET /api/incoming-items` - List incoming items
- `GET /api/incoming-items/{id}` - Detail incoming item
- `POST /api/incoming-items` - Create incoming item
- `PUT /api/incoming-items/{id}` - Update incoming item
- `DELETE /api/incoming-items/{id}` - Delete incoming item

### Outgoing Items (Barang Keluar)
- `GET /api/outgoing-items` - List outgoing items
- `GET /api/outgoing-items/{id}` - Detail outgoing item
- `POST /api/outgoing-items` - Create outgoing item
- `PUT /api/outgoing-items/{id}` - Update outgoing item
- `DELETE /api/outgoing-items/{id}` - Delete outgoing item

### Dashboard
- `GET /api/dashboard` - Get dashboard data

### Reports (Laporan)
- `GET /api/reports/stock` - Laporan stok
- `GET /api/reports/incoming` - Laporan barang masuk
- `GET /api/reports/outgoing` - Laporan barang keluar
- `GET /api/reports/summary` - Laporan ringkasan

## Environment Variables untuk Cloud Run

Backend `.env`:
```env
APP_KEY=base64:xxxxx
DB_CONNECTION=mysql
DB_HOST=136.119.226.222
DB_PORT=3306
DB_DATABASE=inventori-db
DB_USERNAME=root
DB_PASSWORD=xxxxx
```

Frontend:
```env
VITE_API_URL=https://inventori-backend-xxx.run.app/api
```

## Notes

- Untuk development lokal, gunakan MySQL lokal atau SQLite
- Untuk production di Cloud Run, gunakan Cloud SQL (MySQL GCP)
- Pastikan Cloud SQL sudah allow koneksi dari Cloud Run (bisa pakai Private IP atau allow semua Cloud Run services)
- CORS sudah dikonfigurasi untuk allow semua origin, untuk production sebaiknya dibatasi
