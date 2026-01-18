from app import db


class Product(db.Model):
    __tablename__ = "products"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    sku = db.Column(db.String(50), unique=True, nullable=False)
    quantity = db.Column(db.Integer, default=0)

    # Removed to_dict method - using Marshmallow schemas for serialization
