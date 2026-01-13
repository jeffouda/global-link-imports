from flask import Blueprint, request, jsonify
from app import db
from app.models.shipment import Shipment

shipment_bp = Blueprint("shipments", __name__)

# 1. GET ALL - Retrieve all shipments
@shipment_bp.route("", methods=["GET"])
def get_shipments():
    shipments = Shipment.query.all()
    # Using the model's to_dict() method for serialization
    return jsonify([s.to_dict() for s in shipments]), 200

# 2. POST - Create a new shipment
@shipment_bp.route("", methods=["POST"])
def create_shipment():
    data = request.get_json()

    # Basic validation for required fields
    if not data or "destination" not in data or "customer_id" not in data:
        return jsonify({"error": "Missing required fields (destination, customer_id)"}), 400

    new_shipment = Shipment(
        destination=data.get("destination"),
        customer_id=data.get("customer_id"),
        driver_id=data.get("driver_id"), # Optional
        status=data.get("status", "Pending"),
        payment_status=data.get("payment_status", "Unpaid")
    )

    db.session.add(new_shipment)
    db.session.commit()

    return jsonify(new_shipment.to_dict()), 201

# 3. GET ONE - Retrieve a specific shipment by ID
@shipment_bp.route("/<int:shipment_id>", methods=["GET"])
def get_shipment(shipment_id):
    shipment = Shipment.query.get(shipment_id)
    if not shipment:
        return jsonify({"error": "Shipment not found"}), 404
    
    return jsonify(shipment.to_dict()), 200

# 4. PATCH - Update an existing shipment
@shipment_bp.route("/<int:shipment_id>", methods=["PATCH"])
def update_shipment(shipment_id):
    shipment = Shipment.query.get(shipment_id)
    if not shipment:
        return jsonify({"error": "Shipment not found"}), 404

    data = request.get_json()
    if not data:
        return jsonify({"error": "No update data provided"}), 400

    # Conditionally update fields if they are present in the request
    if "destination" in data:
        shipment.destination = data["destination"]
    if "status" in data:
        shipment.status = data["status"]
    if "payment_status" in data:
        shipment.payment_status = data["payment_status"]
    if "driver_id" in data:
        shipment.driver_id = data["driver_id"]

    db.session.commit()
    return jsonify(shipment.to_dict()), 200

# 5. DELETE - Remove a shipment
@shipment_bp.route("/<int:shipment_id>", methods=["DELETE"])
def delete_shipment(shipment_id):
    shipment = Shipment.query.get(shipment_id)
    if not shipment:
        return jsonify({"error": "Shipment not found"}), 404

    db.session.delete(shipment)
    db.session.commit()

    return jsonify({"message": f"Shipment {shipment_id} deleted successfully"}), 200
