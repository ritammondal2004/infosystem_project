def spatial_metrics(df):
    neg_x = (df["x"] < 0).sum()
    neg_y = (df["y"] < 0).sum()

    return {
        "x_stats": {
            "min": df["x"].min(),
            "max": df["x"].max(),
            "mean": df["x"].mean(),
            "std": df["x"].std(),
        },
        "y_stats": {
            "min": df["y"].min(),
            "max": df["y"].max(),
            "mean": df["y"].mean(),
            "std": df["y"].std(),
        },
        "outliers": {
            "negative_x_pct": round(neg_x / len(df) * 100, 2),
            "negative_y_pct": round(neg_y / len(df) * 100, 2),
        }
    }
