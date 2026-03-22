#!/usr/bin/env python3
"""
Run script for PLM API server
"""
import sys
import os

# Add current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Import and run the app
from main import app
import uvicorn

if __name__ == "__main__":
    print("🚀 Starting PLM API Server...")
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)