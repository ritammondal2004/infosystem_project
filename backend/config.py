import os
from dotenv import load_dotenv

load_dotenv()

FLASK_HOST = os.getenv(
    'FLASK_HOST',
    '0.0.0.0'
)
FLASK_PORT = os.getenv(
    'FLASK_PORT',
    5000
)

CORS_ALLOWED_ORIGINS = os.getenv(
    'CORS_ALLOWED_ORIGINS',
    'http://localhost:3000,http://127.0.0.1:3000'
).split(',')

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATA_DIR = os.path.join(BASE_DIR, 'data')
DATA_FILE = os.path.join(DATA_DIR, 'videos.json')

# Get screen width and height from frontend ideally
SCREEN_WIDTH = 1920
SCREEN_HEIGHT = 1080

# Most probably not required
SMOOTHING_WINDOW = 5
FIXATION_THRESHOLD = 50