#!/bin/bash
# Sportify AI Setup Script

echo "🚀 Sportify AI - MVP Setup"
echo "=========================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi

echo "✓ Node.js $(node --version)"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found"
    exit 1
fi

echo "✓ npm $(npm --version)"

# Check PostgreSQL
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL not found. Please install PostgreSQL 12+"
    echo "   macOS: brew install postgresql"
    echo "   Ubuntu: sudo apt-get install postgresql"
else
    echo "✓ PostgreSQL installed"
fi

echo ""
echo "📦 Installing dependencies..."
cd backend
npm install

if [ $? -eq 0 ]; then
    echo "✓ Dependencies installed"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Create .env if doesn't exist
if [ ! -f .env ]; then
    echo ""
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✓ .env created - Please edit with your credentials:"
    echo "   - DATABASE_URL"
    echo "   - OPENAI_API_KEY"
    echo "   - Other config values"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit backend/.env with your configuration"
echo "2. Run: npm run db:setup"
echo "3. Run: npm run db:seed"
echo "4. Run: npm run dev"
echo ""
echo "📚 Documentation:"
echo "   - README.md - Quick start"
echo "   - docs/API.md - API reference"
echo "   - docs/IMPLEMENTATION.md - Architecture"
