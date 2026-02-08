import os
import json
import logging
from flask import Flask, jsonify
from flask_cors import CORS
from flask import request
from analytics.preprocessing import preprocess_gaze_data
from analytics.attention import attention_metrics
from analytics.metrics import compute_all_metrics
from analytics.plots import generate_plots


app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATA_FILE = os.path.join(BASE_DIR, 'data', 'videos.json')

os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)

def load_videos_from_json():
    """Helper to load raw data from the JSON file"""
    if not os.path.exists(DATA_FILE):
        return []
    try:
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    except (json.JSONDecodeError, IOError) as e:
        logging.error(f"Error reading JSON: {e}")
        return []

def format_video(video_data):
    """
    Transforms simple JSON storage format into the API response format
    
    Storage Input:  {"id": "...", "type": "youtube", "src": "..."}
    API Output:     {"id": "...", "source_type": "REMOTE", "meta": {...}}
    """
    is_remote = video_data.get('type') == 'youtube'
    
    meta = {}
    # Handle other sources incrementally
    if is_remote:
        meta = {
            "external_id": video_data.get('src'),
            "provider": "youtube",
            "embed_url": f"https://www.youtube.com/embed/{video_data.get('src')}"
        }

    return {
        "id": video_data.get('id'),
        "title": video_data.get('title'),
        "description": video_data.get('description', ''),
        "source_type": "REMOTE" if is_remote else "LOCAL",
        "meta": meta
    }

@app.route('/api/videos', methods=['GET'])
def get_videos():
    raw_videos = load_videos_from_json()
    formatted_videos = [format_video(v) for v in raw_videos]
    return jsonify(formatted_videos)

@app.route('/api/videos/<video_id>', methods=['GET'])
def get_video(video_id):
    raw_videos = load_videos_from_json()
    for video in raw_videos:
        if video.get('id') == video_id:
            return jsonify(format_video(video))
    return jsonify({"error": "Video not found"}), 404

@app.route("/api/analyze", methods=["POST"])
def analyze_gaze_session(): 
    try:
        payload = request.json
        gaze_data = payload.get("gaze_data", [])

        if not gaze_data:
            return jsonify({"error": "No gaze data provided"}), 400

        # --- Analytics Pipeline ---
        df = preprocess_gaze_data(gaze_data)

        metrics = compute_all_metrics(df)
        plots = generate_plots(df)

        return jsonify({
            "status": "success",
            "metrics": metrics,
            "plots": plots
        })

    except Exception as e:
        logging.error(f"Analytics error: {e}")
        return jsonify({"error": "Internal Server Error"}), 500


if __name__ == "__main__":
    # TODO: Run this in a WSGI server for prod
    app.run(host='0.0.0.0', port=5000)
