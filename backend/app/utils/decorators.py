from functools import wraps
from flask import session, jsonify

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({"error": "Unauthorized. Please log in."}), 401
        return f(*args, **kwargs)
    return decorated_function

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # 1. Check if logged in
        if 'user_id' not in session:
            return jsonify({"error": "Unauthorized. Please log in."}), 401
        
        # 2. Check if role is admin
        if session.get('role') != 'admin':
            return jsonify({"error": "Access denied. Admins only."}), 403
            
        return f(*args, **kwargs)
    return decorated_function