# Global Link Imports - Backend

This is the Flask-based API for the Global Link Imports management system. It handles user authentication, data persistence, and core business logic for shipments and products.

## Tech Stack

- **Flask:** Lightweight Python web framework.
- **Flask-SQLAlchemy:** ORM for database interactions.
- **Flask-Migrate:** Handles database migrations based on Alembic.
- **Flask-Bcrypt:** Secure password hashing.
- **Flask-CORS:** Cross-Origin Resource Sharing support for the frontend.
- **PostgreSQL:** Production-grade relational database.

---

## Getting Started

### Prerequisites
- Python 3.8+
- PostgreSQL
- Virtual environment (recommended)

### Installation
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### Database Setup
1. Create a PostgreSQL database (e.g., `global_link_db`).
2. Configure your database URL in a `.env` file:
   ```text
   DATABASE_URL=postgresql://user:password@localhost/global_link_db
   SECRET_KEY=your_secret_key
   ```
3. Run migrations:
   ```bash
   flask db upgrade
   ```

### Running the Application
Start the development server:
```bash
python run.py
```
The API will be available at `http://localhost:5000`.

---

## API Structure

The application follows a modular structure:
- `app/models/`: Database models defining the schema.
- `app/routes/`: Blueprint-based route definitions for different entities.
- `app/utils/`: Helper functions and decorators (e.g., authentication).

### Core Endpoints
- `/api/auth/`: User registration and login.
- `/api/shipments/`: Shipment CRUD operations.
- `/api/products/`: Product management (planned).

---

## Development

### Creating Migrations
When you modify models, generate a new migration:
```bash
flask db migrate -m "Description of changes"
flask db upgrade
```

### Seeding Data
(Optional) If a seed script exists:
```bash
python seed.py
```
