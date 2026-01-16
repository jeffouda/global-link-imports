# Backend Files Testing Guide with Postman

This guide explains what each backend file does and provides step-by-step Postman testing instructions for every component.

## 📁 **File Structure Overview**

### **Core Application Files**
| File | Purpose | Test Method |
|------|---------|-------------|
| `app/__init__.py` | Flask app factory, extensions setup | Start server, check if all endpoints load |
| `app/config.py` | Configuration settings | Environment variables, JWT settings |
| `run.py` | Application entry point | `python run.py` to start server |

### **Models (Database)**
| File | Purpose | Test Method |
|------|---------|-------------|
| `app/models/user.py` | User authentication model | Register/Login endpoints |
| `app/models/product.py` | Product inventory model | Product CRUD endpoints |
| `app/models/shipment.py` | Shipment tracking model | Shipment CRUD endpoints |
| `app/models/shipment_item.py` | Individual shipment items | Included in shipment responses |

### **Routes (API Endpoints)**
| File | Purpose | Test Method |
|------|---------|-------------|
| `app/routes/auth.py` | Authentication endpoints | Register, Login, Refresh |
| `app/routes/product.py` | Product management | Create, Read, Update, Delete products |
| `app/routes/shipments.py` | Shipment management | Create, Read, Update shipments |

### **Services & Utils**
| File | Purpose | Test Method |
|------|---------|-------------|
| `app/services/shipment_service.py` | Business logic for shipments | Shipment creation workflow |
| `app/utils/decorators.py` | Authentication decorators | Access control testing |
| `app/schemas.py` | Data validation & serialization | Input validation testing |

---

## 🧪 **Step-by-Step Testing Guide**

### **1. Start the Server**
```bash
cd backend
source venv/bin/activate  # or . venv/bin/activate on some systems
python run.py
```
**Expected:** Server starts on `http://localhost:5000`

### **2. Test Core Application (`app/__init__.py`)**
**What it does:** Initializes Flask app, registers blueprints, sets up extensions
**Test:** Check if all endpoints are accessible
- Visit: `http://localhost:5000/api/auth/register`
- Should return: `405 Method Not Allowed` (endpoint exists but wrong method)

### **3. Test Configuration (`app/config.py`)**
**What it does:** JWT settings, database URI, secret keys
**Test:** Check JWT token expiration
- Login and wait 15+ minutes
- Try using access token → should get `401 Unauthorized`
- Use refresh token → should get new access token

---

## 🔐 **Authentication Testing (`app/routes/auth.py` + `app/models/user.py`)**

### **3.1 User Registration**
**Files:** `auth.py`, `user.py`, `schemas.py`
**Purpose:** Create new user accounts with validation

**Postman Request:**
```
Method: POST
URL: http://localhost:5000/api/auth/register
Headers:
  Content-Type: application/json

Body:
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123",
  "role": "customer"
}
```

**Expected Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "role": "customer"
  }
}
```

**Testing Validation (`schemas.py`):**
- Try empty email → `400 Bad Request`
- Try password < 6 chars → `400 Bad Request`
- Try duplicate email → `409 Conflict`

### **3.2 User Login**
**Files:** `auth.py`, `user.py`, `decorators.py`
**Purpose:** Authenticate users and issue JWT tokens

**Postman Request:**
```
Method: POST
URL: http://localhost:5000/api/auth/login
Headers:
  Content-Type: application/json

Body:
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

**Testing Password Hashing (`user.py`):**
- Correct password → Success
- Wrong password → `401 Unauthorized`

### **3.3 Token Refresh**
**Files:** `auth.py`, `config.py`
**Purpose:** Issue new access tokens using refresh tokens

**Postman Request:**
```
Method: POST
URL: http://localhost:5000/api/auth/refresh
Headers:
  Authorization: Bearer <refresh_token>
```

**Expected Response (200):**
```json
{
  "message": "Token refreshed successfully",
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

---

## 📦 **Product Management Testing (`app/routes/product.py` + `app/models/product.py`)**

### **4.1 Create Product (Admin Only)**
**Files:** `product.py`, `product.py`, `decorators.py`
**Purpose:** Add new products to inventory

**Postman Request:**
```
Method: POST
URL: http://localhost:5000/api/products
Headers:
  Authorization: Bearer <admin_token>
  Content-Type: application/json

Body:
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

**Testing Role Access (`decorators.py`):**
- Admin token → Success
- Customer token → `403 Forbidden`

### **4.2 Get All Products**
**Files:** `product.py`, `schemas.py`
**Purpose:** Retrieve product catalog

**Postman Request:**
```
Method: GET
URL: http://localhost:5000/api/products
Headers:
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

### **4.3 Update Product**
**Files:** `product.py`, `schemas.py`
**Purpose:** Modify product information

**Postman Request:**
```
Method: PUT
URL: http://localhost:5000/api/products/1
Headers:
  Authorization: Bearer <admin_token>
  Content-Type: application/json

Body:
{
  "name": "Gaming Laptop",
  "quantity": 8
}
```

### **4.4 Delete Product**
**Files:** `product.py`
**Purpose:** Remove products from inventory

**Postman Request:**
```
Method: DELETE
URL: http://localhost:5000/api/products/1
Headers:
  Authorization: Bearer <admin_token>
```

---

## 🚚 **Shipment Management Testing (`app/routes/shipments.py` + `app/models/shipment*.py`)**

### **5.1 Create Shipment**
**Files:** `shipments.py`, `shipment_service.py`, `shipment.py`, `shipment_item.py`
**Purpose:** Create new shipment orders

**Postman Request:**
```
Method: POST
URL: http://localhost:5000/api/shipments
Headers:
  Authorization: Bearer <customer_token>
  Content-Type: application/json

Body:
{
  "origin": "Nairobi",
  "destination": "Mombasa",
  "items": [
    {
      "name": "Laptop",
      "quantity": 2,
      "weight": 3.5
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
  "created_at": "2026-01-12T16:45:00",
  "items": [
    {
      "id": 1,
      "shipment_id": 1,
      "name": "Laptop",
      "quantity": 2,
      "weight": 3.5
    }
  ]
}
```

### **5.2 Get Shipments**
**Files:** `shipments.py`, `schemas.py`
**Purpose:** Retrieve shipment lists (role-based)

**Postman Request:**
```
Method: GET
URL: http://localhost:5000/api/shipments
Headers:
  Authorization: Bearer <token>
```

**Role-Based Results:**
- **Customer:** Only their shipments
- **Driver/Admin:** All shipments

### **5.3 Update Shipment Status**
**Files:** `shipments.py`, `decorators.py`
**Purpose:** Change shipment status (drivers only)

**Postman Request:**
```
Method: PUT
URL: http://localhost:5000/api/shipments/1/status
Headers:
  Authorization: Bearer <driver_token>
  Content-Type: application/json

Body:
{
  "status": "In Transit"
}
```

**Testing Access Control:**
- Driver/Admin → Success
- Customer → `403 Forbidden`

---

## 🛠️ **Utility Testing**

### **6.1 Test Authentication Decorators (`utils/decorators.py`)**
**Test unauthorized access:**
```
GET /api/products
(No Authorization header)
```
**Expected:** `401 Unauthorized`

### **6.2 Test Schema Validation (`schemas.py`)**
**Test invalid data:**
```
POST /api/auth/register
{
  "email": "invalid-email",
  "password": "123"
}
```
**Expected:** `400 Bad Request` with validation errors

### **6.3 Test Service Logic (`services/shipment_service.py`)**
**Test shipment creation workflow:**
- Create shipment → Check tracking number generation
- Verify database relationships
- Test error handling

---

## 🔍 **Complete Testing Workflow**

1. **Start Server** (`run.py`)
2. **Register Users** (different roles)
3. **Login** (get tokens)
4. **Create Products** (admin only)
5. **Create Shipments** (customer)
6. **Update Status** (driver)
7. **Test Access Control** (try forbidden actions)
8. **Test Token Refresh** (wait for expiration)
9. **Test Validation** (send invalid data)

## 📊 **Expected Test Results Summary**

| Component | Success Criteria | Files Tested |
|-----------|------------------|--------------|
| Authentication | JWT tokens issued, validation works | `auth.py`, `user.py`, `decorators.py` |
| Authorization | Role-based access enforced | `decorators.py`, all routes |
| Validation | Invalid data rejected | `schemas.py`, all routes |
| Serialization | JSON responses formatted correctly | `schemas.py`, all models |
| Business Logic | Shipments created with tracking numbers | `shipment_service.py` |
| Database | Models save/retrieve data properly | All `models/*.py` |

## 🚨 **Common Issues & Fixes**

- **404 Errors:** Check URL prefixes (`/api/auth`, `/api/products`)
- **401 Errors:** Include `Authorization: Bearer <token>` header
- **403 Errors:** Check user role permissions
- **400 Errors:** Validate request body format
- **500 Errors:** Check server logs for exceptions

This guide covers testing every aspect of your backend implementation!