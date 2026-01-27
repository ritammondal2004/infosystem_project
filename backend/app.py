import os
import logging
from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
VIDEO_FOLDER = os.path.join(BASE_DIR, 'static', 'videos')
DB_FILE = os.path.join(BASE_DIR, 'instance', 'site.db')

os.makedirs(VIDEO_FOLDER, exist_ok=True)
os.makedirs(os.path.join(BASE_DIR, 'instance'), exist_ok=True)

app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DB_FILE}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class Video(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(150), unique=True, nullable=False)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.String(300), nullable=True)
    source_type = db.Column(db.String(10), nullable=False, default='LOCAL')  # LOCAL or REMOTE
    s3_key = db.Column(db.String(300), nullable=True)
    mime_type = db.Column(db.String(50), nullable=True, default='video/mp4')
    cdn_url = db.Column(db.String(300), nullable=True)
    external_id = db.Column(db.String(150), nullable=True)
    provider = db.Column(db.String(50), nullable=True)
    embed_url = db.Column(db.String(300), nullable=True)
    
    def to_dict(self):
        """Convert video object to dictionary"""
        meta = {}
        
        if self.source_type == 'LOCAL':
            meta = {
                "s3_key": self.s3_key,
                "mime_type": self.mime_type,
                "cdn_url": self.cdn_url
            }
        elif self.source_type == 'REMOTE':
            meta = {
                "external_id": self.external_id,
                "provider": self.provider,
                "embed_url": self.embed_url
            }
        
        return {
            "id": f"vid_{self.id}",
            "title": self.title,
            "description": self.description,
            "source_type": self.source_type,
            "meta": meta
        }

@app.route('/api/videos', methods=['GET'])
def get_videos():
    """Fetch all videos"""
    try:
        videos = Video.query.all()
        return jsonify([video.to_dict() for video in videos])
    except Exception as e:
        logging.error(f"Error fetching videos: {e}")
        return jsonify({"error": "Failed to fetch videos"}), 500

@app.route('/api/videos/<video_id>', methods=['GET'])
def get_video(video_id):
    """Fetch a specific video"""
    try:
        video_num = int(video_id.split('_')[1]) if '_' in video_id else int(video_id)
        video = Video.query.get(video_num)
        if not video:
            return jsonify({"error": "Video not found"}), 404
        return jsonify(video.to_dict())
    except Exception as e:
        logging.error(f"Error fetching video: {e}")
        return jsonify({"error": "Failed to fetch video"}), 500
 
if __name__ == "__main__":
    # Disable debug mode in production
    app.run(host='0.0.0.0', port=5000, debug=True)