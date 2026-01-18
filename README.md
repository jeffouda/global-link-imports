# Global Link Imports

A comprehensive logistics and shipment management platform designed to streamline global import operations. This project features a robust Flask-based backend and a modern React frontend.

## Overview

Global Link Imports (terabyte./inventory) is a logistics and tracking application focused on simplifying global supply chains. It provides a centralized system for managing users, products, and shipments, allowing teams to track goods, manage inventory, and handle authentication securely.

### Key Features
- **Shipment Tracking:** Create, update, and monitor global shipments in real-time.
- **Product Management:** Catalog and manage imported goods efficiently.
- **User Authentication:** Secure signup and login with role-based access (Admin, Driver, Customer).
- **Modern Dashboard:** Interactive frontend built with React and Tailwind CSS.

---

## Project Architecture

The project is split into two main components:
- **Backend:** Python / Flask API with SQLAlchemy and PostgreSQL.
- **Frontend:** React / Vite application using Tailwind CSS for styling.

---

## Tech Stack

### Backend
- **Framework:** Flask
- **Database:** PostgreSQL with SQLAlchemy ORM
- **Migrations:** Flask-Migrate (Alembic)
- **Security:** Flask-Bcrypt for password hashing
- **Authentication:** Token-based security

### Frontend
- **Framework:** React 19 (Vite)
- **Styling:** Tailwind CSS
- **Routing:** React Router 7
- **Icons:** Lucide React

---

## Quick Start

### 1. Prerequisites
- Python 3.x
- Node.js (v18+)
- PostgreSQL

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip install -r requirements.txt
flask db upgrade
python run.py