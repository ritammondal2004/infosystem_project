from flask import Blueprint, jsonify, request
from services import analyze_gaze_session

analytics_bp = Blueprint('analytics', __name__, url_prefix='/api')


@analytics_bp.route("/analyze", methods=["POST"])
def analyze(): 
    try:
        payload = request.json
        gaze_data = payload.get("gaze_data", [])

        if not gaze_data:
            return jsonify({"error": "No gaze data provided"}), 400

        result = analyze_gaze_session(gaze_data)
        return jsonify(result.to_dict())

    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "Internal Server Error"}), 500
