#!/bin/bash
echo "==============================================="
echo "  Course Buddy Chatbot - Quick Setup Script"
echo "==============================================="
echo ""

echo "[1/4] Creating Python virtual environment..."
python3 -m venv venv
if [ $? -ne 0 ]; then
    echo "ERROR: Python not installed!"
    echo "Please install Python 3.9+ from https://python.org"
    exit 1
fi

echo "[2/4] Activating virtual environment..."
source venv/bin/activate

echo "[3/4] Installing Python dependencies (this may take a few minutes)..."
pip install -r requirements.txt --quiet

echo "[4/4] Installing Frontend dependencies..."
cd frontend
npm install --silent
cd ..

echo ""
echo "==============================================="
echo "  Setup Complete!"
echo "==============================================="
echo ""
echo "To start the application:"
echo ""
echo "  1. Backend:  source venv/bin/activate"
echo "               python -m uvicorn app.main:app --reload --port 8000"
echo ""
echo "  2. Frontend: cd frontend && npm run dev"
echo ""
echo "  3. Open:     http://localhost:5173"
echo ""
