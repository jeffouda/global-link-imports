from flask import Flask
from flask_cors import CORS
from app.config import Config
from app.extensions import db, bcrypt, jwt, migrate, ma, mail


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Init extensions with app
    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    jwt.init_app(app)
    ma.init_app(app)
    mail.init_app(app)

    # Enable CORS (Allow Frontend running on localhost:5173 to talk to backend)
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

    # Import models to ensure they are registered with SQLAlchemy
    from app import models

    # Register Blueprints (Connecting your routes)
    from app.routes.auth import auth_bp
    from app.routes.product import product_bp
    from app.routes.shipments import shipment_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(product_bp, url_prefix="/api")
    app.register_blueprint(shipment_bp, url_prefix="/api")

    # You will register other blueprints here later (e.g., shipments_bp)

    return app
