# app/routes/__init__.py

from .auth import auth_bp
from .products import products_bp
from .shipments import shipments_bp

__all__ = [
    "auth_bp",
    "products_bp",
    "shipments_bp",
]
