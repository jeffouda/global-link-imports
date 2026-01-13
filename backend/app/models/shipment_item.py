# models/shipment_item.py
from app import db


class ShipmentItem(db.Model):
    __tablename__ = "shipment_items"

    id = db.Column(db.Integer, primary_key=True)

    shipment_id = db.Column(
        db.Integer,
        db.ForeignKey("shipments.id"),
        nullable=False
    )

    name = db.Column(db.String(255), nullable=False)

    quantity = db.Column(db.Integer, nullable=False, default=1)

    weight = db.Column(db.Float, nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "shipment_id": self.shipment_id,
            "name": self.name,
            "quantity": self.quantity,
            "weight": self.weight
        }
