from app import db
from datetime import datetime


class Shipment(db.Model):
    __tablename__ = "shipments"

    id = db.Column(db.Integer, primary_key=True)
    tracking_number = db.Column(db.String(50), unique=True, nullable=False)
    status = db.Column(db.String(20), default="Pending")
    origin = db.Column(db.String(100), nullable=False)
    destination = db.Column(db.String(100), nullable=False)
    payment_status = db.Column(db.String(20), default="Unpaid")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Foreign Key: Link to the User table
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    # Foreign Key: Link to the Driver (also a User)
    driver_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)

    # Relationships
    user = db.relationship("User", backref="shipments", foreign_keys=[user_id])
    driver = db.relationship(
        "User", backref="driven_shipments", foreign_keys=[driver_id]
    )
    items = db.relationship(
        "ShipmentItem", backref="shipment", cascade="all, delete-orphan"
    )
