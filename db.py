import pymysql


from flask import Flask

from flask_sqlalchemy import SQLAlchemy


# استبدال MySQLdb بـ pymysql

pymysql.install_as_MySQLdb()


app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost/myproject_db'
db = SQLAlchemy(app)


class User(db.Model):
    __tablename__ = 'users'  # تأكد من أن اسم الجدول هنا هو 'users'
    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), nullable=False)
    password = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False)