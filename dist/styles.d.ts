import { Position, Direction, ModeColors, ThemeColors } from './types';
/**
 * Built-in theme colors
 */
export declare const THEME_COLORS: Record<string, ThemeColors>;
/**
 * Mode-specific colors
 */
export declare const MODE_COLORS: Record<'dark' | 'light', ModeColors>;
/**
 * Get theme colors - supports built-in themes and custom hex
 */
export declare function getThemeColors(theme: string): ThemeColors;
/**
 * Get position CSS properties
 */
export declare function getPositionStyles(position: Position, margin: number): Record<string, string>;
/**
 * Get gradient direction in degrees
 */
export declare function getGradientAngle(direction: Direction): number;
export declare function injectStyles(): void;
//# sourceMappingURL=styles.d.ts.map