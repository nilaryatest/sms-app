#!/usr/bin/env bash
# Render build script — runs on every deploy
set -o errexit  # exit on error

echo "📦 Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo "🗃️ Running database migrations..."
alembic upgrade head

echo "🌱 Seeding database..."
python seed.py

echo "✅ Build complete!"
