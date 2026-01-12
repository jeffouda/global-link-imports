import os


class Config:
    # Generates a random key if one isn't provided (for security)
    SECRET_KEY = os.environ.get("SECRET_KEY") or "dev-key-please-change-in-prod"

    # The database connection string
    # It uses the one in .env, or creates a local sqlite file called 'app.db'
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URI") or "sqlite:///app.db"

    # Performance setting (Turn off to save memory)
    SQLALCHEMY_TRACK_MODIFICATIONS = False
