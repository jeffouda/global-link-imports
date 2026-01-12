from functools import wraps
from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity


def login_required(f):
    @wraps(f)
    @jwt_required()
    def decorated_function(*args, **kwargs):
        return f(*args, **kwargs)

    return decorated_function


def admin_required(f):
    @wraps(f)
    @jwt_required()
    def decorated_function(*args, **kwargs):
        current_user = get_jwt_identity()
        if current_user.get("role") != "admin":
            return jsonify({"error": "Access denied. Admins only."}), 403
        return f(*args, **kwargs)

    return decorated_function


def driver_required(f):
    @wraps(f)
    @jwt_required()
    def decorated_function(*args, **kwargs):
        current_user = get_jwt_identity()
        if current_user.get("role") not in ["admin", "driver"]:
            return jsonify({"error": "Access denied. Drivers and Admins only."}), 403
        return f(*args, **kwargs)

    return decorated_function
