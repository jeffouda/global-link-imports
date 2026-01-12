from app import db
from app.models.shipment import Shipment
from app.models.shipment_item import ShipmentItem
from datetime import datetime


def create_shipment_logic(data, user_id):
    """
    Handles creating a shipment and its associated items (products).
    Expects data to look like:
    {
        "destination": "Mombasa",
        "items": [
            {"product_id": 1, "quantity": 50},
            {"product_id": 2, "quantity": 10}
        ]
    }
    """
    try:
        # 1. Create the Shipment record
        new_shipment = Shipment(
            destination=data.get("destination"),
            status="Pending",
            payment_status="Unpaid",
            customer_id=user_id,
            created_at=datetime.utcnow(),
        )

        # Add to session to get the ID (but don't commit yet)
        db.session.add(new_shipment)
        db.session.flush()

        # 2. Loop through items and add to the Join Table (ShipmentItem)
        if "items" in data:
            for item in data["items"]:
                link = ShipmentItem(
                    shipment_id=new_shipment.id,
                    product_id=item["product_id"],
                    quantity=item["quantity"],  # <--- The User Submittable Attribute
                )
                db.session.add(link)

        # 3. Commit everything at once (Transaction)
        db.session.commit()
        return new_shipment

    except Exception as e:
        db.session.rollback()  # Undo changes if anything fails
        raise e
