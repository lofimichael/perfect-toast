import type { Position, Direction, ModeColors, ThemeColors } from './types';

/**
 * Built-in theme colors
 */
export const THEME_COLORS: Record<string, ThemeColors> = {
  green: { primary: '#00ff00', glow: 'rgba(0, 255, 0, 0.5)' },
  cyan: { primary: '#00ccff', glow: 'rgba(0, 204, 255, 0.5)' },
  red: { primary: '#ff3333', glow: 'rgba(255, 51, 51, 0.5)' },
  amber: { primary: '#ffcc00', glow: 'rgba(255, 204, 0, 0.5)' },
};

/**
 * Mode-specific colors
 */
export const MODE_COLORS: Record<'dark' | 'light', ModeColors> = {
  dark: {
    background: 'rgba(0, 0, 0, 0.7)',
    unfadedText: 'transparent', // Invisible until revealed
    highlight: '#ffffff', // White leading edge in dark mode
  },
  light: {
    background: 'rgba(0, 0, 0, 0.7)', // Dark bg for readability on any surface
    unfadedText: 'transparent', // Invisible until revealed
    highlight: '#000000', // Black leading edge in light mode
  },
};

/**
 * Get theme colors - supports built-in themes and custom hex
 */
export function getThemeColors(theme: string): ThemeColors {
  if (THEME_COLORS[theme]) {
    return THEME_COLORS[theme];
  }
  // Custom hex color
  return {
    primary: theme,
    glow: `${theme}80`, // 50% opacity
  };
}

/**
 * Get position CSS properties
 */
export function getPositionStyles(position: Position, margin: number): Record<string, string> {
  const styles: Record<string, string> = {
    position: 'fixed',
  };

  // Vertical positioning
  if (position.startsWith('top')) {
    styles.top = `${margin}px`;
  } else if (position.startsWith('middle')) {
    styles.top = '50%';
    styles.transform = 'translateY(-50%)';
  } else {
    styles.bottom = `${margin}px`;
  }

  // Horizontal positioning
  if (position.endsWith('left')) {
    styles.left = `${margin}px`;
  } else if (position.endsWith('center')) {
    styles.left = '50%';
    if (styles.transform) {
      styles.transform = 'translate(-50%, -50%)';
    } else {
      styles.transform = 'translateX(-50%)';
    }
  } else {
    styles.right = `${margin}px`;
  }

  return styles;
}

/**
 * Get gradient direction in degrees
 */
export function getGradientAngle(direction: Direction): number {
  switch (direction) {
    case 'left': return 90;    // left to right
    case 'right': return 270;  // right to left
    case 'up': return 0;       // bottom to top
    case 'down': return 180;   // top to bottom
  }
}

/**
 * Inject global styles if not already present
 */
let stylesInjected = false;

export function injectStyles(): void {
  if (stylesInjected || typeof document === 'undefined') return;

  const style = document.createElement('style');
  style.id = 'perfect-toast-styles';
  style.textContent = `
    .pt-container {
      position: fixed;
      z-index: 9999;
      pointer-events: none;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    .pt-container--top-left,
    .pt-container--bottom-left,
    .pt-container--middle-left {
      align-items: flex-start;
    }

    .pt-container--top-center,
    .pt-container--bottom-center,
    .pt-container--middle-center {
      align-items: center;
    }

    .pt-container--top-right,
    .pt-container--bottom-right,
    .pt-container--middle-right {
      align-items: flex-end;
    }

    .pt-container--top-left,
    .pt-container--top-center,
    .pt-container--top-right {
      flex-direction: column;
    }

    .pt-container--bottom-left,
    .pt-container--bottom-center,
    .pt-container--bottom-right {
      flex-direction: column-reverse;
    }

    .pt-toast {
      pointer-events: auto;
      font-family: var(--pt-font-family, 'Courier New', Consolas, monospace);
      font-size: var(--pt-font-size, 14px);
      padding: 4px 8px;
      margin: var(--pt-gap, 6px) 0;
      background: var(--pt-bg);
      border: 1px solid transparent;
      position: relative;
      max-width: 400px;
      width: fit-content;
      box-sizing: border-box;
      /* Mask controls overall visibility - sharper gradient with bright plateau */
      -webkit-mask-image: linear-gradient(
        var(--pt-gradient-angle),
        black calc(var(--pt-reveal, 0%) - 15%),
        white calc(var(--pt-reveal, 0%) - 8%),
        white var(--pt-reveal, 0%),
        transparent calc(var(--pt-reveal, 0%) + 2%)
      );
      mask-image: linear-gradient(
        var(--pt-gradient-angle),
        black calc(var(--pt-reveal, 0%) - 15%),
        white calc(var(--pt-reveal, 0%) - 8%),
        white var(--pt-reveal, 0%),
        transparent calc(var(--pt-reveal, 0%) + 2%)
      );
    }

    /* Border with sharper gradient + bright plateau */
    .pt-toast::before {
      content: '';
      position: absolute;
      inset: -1px;
      pointer-events: none;
      /* Set border properties individually - shorthand resets border-image */
      border-width: 1px;
      border-style: solid;
      border-color: transparent;
      border-image: linear-gradient(
        var(--pt-gradient-angle),
        var(--pt-color) calc(var(--pt-reveal, 0%) - 15%),
        var(--pt-highlight) calc(var(--pt-reveal, 0%) - 8%),
        var(--pt-highlight) var(--pt-reveal, 0%),
        transparent calc(var(--pt-reveal, 0%) + 2%)
      ) 1;
    }

    .pt-toast--dismissible {
      cursor: pointer;
    }

    /* Text with sharper gradient + bright plateau */
    .pt-toast__text {
      background: linear-gradient(
        var(--pt-gradient-angle),
        var(--pt-color) calc(var(--pt-reveal, 0%) - 15%),
        var(--pt-highlight) calc(var(--pt-reveal, 0%) - 8%),
        var(--pt-highlight) var(--pt-reveal, 0%),
        transparent calc(var(--pt-reveal, 0%) + 2%)
      );
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      line-height: 1.3;
    }

    /* Enter animation - everything reveals together via --pt-reveal */
    .pt-toast--entering {
      animation: pt-reveal var(--pt-animation-speed, 400ms) ease-out forwards;
    }

    /* Visible state - keep gradient structure but fully revealed (no style switch = no brightness pop) */
    .pt-toast--visible {
      --pt-reveal: 150%;
    }

    /* Exit animation - clean sweep to transparent (no bright edge) */
    .pt-toast--exiting {
      animation: pt-fade-out var(--pt-animation-speed, 400ms) ease-in forwards;
      /* Mask: transparent sweeps left-to-right, no bright edge */
      -webkit-mask-image: linear-gradient(
        var(--pt-gradient-angle),
        transparent calc(var(--pt-reveal, 0%) - 2%),
        black calc(var(--pt-reveal, 0%) + 40%)
      );
      mask-image: linear-gradient(
        var(--pt-gradient-angle),
        transparent calc(var(--pt-reveal, 0%) - 2%),
        black calc(var(--pt-reveal, 0%) + 40%)
      );
    }

    .pt-toast--exiting::before {
      /* Must set border properties individually - shorthand resets border-image */
      border-width: 1px;
      border-style: solid;
      border-color: transparent;
      border-image: linear-gradient(
        var(--pt-gradient-angle),
        transparent calc(var(--pt-reveal, 0%) - 2%),
        var(--pt-color) calc(var(--pt-reveal, 0%) + 40%)
      ) 1;
    }

    .pt-toast--exiting .pt-toast__text {
      background: linear-gradient(
        var(--pt-gradient-angle),
        transparent calc(var(--pt-reveal, 0%) - 2%),
        var(--pt-color) calc(var(--pt-reveal, 0%) + 40%)
      );
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    @keyframes pt-reveal {
      from { --pt-reveal: -40%; }
      to { --pt-reveal: 145%; }
    }

    @keyframes pt-fade-out {
      from { --pt-reveal: -40%; }
      to { --pt-reveal: 105%; }
    }

    /* Register custom properties for animation */
    @property --pt-reveal {
      syntax: '<percentage>';
      inherits: true;
      initial-value: -40%;
    }

    @property --pt-highlight {
      syntax: '<color>';
      inherits: true;
      initial-value: white;
    }
  `;
  document.head.appendChild(style);
  stylesInjected = true;
}
