from flask import Blueprint, flash, g, redirect, render_template, url_for

from app.auth.routes import login_required
from app.cart.routes import cart_summary, get_cart_items
from app.db import get_db


bp = Blueprint("orders", __name__)


@bp.route("/checkout", methods=["GET", "POST"])
@login_required
def checkout():
    items = get_cart_items()
    summary = cart_summary(items)

    if not items:
        flash("Your cart is empty.", "error")
        return redirect(url_for("cart.cart_page"))

    return render_template("orders/checkout.html", items=items, summary=summary)


@bp.route("/checkout/place", methods=["POST"])
@login_required
def place_order():
    items = get_cart_items()
    summary = cart_summary(items)

    if not items:
        flash("Your cart is empty.", "error")
        return redirect(url_for("cart.cart_page"))

    order_data = {
        "user_id": g.user["id"],
        "total_amount": summary["total"],
        "status": "Placed",
    }
    order_columns = _table_columns("orders")

    if "design_name" in order_columns:
        order_data["design_name"] = f"{len(items)} product(s)"

    if "price" in order_columns:
        order_data["price"] = str(summary["total"])

    selected_columns = [column for column in order_data if column in order_columns]
    placeholders = ", ".join("?" for _ in selected_columns)
    cursor = get_db().execute(
        f"INSERT INTO orders ({', '.join(selected_columns)}) VALUES ({placeholders})",
        tuple(order_data[column] for column in selected_columns),
    )
    order_id = cursor.lastrowid

    for item in items:
        get_db().execute(
            """
            INSERT INTO order_items (order_id, product_id, product_name, price, quantity)
            VALUES (?, ?, ?, ?, ?)
            """,
            (order_id, item["product_id"], item["product_name"], item["price"], item["quantity"]),
        )

    get_db().execute("DELETE FROM cart_items WHERE user_id = ?", (g.user["id"],))
    get_db().commit()
    flash("Order placed successfully.", "success")
    return redirect(url_for("main.account"))


def _table_columns(table_name):
    rows = get_db().execute(f"PRAGMA table_info({table_name})").fetchall()
    return {row["name"] for row in rows}
