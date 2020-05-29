from flask import Flask, render_template, url_for, request, redirect
import bcrypt
import data_manager
app = Flask(__name__)


@app.route('/')
def main_page():
    return render_template('base.html')


@app.route("/registration", methods=['GET', 'POST'])
def registration():
    if request.method == 'GET':
        return render_template('registration.html')
    if request.method == 'POST':
        password = request.form.get('password')
        hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        hashed = hashed.decode('utf-8')
        users = {'username': request.form.get('username'), 'password': hashed}
        data_manager.insert_registration(users)
    return render_template("base.html", users=users)


if __name__ == "__main__":
    app.run(debug=True)