#!/bin/sh
set -e

SSL_DIR="/etc/nginx/ssl"
CERT_FILE="${SSL_DIR}/transcendence.crt"
KEY_FILE="${SSL_DIR}/transcendence.key"

mkdir -p "${SSL_DIR}"

# Generate a self-signed SSL certificate if none exists yet
if [ ! -f "${CERT_FILE}" ] || [ ! -f "${KEY_FILE}" ]; then
    echo "[Nginx] Generating self-signed SSL certificate..."
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout "${KEY_FILE}" \
        -out "${CERT_FILE}" \
        -subj "/C=FR/ST=France/L=Paris/O=42/OU=Transcendence/CN=localhost" \
        -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"
    echo "[Nginx] SSL certificate generated."
fi

# Start Nginx in the foreground so Docker keeps the container running
exec nginx -g "daemon off;"
