# app/__init__.py
from flask import Flask
from app.extensions import db
from app.config import Config

# import models so SQLAlchemy registers them
from app.models import User, Shipment, Product, ShipmentItem

# blueprints
from app.routes.auth import auth_bp
from app.routes.shipments import shipments_bp
from app.routes.products import products_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # init extensions
    db.init_app(app)

    # register blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(shipments_bp)
    app.register_blueprint(products_bp)

    return app
