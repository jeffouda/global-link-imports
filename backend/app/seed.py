from app import create_app, db
from app.models.user import User
from app.models.product import Product
from app.models.shipment import Shipment
from app.models.shipment_item import ShipmentItem


def seed_database():
    """Seed the database with initial data."""
    app = create_app()

    with app.app_context():
        # Create all tables
        db.create_all()

        # Check if data already exists
        if User.query.first():
            print("Database already seeded.")
            return

        # Create users
        admin = User(username="admin", email="admin@example.com", role="admin")
        admin.set_password("admin123")

        driver = User(username="driver", email="driver@example.com", role="driver")
        driver.set_password("driver123")

        customer = User(
            username="customer", email="customer@example.com", role="customer"
        )
        customer.set_password("customer123")

        db.session.add_all([admin, driver, customer])
        db.session.commit()

        # Create products
        product1 = Product(name="Laptop", sku="LAP001", quantity=50)
        product2 = Product(name="Mouse", sku="MOU001", quantity=100)
        product3 = Product(name="Keyboard", sku="KEY001", quantity=75)

        db.session.add_all([product1, product2, product3])
        db.session.commit()

        # Create shipments
        shipment1 = Shipment(
            tracking_number="TRACK001",
            origin="Nairobi Warehouse",
            status="Pending",
            destination="123 Main St, Nairobi",
            payment_status="Paid",
            customer_id=customer.id,
            driver_id=driver.id,
        )

        shipment2 = Shipment(
            tracking_number="TRACK002",
            origin="Nairobi Warehouse",
            status="In Transit",
            destination="456 Oak Ave, Nairobi",
            payment_status="Unpaid",
            customer_id=customer.id,
        )

        db.session.add_all([shipment1, shipment2])
        db.session.commit()

        # Create shipment items
        item1 = ShipmentItem(
            shipment_id=shipment1.id, product_id=product1.id, quantity=1
        )
        item2 = ShipmentItem(
            shipment_id=shipment1.id, product_id=product2.id, quantity=2
        )
        item3 = ShipmentItem(
            shipment_id=shipment2.id, product_id=product3.id, quantity=1
        )

        db.session.add_all([item1, item2, item3])
        db.session.commit()

        print("Database seeded successfully!")


if __name__ == "__main__":
    seed_database()
