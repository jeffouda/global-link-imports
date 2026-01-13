# API Testing Guide with Postman

This guide provides step-by-step instructions for testing the GlobaLink API endpoints using Postman.

## Base URL
```
http://localhost:5000
```

## Authentication Overview
The API uses JWT (JSON Web Tokens) for authentication. Most endpoints require a valid JWT token in the Authorization header.

**Header Format:**
```
Authorization: Bearer <your_jwt_token>
```

## 1. User Registration

**Full URL:** `http://localhost:5000/api/auth/register`
**Method:** `POST`

**Body (JSON):**
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123",
  "role": "customer"  // Optional: "customer", "driver", or "admin"
}
```

**Expected Response (201):**
```json
{
  "message": "User registered successfully"
}
```

## 2. User Login

**Full URL:** `http://localhost:5000/api/auth/login`
**Method:** `POST`

**Body (JSON):**
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

**Expected Response (200):**
```json
{
  "message": "Login successful",
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "role": "customer"
  }
}
```

**Important:** Save both `access_token` and `refresh_token` for use in subsequent requests.

## 3. Refresh Access Token

**Full URL:** `http://localhost:5000/api/auth/refresh`
**Method:** `POST`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Expected Response (200):**
```json
{
  "message": "Token refreshed successfully",
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Note:** Use this endpoint to get a fresh access token. You can use either your current access token or refresh token. Access tokens expire after 15 minutes.

## 4. Testing Role-Based Access

### 4.1 Create Test Users with Different Roles

Register users with different roles:

**Admin User:**
```json
{
  "username": "admin",
  "email": "admin@example.com",
  "password": "admin123",
  "role": "admin"
}
```

**Driver User:**
```json
{
  "username": "driver",
  "email": "driver@example.com",
  "password": "driver123",
  "role": "driver"
}
```

**Customer User:**
```json
{
  "username": "customer",
  "email": "customer@example.com",
  "password": "customer123",
  "role": "customer"
}
```

## 5. Product Management (Admin Only)

### 5.1 Create Product (Admin Required)

**Full URL:** `http://localhost:5000/api/products`
**Method:** `POST`

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Laptop",
  "sku": "LAP001",
  "quantity": 10
}
```

**Expected Response (201):**
```json
{
  "id": 1,
  "name": "Laptop",
  "sku": "LAP001",
  "quantity": 10
}
```

### 5.2 Get All Products (Login Required)

**Full URL:** `http://localhost:5000/api/products`
**Method:** `GET`

**Headers:**
```
Authorization: Bearer <any_token>
```

**Expected Response (200):**
```json
[
  {
    "id": 1,
    "name": "Laptop",
    "sku": "LAP001",
    "quantity": 10
  }
]
```

### 5.3 Update Product (Admin Required)

**Full URL:** `http://localhost:5000/api/products/1`
**Method:** `PUT`

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Gaming Laptop",
  "quantity": 8
}
```

### 5.4 Delete Product (Admin Required)

**Full URL:** `http://localhost:5000/api/products/1`
**Method:** `DELETE`

**Headers:**
```
Authorization: Bearer <admin_token>
```

## 6. Shipment Management

### 6.1 Create Shipment (Login Required)

**Full URL:** `http://localhost:5000/api/shipments`
**Method:** `POST`

**Headers:**
```
Authorization: Bearer <customer_token>
Content-Type: application/json
```

**Body:**
```json
{
  "origin": "Nairobi",
  "destination": "Mombasa",
  "items": [
    {
      "product_id": 1,
      "quantity": 2
    }
  ]
}
```

**Expected Response (201):**
```json
{
  "id": 1,
  "tracking_number": "ABC12345",
  "status": "Pending",
  "origin": "Nairobi",
  "destination": "Mombasa",
  "payment_status": "Unpaid",
  "created_at": "2026-01-12T15:30:00"
}
```

### 6.2 Get Shipments

**Full URL:** `http://localhost:5000/api/shipments`
**Method:** `GET`

**Headers:**
```
Authorization: Bearer <token>
```

**Role-Based Behavior:**
- **Customer:** Sees only their own shipments
- **Driver/Admin:** Sees all shipments

### 6.3 Get Single Shipment

**Full URL:** `http://localhost:5000/api/shipments/1`
**Method:** `GET`

**Headers:**
```
Authorization: Bearer <token>
```

**Expected Response (200):**
```json
{
  "id": 1,
  "tracking_number": "ABC12345",
  "status": "Pending",
  "origin": "Nairobi",
  "destination": "Mombasa",
  "payment_status": "Unpaid",
  "created_at": "2026-01-12T15:30:00",
  "items": [
    {
      "id": 1,
      "shipment_id": 1,
      "product_id": 1,
      "quantity": 2
    }
  ]
}
```

### 6.4 Update Shipment Status (Driver/Admin Required)

**Full URL:** `http://localhost:5000/api/shipments/1/status`
**Method:** `PUT`

**Headers:**
```
Authorization: Bearer <driver_or_admin_token>
Content-Type: application/json
```

**Body:**
```json
{
  "status": "In Transit"
}
```

**Valid Statuses:** "Pending", "In Transit", "Delivered", "Cancelled"

### 6.5 Delete Shipment (Admin Required)

**Full URL:** `http://localhost:5000/api/shipments/1`
**Method:** `DELETE`

**Headers:**
```
Authorization: Bearer <admin_token>
```

## 7. Testing Access Control

### 7.1 Test Unauthorized Access

Try accessing protected endpoints without a token or with an invalid token:

**Full URL:** `http://localhost:5000/api/products`
**Method:** `GET`
**Headers:** (None - no Authorization header)

**Expected Response (401):**
```json
{
  "msg": "Missing Authorization Header"
}
```

### 7.2 Test Insufficient Permissions

Try accessing admin-only endpoints with a customer token:

**Full URL:** `http://localhost:5000/api/products`
**Method:** `POST`
**Headers:**
```
Authorization: Bearer <customer_token>
Content-Type: application/json
```

**Expected Response (403):**
```json
{
  "error": "Access denied. Admins only."
}
```

## 8. Postman Collection Setup

1. **Create a new collection** called "GlobaLink API"
2. **Create environment variables:**
   - `base_url`: `http://localhost:5000`
   - `admin_token`: (set after login)
   - `driver_token`: (set after login)
   - `customer_token`: (set after login)

3. **Set up login requests** to automatically save tokens to environment variables

4. **Use Tests tab** in Postman to automatically set environment variables:
   ```javascript
   if (pm.response.code === 200) {
       const response = pm.response.json();
       pm.environment.set("customer_token", response.access_token);
   }
   ```

## 9. Common Issues & Troubleshooting

### 9.1 Port Already in Use
If you get "Address already in use", the server is already running. You can:
- Kill the existing process: `pkill -f "python run.py"`
- Or run on a different port: `FLASK_RUN_PORT=5001 python run.py`

### 8.2 Database Issues
If you encounter database errors:
- Ensure migrations are up to date: `flask db upgrade`
- Check the database file exists in the correct location

### 8.3 Token Expiration
JWT tokens expire. If you get authentication errors, login again to get a fresh token.

## 10. Sample Test Flow

1. Register admin, driver, and customer users
2. Login with each to get tokens (save both access_token and refresh_token)
3. Test token refresh when access token expires
4. Create products (as admin)
5. Create shipments (as customer)
6. Update shipment status (as driver)
7. Try accessing restricted endpoints with different roles
8. Verify proper access control is enforced

## 11. Modern Authentication Concepts Implemented

This API implements industry-standard authentication practices:

- **JWT (JSON Web Tokens)**: Stateless authentication
- **Password Hashing**: Bcrypt with salt for secure password storage
- **Role-Based Access Control (RBAC)**: Customer, Driver, Admin roles
- **Token Expiration**: Access tokens (15 min), Refresh tokens (7 days)
- **Input Validation**: Marshmallow schemas for data validation
- **Serialization**: Safe JSON responses without recursion
- **HTTPS Ready**: Configured for secure transport (enable in production)

This testing guide covers all major functionality and role-based access control scenarios.