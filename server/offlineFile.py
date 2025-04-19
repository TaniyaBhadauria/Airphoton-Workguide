import sqlitecloud
import requests
import os

def get_db_connection():
    conn = sqlitecloud.connect(
        "sqlitecloud://cnmbhtfonk.g1.sqlite.cloud:8860/workguideDb?apikey=ya6PzUDIFdYGLcoVCHkhSzPq688M5GFhM92gvMvPpKA"
    )
    return conn

def generate_all_instruction_pdfs():
    conn = get_db_connection()
    cursor = conn.execute("SELECT item_name FROM products")
    products = cursor.fetchall()

    output_dir = "workguide/public/offline_pdfs"
    os.makedirs(output_dir, exist_ok=True)  # Ensure the output directory exists

    for product in products:
        item_code = product[0]
        print(f"Downloading PDF for {item_code}...")
        response = requests.get(f"https://y-eta-lemon.vercel.app/download_instructions?item_code={item_code}")
        if response.status_code == 200:
            pdf_path = os.path.join(output_dir, f"{item_code}.pdf")
            with open(pdf_path, "wb") as f:
                f.write(response.content)
            print(f"Saved to {pdf_path}")
        else:
            print(f"Failed to download PDF for {item_code}: {response.status_code}")

if __name__ == "__main__":
    generate_all_instruction_pdfs()
