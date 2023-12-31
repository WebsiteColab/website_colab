from the_project import db, login_manager

from flask_login import UserMixin
from werkzeug.security import generate_password_hash,check_password_hash

@login_manager.user_loader
def load_user(registered_user):
    return Registered_user.query.get(registered_user)


class logged_out_user(db.Model, UserMixin):
  
    __tablename__ = 'customer'
    
    id = db.Column(db.Integer, primary_key = True)
    first_name = db.Column(db.String(64))
    last_name = db.Column(db.String(64))
    email = db.Column(db.String(64), index = True)
    address = db.Column(db.String(64))

    def __init__(self, email, first_name, last_name, address):
        self.email = email
        self.first_name = first_name
        self.last_name = last_name
        self.address = address


class Registered_user(db.Model, UserMixin):
    __tablename__ = 'registered_users'

    id = db.Column(db.Integer, primary_key = True)
    first_name = db.Column(db.String(64), index = True)
    last_name = db.Column(db.String(64), index = True)
    email = db.Column(db.String(64), unique = True, index = True)
    password_hash = db.Column(db.String(128), unique = True, index = True)

    def __init__(self,first_name, last_name, email, password):
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        print(password)
        self.password_hash = generate_password_hash(str(password), method='scrypt')

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    

class Pages_info(db.Model, UserMixin):
    __tablename__ = 'books'

    id = db.Column(db.Integer, primary_key = True)
    book_url = db.Column(db.String(128), unique=True, index=True)
    star_url = db.Column(db.String(128), index=True)
    titles = db.Column(db.String(128), index=True)
    text = db.Column(db.String(128), index=True)
    price_dollars = db.Column(db.Float)
    quantity_count = db.Column(db.Integer)
    

    def __init__(self, url, star_url, text, price, quantity, titles):
        self.book_url = url
        self.star_url = star_url
        self.titles = titles
        self.text = text
        self.price_dollars = price
        self.quantity_count = quantity


class CartItem(db.Model, UserMixin):
        
        __tablename__ = 'cart'

        id = db.Column(db.Integer, primary_key = True)
        book_url = db.Column(db.String(128), unique=True, index=True)
        star_url = db.Column(db.String(128), index=True)
        text = db.Column(db.String(128), index=True)
        price_dollars = db.Column(db.Float)
        quantity_count = db.Column(db.Integer)

        def __init__(self, url, star_url, text, price, quantity):
            self.book_url = url
            self.star_url = star_url
            self.text = text
            self.price_dollars = price
            self.quantity_count = quantity