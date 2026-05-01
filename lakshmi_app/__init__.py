import os
import shutil
from datetime import datetime, timedelta
from pathlib import Path

from flask import Flask
from flask_login import LoginManager

from .db import close_db, init_db


BASE_DIR = Path(__file__).resolve().parent.parent
login_manager = LoginManager()


def _database_path():
    configured_path = os.environ.get("DATABASE_PATH")
    if configured_path:
        return Path(configured_path)

    if os.environ.get("VERCEL"):
        writable_db = Path("/tmp/users.db")
        bundled_db = BASE_DIR / "users.db"

        if bundled_db.exists() and not writable_db.exists():
            shutil.copyfile(bundled_db, writable_db)

        return writable_db

    return BASE_DIR / "users.db"


def create_app(test_config=None):
    app = Flask(
        __name__,
        instance_relative_config=True,
        template_folder=str(BASE_DIR / "templates"),
        static_folder=str(BASE_DIR / "static"),
    )
    app.config.from_mapping(
        SECRET_KEY=os.environ.get("SECRET_KEY", "dev-secret-change-me"),
        DATABASE=_database_path(),
        PRODUCTS_CSV=BASE_DIR / "products" / "products_list.csv",
        SESSION_COOKIE_HTTPONLY=True,
        SESSION_COOKIE_SAMESITE="Lax",
        SESSION_COOKIE_SECURE=os.environ.get("FLASK_ENV") == "production",
        REMEMBER_COOKIE_DURATION=timedelta(days=3650),
        REMEMBER_COOKIE_HTTPONLY=True,
        REMEMBER_COOKIE_SAMESITE="Lax",
        REMEMBER_COOKIE_SECURE=os.environ.get("FLASK_ENV") == "production",
    )

    if test_config:
        app.config.update(test_config)

    app.teardown_appcontext(close_db)

    login_manager.login_view = "auth.login"
    login_manager.login_message = "Please login to continue."
    login_manager.login_message_category = "error"
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(user_id):
        from lakshmi_app.auth.repository import get_user_by_id

        return get_user_by_id(user_id)

    @app.context_processor
    def inject_template_globals():
        return {"current_year": datetime.now().year}

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
