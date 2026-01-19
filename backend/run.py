from app import create_app, db
from app.models.shipment import Shipment, generate_tracking_number

app = create_app()


@app.cli.command("update-tracking")
def update_tracking_numbers():
    """Update shipments with missing tracking numbers."""
    with app.app_context():
        # Query shipments with empty or None tracking numbers
        shipments_to_update = Shipment.query.filter(
            (Shipment.tracking_number.is_(None)) | (Shipment.tracking_number == "")
        ).all()

        print(f"Found {len(shipments_to_update)} shipments without tracking numbers.")

        updated_count = 0
        for shipment in shipments_to_update:
            shipment.tracking_number = generate_tracking_number()
            updated_count += 1
            print(
                f"Updated shipment ID {shipment.id} with tracking number: {shipment.tracking_number}"
            )

        if updated_count > 0:
            db.session.commit()
            print(f"Successfully updated {updated_count} shipments.")
        else:
            print("No shipments needed updating.")


if __name__ == "__main__":
    app.run(debug=True)
