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

shipment_bp = Blueprint("shipment", __name__)


@shipment_bp.route("/shipments", methods=["GET"])
@login_required
def get_shipments():
    current_user = get_jwt_identity()
    user_id = current_user["id"]
    role = current_user["role"]

    if role == "admin":
        shipments = Shipment.query.all()
    elif role == "driver":
        # Drivers can see all shipments to update status
        shipments = Shipment.query.all()
    else:
        # Customers see only their own
        shipments = Shipment.query.filter_by(user_id=user_id).all()

    return jsonify(shipments_schema.dump(shipments)), 200


@shipment_bp.route("/shipments", methods=["POST"])
@login_required
def create_shipment():
    try:
        current_user = get_jwt_identity()
        user_id = current_user["id"]

        # Validate input data
        data = shipment_create_schema.load(request.get_json())

        # 1. Create the Shipment record
        tracking_number = str(uuid.uuid4())[
            :8
        ].upper()  # Generate unique tracking number
        new_shipment = Shipment(
            tracking_number=tracking_number,
            origin=data.get("origin", "Nairobi"),  # Default origin
            destination=data.get("destination"),
            status="Pending",
            payment_status="Unpaid",
            user_id=user_id,
            driver_id=data.get("driver_id"),
            created_at=datetime.utcnow(),
        )

        # Add to session to get the ID
        db.session.add(new_shipment)
        db.session.flush()

        # 2. Loop through items and add to the Join Table (ShipmentItem)
        if "items" in data:
            for item in data["items"]:
                link = ShipmentItem(
                    shipment_id=new_shipment.id,
                    product_id=item["product_id"],
                    quantity=item["quantity"],  # <-- The User Submittable Attribute
                )
                db.session.add(link)

        # 3. Commit everything at once (Transaction)
        db.session.commit()
        return jsonify(shipment_schema.dump(new_shipment)), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 400


@shipment_bp.route("/shipments/<int:shipment_id>", methods=["GET"])
@login_required
def get_shipment(shipment_id):
    current_user = get_jwt_identity()
    user_id = current_user["id"]
    role = current_user["role"]

    shipment = Shipment.query.get_or_404(shipment_id)

    if role not in ["admin", "driver"] and shipment.user_id != user_id:
        return jsonify({"error": "Access denied"}), 403

    return jsonify(shipment_schema.dump(shipment)), 200


@shipment_bp.route("/shipments/<int:shipment_id>/status", methods=["PUT"])
@driver_required
def update_shipment_status(shipment_id):
    try:
        shipment = Shipment.query.get_or_404(shipment_id)

        # Validate input data
        data = shipment_status_schema.load(request.get_json())

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
