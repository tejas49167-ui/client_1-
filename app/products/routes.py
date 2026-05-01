from flask import Blueprint, abort, render_template

from .repository import get_product, list_products, product_image_url


bp = Blueprint("products", __name__)


@bp.route("/privelage/designs.html")
@bp.route("/dashboard/designs.html")
@bp.route("/viewdesign.html")
@bp.route("/products")
def product_list():
    products = list_products()
    return render_template(
        "products/list.html",
        products=products,
        product_image_url=product_image_url,
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
