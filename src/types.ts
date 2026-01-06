/**
 * 9-point grid positioning for toasts
 */
export type Position =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'middle-left'
  | 'middle-center'
  | 'middle-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

/**
 * Direction for the sweep animation
 */
export type Direction = 'left' | 'right' | 'up' | 'down';

/**
 * Built-in color themes
 */
export type Theme = 'green' | 'cyan' | 'red' | 'amber';

/**
 * Light/dark mode setting
 */
export type Mode = 'dark' | 'light' | 'auto';

/**
 * Options for individual toasts
 */
export interface ToastOptions {
  /** Color theme - built-in name or custom hex color */
  theme?: Theme | string;
  /** Position on screen */
  position?: Position;
  /** Light/dark mode */
  mode?: Mode;
  /** Direction of the sweep animation */
  direction?: Direction;
  /** Duration in ms before auto-dismiss (0 = persistent) */
  duration?: number;
  /** Duration of the reveal animation in ms */
  animationSpeed?: number;
  /** Allow click to dismiss */
  dismissible?: boolean;
  /** Pause timer on hover */
  pauseOnHover?: boolean;
  /** Callback when toast appears */
  onShow?: () => void;
  /** Callback when toast is dismissed */
  onDismiss?: () => void;
}

/**
 * Global configuration options
 */
export interface ToastConfig extends ToastOptions {
  /** Font family for toast text */
  fontFamily?: string;
  /** Font size in pixels */
  fontSize?: number;
  /** Margin from screen edges in pixels */
  margin?: number;
  /** Gap between stacked toasts in pixels */
  gap?: number;
  /** Maximum number of visible toasts (0 = unlimited) */
  maxVisible?: number;
}

/**
 * Internal toast state
 */
export interface ToastState {
  id: string;
  message: string;
  options: Required<ToastOptions>;
  element: HTMLElement | null;
  timeoutId: number | null;
  phase: 'entering' | 'visible' | 'exiting' | 'removed';
  pausedAt: number | null;
  remainingTime: number;
}

/**
 * Theme color definitions
 */
export interface ThemeColors {
  primary: string;
  glow: string;
}

/**
 * Resolved mode colors for rendering
 */
export interface ModeColors {
  background: string;
  unfadedText: string;
  highlight: string; // Bright leading edge color (white for dark, black for light)
}
