from flask import Blueprint, request, jsonify
from app import db
from app.models.user import User
from app.schemas import user_register_schema, user_login_schema, user_schema
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity,
    get_jwt,
)

# Define Blueprint
auth_bp = Blueprint("auth", __name__)


# REGISTRATION
@auth_bp.route("/register", methods=["POST"])
def register():
    try:
        # Validate input data
        data = user_register_schema.load(request.get_json())

        # Create new user
        new_user = User(
            username=data["username"],
            email=data["email"],
            role=data["role"],
        )

        # Hash Password & Save
        new_user.set_password(data["password"])
        db.session.add(new_user)
        db.session.commit()

        # Return user data (without password)
        result = user_schema.dump(new_user)
        return jsonify({"message": "User registered successfully", "user": result}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 400


# LOGIN
@auth_bp.route("/login", methods=["POST"])
def login():
    try:
        # Validate input data
        data = user_login_schema.load(request.get_json())

        # Find User
        user = User.query.filter_by(email=data["email"]).first()

        # Check Password
        if user and user.check_password(data["password"]):
            # Create Tokens
            access_token = create_access_token(
                identity={"id": user.id, "role": user.role}
            )
            refresh_token = create_refresh_token(
                identity={"id": user.id, "role": user.role}
            )

            # Return user data using schema (safe serialization)
            result = user_schema.dump(user)

            return jsonify({
                "message": "Login successful",
                "access_token": access_token,
                "refresh_token": refresh_token,
                "user": result,
            }), 200
        else:
            return jsonify({"message": "Invalid email or password"}), 401

    except Exception as e:
        return jsonify({"message": str(e)}), 400


# REFRESH TOKEN
@auth_bp.route("/refresh", methods=["POST"])
@jwt_required()
def refresh():
    try:
        # For now, accept any valid JWT token and create a new access token
        # In production, you might want to restrict this to refresh tokens only
        current_user = get_jwt_identity()
        access_token = create_access_token(identity=current_user)

        return jsonify({
            "message": "Token refreshed successfully",
            "access_token": access_token,
        }), 200

    except Exception as e:
        return jsonify({"message": str(e)}), 400
