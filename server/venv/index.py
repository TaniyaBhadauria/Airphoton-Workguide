from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlitecloud
import os

app = Flask(__name__)
CORS(app)

def get_db_connection():
    conn = sqlitecloud.connect(
        "sqlitecloud://cnmbhtfonk.g1.sqlite.cloud:8860/workguideDb?apikey=ya6PzUDIFdYGLcoVCHkhSzPq688M5GFhM92gvMvPpKA"
    )
    return conn

@app.route('/')
def home():
    return 'Home Page Route - nice work Andrew!!!'


@app.route('/api/user', methods=['GET'])
def get_user_details():
    try:
        username = request.args.get('username')  # Get username from query parameter

        if not username:
            return jsonify({"error": "Username is required"}), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        # Query to fetch user details
        cursor.execute("SELECT * FROM user WHERE username = ?", (username,))
        user = cursor.fetchone()

        if user is None:
            return jsonify({"error": "User not found"}), 404

        # Column names from the table
        columns = ["id", "username", "password", "role", "email", "profilepic"]

        user_dict = dict(zip(columns, user))
        conn.close()

        return user_dict, 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/get_item_codes', methods=['GET'])
def get_item_codes():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT item_name FROM products")
    item_codes = [row[0] for row in cursor.fetchall()]

    conn.close()
    return jsonify(item_codes)