from flask import Flask, render_template, request, jsonify, redirect, url_for, session
from db import app, db, User
import os

# إعداد مفتاح سر الجلسات
app.secret_key = os.urandom(24)

APP = app

# صفحات الموقع
@APP.route("/")
def home():
    return render_template("index.html")

@APP.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]
        email = request.form["email"]
        new_user = User(username=username, password=password, email=email)
        db.session.add(new_user)
        db.session.commit()
        return redirect(url_for("login"))
    return render_template("register.html")

@APP.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form.get("email")
        password = request.form.get("password")
        user = User.query.filter_by(email=email).first()
        if user and user.password == password:
            session['logged_in'] = True
            session['email'] = email
            session.pop('message_count', None)  # إعادة تعيين عدد الرسائل عند تسجيل الدخول
            return redirect(url_for("index"))
        else:
            return "بيانات الدخول غير صحيحة، حاول مرة أخرى"
    return render_template("index.html")

@APP.route("/index")
def chat():
    if not session.get('logged_in'):
        return redirect(url_for("login"))  # إعادة توجيه المستخدمين غير المسجلين إلى صفحة تسجيل الدخول
    return render_template("index.html")

@APP.route("/send_message", methods=["POST"])
def send_message():
    if not session.get('logged_in'):
        if 'message_count' not in session:
            session['message_count'] = 0
        session['message_count'] += 1
        if session['message_count'] > 5:
            return jsonify({'error': 'لقد تجاوزت الحد المسموح به من الرسائل، يرجى التسجيل للمتابعة'}), 403
    # هنا قم بمعالجة الرسالة وإرسالها
    return jsonify({'message': 'تم إرسال الرسالة بنجاح'})

@APP.route("/image")
def image():
    return render_template("image.html")

@APP.route("/translate")
def translate():
    return render_template("translate.html")

if __name__ == "__main__":
    APP.run(debug=True)
