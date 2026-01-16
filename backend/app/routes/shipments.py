from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity
from app import db
from app.models.shipment import Shipment
from app.models.shipment_item import ShipmentItem
from app.schemas import (
    shipments_schema,
    shipment_schema,
    shipment_create_schema,
    shipment_status_schema,
)
from app.utils.decorators import login_required, admin_required, driver_required
from datetime import datetime
import uuid
from sqlalchemy.orm import joinedload

shipment_bp = Blueprint("shipment", __name__)

#


@shipment_bp.route("/shipments", methods=["GET"])
@login_required
def get_shipments():
    """
    Get all shipments based on user role.
    - Admin: Sees ALL
    - Driver: Sees ALL (to find assignments)
    - Customer: Sees ONLY their own
    """
    current_user = get_jwt_identity()
    user_id = current_user["id"]
    role = current_user["role"]

    if role in ["admin", "driver"]:
        shipments = Shipment.query.options(
            joinedload(Shipment.shipment_items).joinedload(ShipmentItem.product)
        ).all()
    else:
        shipments = (
            Shipment.query
            .filter_by(customer_id=user_id)
            .options(
                joinedload(Shipment.shipment_items).joinedload(ShipmentItem.product)
            )
            .all()
        )

    try:
        data = shipments_schema.dump(shipments)
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 422


@shipment_bp.route("/shipments", methods=["POST"])
@login_required
def create_shipment():
    """
    Creates a new shipment AND links products to it (if provided).
    Uses a database transaction to ensure data integrity.
    """
    try:
        current_user = get_jwt_identity()
        user_id = current_user["id"]

        # Validate input data using Marshmallow
        data = shipment_create_schema.load(request.get_json())

        # 1. Create the Shipment record
        tracking_number = str(uuid.uuid4())[:8].upper()

        new_shipment = Shipment(
            tracking_number=tracking_number,
            origin=data.get("origin", "Nairobi"),
            destination=data.get("destination"),
            status="Pending",
            payment_status="Unpaid",
            customer_id=user_id,
            driver_id=data.get("driver_id"),  # Optional: Admin might assign later
            created_at=datetime.utcnow(),
        )

        db.session.add(new_shipment)
        db.session.flush()  # Flush to generate the new_shipment.id

        # 2. Handle Shipment Items (The products inside the box)
        if "items" in data:
            for item in data["items"]:
                link = ShipmentItem(
                    shipment_id=new_shipment.id,
                    product_id=item["product_id"],
                    quantity=item["quantity"],
                )
                db.session.add(link)

        # 3. Commit everything
        db.session.commit()
        return jsonify(shipment_schema.dump(new_shipment)), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 400


@shipment_bp.route("/shipments/<int:shipment_id>", methods=["GET"])
@login_required
def get_shipment(shipment_id):
    """
    Get a single shipment.
    Security: Ensures users can't spy on other people's shipments.
    """
    current_user = get_jwt_identity()
    user_id = current_user["id"]
    role = current_user["role"]

    shipment = Shipment.query.options(
        joinedload(Shipment.shipment_items).joinedload(ShipmentItem.product)
    ).get_or_404(shipment_id)

    # Security Check
    if role not in ["admin", "driver"] and shipment.customer_id != user_id:
        return jsonify({"error": "Access denied"}), 403

    return jsonify(shipment_schema.dump(shipment)), 200


@shipment_bp.route("/shipments/<int:shipment_id>", methods=["PATCH"])
@login_required
def update_shipment(shipment_id):
    """
    Universal Update Route.
    - Drivers can update Status.
    - Admins can update Driver Assignment.
    """
    current_user = get_jwt_identity()
    role = current_user["role"]

    shipment = Shipment.query.get_or_404(shipment_id)
    data = request.get_json()

    try:
        # Admin Logic: Can assign drivers
        if role == "admin":
            if "driver_id" in data:
                shipment.driver_id = data["driver_id"]
            if "status" in data:
                shipment.status = data["status"]

        # Driver Logic: Can only update status
        if role == "driver":
            if "status" in data:
                shipment.status = data["status"]

        db.session.commit()
        return jsonify(shipment_schema.dump(shipment)), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 400


@shipment_bp.route("/shipments/<int:shipment_id>", methods=["DELETE"])
@admin_required
def delete_shipment(shipment_id):
    shipment = Shipment.query.get_or_404(shipment_id)
    db.session.delete(shipment)
    db.session.commit()
    return jsonify({"message": "Shipment deleted"}), 200
