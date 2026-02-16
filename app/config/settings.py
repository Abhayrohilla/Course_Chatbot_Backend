# Academic Course Recommendation Backend Configuration
import os
from dotenv import load_dotenv

# Get the project root directory (where main.py's parent 'app' folder is)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Load .env file from project root
load_dotenv(os.path.join(BASE_DIR, ".env"))

# Embedding Model Configuration
# true = OpenAI text-embedding-3-small | false = Local MiniLM
USE_OPENAI_EMBEDDING = os.getenv("USE_OPENAI_EMBEDDING", "false").lower() == "true"
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")

# Data file path - relative to project root (inside app/data/ folder)
EXCEL_FILE_PATH = os.path.join(BASE_DIR, "app", "data", "Academic AI agent Data_2026.xlsx")

# Column names from Excel
COLUMNS = {
    "course_name": "Course Name",
    "department": "Department",
    "skills": "Skills",
    "industry_domain": "Industry Domain",
    "course_type": "Course type",
    "course_pathway": "Course Pathway",
    "course_level": "Course Level",
    "job_role": "job role to skill"
}
