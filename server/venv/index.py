from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
import sqlitecloud
import os
import sqlite3
import yaml
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
    
def find_yaml_by_item_code(target_code, repo_owner, repo_name, token):
    yaml_files = fetch_yaml_files(repo_owner, repo_name, token)
    print(yaml_files)

    for file_path in yaml_files:
        file_url = f"https://api.github.com/repos/{repo_owner}/{repo_name}/contents/{file_path}"
        response = requests.get(file_url)
        print(file_url)

        if response.status_code == 200:
            content_data = response.json()
            if "content" in content_data:
                yaml_content = base64.b64decode(content_data["content"]).decode("utf-8")
                try:
                    docs = list(yaml.safe_load_all(yaml_content))
                    for doc in docs:
                        if isinstance(doc, dict) and doc.get("item_name") == target_code:
                            commit_info = get_last_commit_info(repo_owner, repo_name, file_path, token)
                            return {
                                "file_path": file_path,
                                "item_name": doc.get("item_name"),
                                "item_code": target_code,
                                "last_commit": commit_info
                            }
                except yaml.YAMLError as e:
                    print(f"YAML parse error in {file_path}: {e}")
        else:
            print(f"Failed to fetch file {file_path}: {response.status_code}")
    return {"error": "Item code not found"}

def get_last_commit_info(repo_owner, repo_name, file_path, token):
    url = f"https://api.github.com/repos/{repo_owner}/{repo_name}/commits"
    headers = {"Authorization": f"token {token}"} if token else {}
    params = {"path": file_path, "per_page": 1}
    response = requests.get(url, headers=headers, params=params)
    if response.status_code == 200:
        commits = response.json()
        if commits:
            commit = commits[0]
            return {
                "message": commit["commit"]["message"],
                "author": commit["commit"]["author"]["name"],
                "date": commit["commit"]["author"]["date"]
            }
    return {}

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
    return 'Home Page Route'


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
    
@app.route('/check-item-code', methods=['GET'])
def check_item_code():
    repo_owner = 'TaniyaBhadauria'
    repo_name = 'apps-wi'
    token = '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'  # Optional for private repos 
    target_code = request.args.get('target_code')

    if not all([target_code, repo_owner, repo_name]):
        return jsonify({"error": "Missing required parameters"}), 400

    result = find_yaml_by_item_code(target_code, repo_owner, repo_name, token)
    return jsonify(result)

@app.route('/request-role', methods=['POST'])
def request_role():
    data = request.json
    user_id = data.get('user_id')
    username = data.get('username')
    requested_role = data.get('requested_role')

    if not all([user_id, username, requested_role]):
        return jsonify({"error": "Missing fields"}), 400

    conn = get_db_connection()
    conn.execute(
        'INSERT INTO notifications (user_id, username, requested_role, status) VALUES (?, ?, ?, ?)',
        (user_id, username, requested_role, 'Pending')
    )
    conn.commit()
    conn.close()
    return jsonify({"message": "Role request submitted!"}), 201

def get_pending_notifications():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # for admin roles get peding requests
    cursor.execute("""
        SELECT id, user_id, username, requested_role, status, created_at
        FROM notifications
        WHERE status = 'Pending'
    """)
    rows = cursor.fetchall()
    conn.close()

    notifications = [
        {
            "id": row[0],
            "user_id": row[1],
            "username": row[2],
            "requested_role": row[3],
            "status": row[4],
            "created_at": row[5],
        }
        for row in rows
    ]
    return notifications

def get_approved_notifications(username):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Get only approved requests for a specific username
    cursor.execute("""
        SELECT id, user_id, username, requested_role, status, created_at
        FROM notifications
        WHERE status = 'Approved' AND username = ?
    """, (username,))
    
    rows = cursor.fetchall()
    conn.close()

    notifications = [
        {
            "id": row[0],
            "user_id": row[1],
            "username": row[2],
            "requested_role": row[3],
            "status": row[4],
            "created_at": row[5],
        }
        for row in rows
    ]
    return notifications

def is_admin(username):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT role FROM user WHERE username = ?
    """, (username,))
    result = cursor.fetchone()
    conn.close()

    if result and result[0] == 'admin':
        return True
    return False

@app.route('/pending-notifications', methods=['GET'])
def pending_notifications():
    username = request.args.get('username')

    if not username:
        return jsonify({"error": "Username is required"}), 400

    if not is_admin(username):
        return jsonify({"error": "Unauthorized: Only Admins can view notifications"}), 403

    notifications = get_pending_notifications()
    return jsonify(notifications)

@app.route('/update-notification', methods=['POST'])
def update_notification():
    data = request.get_json()
    notif_id = data.get('id')
    new_status = data.get('status')

    if not notif_id or not new_status:
        return jsonify({"error": "Missing id or status"}), 400

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        'UPDATE notifications SET status = ? WHERE id = ?',
        (new_status, notif_id)
    )
    conn.commit()
    conn.close()

    return jsonify({"message": "Notification updated successfully"}), 200

@app.route('/approved-notifications', methods=['GET'])
def approved_notifications():
    username = request.args.get('username')  # get username from query parameters
    if not username:
        return jsonify({"error": "Username is required"}), 400
    
    notifications = get_approved_notifications(username)
    return jsonify(notifications), 200

@app.route('/update-user/<username>', methods=['PUT'])
def update_user(username):
    # Get data from the request
    data = request.get_json()

    email = data.get('email')
    profilepic = data.get('profilepic')  # Profile picture is optional

    # Establish database connection
    conn = get_db_connection()
    cursor = conn.cursor()

    # Prepare the update query dynamically based on the provided fields
    update_fields = []
    query_params = []

    if email:
        update_fields.append("email = ?")
        query_params.append(email)
    
    if profilepic:
        update_fields.append("profilepic = ?")
        query_params.append(profilepic)

    # Join the update fields with commas
    update_query = f'''
        UPDATE user
        SET {', '.join(update_fields)}
        WHERE username = ?
    '''
    
    query_params.append(username)

    try:
        cursor.execute(update_query, tuple(query_params))
        conn.commit()

        if cursor.rowcount == 0:
            return jsonify({"error": "User not found"}), 404

        return jsonify({"message": "User updated successfully"}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

GITHUB_API_URL = 'https://api.github.com'
REPO_OWNER = 'TaniyaBhadauria'  # GitHub username
REPO_NAME = 'apps-wi'  # Repository name
MAIN_BRANCH = 'master'  # Default branch (main)
NEW_BRANCH = 'feature-branch'  # New branch where changes will be committed
GITHUB_TOKEN = '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'  # Your GitHub token for authentication

# Function to create a new branch based on the main branch
def create_new_branch():
    # Get the latest commit SHA from the main branch
    url = f'{GITHUB_API_URL}/repos/{REPO_OWNER}/{REPO_NAME}/git/refs/heads/{MAIN_BRANCH}'
    response = requests.get(url, headers={'Authorization': f'token {GITHUB_TOKEN}'})
    if response.status_code != 200:
        raise Exception(f"Error fetching main branch ref: {response.status_code} - {response.text}")
    
    commit_sha = response.json()['object']['sha']
    
    # Create the new branch based on the main branch commit SHA
    new_branch_ref = f'refs/heads/{NEW_BRANCH}'
    data = {
        'ref': new_branch_ref,
        'sha': commit_sha
    }
    
    # Create new branch
    create_branch_url = f'{GITHUB_API_URL}/repos/{REPO_OWNER}/{REPO_NAME}/git/refs'
    create_branch_response = requests.post(create_branch_url, json=data, headers={'Authorization': f'token {GITHUB_TOKEN}'})
    
    if create_branch_response.status_code == 201:
        return NEW_BRANCH
    else:
        raise Exception(f"Error creating new branch: {create_branch_response.status_code} - {create_branch_response.text}")

# Function to create or update a file in the GitHub repository
def create_or_update_github_file(path, content, message, branch):
    # Get the file's current state from GitHub
    url = f'{GITHUB_API_URL}/repos/{REPO_OWNER}/{REPO_NAME}/contents/{path}'
    
    # Check if the file exists to determine if it's an update or a new file
    response = requests.get(url, headers={'Authorization': f'token {GITHUB_TOKEN}'})
    
    if response.status_code == 200:  # File exists, update it
        sha = response.json()['sha']
        data = {
            'message': message,
            'content': base64.b64encode(content.encode('utf-8')).decode('utf-8'),
            'sha': sha,
            'branch': branch
        }
        update_response = requests.put(url, json=data, headers={'Authorization': f'token {GITHUB_TOKEN}'})
        return update_response.json()
    
    elif response.status_code == 404:  # File does not exist, create it
        data = {
            'message': message,
            'content': base64.b64encode(content.encode('utf-8')).decode('utf-8'),
            'branch': branch
        }
        create_response = requests.put(url, json=data, headers={'Authorization': f'token {GITHUB_TOKEN}'})
        return create_response.json()

    else:
        raise Exception(f"Error checking file: {response.status_code} - {response.text}")

# Function to upload media files to GitHub directly (without local storage)
def upload_media_files_to_github(branch):
    for media_file in request.files.values():
        if media_file:
            file_content = base64.b64encode(media_file.read()).decode('utf-8')
            target_path = f'media/{media_file.filename}'
            create_or_update_github_file(target_path, file_content, f"Add {media_file.filename} to media folder", branch)

@app.route('/submitForm', methods=['POST'])
def submit_form():
    try:
        # Create a new branch
        new_branch = create_new_branch()

        # Get form fields
        item_code = request.form.get('itemCode')
        item_name = request.form.get('itemName')
        bom_code = request.form.get('bomCode')
        
        # Check if cover image is provided, else set it to the placeholder
        cover_image = request.files.get('coverImage')
        cover_image_path = None
        if cover_image:
            cover_image_path = f'./media/{cover_image.filename}'
        else:
            cover_image_path = './media/placeholder.svg'

        # Initialize instructions list
        instructions = []

        # Loop through steps and collect title, content, and media
        step_count = 0
        while True:
            step_title = request.form.get(f'step_{step_count + 1}_title')
            step_content = request.form.get(f'step_{step_count + 1}_content')

            if not step_title or not step_content:
                break  # Exit the loop if no more steps are present
            
            # Initialize step data
            step_data = {
                'type': 'instruction',
                'title': step_title,
                'content': step_content,
                'media': []
            }

            # Handle media files for each step
            media_count = 1
            while True:
                media_file = request.files.get(f'step_{step_count + 1}_media_{media_count}')
                if media_file:
                    # Directly upload the media file to GitHub without saving locally
                    step_data['media'].append(f'./media/{media_file.filename}')
                else:
                    # If no media file is provided, set the placeholder
                    step_data['media'].append('./media/placeholder.svg')
                media_count += 1

                # Exit the loop if no more media files are provided
                if not request.files.get(f'step_{step_count + 1}_media_{media_count}'):
                    break

            # Add the step data to instructions
            instructions.append(step_data)

            step_count += 1

        # Prepare the data for YAML
        form_data = {
            'item_code': item_code,
            'item_name': item_name,
            'bom_code': bom_code,
            'cover_image': cover_image_path,
            'steps': instructions
        }

        # Convert the form data into YAML format
        yaml_content = yaml.dump(form_data, default_flow_style=False)

        # Upload YAML to GitHub
        create_or_update_github_file('form_data.yaml', yaml_content, 'Add form data YAML file', new_branch)

        # Upload media files to GitHub
        upload_media_files_to_github(new_branch)

        # Return a response indicating success
        return jsonify({'message': 'Form submitted, YAML and media files uploaded to GitHub successfully'})

    except Exception as e:
        return jsonify({'error': str(e)}), 500


