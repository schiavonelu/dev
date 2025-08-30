#!/usr/bin/env bash
set -e

# Installa dipendenze
if [ -f frontend/package.json ]; then
  cd frontend
  npm install
  cd ..
fi

if [ -f backend/package.json ]; then
  cd backend
  npm install
  cd ..
fi

echo "✅ Dipendenze installate"
