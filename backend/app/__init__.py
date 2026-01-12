from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_migrate import Migrate
from flask_marshmallow import Marshmallow
from app.config import Config

# Initialize Extensions (Global scope)
db = SQLAlchemy()
bcrypt = Bcrypt()
jwt = JWTManager()
migrate = Migrate()
ma = Marshmallow()


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Init extensions with app
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    ma.init_app(app)

    # Enable CORS (Allow Frontend running on localhost:3000 to talk to backend)
    CORS(app, resources={r"/api/*": {"origins": "*"}})

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
