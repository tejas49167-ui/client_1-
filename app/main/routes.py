from flask import Blueprint, g, render_template

from app.auth.routes import login_required
from app.cart.routes import cart_summary
from app.db import get_db
from app.products.repository import list_products, product_image_url


bp = Blueprint("main", __name__)


@bp.route("/")
@bp.route("/index.html")
def landing():
    products = list_products()[:4]
    slides = [
        "images/shop/slide1.jpg",
        "images/shop/slide2.jpg",
        "images/shop/slide3.jpg",
        "images/shop/slide4.webp",
    ]
    return render_template(
        "main/index.html",
        products=products,
        slides=slides,
        product_image_url=product_image_url,
    )


@bp.route("/privelage/")
@bp.route("/privelage/index.html")
@bp.route("/dashboard/")
@bp.route("/dashboard/index.html")
@bp.route("/account")
@login_required
def account():
    orders = get_db().execute(
        """
        SELECT id, total_amount, status, created_at
        FROM orders
        WHERE user_id = ?
        ORDER BY created_at DESC
        """,
        (g.user["id"],),
    ).fetchall()
    summary = cart_summary()
    return render_template("dashboard/account.html", orders=orders, summary=summary)
