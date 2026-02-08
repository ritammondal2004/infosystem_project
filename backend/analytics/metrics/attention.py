from config import SCREEN_WIDTH, SCREEN_HEIGHT, FIXATION_THRESHOLD

def attention_metrics(df):
    df["on_screen"] = (
        (df["x"] >= 0) & (df["x"] <= SCREEN_WIDTH) &
        (df["y"] >= 0) & (df["y"] <= SCREEN_HEIGHT)
    )

    df["is_fixation"] = df["velocity"] < FIXATION_THRESHOLD


    on_screen_ratio: float = float(df["on_screen"].mean())
    fixation_ratio: float = float(df["is_fixation"].mean())

    focus_score: float = (0.6 * fixation_ratio + 0.4 * on_screen_ratio) * 100

    return {
        "on_screen_ratio": round(on_screen_ratio, 3),  # pyre-ignore[6]
        "fixation_ratio": round(fixation_ratio, 3),  # pyre-ignore[6]
        "focus_score": round(focus_score, 2),  # pyre-ignore[6]
    }