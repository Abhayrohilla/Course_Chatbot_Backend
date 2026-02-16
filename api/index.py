"""Vercel Serverless Function Entry Point.

This file exposes the FastAPI app as a Vercel serverless function.
Vercel automatically detects the 'app' variable as the ASGI handler.
"""
from app.main import app
