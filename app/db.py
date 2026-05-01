import sqlite3
from pathlib import Path

from flask import current_app, g


def get_db():
    if "db" not in g:
        database_path = Path(current_app.config["DATABASE"])
        database_path.parent.mkdir(parents=True, exist_ok=True)
        connection = sqlite3.connect(database_path)
        connection.row_factory = sqlite3.Row
        g.db = connection

    return g.db


def close_db(error=None):
    connection = g.pop("db", None)

    if connection is not None:
        connection.close()


def init_db():
    connection = get_db()
    connection.executescript(
        """
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            full_name TEXT NOT NULL,
            phone TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS cart_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            product_id TEXT NOT NULL,
            product_name TEXT NOT NULL,
            price REAL NOT NULL DEFAULT 0,
            image_path TEXT,
            quantity INTEGER NOT NULL DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        );

        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            total_amount REAL NOT NULL DEFAULT 0,
            status TEXT NOT NULL DEFAULT 'Placed',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        );

        CREATE TABLE IF NOT EXISTS order_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER NOT NULL,
            product_id TEXT NOT NULL,
            product_name TEXT NOT NULL,
            price REAL NOT NULL DEFAULT 0,
            quantity INTEGER NOT NULL DEFAULT 1,
            FOREIGN KEY (order_id) REFERENCES orders (id)
        );
        """
    )
    _migrate_cart_items(connection)
    _migrate_orders(connection)
    connection.commit()


def _table_columns(connection, table_name):
    rows = connection.execute(f"PRAGMA table_info({table_name})").fetchall()
    return {row["name"] for row in rows}


def _migrate_cart_items(connection):
    columns = _table_columns(connection, "cart_items")
    migrations = {
        "product_id": "ALTER TABLE cart_items ADD COLUMN product_id TEXT",
        "product_name": "ALTER TABLE cart_items ADD COLUMN product_name TEXT",
        "image_path": "ALTER TABLE cart_items ADD COLUMN image_path TEXT",
        "quantity": "ALTER TABLE cart_items ADD COLUMN quantity INTEGER NOT NULL DEFAULT 1",
        "updated_at": "ALTER TABLE cart_items ADD COLUMN updated_at TIMESTAMP",
    }

    for column, sql in migrations.items():
        if column not in columns:
            connection.execute(sql)

    columns = _table_columns(connection, "cart_items")
    if "design_name" in columns:
        connection.execute(
            """
            UPDATE cart_items
            SET product_name = COALESCE(product_name, design_name),
                product_id = COALESCE(product_id, design_name),
                image_path = COALESCE(image_path, photo_url)
            """
        )


def _migrate_orders(connection):
    columns = _table_columns(connection, "orders")
    migrations = {
        "total_amount": "ALTER TABLE orders ADD COLUMN total_amount REAL NOT NULL DEFAULT 0",
    }

    for column, sql in migrations.items():
        if column not in columns:
            connection.execute(sql)
