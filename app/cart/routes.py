from flask import Blueprint, flash, redirect, render_template, request, url_for
from flask_login import current_user, login_required

from app.db import get_db
from app.products.repository import get_product, product_image_url


bp = Blueprint("cart", __name__)


@bp.route("/cart")
@login_required
def cart_page():
    items = get_cart_items()
    return render_template("cart/cart.html", items=items, summary=cart_summary(items))


@bp.route("/cart/add/<product_id>", methods=["POST"])
@bp.route("/cart/add", methods=["POST"])
@login_required
def add_to_cart(product_id=None):
    product_id = product_id or request.form.get("product_id") or request.form.get("design_name")
    product = get_product(product_id)

    if product is None:
        flash("Product could not be found.", "error")
        return redirect(url_for("products.product_list"))

    quantity = max(int(request.form.get("quantity", 1)), 1)
    existing = get_db().execute(
        "SELECT id, quantity FROM cart_items WHERE user_id = ? AND product_id = ?",
        (current_user.id, product.id),
    ).fetchone()

    if existing:
        get_db().execute(
            """
            UPDATE cart_items
            SET quantity = quantity + ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
            """,
            (quantity, existing["id"]),
        )
    else:
        columns = _table_columns("cart_items")
        insert_data = {
            "user_id": current_user.id,
            "product_id": product.id,
            "product_name": product.name,
            "price": product.price,
            "image_path": product.image_path,
            "quantity": quantity,
        }

        if "design_name" in columns:
            insert_data["design_name"] = product.name

        if "photo_url" in columns:
            insert_data["photo_url"] = product.image_path

        selected_columns = [column for column in insert_data if column in columns]
        placeholders = ", ".join("?" for _ in selected_columns)
        get_db().execute(
            f"INSERT INTO cart_items ({', '.join(selected_columns)}) VALUES ({placeholders})",
            tuple(insert_data[column] for column in selected_columns),
        )

    get_db().commit()
    flash("Product added to cart.", "success")
    return redirect(url_for("cart.cart_page"))


@bp.route("/cart/update/<int:item_id>", methods=["POST"])
@login_required
def update_cart_item(item_id):
    quantity = max(int(request.form.get("quantity", 1)), 1)
    get_db().execute(
        """
        UPDATE cart_items
        SET quantity = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND user_id = ?
        """,
        (quantity, item_id, current_user.id),
    )
    get_db().commit()
    flash("Cart updated.", "success")
    return redirect(url_for("cart.cart_page"))


@bp.route("/cart/remove/<int:item_id>", methods=["POST"])
@login_required
def remove_cart_item(item_id):
    get_db().execute("DELETE FROM cart_items WHERE id = ? AND user_id = ?", (item_id, current_user.id))
    get_db().commit()
    flash("Item removed from cart.", "success")
    return redirect(url_for("cart.cart_page"))


def get_cart_items():
    rows = get_db().execute(
        """
        SELECT id, user_id, product_id, product_name, price, image_path, quantity
        FROM cart_items
        WHERE user_id = ?
        ORDER BY updated_at DESC, created_at DESC
        """,
        (current_user.id,),
    ).fetchall()

    return [
        {
            "id": row["id"],
            "user_id": row["user_id"],
            "product_id": row["product_id"],
            "product_name": row["product_name"],
            "price": float(row["price"] or 0),
            "image_path": row["image_path"] or "images/products/d1.webp",
            "quantity": int(row["quantity"] or 1),
        }
        for row in rows
    ]


def cart_summary(items=None):
    if not current_user.is_authenticated:
        return {"count": 0, "total": 0}

    items = items if items is not None else get_cart_items()
    count = sum(item["quantity"] for item in items)
    total = sum(float(item["price"] or 0) * item["quantity"] for item in items)
    return {"count": count, "total": total}


def _table_columns(table_name):
    rows = get_db().execute(f"PRAGMA table_info({table_name})").fetchall()
    return {row["name"] for row in rows}


@bp.get("/dashboard/cart.html")
@bp.get("/privelage/cart.html")
def legacy_cart_page():
    return redirect(url_for("cart.cart_page"), code=301)
