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
