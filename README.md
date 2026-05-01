# Lakshmi Embroidery E-Commerce App

A production-style Flask e-commerce app with blueprints, Jinja templates, Tailwind-based UI, SQLite persistence, and a CSV-backed product catalog.

## Run Locally

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
export SECRET_KEY="change-this-for-local-development"
python app.py
```

Open `http://127.0.0.1:8000`.

## New Folder Structure

```text
app/
  __init__.py
  db.py
  models.py
  auth/routes.py
  main/routes.py
  products/routes.py
  products/repository.py
  cart/routes.py
  orders/routes.py
templates/
  base.html
  auth/login.html
  auth/signup.html
  main/index.html
  dashboard/account.html
  products/list.html
  products/detail.html
  products/_card.html
  cart/cart.html
  orders/checkout.html
static/
  css/app.css
  js/app.js
  images/shop/
  images/products/
products/products_list.csv
users.db
app.py
```

The old `before_login,signup/` and `after_login,signup/` folders are no longer used by the running Flask app. They are kept only as legacy source/reference files.

## Routes

- `/` - landing page with slider and featured products
- `/login`, `/signup`, `/logout` - authentication
- `/products` - product listing loaded from `products/products_list.csv`
- `/product/<id>` - product detail
- `/cart` - cart page
- `/cart/add/<id>` - add product to cart
- `/cart/update/<item_id>` - update quantity
- `/cart/remove/<item_id>` - remove item
- `/checkout` - checkout confirmation
- `/checkout/place` - place order
- `/account` - user dashboard/profile and order history

Backward-compatible aliases like `/viewdesign.html`, `/dashboard/index.html`, and `/privelage/...` still route into the new blueprint app.

## Data

- User, cart, and order data are stored in `users.db`.
- Product data is read from `products/products_list.csv`.
- Product images are served from `static/images/products/`.

CSV columns currently supported:

```csv
id,name,photo url,price,description,category
```

`id`, `description`, and `category` are optional. If `id` is missing, the row number is used.

## Production Notes

- Set a strong `SECRET_KEY` through the environment.
- Use Gunicorn or another production WSGI server behind a reverse proxy.
- Keep `.env` and local database files out of version control.
- Add CSRF protection and payment integration before handling real payments.
