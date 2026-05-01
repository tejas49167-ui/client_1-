import csv

from flask import current_app, url_for

from lakshmi_app.models import Product


def list_products():
    csv_path = current_app.config["PRODUCTS_CSV"]

    if not csv_path.exists():
        return []

    with csv_path.open(newline="", encoding="utf-8") as csv_file:
        rows = list(csv.DictReader(csv_file))

    products = []
    for index, row in enumerate(rows, start=1):
        product_id = (row.get("id") or str(index)).strip()
        name = (row.get("name") or row.get("title") or "Product").strip()
        price = _parse_price(row.get("price"))
        image_path = _normalise_image(row.get("photo url") or row.get("photo") or row.get("image") or "")
        products.append(
            Product(
                id=product_id,
                name=name,
                price=price,
                image_path=image_path,
                description=(row.get("description") or "Premium tailoring service with careful fitting and finishing.").strip(),
                category=(row.get("category") or "Tailoring").strip(),
            )
        )

    return products


def get_product(product_id):
    return next((product for product in list_products() if product.id == str(product_id)), None)


def product_image_url(product):
    if product.image_path.startswith(("http://", "https://", "data:")):
        return product.image_path

    return url_for("static", filename=product.image_path)


def _parse_price(value):
    try:
        return float(str(value or "0").replace(",", "").strip())
    except ValueError:
        return 0.0


def _normalise_image(path):
    path = path.strip().replace("\\", "/")

    if path.startswith("products/"):
        return f"images/{path}"

    if path.startswith("static/"):
        return path.replace("static/", "", 1)

    return path or "images/products/d1.webp"
