from app import db, bcrypt
from datetime import datetime


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

    # Role: 'admin', 'driver', 'customer'
    role = db.Column(db.String(20), default="customer", nullable=False)

    # Password reset fields
    reset_token = db.Column(db.String(128), nullable=True)
    token_expiry = db.Column(db.DateTime, nullable=True)

    def set_password(self, password):
        """Creates a hash of the password."""
        self.password_hash = bcrypt.generate_password_hash(password).decode("utf-8")

    def check_password(self, password):
        """Checks if the provided password matches the hash."""
        return bcrypt.check_password_hash(self.password_hash, password)

    # Removed to_dict method - using Marshmallow schemas for serialization
