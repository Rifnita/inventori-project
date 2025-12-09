#!/bin/bash
set -e

echo "Starting Laravel Application..."

# Wait for database to be ready
echo "Waiting for database..."
sleep 10

# Generate APP_KEY if not exists
if [ -z "$APP_KEY" ]; then
    echo "Generating APP_KEY..."
    php artisan key:generate --force
fi

# Run database migrations
echo "Running migrations..."
php artisan migrate --force || echo "Migration failed, continuing..."

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
