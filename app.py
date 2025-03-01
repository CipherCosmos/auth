"""
Flask Authentication API
========================
This Flask application provides user authentication functionalities, including:
- User registration
- Login with JWT-based authentication
- Password reset via OTP
- Profile update

Technologies Used:
- Flask
- Flask-SQLAlchemy
- Flask-Bcrypt
- Flask-JWT-Extended
- Flask-CORS

Ensure you install dependencies from `requirements.txt` before running the application.
"""

import os
import random
import datetime
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity,
)
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__)

# Enable CORS for frontend (Adjust origins as needed)
# CORS(app, supports_credentials=True, origins=["http://localhost:5173"])
CORS(app, supports_credentials=True, origins="*", allow_headers=["Content-Type", "Authorization", "X-CSRFToken"])

# Database Configuration
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///users.db"  # Using SQLite as the database
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SECRET_KEY"] = "your_secret_key"  # Change this for security
app.config["JWT_SECRET_KEY"] = "your_jwt_secret"  # Change this for security

# Initialize Extensions
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# User Model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    name = db.Column(db.String(100), nullable=True)
    otp = db.Column(db.Integer, nullable=True)
    otp_expiry = db.Column(db.DateTime, nullable=True)

# Initialize Database
with app.app_context():
    db.create_all()

# Register Route
@app.route("/register", methods=["POST"])
def register():
    """Registers a new user by storing their email, hashed password, and name."""
    data = request.json
    email = data.get("email")
    password = data.get("password")
    username = data.get("username")

    if User.query.filter_by(email=email).first():
        return jsonify({"message": "User already exists"}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")
    new_user = User(email=email, password=hashed_password, name=username)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 200

# Login Route
@app.route("/login", methods=["POST"])
def login():
    """Authenticates a user and returns JWT tokens."""
    data = request.json
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()

    if not user or not bcrypt.check_password_hash(user.password, password):
        return jsonify({"message": "Invalid credentials"}), 401

    access_token = create_access_token(identity=email)
    refresh_token = create_refresh_token(identity=email)
    return jsonify({
        "message": "Login successful",
        "token": access_token,
        "refresh": refresh_token,
        "username": user.name,
        "email": user.email
    }), 200

# Request Password Reset (OTP)
@app.route("/reset-password", methods=["POST"])
def reset_password():
    """Generates and stores a one-time password (OTP) for resetting password."""
    data = request.json
    email = data.get("email")

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"message": "User not found"}), 404

    otp = random.randint(100000, 999999)
    expiry_time = datetime.datetime.utcnow() + datetime.timedelta(minutes=5)
    user.otp = otp
    user.otp_expiry = expiry_time
    db.session.commit()

    return jsonify({"message": otp}), 200  # Replace with email sending logic

# Verify OTP & Update Password
@app.route("/update-password", methods=["POST"])
def update_password():
    """Validates OTP and updates the user's password."""
    data = request.json
    email = data.get("email")
    otp = data.get("otp")
    new_password = data.get("new_password")

    user = User.query.filter_by(email=email).first()
    if not user or user.otp != otp or datetime.datetime.utcnow() > user.otp_expiry:
        return jsonify({"message": "Invalid or expired OTP"}), 400

    user.password = bcrypt.generate_password_hash(new_password).decode("utf-8")
    user.otp = None
    user.otp_expiry = None
    db.session.commit()

    return jsonify({"message": "Password updated successfully"}), 200

# Logout Route
@app.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    """Handles logout (JWT is managed on frontend)."""
    return jsonify({"message": "Logout successful"}), 200

# Update Profile
@app.route("/update-profile", methods=["PUT"])
@jwt_required()
def update_profile():
    """Updates the user's profile information (name)."""
    current_user_email = get_jwt_identity()
    data = request.json
    new_name = data.get("name")

    user = User.query.filter_by(email=current_user_email).first()
    if not user:
        return jsonify({"message": "User not found"}), 404

    user.name = new_name
    db.session.commit()

    return jsonify({"message": "Profile updated successfully"}), 200

if __name__ == "__main__":
    app.run(debug=True)
