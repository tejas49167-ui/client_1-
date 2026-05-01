from urllib.parse import urlsplit

from flask import Blueprint, flash, redirect, render_template, request, url_for
from flask_login import current_user, login_required, login_user, logout_user
from werkzeug.security import check_password_hash

from lakshmi_app.auth.repository import create_user, get_user_by_email
from lakshmi_app.models import User


bp = Blueprint("auth", __name__)


@bp.route("/login", methods=["GET", "POST"])
def login():
    if current_user.is_authenticated:
        return redirect(url_for("main.account"))

    if request.method == "POST":
        email = request.form.get("email", "").strip().lower()
        password = request.form.get("password", "")
        next_url = _safe_next_url(request.args.get("next"))

        if not email or not password:
            flash("Please enter email and password.", "error")
            return redirect(url_for("auth.login"))

        user = get_user_by_email(email)

        if user is None or not check_password_hash(user["password_hash"], password):
            flash("Invalid email or password.", "error")
            return redirect(url_for("auth.login"))

        login_user(_row_to_user(user))
        flash(f"Welcome back, {user['full_name']}!", "success")
        return redirect(next_url or url_for("main.account"))

    return render_template("auth/login.html")


@bp.route("/signup", methods=["GET", "POST"])
def signup():
    if current_user.is_authenticated:
        return redirect(url_for("main.account"))

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

        user = create_user(full_name, phone, email, password)

        if user is None:
            flash("An account with this email already exists.", "error")
            return redirect(url_for("auth.signup"))

        login_user(user)
        flash("Account created successfully.", "success")
        return redirect(url_for("main.account"))

    return render_template("auth/signup.html")


@bp.route("/logout")
@login_required
def logout():
    logout_user()
    flash("You have been logged out.", "success")
    return redirect(url_for("auth.login"))


@bp.get("/login.html")
def legacy_login():
    return redirect(url_for("auth.login"), code=301)


@bp.get("/signup.html")
def legacy_signup():
    return redirect(url_for("auth.signup"), code=301)


def _row_to_user(row):
    return User(
        id=row["id"],
        full_name=row["full_name"],
        phone=row["phone"],
        email=row["email"],
    )


def _safe_next_url(next_url):
    if not next_url:
        return None

    parsed = urlsplit(next_url)
    return next_url if not parsed.netloc and not parsed.scheme else None
