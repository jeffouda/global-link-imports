from flask import Blueprint, request, jsonify, current_app
from app import db, mail
from app.models.user import User
from app.schemas import user_register_schema, user_login_schema, user_schema
from app.utils.decorators import login_required
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity,
    get_jwt,
)
from flask_mail import Message
import random
import string
from datetime import datetime, timedelta

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


# FORGOT PASSWORD
@auth_bp.route("/forgot-password", methods=["POST"])
def forgot_password():
    try:
        data = request.get_json()
        print(f"Received Reset Request: {data}")  # Debugging
        if not data:
            return jsonify({"error": "Invalid JSON payload"}), 400
        email = data.get("email")
        if not email:
            return jsonify({"error": "Email is required"}), 400

        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({
                "message": "If the email exists, a reset code has been sent"
            }), 200  # Don't reveal if email exists

        # Generate 6-digit code
        reset_code = "".join(random.choices(string.digits, k=6))

        # Hash the code for storage
        from app import bcrypt

        hashed_code = bcrypt.generate_password_hash(reset_code).decode("utf-8")

        # Set expiry to 15 minutes from now
        expiry = datetime.utcnow() + timedelta(minutes=15)

        user.reset_token = hashed_code
        user.token_expiry = expiry
        db.session.commit()

        # Send email
        try:
            print(
                f"Mail config - SERVER: {current_app.config.get('MAIL_SERVER')}, USERNAME: {current_app.config.get('MAIL_USERNAME')}, PORT: {current_app.config.get('MAIL_PORT')}"
            )  # Debugging
            msg = Message(
                subject="Password Reset Code - GlobalLink Logistics",
                recipients=[email],
                body=f"Your password reset code is: {reset_code}\n\nThis code expires in 15 minutes.",
            )
            mail.send(msg)
            print("Email sent successfully")  # Debugging
        except Exception as mail_error:
            print(f"Mail sending failed: {mail_error}")  # Debugging
            return jsonify({"error": f"Failed to send email: {str(mail_error)}"}), 500

        return jsonify({
            "message": "If the email exists, a reset code has been sent"
        }), 200

    except Exception as e:
        db.session.rollback()
        print(f"Forgot password error: {e}")  # Debugging
        return jsonify({"error": str(e)}), 400


# RESET PASSWORD
@auth_bp.route("/reset-password", methods=["POST"])
def reset_password():
    try:
        data = request.get_json()
        email = data.get("email")
        code = data.get("code")
        new_password = data.get("new_password")

        if not all([email, code, new_password]):
            return jsonify({
                "message": "Email, code, and new password are required"
            }), 400

        user = User.query.filter_by(email=email).first()
        if not user or not user.reset_token or not user.token_expiry:
            return jsonify({"message": "Invalid or expired reset code"}), 400

        # Check if code is expired
        if datetime.utcnow() > user.token_expiry:
            return jsonify({"message": "Reset code has expired"}), 400

        # Verify code
        from app import bcrypt

        if not bcrypt.check_password_hash(user.reset_token, code):
            return jsonify({"message": "Invalid reset code"}), 400

        # Update password
        user.set_password(new_password)
        user.reset_token = None
        user.token_expiry = None
        db.session.commit()

        return jsonify({"message": "Password reset successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 400


# GET DRIVERS
@auth_bp.route("/users/drivers", methods=["GET"])
@login_required
def get_drivers():
    try:
        drivers = User.query.filter_by(role="driver").all()
        return jsonify([
            {"id": d.id, "email": d.email, "name": d.username} for d in drivers
        ]), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 400
