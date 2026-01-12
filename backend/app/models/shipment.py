from app import db
from datetime import datetime


class Shipment(db.Model):
    """
    Model representing a delivery order (Shipment) in the system.
    Created by Customers and managed by Administrators and Drivers.
    """

    __tablename__ = "shipments"

    # Primary Key
    id = db.Column(db.Integer, primary_key=True)

    # Core Attributes
    # Current status of the delivery: e.g., "Pending", "In Transit", "Delivered"
    status = db.Column(db.String, nullable=False, default="Pending")

    # Destination address for the shipment
    destination = db.Column(db.String, nullable=False)

    # Financial status of the order: e.g., "Unpaid", "Paid", "Pending Refund"
    payment_status = db.Column(db.String, nullable=False, default="Unpaid")

    # Timestamp for tracking when the shipment record was created
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships (Foreign Keys)
    # One-to-Many: A User (with Customer role) can create many Shipments
    customer_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    # One-to-Many: A User (with Driver role) can be assigned to many Shipments
    driver_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)

    # Many-to-Many through ShipmentItem Join Table
    # A Shipment can contain multiple Products, and a Product can be part of multiple Shipments
    shipment_items = db.relationship(
        "ShipmentItem", back_populates="shipment", cascade="all, delete-orphan"
    )

    def to_dict(self):
        """
        Converts the Shipment model instance into a dictionary for JSON serialization.
        """
        return {
            "id": self.id,
            "status": self.status,
            "destination": self.destination,
            "payment_status": self.payment_status,
            "customer_id": self.customer_id,
            "driver_id": self.driver_id,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "items": [item.to_dict() for item in self.shipment_items],
        }

    def __repr__(self):
        """
        Returns a string representation of the Shipment instance.
        """
        return f"<Shipment id={self.id} destination='{self.destination}' status='{self.status}'>"
