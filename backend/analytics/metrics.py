from analytics.temporal import temporal_metrics
from analytics.spatial import spatial_metrics
from analytics.attention import attention_metrics
from analytics.heatmap import aoi_grid

def compute_all_metrics(df):
    """
    Aggregates all gaze analytics metrics into a single dictionary.
    """
    return {
        "temporal": temporal_metrics(df),
        "spatial": spatial_metrics(df),
        "attention": attention_metrics(df),
        "aoi": aoi_grid(df)
    }
