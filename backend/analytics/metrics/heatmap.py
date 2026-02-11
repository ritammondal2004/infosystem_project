import numpy as np

def aoi_grid(df, rows=5, cols=5):
    heatmap, _, _ = np.histogram2d(
        df["y"], df["x"],
        bins=[rows, cols]
    )

    heatmap_pct = heatmap / heatmap.sum() * 100
    return heatmap_pct.round(2).tolist()