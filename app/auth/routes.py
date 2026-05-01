import sqlite3
from functools import wraps

from flask import Blueprint, flash, g, redirect, render_template, request, session, url_for
from werkzeug.security import check_password_hash, generate_password_hash

from app.db import get_db


bp = Blueprint("auth", __name__)


def current_user():
    user_id = session.get("user_id")

    if not user_id:
        return None

    return get_db().execute(
        "SELECT id, full_name, phone, email, created_at FROM users WHERE id = ?",
        (user_id,),
    ).fetchone()


def login_required(view):
    @wraps(view)
    def wrapped_view(*args, **kwargs):
        if g.user is None:
            flash("Please login to continue.", "error")
            return redirect(url_for("auth.login", next=request.path))

        return view(*args, **kwargs)

    return wrapped_view


@bp.before_app_request
def load_logged_in_user():
    g.user = current_user()


@bp.route("/login", methods=["GET", "POST"])
@bp.route("/login.html", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form.get("email", "").strip().lower()
        password = request.form.get("password", "")
        next_url = request.args.get("next")

        if not email or not password:
            flash("Please enter email and password.", "error")
            return redirect(url_for("auth.login"))

        user = get_db().execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()

        if user is None or not check_password_hash(user["password_hash"], password):
            flash("Invalid email or password.", "error")
            return redirect(url_for("auth.login"))

        session.clear()
        session["user_id"] = user["id"]
        session["user_name"] = user["full_name"]
        flash(f"Welcome back, {user['full_name']}!", "success")
        return redirect(next_url or url_for("main.account"))

    return render_template("auth/login.html")


@bp.route("/signup", methods=["GET", "POST"])
@bp.route("/signup.html", methods=["GET", "POST"])
def signup():
    if request.method == "POST":
        full_name = request.form.get("full_name", "").strip()
        phone = request.form.get("phone", "").strip()
        email = request.form.get("email", "").strip().lower()
        password = request.form.get("password", "")
        confirm_password = request.form.get("confirm_password", "")

        if not all([full_name, phone, email, password, confirm_password]):
            flash("Please fill all fields.", "error")
            return redirect(url_for("auth.signup"))

        if len(password) < 8:
            flash("Password must be at least 8 characters.", "error")
            return redirect(url_for("auth.signup"))

        if password != confirm_password:
            flash("Passwords do not match.", "error")
            return redirect(url_for("auth.signup"))

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
            flash("An account with this email already exists.", "error")
            return redirect(url_for("auth.signup"))

        session.clear()
        session["user_id"] = cursor.lastrowid
        session["user_name"] = full_name
        flash("Account created successfully.", "success")
        return redirect(url_for("main.account"))

    return render_template("auth/signup.html")


@bp.route("/logout")
def logout():
    session.clear()
    flash("You have been logged out.", "success")
    return redirect(url_for("auth.login"))
