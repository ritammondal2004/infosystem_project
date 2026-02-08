def temporal_metrics(df):
    first_ts = df["timestamp"].min()
    last_ts = df["timestamp"].max()

    duration_sec = (last_ts - first_ts) / 1000.0
    diffs = df["timestamp"].diff().dropna()

    avg_interval = diffs.mean()
    sampling_rate = 1000 / avg_interval if avg_interval > 0 else 0

    return {
        "session_duration_sec": round(duration_sec, 2),
        "sampling_rate_hz": round(sampling_rate, 2),
        "avg_interval_ms": round(avg_interval, 2),
        "min_interval_ms": round(diffs.min(), 2),
        "max_interval_ms": round(diffs.max(), 2),
    }
  