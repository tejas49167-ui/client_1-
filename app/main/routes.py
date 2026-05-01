from flask import Blueprint, redirect, render_template, url_for
from flask_login import current_user, login_required

from app.cart.routes import cart_summary
from app.db import get_db
from app.products.repository import list_products, product_image_url


bp = Blueprint("main", __name__)


@bp.route("/")
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
        (current_user.id,),
    ).fetchall()
    summary = cart_summary()
    return render_template("dashboard/account.html", orders=orders, summary=summary)


@bp.get("/index.html")
def legacy_index():
    return redirect(url_for("main.landing"), code=301)


@bp.get("/dashboard/")
@bp.get("/dashboard/index.html")
@bp.get("/privelage/")
@bp.get("/privelage/index.html")
def legacy_account():
    return redirect(url_for("main.account"), code=301)
