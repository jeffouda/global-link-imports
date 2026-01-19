from datetime import datetime
import json
import uuid
from app import db

# shipment.py - Shipment Model
# This model represents the core logistics entity in our system.
# It tracks the journey of goods from the warehouse to the customer.


def generate_tracking_number():
    """Generate a unique 8-character uppercase alphanumeric tracking number."""
    return str(uuid.uuid4())[:8].upper()


class Shipment(db.Model):
    """
    Model representing a delivery order (Shipment) in the system.

    Attributes:
        id (int): Unique identifier and Primary Key for the shipment.
        tracking_number (str): Unique tracking code for the shipment.
        status (str): Current state of delivery (e.g., "Pending", "In Transit", "Delivered").
        origin (str): Starting location of the shipment.
        destination (str): Physical address where the items are being shipped.
        payment_status (str): Financial standing of the order (e.g., "Unpaid", "Paid").
        created_at (datetime): Automated timestamp representing when the order was placed.
    """

    __tablename__ = "shipments"

    # 1. Primary Key: Essential for database indexing and identifying unique orders.
    id = db.Column(db.Integer, primary_key=True)

    # Tracking number for shipment identification
    tracking_number = db.Column(
        db.String(50), unique=True, nullable=False, default=generate_tracking_number
    )

    # 2. Core Business Attributes:
    # We use default="Pending" to ensure every new shipment starts with a known status.
    status = db.Column(db.String, nullable=False, default="Pending")

    # Origin and destination for logistics
    origin = db.Column(db.String(100), nullable=False)
    destination = db.Column(db.String, nullable=False)

    # payment_status helps the business track revenue and prevents shipping unpaid goods.
    payment_status = db.Column(db.String, nullable=False, default="Unpaid")

    # notes for additional customer instructions
    notes = db.Column(db.Text, nullable=True)

    # recipient name
    recipient = db.Column(db.String(100), nullable=True)

    # weight in kg
    weight = db.Column(db.Float, nullable=True)

    # items as JSON string
    items = db.Column(db.Text, nullable=True)

    # created_at uses datetime.utcnow to maintain a standardized timeline across timezones.
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # 3. Relationships (Foreign Keys):
    # customer_id: Links this shipment to the User who purchased it.
    customer_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    # driver_id: Links to the User (Driver role) responsible for the physical delivery.
    # We set nullable=True because a shipment might not have a driver assigned immediately.
    driver_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)

    # Relationships
    customer = db.relationship("User", foreign_keys=[customer_id], backref="shipments")
    driver = db.relationship(
        "User", foreign_keys=[driver_id], backref="assigned_shipments"
    )

    # 4. Many-to-Many Relationship:
    # A shipment can have many products, and one product can be in many shipments.
    # 'cascade="all, delete-orphan"' ensures that if a shipment is deleted,
    # its entry in the join table (ShipmentItem) is also cleaned up.
    shipment_items = db.relationship(
        "ShipmentItem", back_populates="shipment", cascade="all, delete-orphan"
    )

    def to_dict(self):
        """
        Converts the Shipment database object into a Python dictionary.
        This is crucial for the Flask API to return JSON data that the frontend can read.
        """
        return {
            "id": self.id,
            "tracking_number": self.tracking_number,
            "status": self.status,
            "origin": self.origin,
            "destination": self.destination,
            "recipient": self.recipient,
            "weight": self.weight,
            "payment_status": self.payment_status,
            "notes": self.notes,
            "customer_id": self.customer_id,
            "driver_id": self.driver_id,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "items": json.loads(self.items) if self.items else [],
        }

    def __repr__(self):
        """
        String representation of the model.
        Highly useful for developers when debugging in the Python console.
        """
        return f"<Shipment id={self.id} destination='{self.destination}' status='{self.status}'>"
