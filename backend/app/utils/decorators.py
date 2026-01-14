from functools import wraps
from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity


<<<<<<< HEAD
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
=======
"""
decorators.py - The Security Gatekeeper
This file contains custom Python decorators that protect our API routes.
They wrap around route functions to perform checks (like "Is this user logged in?")
before the actual logic of the route is allowed to run.
"""

def login_required(f):
    """
    1. Authentication Check: Ensures the user is logged in.
    
    *args and **kwargs:
    - These are "catch-alls" for arguments. 
    - *args collects extra positional arguments (like /shipments/10).
    - **kwargs collects extra keyword arguments.
    - We use them so the decorator can pass whatever inputs the original 
      function needs without knowing what they are in advance!
    """
    @wraps(f) 
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({"error": "Unauthorized. Please log in."}), 401
        
        # We pass *args and **kwargs along to the original function 'f'
        return f(*args, **kwargs)
    return decorated_function

def roles_required(*roles):
    """
    2. Authorization Check: A flexible decorator for specific user types.
    - Example: @roles_required('admin', 'driver')
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if 'user_id' not in session:
                return jsonify({"error": "Unauthorized. Please log in."}), 401
            
            user_role = session.get('role')
            if user_role not in roles:
                return jsonify({"error": f"Access denied. Required roles: {', '.join(roles)}"}), 403
                
            # Passing all arguments through to the route
            return f(*args, **kwargs)
        return decorated_function
    return decorator

def admin_required(f):
    """
    3. Shorthand: Specialized for Admin-only routes.
    """
    return roles_required('admin')(f)

def driver_required(f):
    """
    4. Shorthand: Specialized for Driver-only routes.
    """
    return roles_required('driver')(f)
>>>>>>> main
