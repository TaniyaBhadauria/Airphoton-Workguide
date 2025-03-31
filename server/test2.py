import requests

def list_yaml_files(repo_owner, repo_name, token=None):
    """Fetches all YAML files from a GitHub repository."""
    url = f"https://api.github.com/repos/{repo_owner}/{repo_name}/git/trees/master?recursive=1"
    headers = {"Authorization": f"token {token}"} if token else {}

    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        files = response.json().get("tree", [])
        
        # Filter for .yaml and .yml files
        yaml_files = [file["path"] for file in files if file["path"].endswith((".yaml", ".yml"))]
        
        return yaml_files
    else:
        print(f"Error fetching repository files: {response.status_code} - {response.text}")
        return []

# Example Usage
repo_owner = "TaniyaBhadauria"
repo_name = "apps-wi"
token = "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"  # Optional for private repos

yaml_files = list_yaml_files(repo_owner, repo_name, token=token)

if yaml_files:
    print("YAML Files Found:")
    for file in yaml_files:
        print(f"- {file}")
else:
    print("No YAML files found.")
