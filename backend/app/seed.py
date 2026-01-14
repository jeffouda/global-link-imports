from app import create_app
from app.extensions import db
from app.models import User, Product, Shipment, ShipmentItem

def seed_users():
    admin = User(
        username="admin",
        email="admin@example.com",
        role="admin"
    )
    admin.set_password("admin123")

    customer = User(
        username="customer",
        email="customer@example.com",
        role="customer"
    )
    customer.set_password("customer123")

    driver = User(
        username="driver",
        email="driver@example.com",
        role="driver"
    )
    driver.set_password("driver123")

    db.session.add_all([admin, customer, driver])
    db.session.commit()

    return admin, customer, driver


def seed_products():
    products = [
        Product(name="Laptop", price=1200.00),
        Product(name="Phone", price=800.00),
        Product(name="Headphones", price=150.00),
    ]

    db.session.add_all(products)
    db.session.commit()

    return products


def seed_shipments(customer):
    shipment1 = Shipment(
        destination="Nairobi",
        status="pending",
        payment_status="paid",
        user_id=customer.id
    )

    shipment2 = Shipment(
        destination="Mombasa",
        status="in_transit",
        payment_status="unpaid",
        user_id=customer.id
    )

    db.session.add_all([shipment1, shipment2])
    db.session.commit()

    return shipment1, shipment2


def seed_shipment_items(shipments, products):
    items = [
        ShipmentItem(
            shipment_id=shipments[0].id,
            product_id=products[0].id,
            quantity=1
        ),
        ShipmentItem(
            shipment_id=shipments[0].id,
            product_id=products[2].id,
            quantity=2
        ),
        ShipmentItem(
            shipment_id=shipments[1].id,
            product_id=products[1].id,
            quantity=1
        ),
    ]

    db.session.add_all(items)
    db.session.commit()


def run_seed():
    app = create_app()

    with app.app_context():
        print("🌱 Seeding database...")

        db.drop_all()
        db.create_all()

        admin, customer, driver = seed_users()
        products = seed_products()
        shipments = seed_shipments(customer)
        seed_shipment_items(shipments, products)

        print("✅ Seeding complete!")


if __name__ == "__main__":
    run_seed()
