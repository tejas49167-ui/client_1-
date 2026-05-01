import os
from pathlib import Path

from flask import Flask

from .db import close_db, init_db


BASE_DIR = Path(__file__).resolve().parent.parent


def create_app(test_config=None):
    app = Flask(
        __name__,
        instance_relative_config=True,
        template_folder=str(BASE_DIR / "templates"),
        static_folder=str(BASE_DIR / "static"),
    )
    app.config.from_mapping(
        SECRET_KEY=os.environ.get("SECRET_KEY", "dev-secret-change-me"),
        DATABASE=BASE_DIR / "users.db",
        PRODUCTS_CSV=BASE_DIR / "products" / "products_list.csv",
        SESSION_COOKIE_HTTPONLY=True,
        SESSION_COOKIE_SAMESITE="Lax",
        SESSION_COOKIE_SECURE=os.environ.get("FLASK_ENV") == "production",
    )

    if test_config:
        app.config.update(test_config)

    app.teardown_appcontext(close_db)

    from .auth.routes import bp as auth_bp
    from .cart.routes import bp as cart_bp
    from .main.routes import bp as main_bp
    from .orders.routes import bp as orders_bp
    from .products.routes import bp as products_bp

    app.register_blueprint(main_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(products_bp)
    app.register_blueprint(cart_bp)
    app.register_blueprint(orders_bp)

    with app.app_context():
        init_db()

    return app
