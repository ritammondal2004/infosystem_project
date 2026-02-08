SCREEN_W, SCREEN_H = 1920, 1080
FIX_THRESH = 50  # px/sec

def attention_metrics(df):
    df["on_screen"] = (
        (df["x"] >= 0) & (df["x"] <= SCREEN_W) &
        (df["y"] >= 0) & (df["y"] <= SCREEN_H)
    )

    df["is_fixation"] = df["velocity"] < FIX_THRESH

    on_screen_ratio = df["on_screen"].mean()
    fixation_ratio = df["is_fixation"].mean()

    focus_score = (0.6 * fixation_ratio + 0.4 * on_screen_ratio) * 100

    return {
        "on_screen_ratio": round(on_screen_ratio, 3),
        "fixation_ratio": round(fixation_ratio, 3),
        "focus_score": round(focus_score, 2),
    }
