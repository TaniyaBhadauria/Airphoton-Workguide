from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
import sqlitecloud
import os
import sqlite3
import base64
import requests
from models import Instruction, InstructionMedia
from fpdf import FPDF
from io import BytesIO
import tempfile

app = Flask(__name__)
CORS(app)

def get_db_connection():
    conn = sqlitecloud.connect(
        "sqlitecloud://cnmbhtfonk.g1.sqlite.cloud:8860/workguideDb?apikey=ya6PzUDIFdYGLcoVCHkhSzPq688M5GFhM92gvMvPpKA"
    )
    return conn

def get_directories(repo_owner, repo_name, token, branch="master"):
    """Fetches all directory names from a GitHub repository."""
    url = f"https://api.github.com/repos/{repo_owner}/{repo_name}/contents/"
    headers = {"Authorization": f"token {token}"} if token else {}

    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        items = response.json()

        # Filter only directories
        directories = [item["name"] for item in items if item["type"] == "dir"]

        return directories
    else:
        return {"error": f"Error fetching repository contents: {response.status_code} - {response.text}"}

def fetch_yaml_files(repo_owner, repo_name, token):
    """Fetch all YAML file paths from the GitHub repository."""
    url = f"https://api.github.com/repos/{repo_owner}/{repo_name}/git/trees/master?recursive=1"
    headers = {"Authorization": f"token {token}"} if token else {}

    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        files = response.json().get("tree", [])
        yaml_files = [file["path"] for file in files if file["path"].endswith((".yaml", ".yml"))]
        return yaml_files
    else:
        print(f"Error fetching repository files: {response.status_code} - {response.text}")
        return []

def extract_item_names(repo_owner, repo_name, yaml_files, token):
    """Read each YAML file and extract item_code."""
    item_codes = []
    for file_path in yaml_files:
        file_url = f"https://api.github.com/repos/{repo_owner}/{repo_name}/contents/{file_path}"
        headers = {"Authorization": f"token {token}"} if token else {}

        response = requests.get(file_url, headers=headers)
        if response.status_code == 200:
            file_data = response.json()
            if "content" in file_data:
                import base64
                yaml_content = base64.b64decode(file_data["content"]).decode("utf-8")
                try:
                    yaml_documents = list(yaml.safe_load_all(yaml_content))
                    for doc in yaml_documents:
                        if isinstance(doc, dict):
                            # Check for item_code in each dictionary
                            if "item_name" in doc:
                                item_codes.append(doc["item_name"])
                except yaml.YAMLError as e:
                    print(f"Error parsing YAML in {file_path}: {e}")
        else:
            print(f"Error fetching YAML file {file_path}: {response.status_code} - {response.text}")

    return item_codes

def get_github_commits(repo_owner, repo_name, num_commits=10):
    url = f"https://api.github.com/repos/{repo_owner}/{repo_name}/commits?per_page={num_commits}"
    response = requests.get(url)

    if response.status_code == 200:
        commits = response.json()
        commit_info = []

        for commit in commits:
            commit_data = {
                "sha": commit['sha'][:7],
                "message": commit['commit']['message'],
                "author": commit['commit']['author']['name'],
                "date": commit['commit']['author']['date'],
                "files": []
            }

            commit_url = commit['url']
            commit_response = requests.get(commit_url)

            if commit_response.status_code == 200:
                commit_details = commit_response.json()
                if "files" in commit_details:
                    commit_data["files"] = [
                        {
                            "filename": file['filename'],
                            "changes": file.get("patch", "No diff available")
                        }
                        for file in commit_details['files']
                    ]

            commit_info.append(commit_data)

        return commit_info
    else:
        return {"error": f"Error fetching commits: {response.status_code}"}

def get_all_items():
    """Fetch all item numbers and their images from the database."""
    conn = sqlitecloud.connect(
        "sqlitecloud://cnmbhtfonk.g1.sqlite.cloud:8860/workguideDb?apikey=ya6PzUDIFdYGLcoVCHkhSzPq688M5GFhM92gvMvPpKA"
    )
    cursor = conn.cursor()

    cursor.execute("SELECT item_name, cover_image FROM products")
    items = cursor.fetchall()
    conn.close()

    # Convert BLOB images to Base64
    result = []
    for item in items:
        item_code, image_name = item
        image_base64 = base64.b64encode(image_name).decode('utf-8')  # Convert binary to Base64
        result.append({"item_id": item_code, "image_name": image_base64})

    return result

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

@app.route('/api/users', methods=['POST'])
def insert_user():
    try:
        data = request.json
        username = data.get('username')
        password = data.get('password')
        role = data.get('role')
        email = data.get('email')
        profilepic = data.get('profilepic')

        if not all([username, password, role, email]):
            return jsonify({"error": "Missing required fields"}), 400


        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO user (username, password, role, email, profilepic) 
            VALUES (?, ?, ?, ?, ?)
        """, (username, password, role, email, profilepic))

        conn.commit()
        conn.close()

        return jsonify({"message": "User created successfully"}), 201

    except sqlite3.IntegrityError:
        return jsonify({"error": "Username or email already exists"}), 409
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/update_feedback_status", methods=["POST"])
def update_feedback_status():
    data = request.json
    comment = data.get("comment")

    if not comment:
        return jsonify({"error": "Comment is required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE Feedback
        SET status = 'Resolved'
        WHERE comment = ?
    """, (comment,))

    if cursor.rowcount == 0:
        return jsonify({"error": "No matching comment found"}), 404

    conn.commit()
    conn.close()

    return jsonify({"message": "Status updated to Resolved"})

@app.route('/api/feedback', methods=['GET'])
def get_feedback():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM Feedback ORDER BY created_at DESC")
        feedback_list = cursor.fetchall()

        columns = ["id", "feedback_type", "comment", "file_upload", "experience_rating", "additional_comments", "status", "created_at"]

        feedback_json = []
        for row in feedback_list:
            feedback_dict = dict(zip(columns, row))

            # Convert file_upload (BLOB) to a Base64 string if it's not None
            if feedback_dict["file_upload"] is not None:
                feedback_dict["file_upload"] = base64.b64encode(feedback_dict["file_upload"]).decode("utf-8")

            feedback_json.append(feedback_dict)

        conn.close()
        return jsonify(feedback_json)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/get_item_codes_and_images', methods=['GET'])
def get_item_codes_and_images():
    """API to fetch item codes and their respective image paths from YAML files in a GitHub repo."""
    repo_owner = request.args.get('repo_owner', 'TaniyaBhadauria')
    repo_name = request.args.get('repo_name', 'apps-wi')
    token = request.args.get('token')  # Optional for private repos

    # Fetch all YAML file paths
    yaml_files = fetch_yaml_files(repo_owner, repo_name, token)

    # Extract item names and their image paths
    item_codes = extract_item_names(repo_owner, repo_name, yaml_files, token)

    return (item_codes)

@app.route("/api/commits", methods=["GET"])
def fetch_commits():
    repo_owner = request.args.get("repo_owner")
    repo_name = request.args.get("repo_name")
    num_commits = request.args.get("num", default=10, type=int)

    if not repo_owner or not repo_name:
        return jsonify({"error": "Missing required parameters: owner and repo"}), 400

    commits = get_github_commits(repo_owner, repo_name, num_commits)
    return jsonify(commits)

@app.route("/items", methods=["GET"])
def get_items():
    """API endpoint to fetch all items."""
    items = get_all_items()
    return jsonify(items)

@app.route("/instructions", methods=["GET"])
def get_instructions():
    item_code = request.args.get("item_code")
    conn = sqlitecloud.connect(
        "sqlitecloud://cnmbhtfonk.g1.sqlite.cloud:8860/workguideDb?apikey=ya6PzUDIFdYGLcoVCHkhSzPq688M5GFhM92gvMvPpKA"
    )
    cursor = conn.execute("SELECT id FROM products WHERE item_name = ?", (item_code,))
    product = cursor.fetchone()

    product_id = product[0]
    cursor = conn.execute("SELECT id, title, content FROM instructions WHERE product_id = ?", (product_id,))
    instructions = cursor.fetchall()

    result = []
    for ins in instructions:
        instruction_id = ins[0]
        cursor = conn.execute("SELECT media_path FROM instruction_media WHERE instruction_id = ?", (instruction_id,))
        media = cursor.fetchall()
        media_list = [InstructionMedia(media_path=m[0]) for m in media]
        result.append(Instruction(title=ins[1], content=ins[2], media=media_list).dict())

    return result

@app.route("/download_instructions", methods=["GET"])
def download_instructions():
    item_code = request.args.get("item_code")
    conn = get_db_connection()
    cursor = conn.execute("SELECT id FROM products WHERE item_name = ?", (item_code,))
    product = cursor.fetchone()

    if not product:
        return {"error": "Product not found"}, 404

    product_id = product[0]
    cursor = conn.execute("SELECT id, title, content FROM instructions WHERE product_id = ?", (product_id,))
    instructions = cursor.fetchall()

    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.set_left_margin(10)
    pdf.set_right_margin(10)

    pdf.add_page()
    pdf.set_font("Arial", "B", 16)
    pdf.cell(200, 10, f"Instructions for {item_code}", ln=True, align="C")

    base_image_url = "https://raw.githubusercontent.com/TaniyaBhadauria/apps-wi/master/"

    for ins in instructions:
        instruction_id = ins[0]
        title, content = ins[1], ins[2]

        # Fetch media paths
        cursor = conn.execute("SELECT media_path FROM instruction_media WHERE instruction_id = ?", (instruction_id,))
        media = cursor.fetchall()
        media_paths = [m[0] for m in media]

        pdf.set_font("Arial", "B", 14)
        pdf.cell(0, 10, title, ln=True)

        content = content.replace("\u2019", "'")
        pdf.set_font("Arial", "", 12)
        pdf.multi_cell(0, 8, content)

        for media_path in media_paths:
            media_path = media_path.replace("\u0000", "")
            if media_path.lower().endswith(".svg"):
                continue
            image_url = f"{base_image_url}{media_path}"
            response = requests.get(image_url)
            if response.status_code == 200:
                with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as temp_img:
                    temp_img.write(response.content)
                    temp_img.flush()
                    pdf.image(temp_img.name, x=10, w=100)
                    os.unlink(temp_img.name)

        pdf.ln(10)

    # Save PDF to a temporary file, then read into memory
    with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp_pdf:
        pdf.output(tmp_pdf.name)
        tmp_pdf.flush()
        tmp_pdf.seek(0)
        data = tmp_pdf.read()
        os.unlink(tmp_pdf.name)

    return send_file(BytesIO(data), as_attachment=True, download_name="instructions.pdf", mimetype="application/pdf")

@app.route('/get_directories', methods=['GET'])
def list_directories():
    repo_owner = request.args.get('repo_owner', 'TaniyaBhadauria')
    repo_name = request.args.get('repo_name', 'apps-wi')
    token = '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'  # Optional, pass in request if needed

    directories = get_directories(repo_owner, repo_name, token)

    return jsonify(directories)

@app.route('/submit_feedback', methods=['POST'])
def submit_feedback():
    conn = get_db_connection()
    cursor = conn.cursor()

    feedback_type = request.form.get('feedback_type')
    comment = request.form.get('comment')
    experience_rating = request.form.get('experience_rating')
    status = request.form.get('status')
    additional_comments = request.form.get('additional_comments')
    # Handle file upload as binary data (BLOB)
    file_upload = None
    if 'file_upload' in request.files:
        file = request.files['file_upload']
        if file.filename != '':
            # Read the file as binary data
            file_data = file.read()
            file_upload = file_data  # Store the binary data

    # Prepare the values to insert into the database
    cursor.execute("""
    INSERT INTO Feedback (feedback_type, comment, file_upload, experience_rating, status, additional_comments)
    VALUES (?, ?, ?, ?, ?, ?)
""", (feedback_type, comment, file_upload, experience_rating, status, additional_comments))
    conn.commit()
    conn.close()

    return jsonify({"message": "Feedback submitted successfully!"}), 200

@app.route('/get_user', methods=['GET'])
def get_user():
    try:
        # Retrieve username from query parameters
        username = request.args.get('username')
        password = request.args.get('password')

        # Check if username is provided
        if not username:
            return jsonify({"error": "Username parameter is required"}), 400

        if not password:
            return jsonify({"error": "password parameter is required"}), 400

        # Connect to the database
        conn = get_db_connection()
        cursor = conn.cursor()

        # SQL query to fetch user by username
        cursor.execute("SELECT * FROM user WHERE username = ? AND password = ?", (username, password))
        user = cursor.fetchone()

        # Close the connection
        conn.close()

        # Check if the user was found
        if user:
            # Return user data as JSON
            user_data = {
                "id": user[0],
                "username": user[1],
                "password": user[2],
                "role": user[3],
                "email": user[4],
                "profilepic": user[5]
            }
            return jsonify(user_data), 200
        else:
            return jsonify({"error": "User not found"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500

def download_pdf(item_code):
    try:
        response = requests.get(f"https://y-eta-lemon.vercel.app/download_instructions?item_code={item_code}")
        if response.status_code == 200:
            return response.content
        else:
            print(f"Failed to download PDF for {item_code}: {response.status_code}")
            return None
    except requests.RequestException as e:
        print(f"Error downloading PDF for {item_code}: {e}")
        return None

# API endpoint to get item codes and their PDFs
@app.route('/api/getInstructionPdfs', methods=['GET'])
def get_instruction_pdfs():
    try:
        conn = get_db_connection()
        cursor = conn.execute("SELECT item_name FROM products")
        products = cursor.fetchall()

        pdf_data = []

        for product in products:
            item_code = product[0]
            print(f"Downloading PDF for {item_code}...")

            # Download the PDF for each item code
            pdf_content = download_pdf(item_code)

            if pdf_content:
                # Convert PDF content to base64 for easier transport
                base64_pdf = base64.b64encode(pdf_content).decode('utf-8')
                pdf_data.append({"item_code": item_code, "pdf": base64_pdf})

        conn.close()

        return jsonify(pdf_data)

    except Exception as e:
        print(f"Error generating PDFs: {e}")
        return jsonify({"error": "Error generating PDF list"}), 500
    

@app.route('/api/submit', methods=['POST'])
def submit():
    data = request.json
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO work_review (
                pro_number, item_code, station, sa_serial_number,
                technician, entry_date, review, review_date
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            data.get('proNumber'),
            data.get('itemCode'),
            data.get('station'),
            data.get('saSn'),
            data.get('technician'),
            data.get('techDate'),
            data.get('review'),
            data.get('reviewDate')
        ))
        conn.commit()
        return jsonify({"message": "Data inserted successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500