import matplotlib
matplotlib.use('Agg') # Crucial for backend
import matplotlib.pyplot as plt
import seaborn as sns
import io
import base64

def fig_to_base64(fig):
    """Helper to convert plot to string"""
    buf = io.BytesIO()
    fig.savefig(buf, format='png', bbox_inches='tight')
    buf.seek(0)
    img_str = base64.b64encode(buf.read()).decode('utf-8')
    plt.close(fig)
    return img_str

def generate_plots(df, screen_w=1920, screen_h=1080):
    if df.empty:
        return {}

    plots = {}
    
    # Filter for cleaner plots (only on-screen data)
    df_clean = df[df['on_screen'] == True]
    if df_clean.empty:
        return plots

    # --- Plot 1: 2D Heatmap (Histogram) ---
    fig1, ax1 = plt.figure(figsize=(10, 6)), plt.gca()
    h = ax1.hist2d(df_clean['x_smooth'], df_clean['y_smooth'], bins=40, cmap='inferno')
    plt.colorbar(h[3], ax=ax1, label='Gaze Duration')
    ax1.set_xlim(0, screen_w)
    ax1.set_ylim(screen_h, 0) # Invert Y for screen coordinates
    ax1.set_title("Gaze Intensity Heatmap")
    ax1.set_xlabel("Screen X")
    ax1.set_ylabel("Screen Y")
    plots['heatmap'] = fig_to_base64(fig1)

    # --- Plot 2: Scatter Plot (Time Colored) ---
    fig2, ax2 = plt.figure(figsize=(10, 6)), plt.gca()
    scatter = ax2.scatter(df_clean['x_smooth'], df_clean['y_smooth'], 
                          c=df_clean['time_sec'], cmap='viridis', alpha=0.6, s=15)
    plt.colorbar(scatter, ax=ax2, label='Time (seconds)')
    ax2.set_xlim(0, screen_w)
    ax2.set_ylim(screen_h, 0)
    ax2.set_title("Gaze Path Over Time")
    plots['scatter_path'] = fig_to_base64(fig2)

    # --- Plot 3: X-Coordinate Time Series ---
    fig3, ax3 = plt.figure(figsize=(10, 4)), plt.gca()
    ax3.plot(df['time_sec'], df['x_smooth'], color='blue', linewidth=1)
    ax3.axhline(0, color='red', linestyle='--')
    ax3.axhline(screen_w, color='red', linestyle='--')
    ax3.set_title("Horizontal Eye Movement (Reading Pattern)")
    ax3.set_xlabel("Time (s)")
    ax3.set_ylabel("X Pixel")
    plots['x_time_series'] = fig_to_base64(fig3)

    return plots