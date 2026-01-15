# Global Link Imports

# Global Link Imports

A comprehensive logistics and shipment management platform designed to streamline global import operations. This project features a robust Flask-based backend and a modern React frontend.

## Overview

Global Link Imports provides a centralized system for managing users, products, and shipments. It allows logistics teams to track the movement of goods, manage inventory, and handle authentication securely.

### Key Features
- **Shipment Tracking:** Create, update, and monitor global shipments.
- **Product Management:** Catalog and manage imported goods.
- **User Authentication:** Secure signup and login with role-based access.
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
- **Authentication:** Token-based (custom implementation)

### Frontend
- **Framework:** React 19 (Vite)
- **Styling:** Tailwind CSS
- **Routing:** React Router 7
- **API Client:** Axios
- **Icons:** Lucide React
- **Forms:** React Hook Form

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
source venv/bin/activate
pip install -r requirements.txt
flask db upgrade
python run.py
3. Frontend Setup
From the project root directory:

Bash

cd frontend
npm install
Note: If dependencies fail, you can install core packages manually:

Bash

npm install react-router-dom lucide-react axios react-hook-form
Run the Development Server:

Bash

npm run dev
4. Tailwind Configuration (If needed)
If you need to re-initialize Tailwind, follow these steps:

Install & Init:

Bash

npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
Configure tailwind.config.js:

JavaScript

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
Add Directives to src/index.css:

CSS

@tailwind base;
@tailwind components;
@tailwind utilities;
Access the App
The application will be available at:

Frontend: http://localhost:5173

Backend API: http://localhost:5000

License
MIT


### Final Step: Save and Commit
Once you have replaced the content:
1.  **Save** the file.
2.  Run these commands in your terminal:
    ```bash
    git add README.md
    git commit -m "Resolved merge conflict: merged main overview with alvin frontend instructions"
    git push
    ```