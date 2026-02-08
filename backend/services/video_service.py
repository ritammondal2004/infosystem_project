import os
import json
import logging
from typing import List
from models.video import Video
from config import DATA_FILE


def _load_from_json() -> list:
    """Helper to load raw data from the JSON file"""
    if not os.path.exists(DATA_FILE):
        return []
    try:
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    except (json.JSONDecodeError, IOError) as e:
        logging.error(f"Error reading JSON: {e}")
        return []


def get_all_videos() -> List[Video]:
    """Retrieve all videos"""
    raw_videos = _load_from_json()
    return [Video.from_json(v) for v in raw_videos]


def get_video_by_id(video_id: str) -> Video:
    """Retrieve a single video by ID"""
    raw_videos = _load_from_json()
    for video_data in raw_videos:
        if video_data.get('id') == video_id:
            return Video.from_json(video_data)
    return None