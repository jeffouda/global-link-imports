from flask import Blueprint, request, jsonify
from app import db
from app.models.product import Product
from app.schemas import product_schema, products_schema
from app.utils.decorators import login_required, admin_required

product_bp = Blueprint("product", __name__)


@product_bp.route("/products", methods=["GET"])
@login_required
def get_products():
    products = Product.query.all()
    return jsonify(products_schema.dump(products)), 200


@product_bp.route("/products", methods=["POST"])
@admin_required
def create_product():
    try:
        # Validate and deserialize input
        product_data = product_schema.load(request.get_json(), session=db.session)

        # Check for duplicate SKU
        if Product.query.filter_by(sku=product_data.sku).first():
            return jsonify({"message": "SKU already exists"}), 409

        db.session.add(product_data)
        db.session.commit()

        return jsonify(product_schema.dump(product_data)), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 400


@product_bp.route("/products/<int:product_id>", methods=["PUT"])
@admin_required
def update_product(product_id):
    product = Product.query.get_or_404(product_id)
    data = request.get_json()

    if data.get("name"):
        product.name = data["name"]
    if data.get("sku"):
        if (
            Product.query.filter_by(sku=data["sku"]).first()
            and data["sku"] != product.sku
        ):
            return jsonify({"message": "SKU already exists"}), 409
        product.sku = data["sku"]
    if data.get("quantity") is not None:
        product.quantity = data["quantity"]

    db.session.commit()
    return jsonify(product_schema.dump(product)), 200


@product_bp.route("/products/<int:product_id>", methods=["DELETE"])
@admin_required
def delete_product(product_id):
    product = Product.query.get_or_404(product_id)
    db.session.delete(product)
    db.session.commit()
    return jsonify({"message": "Product deleted"}), 200
