from functools import wraps
from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity


def login_required(f):
    """
    Decorator to ensure the user is logged in with a valid JWT token.
    """

    @wraps(f)
    @jwt_required()
    def decorated_function(*args, **kwargs):
        return f(*args, **kwargs)

    return decorated_function


def role_required(required_roles):
    """
    Helper decorator to check if the user has one of the required roles.
    Usage: @role_required(['admin']) or @role_required(['admin', 'driver'])
    """

    def decorator(f):
        @wraps(f)
        @jwt_required()
        def decorated_function(*args, **kwargs):
            current_user = get_jwt_identity()

            # Ensure current_user is a dictionary (depends on how you create the token)
            # If your token only stores ID, you might need to query the DB here.
            # Assuming token payload is: {"id": 1, "role": "admin"}
            user_role = (
                current_user.get("role") if isinstance(current_user, dict) else None
            )

            if user_role not in required_roles:
                return jsonify({"error": "Access denied."}), 403

            return f(*args, **kwargs)

        return decorated_function

    return decorator


# Shorthand Decorators 


def admin_required(f):
    """Restricts access to Admins only."""
    return role_required(["admin"])(f)


def driver_required(f):
    """Restricts access to Drivers (and usually Admins too)."""
    return role_required(["admin", "driver"])(f)
