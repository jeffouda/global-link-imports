from flask import Blueprint, jsonify

shipment_bp = Blueprint("shipments", __name__)


@shipment_bp.route("/", methods=["GET"])
def get_shipments():
    return jsonify({"message": "Shipments route works"})
