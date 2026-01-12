from app import db
from datetime import datetime


class Shipment(db.Model):
    __tablename__ = "shipments"

    id = db.Column(db.Integer, primary_key=True)
    tracking_number = db.Column(db.String(50), unique=True, nullable=False)
    status = db.Column(db.String(20), default="Pending")
    origin = db.Column(db.String(100), nullable=False)
    destination = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255))
    payment_status = db.Column(db.String(20), default="Unpaid")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Foreign Key: Link to the User table
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    # Removed to_dict method - using Marshmallow schemas for serialization
