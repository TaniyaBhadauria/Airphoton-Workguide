import requests

def get_github_commits(repo_owner, repo_name, num_commits=10):
    # GitHub API URL to fetch commits
    url = f"https://api.github.com/repos/{repo_owner}/{repo_name}/commits?per_page={num_commits}"
    
    # Send a GET request to fetch the commits
    response = requests.get(url)
    
    if response.status_code == 200:
        commits = response.json()  # Get the JSON response
        commit_info = []
        
        for commit in commits:
            commit_info.append({
                "sha": commit['sha'][:7],  # Shortened commit SHA
                "message": commit['commit']['message'],
                "author": commit['commit']['author']['name'],
                "date": commit['commit']['author']['date']
            })
        
        return commit_info
    else:
        print(f"Error fetching commits: {response.status_code}")
        return []

# Example Usage
repo_owner = "TaniyaBhadauria"  # GitHub username or organization
repo_name = "AcademicHarbor"  # GitHub repository name
commits = get_github_commits(repo_owner, repo_name)

for commit in commits:
    print(f"{commit['sha']} - {commit['message']} by {commit['author']} on {commit['date']}")
