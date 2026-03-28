#!/bin/bash
set -e

export LOG_CHANNEL=stderr

php artisan migrate --force || echo "Migration failed, continuing..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

export PORT=${PORT:-8000}
echo "=== PORT is: ${PORT} ==="
envsubst '${PORT}' < /etc/nginx/sites-available/default > /etc/nginx/sites-available/default.tmp
mv /etc/nginx/sites-available/default.tmp /etc/nginx/sites-available/default

echo "=== nginx.conf content ==="
cat /etc/nginx/sites-available/default
echo "=== end nginx.conf ==="

ln -sf /dev/stderr /var/www/html/storage/logs/laravel.log

echo "Starting php-fpm..."
php-fpm -D
echo "Testing nginx config..."
nginx -t
echo "Starting nginx on port ${PORT}..."
nginx -g "daemon off;"
