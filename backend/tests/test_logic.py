import pytest
import json
from app import create_app, db
from app.models.user import User
from app.models.product import Product
from app.models.shipment import Shipment
from app.models.shipment_item import ShipmentItem


@pytest.fixture
def app():
    app = create_app()
    app.config["TESTING"] = True
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
    with app.app_context():
        db.create_all()
        yield app
        db.drop_all()


@pytest.fixture
def client(app):
    return app.test_client()


@pytest.fixture
def runner(app):
    return app.test_cli_runner()


def create_user(client, username, email, password, role):
    response = client.post(
        "/api/auth/register",
        json={"username": username, "email": email, "password": password, "role": role},
    )
    return response


def login_user(client, email, password):
    response = client.post(
        "/api/auth/login", json={"email": email, "password": password}
    )
    data = json.loads(response.data)
    return data["access_token"]


def create_product(client, token, name, sku, quantity):
    response = client.post(
        "/api/products",
        json={"name": name, "sku": sku, "quantity": quantity},
        headers={"Authorization": f"Bearer {token}"},
    )
    return response


def test_spy_security(client):
    # Create two customers
    create_user(client, "customer_a", "a@example.com", "pass123", "customer")
    create_user(client, "customer_b", "b@example.com", "pass123", "customer")

    token_a = login_user(client, "a@example.com", "pass123")
    token_b = login_user(client, "b@example.com", "pass123")

    # Create product
    create_product(client, token_a, "Test Product", "TEST001", 10)

    # Customer A creates shipment
    response = client.post(
        "/api/shipments",
        json={
            "destination": "Test Destination",
            "origin": "Test Origin",
            "items": [{"product_id": 1, "quantity": 1}],
        },
        headers={"Authorization": f"Bearer {token_a}"},
    )
    assert response.status_code == 201
    shipment_data = json.loads(response.data)
    shipment_id = shipment_data["id"]

    # Customer B tries to access A's shipment
    response = client.get(
        f"/api/shipments/{shipment_id}", headers={"Authorization": f"Bearer {token_b}"}
    )
    assert response.status_code == 403


def test_admin_god_mode(client):
    # Create admin and customer
    create_user(client, "admin", "admin@example.com", "pass123", "admin")
    create_user(client, "customer", "cust@example.com", "pass123", "customer")

    token_admin = login_user(client, "admin@example.com", "pass123")
    token_cust = login_user(client, "cust@example.com", "pass123")

    # Create product
    create_product(client, token_admin, "Test Product", "TEST001", 10)

    # Customer creates shipment
    response = client.post(
        "/api/shipments",
        json={
            "destination": "Test Destination",
            "origin": "Test Origin",
            "items": [{"product_id": 1, "quantity": 1}],
        },
        headers={"Authorization": f"Bearer {token_cust}"},
    )
    assert response.status_code == 201
    shipment_data = json.loads(response.data)
    shipment_id = shipment_data["id"]

    # Admin can see all shipments
    response = client.get(
        "/api/shipments", headers={"Authorization": f"Bearer {token_admin}"}
    )
    assert response.status_code == 200
    shipments = json.loads(response.data)
    assert len(shipments) == 1

    # Admin can delete shipment
    response = client.delete(
        f"/api/shipments/{shipment_id}",
        headers={"Authorization": f"Bearer {token_admin}"},
    )
    assert response.status_code == 200

    # Customer cannot delete
    # First recreate shipment
    response = client.post(
        "/api/shipments",
        json={
            "destination": "Test Destination",
            "origin": "Test Origin",
            "items": [{"product_id": 1, "quantity": 1}],
        },
        headers={"Authorization": f"Bearer {token_cust}"},
    )
    shipment_data = json.loads(response.data)
    shipment_id = shipment_data["id"]

    response = client.delete(
        f"/api/shipments/{shipment_id}",
        headers={"Authorization": f"Bearer {token_cust}"},
    )
    assert response.status_code == 403


def test_transaction_integrity(client):
    # Create admin and customer
    create_user(client, "admin", "admin@example.com", "pass123", "admin")
    create_user(client, "customer", "cust@example.com", "pass123", "customer")
    admin_token = login_user(client, "admin@example.com", "pass123")
    token = login_user(client, "cust@example.com", "pass123")

    # Create product with admin
    create_product(client, admin_token, "Test Product", "TEST001", 10)

    # Attempt invalid shipment (missing destination)
    response = client.post(
        "/api/shipments",
        json={"origin": "Test Origin", "items": [{"product_id": 1, "quantity": 1}]},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 400

    # Check no shipments created
    response = client.get(
        "/api/shipments", headers={"Authorization": f"Bearer {token}"}
    )
    shipments = json.loads(response.data)
    assert len(shipments) == 0

    # Create valid shipment
    response = client.post(
        "/api/shipments",
        json={
            "destination": "Test Destination",
            "origin": "Test Origin",
            "items": [{"product_id": 1, "quantity": 1}],
        },
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 201
    shipment_data = json.loads(response.data)
    assert "tracking_number" in shipment_data
    assert len(shipment_data["items"]) == 1


def test_driver_workflow(client):
    # Create driver and customer
    create_user(client, "driver", "driver@example.com", "pass123", "driver")
    create_user(client, "customer", "cust@example.com", "pass123", "customer")

    token_driver = login_user(client, "driver@example.com", "pass123")
    token_cust = login_user(client, "cust@example.com", "pass123")

    # Create product
    create_product(client, token_cust, "Test Product", "TEST001", 10)

    # Customer creates shipment
    response = client.post(
        "/api/shipments",
        json={
            "destination": "Test Destination",
            "origin": "Test Origin",
            "items": [{"product_id": 1, "quantity": 1}],
        },
        headers={"Authorization": f"Bearer {token_cust}"},
    )
    shipment_data = json.loads(response.data)
    shipment_id = shipment_data["id"]

    # Driver can update status
    response = client.patch(
        f"/api/shipments/{shipment_id}",
        json={"status": "In Transit"},
        headers={"Authorization": f"Bearer {token_driver}"},
    )
    assert response.status_code == 200

    # But cannot change destination
    response = client.patch(
        f"/api/shipments/{shipment_id}",
        json={"destination": "New Destination"},
        headers={"Authorization": f"Bearer {token_driver}"},
    )
    assert response.status_code == 200  # Patch allows, but only status should change
    # Actually, in code, driver can only update status, so destination change should not happen
    # But the code doesn't prevent it in the route, wait, in update_shipment, for driver, only if 'status' in data
    # So it won't change destination
    updated_data = json.loads(response.data)
    assert updated_data["destination"] == "Test Destination"  # Should remain unchanged
