import sqlite3

from werkzeug.security import generate_password_hash

from app.db import get_db
from app.models import User


def get_user_by_id(user_id):
    return _row_to_user(
        get_db()
        .execute(
            "SELECT id, full_name, phone, email FROM users WHERE id = ?",
            (user_id,),
        )
        .fetchone()
    )


def get_user_by_email(email):
    return get_db().execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()


def create_user(full_name, phone, email, password):
    try:
        cursor = get_db().execute(
            """
            INSERT INTO users (full_name, phone, email, password_hash)
            VALUES (?, ?, ?, ?)
            """,
            (full_name, phone, email, generate_password_hash(password)),
        )
        get_db().commit()
    except sqlite3.IntegrityError:
        return None

    return get_user_by_id(cursor.lastrowid)


def _row_to_user(row):
    if row is None:
        return None

    return User(
        id=row["id"],
        full_name=row["full_name"],
        phone=row["phone"],
        email=row["email"],
    )
