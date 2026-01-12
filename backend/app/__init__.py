from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from app.config import Config

# 1. Initialize the extensions (but don't bind to app yet)
db = SQLAlchemy()
migrate = Migrate()
bcrypt = Bcrypt()
cors = CORS()


def create_app(config_class=Config):
    # 2. Create the Flask app instance
    app = Flask(__name__)
    app.config.from_object(config_class)

    # 3. Bind extensions to the app
    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)

    # Allow CORS for localhost:5173 (Vite) and localhost:3000 (standard React)
    cors.init_app(
        app,
        resources={
            r"/*": {"origins": ["http://localhost:5173", "http://localhost:3000"]}
        },
    )

    # 4. Import and Register Blueprints (Routes)
    # We do this inside the function to avoid "Circular Import" errors
    from app.routes.auth import auth_bp
    from app.routes.shipments import shipment_bp
    # from app.routes.products import product_bp (Uncomment when you create this file)

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(shipment_bp, url_prefix="/api/shipments")
    # app.register_blueprint(product_bp, url_prefix='/api/products')

    # 5. Simple Test Route
    @app.route("/")
    def home():
        return {"message": "Global Link Imports API is running!"}

    return app
