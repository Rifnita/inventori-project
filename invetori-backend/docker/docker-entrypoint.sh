#!/bin/bash
set -e

echo "Starting Laravel Application..."

# Create .env from .env.example if not exists
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp .env.example .env || echo "Warning: .env.example not found"
fi

# Wait for database to be ready (optional)
echo "Checking database connection..."
timeout 5 php artisan db:show 2>/dev/null || echo "Database not ready yet, will retry on first request"

# Generate APP_KEY if not exists
if [ -z "$APP_KEY" ]; then
    echo "Generating APP_KEY..."
    php artisan key:generate --force
fi

# Run database migrations (optional - won't fail if DB not ready)
echo "Running migrations..."
php artisan migrate --force 2>/dev/null || echo "Migration skipped - database not available yet"

# Run seeders (optional - won't fail if DB not ready)
echo "Running seeders..."
php artisan db:seed --force 2>/dev/null || echo "Seeder skipped - database not available yet"

# Clear and cache config
echo "Optimizing Laravel..."
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan config:cache
php artisan route:cache

# Start Apache
echo "Starting Apache on port 8080..."
exec "$@"
