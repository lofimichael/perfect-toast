import { ToastOptions, ToastConfig } from './types';
/**
 * Show a toast
 */
declare function show(message: string, options?: ToastOptions): string;
/**
 * Dismiss a toast
 */
declare function dismiss(id: string): void;
/**
 * Dismiss all toasts
 */
declare function dismissAll(): void;
/**
 * Update toast message
 */
declare function update(id: string, updates: {
    message?: string;
}): void;
/**
 * Configure global defaults
 */
declare function configure(newConfig: Partial<ToastConfig>): void;
/**
 * Get current configuration
 */
declare function getConfig(): Readonly<Required<ToastConfig>>;
export declare const toast: typeof show & {
    dismiss: typeof dismiss;
    dismissAll: typeof dismissAll;
    update: typeof update;
    configure: typeof configure;
    getConfig: typeof getConfig;
    success: (message: string, options?: Omit<ToastOptions, "theme">) => string;
    info: (message: string, options?: Omit<ToastOptions, "theme">) => string;
    error: (message: string, options?: Omit<ToastOptions, "theme">) => string;
    warning: (message: string, options?: Omit<ToastOptions, "theme">) => string;
};
export {};
//# sourceMappingURL=toast.d.ts.map