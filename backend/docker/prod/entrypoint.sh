#!/bin/bash
set -e

php artisan migrate --force || echo "Migration failed, continuing..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

export PORT=${PORT:-8000}
envsubst '${PORT}' < /etc/nginx/sites-available/default > /etc/nginx/sites-available/default.tmp
mv /etc/nginx/sites-available/default.tmp /etc/nginx/sites-available/default

echo "Starting php-fpm..."
php-fpm -D
echo "Testing nginx config..."
nginx -t
echo "Starting nginx on port ${PORT}..."
nginx -g "daemon off;"
