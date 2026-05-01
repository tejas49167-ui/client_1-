from urllib.parse import urlsplit

from flask import Blueprint, flash, redirect, render_template, request, url_for
from flask_login import current_user, login_required, login_user, logout_user
from werkzeug.security import check_password_hash

from lakshmi_app.auth.repository import create_user, get_user_by_login_identifier
from lakshmi_app.models import User


bp = Blueprint("auth", __name__)


@bp.after_request
def prevent_auth_page_cache(response):
    if request.endpoint in {"auth.login", "auth.signup", "auth.legacy_login", "auth.legacy_signup"}:
        response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
        response.headers["Pragma"] = "no-cache"
        response.headers["Expires"] = "0"

    return response


@bp.route("/login", methods=["GET", "POST"])
def login():
    if current_user.is_authenticated:
        return redirect(url_for("main.account"))

    if request.method == "POST":
        identifier = (request.form.get("identifier") or request.form.get("email") or "").strip().lower()
        password = request.form.get("password", "")
        next_url = _safe_next_url(request.args.get("next"))

        if not identifier or not password:
            flash("Please enter email or phone number and password.", "error")
            return render_template("auth/login.html", form_data={"identifier": identifier})

        user = get_user_by_login_identifier(identifier)

        if user is None or not check_password_hash(user["password_hash"], password):
            flash("Invalid email, phone number, or password.", "error")
            return render_template("auth/login.html", form_data={"identifier": identifier})

        login_user(_row_to_user(user), remember=True)
        flash(f"Welcome back, {user['full_name']}!", "success")
        return redirect(next_url or url_for("main.account"))

    return render_template("auth/login.html", form_data={})


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
        form_data = {"full_name": full_name, "phone": phone, "email": email}

        if not all([full_name, phone, email, password, confirm_password]):
            flash("Please fill all fields.", "error")
            return render_template("auth/signup.html", form_data=form_data)

        if password != confirm_password:
            flash("Passwords do not match.", "error")
            return render_template("auth/signup.html", form_data=form_data)

        user = create_user(full_name, phone, email, password)

        if user is None:
            flash("An account with this email already exists.", "error")
            return render_template("auth/signup.html", form_data=form_data)

        login_user(user, remember=True)
        flash("Account created successfully.", "success")
        return redirect(url_for("main.account"))

    return render_template("auth/signup.html", form_data={})


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
