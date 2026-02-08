from analytics.metrics.temporal import temporal_metrics
from analytics.metrics.spatial import spatial_metrics
from analytics.metrics.attention import attention_metrics
from analytics.metrics.heatmap import aoi_grid


def compute_all_metrics(df):
    return {
        "temporal": temporal_metrics(df),
        "spatial": spatial_metrics(df),
        "attention": attention_metrics(df),
        "aoi": aoi_grid(df)
    }


__all__ = ['temporal_metrics', 'spatial_metrics', 'attention_metrics', 'aoi_grid', 'compute_all_metrics']