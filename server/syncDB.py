from flask import Flask, jsonify, request,send_file
import requests
import yaml
import base64
import sqlitecloud
from io import BytesIO
from flask_cors import CORS

# Database file
DB_FILE = "products.db"

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
    
def fetch_img_files(image_file,repo_owner, repo_name, token):
    """Fetch all YAML file paths from the GitHub repository."""
    url = f"https://api.github.com/repos/{repo_owner}/{repo_name}/git/trees/master?recursive=1"
    headers = {"Authorization": f"token {token}"} if token else {}

    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        files = response.json().get("tree", [])
        image_files = [file["path"] for file in files if image_file in file["path"]]
        return image_files
    else:
        print(f"Error fetching repository files: {response.status_code} - {response.text}")
        return []

def extract_item_image(name, repo_owner, repo_name, yaml_files, token):
    """Read each YAML file and extract item_code."""
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
                            if ("item_name" in doc and doc["item_name"] == name):
                                return  doc["cover_image"]  # The image path from YAML
                except yaml.YAMLError as e:
                    print(f"Error parsing YAML in {file_path}: {e}")
        else:
            print(f"Error fetching YAML file {file_path}: {response.status_code} - {response.text}")


def get_image(image_path): 
    # Correct raw URL of the image on GitHub
    image_url = f"https://raw.githubusercontent.com/TaniyaBhadauria/apps-wi/master/{image_path}"
    
    # Fetch the image using requests
    response = requests.get(image_url)
    
    # Check if the image was found and return it
    if response.status_code == 200:
        # Dynamically set MIME type based on image extension, you can refine it for more types
        if image_path.endswith('.png'):
            mimetype = 'image/png'
        elif image_path.endswith('.svg'):
            mimetype = 'image/svg+xml'
        else:
            mimetype = 'application/octet-stream'  # Fallback for unknown file types
        
        # return send_file(BytesIO(response.content), mimetype=mimetype)
        return response.content
    else:
        return "Image not found", 404


def insert_data(yaml_file):
    """Parse YAML file and insert data into SQLite database"""
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
                                  item_code = doc["item_code"]
                                  item_name = doc["item_name"]
                                  bom_code = doc["bom_code"]
                                  image_file = extract_item_image(item_name, repo_owner, repo_name, yaml_files, token)
                                  image_path = fetch_img_files(image_file.lstrip("./"),repo_owner, repo_name, token)
                                  cover_image_data = get_image(image_path[0]) 

                                  conn = sqlitecloud.connect(
        "sqlitecloud://cnmbhtfonk.g1.sqlite.cloud:8860/workguideDb?apikey=ya6PzUDIFdYGLcoVCHkhSzPq688M5GFhM92gvMvPpKA"
                                   )
                                  cursor = conn.cursor()
                                  cursor.execute("""
                                  INSERT INTO products (item_code, item_name, bom_code, cover_image)
                                  VALUES (?, ?, ?, ?)
                                  """, (item_code, item_name, bom_code, cover_image_data))
                                  product_id = cursor.lastrowid

                            if doc.get("type") == "tool-list":
                                    for tool_entry in doc["tools"]:
                                     for tool_name, tool_image in tool_entry.items():
                                        tool_image_path = fetch_img_files(tool_image.lstrip("./"), repo_owner, repo_name, token)
                                        tool_image_data = get_image(tool_image_path[0])
                                        
                                        cursor.execute("""
                                            INSERT INTO tools (product_id, tool_name, tool_image)
                                            VALUES (?, ?, ?)
                                        """, (product_id, tool_name, tool_image_data))
                            
                            if doc.get("type") == "instruction":
                                title = doc["title"]
                                content = doc["content"]
                                cursor.execute('''
                INSERT INTO instructions (product_id, title, content)
                VALUES (?, ?, ?)
            ''', (product_id, title, content))
                                instruction_id = cursor.lastrowid
                                for media in doc["media"]:
                                        tool_image_path = fetch_img_files(media['image'].lstrip("./"), repo_owner, repo_name, token)
                                        
                                        cursor.execute('''
                        INSERT INTO instruction_media (instruction_id, media_path)
                        VALUES (?, ?)
                    ''', (instruction_id, tool_image_path))
                except yaml.YAMLError as e:
                  print(f"Error parsing YAML in {file_path}: {e}")
        else:
         print(f"Error fetching YAML file {file_path}: {response.status_code} - {response.text}")


    # Extract product details
  

    # Extract tools
    # for section in data:
    #     if section.get("type") == "tool-list":
    #         for tool_name, tool_image in section["tools"].items():
    #             tool_image_data = read_image(tool_image)
    #             cursor.execute("""
    #                 INSERT INTO tools (product_id, tool_name, tool_image)
    #                 VALUES (?, ?, ?)
    #             """, (product_id, tool_name, tool_image_data))

    # Extract instructions
    # for section in data:
    #     if section.get("type") == "instruction":
    #         title = section["title"]
    #         content = section["content"]
    #         cursor.execute("""
    #             INSERT INTO instructions (product_id, title, content)
    #             VALUES (?, ?, ?)
    #         """, (product_id, title, content))
    #         instruction_id = cursor.lastrowid

    #         # Insert instruction media
    #         for media in section.get("media", []):
    #             image_data = read_image(media["image"])
    #             cursor.execute("""
    #                 INSERT INTO instruction_media (instruction_id, media)
    #                 VALUES (?, ?)
    #             """, (instruction_id, image_data))

    # Extract inspections
    # for section in data:
    #     if section.get("type") == "inspection":
    #         title = section["title"]
    #         content = section["content"]
    #         cursor.execute("""
    #             INSERT INTO inspections (product_id, title, content)
    #             VALUES (?, ?, ?)
    #         """, (product_id, title, content))
    #         inspection_id = cursor.lastrowid

    #         # Insert inspection media
    #         for media in section.get("media", []):
    #             image_data = read_image(media["image"])
    #             cursor.execute("""
    #                 INSERT INTO inspection_media (inspection_id, media)
    #                 VALUES (?, ?)
    #             """, (inspection_id, image_data))

    conn.commit()
    conn.close()

if __name__ == "__main__":
    repo_owner = 'TaniyaBhadauria'
    repo_name = 'apps-wi'
    token = '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'  # Optional for private repos 
    # Fetch all YAML file paths
    yaml_files = fetch_yaml_files(repo_owner, repo_name, token)
    # yaml_files = ["product.yaml"]  # Change this to the actual YAML files
    for file in yaml_files:
        insert_data(file)
