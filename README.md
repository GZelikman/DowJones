# DowJones

A bar where drink prices fluctuate dynamically—driven by real-time demand plus a dash of randomness. Inspired by Barcelona’s “Dow Jones Bar,” this repository recreates the idea from scratch.
Tech Stack:

    Frontend: JavaScript

    Backend: Python + FastAPI

    Data Storage: JSON files

Features:

    Live Pricing Dashboard
    View current drink prices and explore historical price trends via an interactive chart.

    Ordering System
    Guests can place drink orders directly from the web interface.

    Admin Panel
    Managers can review, approve, or cancel orders in real-time.

to start server: fastapi dev .\backend\backend.py
Works more consistent: uvicorn backend:app --host 127.0.0.1 --port 7999
