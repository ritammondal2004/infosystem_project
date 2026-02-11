import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns
from utils.encoding import fig_to_base64
from config import SCREEN_WIDTH, SCREEN_HEIGHT


def generate_plots(df, screen_w=None, screen_h=None):
    if screen_w is None:
        screen_w = SCREEN_WIDTH
    if screen_h is None:
        screen_h = SCREEN_HEIGHT
        
    if df.empty:
        return {}

    plots = {}
    
    # Filter for cleaner plots (only on-screen data)
    df_clean = df[df['on_screen'] == True]
    if df_clean.empty:
        return plots

    # --- Plot 1: 2D Heatmap (KDE) ---
    fig1, ax1 = plt.subplots(figsize=(10, 6))
    sns.kdeplot(
        data=df_clean,
        x='x_smooth',
        y='y_smooth',
        fill=True,
        cmap='rocket',
        levels=30,
        alpha=0.85,
        ax=ax1,
        cbar=True,
        cbar_kws={'label': 'Gaze Density'}
    )
    ax1.set_xlim(0, screen_w)
    ax1.set_ylim(screen_h, 0)  # Invert Y for screen coordinates
    ax1.set_title("Gaze Intensity Heatmap")
    ax1.set_xlabel("Screen X")
    ax1.set_ylabel("Screen Y")
    plots['heatmap'] = fig_to_base64(fig1)

    # --- Plot 2: Scatter Plot (Time Colored) ---
    fig2, ax2 = plt.subplots(figsize=(10, 6))
    
    # Plot path lines first (underneath points)
    ax2.plot(df_clean['x_smooth'], df_clean['y_smooth'], 
             color='lightgray', alpha=0.4, linewidth=1.5, zorder=1)
    
    # Scatter plot with seaborn for better styling
    scatter = sns.scatterplot(
        data=df_clean,
        x='x_smooth',
        y='y_smooth',
        hue='time_sec',
        palette='mako',
        alpha=0.75,
        s=25,
        edgecolor='white',
        linewidth=0.4,
        ax=ax2,
        legend=False,
        zorder=2
    )
    
    # Add colorbar
    norm = plt.Normalize(vmin=df_clean['time_sec'].min(), vmax=df_clean['time_sec'].max())
    sm = plt.cm.ScalarMappable(cmap='mako', norm=norm)
    sm.set_array([])
    plt.colorbar(sm, ax=ax2, label='Time (seconds)')
    
    ax2.set_xlim(0, screen_w)
    ax2.set_ylim(screen_h, 0)
    ax2.set_title("Gaze Path Over Time")
    ax2.set_xlabel("Screen X")
    ax2.set_ylabel("Screen Y")
    plots['scatter_path'] = fig_to_base64(fig2)

    # --- Plot 3: X-Coordinate Time Series ---
    fig3, ax3 = plt.subplots(figsize=(10, 4))
    
    # Add horizontal zone bands for context (left/center/right screen)
    ax3.axhspan(0, screen_w*0.33, alpha=0.08, color='blue', zorder=1)
    ax3.axhspan(screen_w*0.33, screen_w*0.67, alpha=0.08, color='green', zorder=1)
    ax3.axhspan(screen_w*0.67, screen_w, alpha=0.08, color='red', zorder=1)
    
    # Plot line with seaborn for better styling
    sns.lineplot(data=df, x='time_sec', y='x_smooth', 
                color='#1B4965', linewidth=2, ax=ax3, zorder=3)
    
    # Add gradient fill under the line
    ax3.fill_between(df['time_sec'], 0, df['x_smooth'], 
                     alpha=0.25, color='steelblue', zorder=2)
    
    # Softer boundary lines
    ax3.axhline(0, color='gray', linestyle=':', alpha=0.6, linewidth=1.5, zorder=4)
    ax3.axhline(screen_w, color='gray', linestyle=':', alpha=0.6, linewidth=1.5, zorder=4)
    
    ax3.set_title("Horizontal Eye Movement (Reading Pattern)", fontsize=11, pad=10)
    ax3.set_xlabel("Time (s)")
    ax3.set_ylabel("X Pixel")
    ax3.set_ylim(-50, screen_w + 50)  # Add padding for better visibility
    ax3.grid(True, alpha=0.2, linestyle='--', linewidth=0.5)
    plots['x_time_series'] = fig_to_base64(fig3)

    # --- Plot 4: Y-Coordinate Time Series ---
    fig4, ax4 = plt.subplots(figsize=(10, 4))
    
    # Add horizontal zone bands for context (top/middle/bottom screen)
    ax4.axhspan(0, screen_h*0.33, alpha=0.08, color='blue', zorder=1)
    ax4.axhspan(screen_h*0.33, screen_h*0.67, alpha=0.08, color='green', zorder=1)
    ax4.axhspan(screen_h*0.67, screen_h, alpha=0.08, color='red', zorder=1)
    
    # Plot line with seaborn for better styling
    sns.lineplot(data=df, x='time_sec', y='y_smooth', 
                color='#62374E', linewidth=2, ax=ax4, zorder=3)
    
    # Add gradient fill under the line
    ax4.fill_between(df['time_sec'], 0, df['y_smooth'], 
                     alpha=0.25, color='orchid', zorder=2)
    
    # Softer boundary lines
    ax4.axhline(0, color='gray', linestyle=':', alpha=0.6, linewidth=1.5, zorder=4)
    ax4.axhline(screen_h, color='gray', linestyle=':', alpha=0.6, linewidth=1.5, zorder=4)
    
    ax4.set_title("Vertical Eye Movement (Scrolling Pattern)", fontsize=11, pad=10)
    ax4.set_xlabel("Time (s)")
    ax4.set_ylabel("Y Pixel")
    ax4.set_ylim(-50, screen_h + 50)  # Add padding for better visibility
    ax4.grid(True, alpha=0.2, linestyle='--', linewidth=0.5)
    plots['y_time_series'] = fig_to_base64(fig4)

    return plots