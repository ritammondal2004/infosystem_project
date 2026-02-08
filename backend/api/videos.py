from flask import Blueprint, jsonify
from services import get_all_videos, get_video_by_id

videos_bp = Blueprint('videos', __name__, url_prefix='/api/videos')


@videos_bp.route('', methods=['GET'])
def list_videos():
    videos = get_all_videos()
    return jsonify([v.to_dict() for v in videos])


@videos_bp.route('/<video_id>', methods=['GET'])
def get_video(video_id):
    video = get_video_by_id(video_id)
    if video is None:
        return jsonify({"error": "Video not found"}), 404
    return jsonify(video.to_dict())
