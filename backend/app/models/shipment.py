from datetime import datetime
from app import db

# shipment.py - Shipment Model
# This model represents the core logistics entity in our system.
# It tracks the journey of goods from the warehouse to the customer.

class Shipment(db.Model):
    """
    Model representing a delivery order (Shipment) in the system.
    
    Attributes:
        id (int): Unique identifier and Primary Key for the shipment.
        status (str): Current state of delivery (e.g., "Pending", "In Transit", "Delivered").
        destination (str): Physical address where the items are being shipped.
        payment_status (str): Financial standing of the order (e.g., "Unpaid", "Paid").
        created_at (datetime): Automated timestamp representing when the order was placed.
    """

    __tablename__ = "shipments"

    # 1. Primary Key: Essential for database indexing and identifying unique orders.
    id = db.Column(db.Integer, primary_key=True)

    # 2. Core Business Attributes:
    # We use default="Pending" to ensure every new shipment starts with a known status.
    status = db.Column(db.String, nullable=False, default="Pending")

    # Destination is mandatory because a driver needs to know where to go!
    destination = db.Column(db.String, nullable=False)

    # payment_status helps the business track revenue and prevents shipping unpaid goods.
    payment_status = db.Column(db.String, nullable=False, default="Unpaid")

    # created_at uses datetime.utcnow to maintain a standardized timeline across timezones.
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # 3. Relationships (Foreign Keys):
    # customer_id: Links this shipment to the User who purchased it.
    customer_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    # driver_id: Links to the User (Driver role) responsible for the physical delivery.
    # We set nullable=True because a shipment might not have a driver assigned immediately.
    driver_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)

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
        String representation of the model. 
        Highly useful for developers when debugging in the Python console.
        """
        return f"<Shipment id={self.id} destination='{self.destination}' status='{self.status}'>"
