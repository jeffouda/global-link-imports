from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.user import User
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
import json
from sqlalchemy.orm import joinedload

shipment_bp = Blueprint("shipment", __name__)

#


@shipment_bp.route("/shipments/", methods=["GET"], strict_slashes=False)
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
    user = User.query.get(user_id)

    if user.role == "admin":
        shipments = Shipment.query.options(
            joinedload(Shipment.shipment_items),
            joinedload(Shipment.customer),
            joinedload(Shipment.driver),
        ).all()
    elif user.role == "driver":
        shipments = (
            Shipment.query
            .filter_by(driver_id=user.id)
            .options(
                joinedload(Shipment.shipment_items),
                joinedload(Shipment.customer),
                joinedload(Shipment.driver),
            )
            .all()
        )
    else:
        shipments = (
            Shipment.query
            .filter_by(customer_id=user.id)
            .options(
                joinedload(Shipment.shipment_items),
                joinedload(Shipment.customer),
                joinedload(Shipment.driver),
            )
            .all()
        )

    try:
        data = shipments_schema.dump(shipments)
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 422


@shipment_bp.route("/admin/all", methods=["GET"], strict_slashes=False)
@jwt_required()
def get_all_shipments():
    """
    Admin only: Get all shipments.
    """
    try:
        # 1. Get the User ID from the Token
        current_user_data = get_jwt_identity()

        # Handle cases where identity might be just an ID or a Dict
        if isinstance(current_user_data, dict):
            user_id = current_user_data.get("id")
        else:
            user_id = current_user_data

        # 2. Verify Admin Role in Database
        user = User.query.get(user_id)

        if not user or user.role != "admin":
            return jsonify({"error": "Access denied. Admins only."}), 403

        # 3. Fetch All Shipments
        shipments = Shipment.query.options(
            joinedload(Shipment.shipment_items),
            joinedload(Shipment.customer),
            joinedload(Shipment.driver),
        ).all()

        # Debug: Check if customer is loaded
        if shipments:
            print(f"First shipment customer: {shipments[0].customer}")
            print(
                f"Customer username: {shipments[0].customer.username if shipments[0].customer else 'None'}"
            )

        # 4. Return Data
        data = shipments_schema.dump(shipments)
        return jsonify(data), 200

    except Exception as e:
        print(f"Error in Admin Route: {e}")
        return jsonify({"error": str(e)}), 500


@shipment_bp.route("/shipments/", methods=["POST"], strict_slashes=False)
@login_required
def create_shipment():
    """
    Creates a new shipment with recipient, weight, and items as JSON string.
    """
    try:
        current_user = get_jwt_identity()
        user_id = current_user["id"]

        # Validate and load data
        data = shipment_create_schema.load(request.get_json())

        # Create the Shipment record
        target_id = data.get("customer_id", user_id)

        new_shipment = Shipment(
            origin=data["origin"],
            destination=data["destination"],
            recipient=data["recipient"],
            weight=data["weight"],
            status="Pending",
            payment_status="Unpaid",
            notes=data.get("notes"),
            customer_id=target_id,
            driver_id=data.get("driver_id"),  # Optional: Admin might assign later
            created_at=datetime.utcnow(),
        )

        db.session.add(new_shipment)
        db.session.commit()
        return jsonify(shipment_schema.dump(new_shipment)), 201

    except Exception as e:
        db.session.rollback()
        print(e)
        return jsonify({"error": str(e)}), 400


@shipment_bp.route(
    "/shipments/<int:shipment_id>", methods=["GET"], strict_slashes=False
)
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
        new_status = data.get("status")

        # Business Rule: No Pay, No Delivery
        if new_status == "Delivered" and shipment.payment_status != "Paid":
            return jsonify({
                "error": "Cannot mark as Delivered. Payment is pending."
            }), 400

        # Admin Logic: Can assign drivers and update payment
        if role == "admin":
            if "driver_id" in data:
                shipment.driver_id = data["driver_id"]
            if "status" in data:
                shipment.status = data["status"]
            if "payment_status" in data:
                shipment.payment_status = data["payment_status"]

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


@shipment_bp.route("/shipments/track/<tracking_number>", methods=["GET"])
def track_shipment(tracking_number):
    """
    Public route to track a shipment by tracking number.
    """
    print(f"Searching for: {tracking_number}")
    shipment = Shipment.query.filter_by(tracking_number=tracking_number.upper()).first()
    print(f"Found shipment: {shipment}")
    if not shipment:
        return jsonify({"error": "Shipment not found"}), 404
    return jsonify(shipment_schema.dump(shipment)), 200
