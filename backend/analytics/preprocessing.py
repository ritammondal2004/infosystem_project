import pandas as pd
import numpy as np

SMOOTHING_WINDOW = 5

def preprocess_gaze_data(json_data):
    """
    Converts raw WebGazer JSON into a cleaned DataFrame with
    smoothed gaze coordinates and velocity physics.
    """
    df = pd.DataFrame(json_data)

    if df.empty:
        return pd.DataFrame()

    # Sort chronologically
    df = df.sort_values("timestamp").reset_index(drop=True)

    # Normalize time (ms → seconds, start at 0)
    start_ts = df["timestamp"].iloc[0]
    df["time_sec"] = (df["timestamp"] - start_ts) / 1000.0

    # Smooth gaze signal to reduce WebGazer jitter
    df["x_smooth"] = (
        df["x"]
        .rolling(window=SMOOTHING_WINDOW, center=True)
        .mean()
        .fillna(df["x"])
    )   
    df["y_smooth"] = (
        df["y"]
        .rolling(window=SMOOTHING_WINDOW, center=True)
        .mean()
        .fillna(df["y"])  
    )               
            
    # Motion physics
    df["dx"] = df["x_smooth"].diff().fillna(0)
    df["dy"] = df["y_smooth"].diff().fillna(0)
    df["dt"] = df["time_sec"].diff().replace(0, np.nan).fillna(0.04)

    df["distance_px"] = np.sqrt(df["dx"]**2 + df["dy"]**2)
    df["velocity"] = (df["distance_px"] / df["dt"]).fillna(0)
                    
    return df           
