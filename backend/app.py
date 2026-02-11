import os
from flask import Flask
from flask_cors import CORS
from config import CORS_ALLOWED_ORIGINS, DATA_FILE, FLASK_HOST, FLASK_PORT
from api import videos_bp, analytics_bp


app = Flask(__name__)

CORS(app, origins=CORS_ALLOWED_ORIGINS)    
os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)

app.register_blueprint(videos_bp)
app.register_blueprint(analytics_bp)

if __name__ == "__main__":
    # TODO: Run this in a WSGI server for prod
    app.run(host=FLASK_HOST, port=FLASK_PORT)