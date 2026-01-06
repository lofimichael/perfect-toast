import type {
  ToastOptions,
  ToastConfig,
  ToastState,
  Position,
  Mode,
} from './types';
import {
  injectStyles,
  getThemeColors,
  getPositionStyles,
  getGradientAngle,
  MODE_COLORS,
} from './styles';

// Default configuration
const DEFAULT_CONFIG: Required<ToastConfig> = {
  theme: 'green',
  position: 'bottom-left',
  mode: 'auto',
  direction: 'left',
  duration: 4000,
  animationSpeed: 400,
  dismissible: true,
  pauseOnHover: true,
  onShow: () => {},
  onDismiss: () => {},
  fontFamily: "'Courier New', Consolas, monospace", // Can set to '"Press Start 2P"' for pixel font
  fontSize: 14,
  margin: 16,
  gap: 6,
  maxVisible: 5,
};

// State
let config: Required<ToastConfig> = { ...DEFAULT_CONFIG };
const toasts: Map<string, ToastState> = new Map();
const containers: Map<Position, HTMLElement> = new Map();
let idCounter = 0;

/**
 * Generate unique toast ID
 */
function generateId(): string {
  return `pt-${++idCounter}-${Date.now()}`;
}

/**
 * Detect system color scheme
 */
function getSystemMode(): 'dark' | 'light' {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Resolve mode to actual dark/light value
 */
function resolveMode(mode: Mode): 'dark' | 'light' {
  return mode === 'auto' ? getSystemMode() : mode;
}

/**
 * Get or create container for a position
 */
function getContainer(position: Position): HTMLElement {
  if (containers.has(position)) {
    return containers.get(position)!;
  }

  const container = document.createElement('div');
  container.className = `pt-container pt-container--${position}`;

  const posStyles = getPositionStyles(position, config.margin);
  Object.assign(container.style, posStyles);

  // Stack direction based on position
  if (position.startsWith('middle')) {
    container.style.alignItems = position.endsWith('left') ? 'flex-start' :
                                  position.endsWith('right') ? 'flex-end' : 'center';
  }

  document.body.appendChild(container);
  containers.set(position, container);
  return container;
}

/**
 * Create toast element
 */
function createToastElement(state: ToastState): HTMLElement {
  const { message, options } = state;
  const themeColors = getThemeColors(options.theme);
  const modeColors = MODE_COLORS[resolveMode(options.mode)];
  const gradientAngle = getGradientAngle(options.direction);

  const toast = document.createElement('div');
  toast.className = 'pt-toast pt-toast--entering';
  if (options.dismissible) {
    toast.classList.add('pt-toast--dismissible');
  }

  // Set CSS custom properties
  toast.style.setProperty('--pt-color', themeColors.primary);
  toast.style.setProperty('--pt-glow', themeColors.glow);
  toast.style.setProperty('--pt-highlight', modeColors.highlight); // Mode-aware bright edge
  toast.style.setProperty('--pt-bg', modeColors.background);
  toast.style.setProperty('--pt-gradient-angle', `${gradientAngle}deg`);
  toast.style.setProperty('--pt-animation-speed', `${options.animationSpeed}ms`);
  toast.style.setProperty('--pt-font-family', config.fontFamily);
  toast.style.setProperty('--pt-font-size', `${config.fontSize}px`);
  toast.style.setProperty('--pt-gap', `${config.gap}px`);

  // Text content
  const text = document.createElement('span');
  text.className = 'pt-toast__text';
  text.textContent = message;
  toast.appendChild(text);

  // Event handlers
  if (options.dismissible) {
    toast.addEventListener('click', () => dismiss(state.id));
  }

  if (options.pauseOnHover) {
    toast.addEventListener('mouseenter', () => pauseTimer(state.id));
    toast.addEventListener('mouseleave', () => resumeTimer(state.id));
  }

  return toast;
}

/**
 * Start auto-dismiss timer
 */
function startTimer(state: ToastState): void {
  if (state.options.duration <= 0) return;

  state.timeoutId = window.setTimeout(() => {
    dismiss(state.id);
  }, state.remainingTime);
}

/**
 * Pause timer on hover
 */
function pauseTimer(id: string): void {
  const state = toasts.get(id);
  if (!state || state.phase !== 'visible' || !state.timeoutId) return;

  window.clearTimeout(state.timeoutId);
  state.pausedAt = Date.now();
  state.timeoutId = null;
}

/**
 * Resume timer after hover
 */
function resumeTimer(id: string): void {
  const state = toasts.get(id);
  if (!state || state.phase !== 'visible' || !state.pausedAt) return;

  const elapsed = Date.now() - (state.options.duration - state.remainingTime);
  state.remainingTime = Math.max(0, state.options.duration - elapsed);
  state.pausedAt = null;
  startTimer(state);
}

/**
 * Show a toast
 */
function show(message: string, options?: ToastOptions): string {
  injectStyles();

  const id = generateId();
  const mergedOptions: Required<ToastOptions> = {
    ...config,
    ...options,
  };

  const state: ToastState = {
    id,
    message,
    options: mergedOptions,
    element: null,
    timeoutId: null,
    phase: 'entering',
    pausedAt: null,
    remainingTime: mergedOptions.duration,
  };

  // Enforce max visible
  if (config.maxVisible > 0) {
    const visibleToasts = Array.from(toasts.values()).filter(
      t => t.phase !== 'exiting' && t.phase !== 'removed'
    );
    if (visibleToasts.length >= config.maxVisible) {
      const oldest = visibleToasts[0];
      dismiss(oldest.id);
    }
  }

  toasts.set(id, state);

  // Create and insert element
  const container = getContainer(mergedOptions.position);
  const element = createToastElement(state);
  state.element = element;

  // Insert at appropriate position based on container direction
  if (mergedOptions.position.startsWith('bottom')) {
    container.insertBefore(element, container.firstChild);
  } else {
    container.appendChild(element);
  }

  // Transition to visible after enter animation
  setTimeout(() => {
    if (state.phase === 'entering') {
      state.phase = 'visible';
      element.classList.remove('pt-toast--entering');
      element.classList.add('pt-toast--visible');
      state.options.onShow?.();
      startTimer(state);
    }
  }, mergedOptions.animationSpeed);

  return id;
}

/**
 * Dismiss a toast
 */
function dismiss(id: string): void {
  const state = toasts.get(id);
  if (!state || state.phase === 'exiting' || state.phase === 'removed') return;

  state.phase = 'exiting';

  if (state.timeoutId) {
    window.clearTimeout(state.timeoutId);
    state.timeoutId = null;
  }

  if (state.element) {
    // Reset reveal for exit animation (start off-screen so nothing disappears immediately)
    state.element.style.setProperty('--pt-reveal', '-40%');

    state.element.classList.remove('pt-toast--visible');
    state.element.classList.add('pt-toast--exiting');

    // Remove after animation completes
    setTimeout(() => {
      removeToast(id);
    }, state.options.animationSpeed);
  } else {
    removeToast(id);
  }
}

/**
 * Remove toast from DOM and state
 */
function removeToast(id: string): void {
  const state = toasts.get(id);
  if (!state) return;

  state.phase = 'removed';
  state.element?.remove();
  state.options.onDismiss?.();
  toasts.delete(id);

  // Clean up empty containers
  const container = containers.get(state.options.position);
  if (container && container.children.length === 0) {
    container.remove();
    containers.delete(state.options.position);
  }
}

/**
 * Dismiss all toasts
 */
function dismissAll(): void {
  for (const id of toasts.keys()) {
    dismiss(id);
  }
}

/**
 * Update toast message
 */
function update(id: string, updates: { message?: string }): void {
  const state = toasts.get(id);
  if (!state || !state.element) return;

  if (updates.message) {
    state.message = updates.message;
    const textEl = state.element.querySelector('.pt-toast__text');
    if (textEl) {
      textEl.textContent = updates.message;
    }
  }
}

/**
 * Configure global defaults
 */
function configure(newConfig: Partial<ToastConfig>): void {
  config = { ...config, ...newConfig };
}

/**
 * Get current configuration
 */
function getConfig(): Readonly<Required<ToastConfig>> {
  return { ...config };
}

// Export toast function with methods
export const toast = Object.assign(show, {
  dismiss,
  dismissAll,
  update,
  configure,
  getConfig,

  // Themed shortcuts
  success: (message: string, options?: Omit<ToastOptions, 'theme'>) =>
    show(message, { ...options, theme: 'green' }),

  info: (message: string, options?: Omit<ToastOptions, 'theme'>) =>
    show(message, { ...options, theme: 'cyan' }),

  error: (message: string, options?: Omit<ToastOptions, 'theme'>) =>
    show(message, { ...options, theme: 'red' }),

  warning: (message: string, options?: Omit<ToastOptions, 'theme'>) =>
    show(message, { ...options, theme: 'amber' }),
});
