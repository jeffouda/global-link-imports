from flask import Blueprint, jsonify

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/test", methods=["GET"])
def test_auth():
    return jsonify({"message": "Auth route works"})
