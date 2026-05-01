from flask import Blueprint, abort, redirect, render_template, request, url_for

from .repository import get_product, list_products, product_image_url


bp = Blueprint("products", __name__)


@bp.route("/products")
def product_list():
    query = request.args.get("q", "").strip().lower()
    products = list_products()

    if query:
        products = [
            product
            for product in products
            if query in f"{product.name} {product.category} {product.price:.0f}".lower()
        ]

    return render_template(
        "products/list.html",
        products=products,
        product_image_url=product_image_url,
        query=query,
    )


@bp.route("/product/<product_id>")
def product_detail(product_id):
    product = get_product(product_id)

    if product is None:
        abort(404)

    return render_template(
        "products/detail.html",
        product=product,
        product_image_url=product_image_url,
    )


@bp.get("/dashboard/designs.html")
@bp.get("/privelage/designs.html")
@bp.get("/viewdesign.html")
def legacy_product_list():
    return redirect(url_for("products.product_list"), code=301)
