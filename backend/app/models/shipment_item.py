# models/shipment_item.py
from app import db


class ShipmentItem(db.Model):
    __tablename__ = "shipment_items"

    id = db.Column(db.Integer, primary_key=True)

    shipment_id = db.Column(db.Integer, db.ForeignKey("shipments.id"), nullable=False)

    product_id = db.Column(db.Integer, db.ForeignKey("products.id"), nullable=False)

    quantity = db.Column(db.Integer, nullable=False, default=1)

    # Relationships
    product = db.relationship("Product", backref="shipment_items")
    shipment = db.relationship("Shipment", back_populates="shipment_items")

    def to_dict(self):
        return {
            "id": self.id,
            "shipment_id": self.shipment_id,
            "product_id": self.product_id,
            "quantity": self.quantity,
            "product": self.product.name if self.product else None,
        }
