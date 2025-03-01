# Flask Authentication API

## Overview
This is a simple Flask-based authentication API that provides user authentication features, including user registration, login, password reset via OTP, and profile updates. It uses JWT (JSON Web Token) for authentication and SQLite as the database.

## Features
- **User Registration**: New users can sign up with an email and password.
- **User Login**: Users can log in with their credentials and receive a JWT token.
- **JWT Authentication**: Secure authentication using JSON Web Tokens.
- **Password Reset via OTP**: Users can reset their password using a one-time password (OTP) sent to their email.
- **Profile Update**: Users can update their profile details.
- **Logout Handling**: JWT is handled on the frontend for logout functionality.
- **Secure Password Storage**: Uses bcrypt for password hashing.

## Technologies Used
- **Flask** - Micro web framework for Python.
- **Flask-SQLAlchemy** - ORM for handling database operations.
- **Flask-Bcrypt** - For secure password hashing.
- **Flask-JWT-Extended** - Manages authentication using JWT.
- **Flask-CORS** - Enables Cross-Origin Resource Sharing for frontend communication.

## Database Schema
The database used in this project is **SQLite**. The schema for the `User` model is as follows:

| Column Name   | Data Type     | Constraints                    |
|--------------|--------------|--------------------------------|
| `id`         | Integer       | Primary Key, Auto-increment   |
| `email`      | String(100)   | Unique, Not Null              |
| `password`   | String(200)   | Hashed Password, Not Null     |
| `name`       | String(100)   | Optional User Name            |
| `otp`        | Integer       | Optional OTP for Password Reset |
| `otp_expiry` | DateTime      | Expiry Time for OTP           |

## Installation
Follow these steps to set up and run the project on your local machine.

### 1. Install Python
Ensure Python 3 is installed. Check using:
```sh
python --version
```

<!-- ### 2. Clone the Repository
```sh
git clone https://github.com/CipherCosmos/auth.git
cd flask-auth-api
``` -->

### 3. Create and Activate Virtual Environment
```sh
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
```

### 4. Install Dependencies
```sh
pip install -r requirements.txt
```

### 5. Initialize the Database
Run the following command inside a Python shell:
```python
from app import db
from app import app
with app.app_context():
    db.create_all()
```
This creates the `users.db` SQLite database.

### 6. Run the Application
```sh
python app.py
```
The application will start running on:
```
http://127.0.0.1:5000/
```

## API Endpoints
### 1. User Registration
**Endpoint:** `POST /register`

**Payload:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "username": "John Doe"
}
```

**Response:**
```json
{
  "message": "User registered successfully"
}
```

### 2. User Login
**Endpoint:** `POST /login`

**Payload:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt_token",
  "refresh": "refresh_token",
  "username": "John Doe",
  "email": "user@example.com"
}
```

### 3. Request Password Reset (OTP)
**Endpoint:** `POST /reset-password`

**Payload:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "OTP sent successfully"
}
```

### 4. Update Password
**Endpoint:** `POST /update-password`

**Payload:**
```json
{
  "email": "user@example.com",
  "otp": 123456,
  "new_password": "newsecurepassword"
}
```

**Response:**
```json
{
  "message": "Password updated successfully"
}
```

### 5. Update Profile
**Endpoint:** `PUT /update-profile`

**Headers:**
```json
{
  "Authorization": "Bearer jwt_token"
}
```

**Payload:**
```json
{
  "name": "New Name"
}
```

**Response:**
```json
{
  "message": "Profile updated successfully"
}
```

## Notes
- **Security:** Change `SECRET_KEY` and `JWT_SECRET_KEY` in `app.py` for enhanced security.
- **Database Storage:** SQLite is used for development. For production, use PostgreSQL or MySQL.
- **Email Sending:** The OTP is currently returned in the response. In production, integrate an email service to send the OTP.

## License
This project is open-source and free to use. Modify it as per your needs.

## Contact
For any issues or improvements, feel free to contribute or reach out.

Happy coding! 🚀

