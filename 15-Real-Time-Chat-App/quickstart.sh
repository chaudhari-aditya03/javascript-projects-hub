#!/bin/bash

# Real-Time Chat Application - Quick Start Script
# This script sets up and runs both backend and frontend

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}Real-Time Chat App - Quick Start${NC}"
echo -e "${GREEN}================================${NC}\n"

# Check if running on Windows (Git Bash, WSL, etc.)
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    ACTIVATE_CMD="venv\\Scripts\\activate"
else
    ACTIVATE_CMD="source venv/bin/activate"
fi

# Backend Setup
echo -e "${YELLOW}[1/4] Setting up Backend...${NC}"
cd backend

if [ ! -d "venv" ]; then
    echo -e "${YELLOW}Creating virtual environment...${NC}"
    python -m venv venv
fi

echo -e "${YELLOW}Activating virtual environment...${NC}"
eval "$ACTIVATE_CMD"

echo -e "${YELLOW}Installing dependencies...${NC}"
pip install -r requirements.txt > /dev/null 2>&1

if [ ! -f ".env" ]; then
    echo -e "${YELLOW}Creating .env file...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✓ Backend configured${NC}\n"
else
    echo -e "${GREEN}✓ Backend configured${NC}\n"
fi

# Frontend Setup
echo -e "${YELLOW}[2/4] Setting up Frontend...${NC}"
cd ../frontend

echo -e "${YELLOW}Installing dependencies...${NC}"
npm install > /dev/null 2>&1

if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}Creating .env.local file...${NC}"
    cp .env.example .env.local
    echo -e "${GREEN}✓ Frontend configured${NC}\n"
else
    echo -e "${GREEN}✓ Frontend configured${NC}\n"
fi

# Summary
echo -e "${GREEN}[3/4] Setup Complete!${NC}\n"

echo -e "${YELLOW}[4/4] Starting Services...${NC}"
echo -e "${YELLOW}To start the application:${NC}\n"

if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    echo -e "${GREEN}Terminal 1 - Backend:${NC}"
    echo "cd backend"
    echo "venv\\Scripts\\activate"
    echo "uvicorn main:app --reload --host 0.0.0.0 --port 8000"
    echo ""
    echo -e "${GREEN}Terminal 2 - Frontend:${NC}"
    echo "cd frontend"
    echo "npm run dev"
else
    echo -e "${GREEN}Terminal 1 - Backend:${NC}"
    echo "cd backend"
    echo "source venv/bin/activate"
    echo "uvicorn main:app --reload --host 0.0.0.0 --port 8000"
    echo ""
    echo -e "${GREEN}Terminal 2 - Frontend:${NC}"
    echo "cd frontend"
    echo "npm run dev"
fi

echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}Backend: http://localhost:8000${NC}"
echo -e "${GREEN}Frontend: http://localhost:5173${NC}"
echo -e "${GREEN}API Docs: http://localhost:8000/docs${NC}"
echo -e "${GREEN}================================${NC}\n"

echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Open the above URLs in your browser"
echo "2. Register two accounts for testing"
echo "3. Start chatting in real-time!"
echo ""
echo -e "${GREEN}Happy Chatting! 💬${NC}"
