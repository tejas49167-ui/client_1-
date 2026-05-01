from dataclasses import dataclass

from flask_login import UserMixin


@dataclass(frozen=True)
class User(UserMixin):
    id: int
    full_name: str
    phone: str
    email: str

    def get_id(self):
        return str(self.id)


@dataclass(frozen=True)
class Product:
    id: str
    name: str
    price: float
    image_path: str
    description: str = ""
    category: str = "Tailoring"


@dataclass(frozen=True)
class CartItem:
    id: int
    user_id: int
    product_id: str
    product_name: str
    price: float
    image_path: str
    quantity: int

    @property
    def subtotal(self):
        return self.price * self.quantity


@dataclass(frozen=True)
class Order:
    id: int
    user_id: int
    total_amount: float
    status: str
    created_at: str
