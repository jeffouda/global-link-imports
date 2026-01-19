from app import ma, db
from app.models.user import User
from app.models.product import Product
from app.models.shipment import Shipment
from app.models.shipment_item import ShipmentItem
from marshmallow import fields, validates, ValidationError
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema, auto_field
import re


class UserSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = User
        sqla_session = db.session
        load_instance = True
        exclude = ("password_hash",)  # Never serialize password hash

    # Custom validation for email
    @validates("email")
    def validate_email(self, value):
        if not re.match(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$", value):
            raise ValidationError("Invalid email format")

    # Custom validation for password (for registration)
    password = fields.Str(load_only=True, required=True, validate=lambda x: len(x) >= 6)

    # Custom validation for role
    @validates("role")
    def validate_role(self, value):
        if value not in ["customer", "driver", "admin"]:
            raise ValidationError("Role must be customer, driver, or admin")


class UserLoginSchema(ma.Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=lambda x: len(x) >= 6)


class UserRegisterSchema(ma.Schema):
    username = fields.Str(required=True, validate=lambda x: len(x) >= 2)
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=lambda x: len(x) >= 6)
    role = fields.Str(
        load_default="customer", validate=lambda x: x in ["customer", "driver", "admin"]
    )

    @validates("email")
    def validate_email_unique(self, value):
        if User.query.filter_by(email=value).first():
            raise ValidationError("Email already registered")


class ProductSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Product
        sqla_session = db.session
        load_instance = True


class ShipmentItemSchema(ma.Schema):
    id = fields.Int()
    shipment_id = fields.Int()
    product_id = fields.Int()
    quantity = fields.Int()


class ShipmentSchema(ma.Schema):
    id = fields.Int()
    tracking = fields.Str(attribute="tracking_number")
    status = fields.Str()
    origin = fields.Str()
    destination = fields.Str()
    payment = fields.Str(attribute="payment_status")
    customer_id = fields.Int()
    driver_id = fields.Int()
    created_at = fields.DateTime()
    customer_name = fields.Method("get_customer_name")
    customerEmail = fields.Method("get_customer_email")
    driverName = fields.Method("get_driver_name")
    # items = fields.Nested(ShipmentItemSchema, many=True)

    def get_customer_name(self, obj):
        return obj.customer.username if obj.customer else "Unknown Customer"

    def get_customer_email(self, obj):
        return obj.customer.email if obj.customer else None

    def get_driver_name(self, obj):
        return obj.driver.username if obj.driver else None


class ShipmentCreateSchema(ma.Schema):
    tracking_number = fields.Str(required=False)  # Will be generated if not provided
    origin = fields.Str(required=True)
    destination = fields.Str(required=True)
    recipient = fields.Str(required=True)
    weight = fields.Float(required=True)
    notes = fields.Str(required=False)
    driver_id = fields.Int(required=False, allow_none=True)
    customer_id = fields.Int(required=False)
    items = fields.List(
        fields.Dict(keys=fields.Str(), values=fields.Raw()), required=True
    )

    @validates("items")
    def validate_items(self, value):
        if not value:
            raise ValidationError("At least one item is required")
        for item in value:
            if "product_id" not in item or "quantity" not in item:
                raise ValidationError("Each item must have product_id and quantity")
            if not isinstance(item["quantity"], int) or item["quantity"] <= 0:
                raise ValidationError("Quantity must be a positive integer")


class ShipmentStatusUpdateSchema(ma.Schema):
    status = fields.Str(
        required=True,
        validate=lambda x: x in ["Pending", "In Transit", "Delivered", "Cancelled"],
    )


# Create schema instances
user_schema = UserSchema()
users_schema = UserSchema(many=True)
user_login_schema = UserLoginSchema()
user_register_schema = UserRegisterSchema()

product_schema = ProductSchema()
products_schema = ProductSchema(many=True)

shipment_schema = ShipmentSchema()
shipments_schema = ShipmentSchema(many=True)
shipment_create_schema = ShipmentCreateSchema()
shipment_status_schema = ShipmentStatusUpdateSchema()

shipment_item_schema = ShipmentItemSchema()
shipment_items_schema = ShipmentItemSchema(many=True)
