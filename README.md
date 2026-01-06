# Perfect Toast

A Perfect Dark-inspired toast notification library with directional gradient sweep animations.

## Features

- Directional color gradient reveal animation (like Perfect Dark's HUD)
- 9-point positioning grid
- 4 built-in color themes + custom hex support
- Light/dark mode support
- Pause on hover, click to dismiss
- TypeScript support
- Zero dependencies, ~3KB gzipped

## Installation

```bash
npm install perfect-toast
```

```bash
yarn add perfect-toast
```

```bash
pnpm add perfect-toast
```

## Quick Start

```typescript
import { toast } from 'perfect-toast';

// Simple toast
toast('Objective complete.');

// Themed shortcuts
toast.success('Mission complete.');
toast.info('New intel received.');
toast.error('Connection lost.');
toast.warning('Low ammunition.');
```

## API

### `toast(message, options?)`

Show a toast notification.

```typescript
const id = toast('Hello world', {
  theme: 'green',
  position: 'bottom-left',
  direction: 'left',
  duration: 4000,
});
```

### Themed Shortcuts

```typescript
toast.success(message, options?)  // green theme
toast.info(message, options?)     // cyan theme
toast.error(message, options?)    // red theme
toast.warning(message, options?)  // amber theme
```

### Management

```typescript
toast.dismiss(id)      // Dismiss specific toast
toast.dismissAll()     // Dismiss all toasts
toast.update(id, { message: 'Updated!' })  // Update toast message
```

### Configuration

Set global defaults:

```typescript
toast.configure({
  position: 'bottom-left',
  theme: 'green',
  duration: 4000,
  direction: 'left',
  mode: 'auto',
});
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `theme` | `'green' \| 'cyan' \| 'red' \| 'amber' \| string` | `'green'` | Color theme or custom hex |
| `position` | `Position` | `'bottom-left'` | Screen position (9-point grid) |
| `mode` | `'dark' \| 'light' \| 'auto'` | `'auto'` | Background mode |
| `direction` | `'left' \| 'right' \| 'up' \| 'down'` | `'left'` | Animation sweep direction |
| `duration` | `number` | `4000` | Auto-dismiss time in ms (0 = persistent) |
| `animationSpeed` | `number` | `400` | Reveal animation duration in ms |
| `dismissible` | `boolean` | `true` | Click to dismiss |
| `pauseOnHover` | `boolean` | `true` | Pause timer on hover |
| `onShow` | `() => void` | - | Callback when toast appears |
| `onDismiss` | `() => void` | - | Callback when toast is dismissed |

## Positions

9-point positioning grid:

```
top-left      top-center      top-right
middle-left   middle-center   middle-right
bottom-left   bottom-center   bottom-right
```

## Global Config Options

Additional options available via `toast.configure()`:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `fontFamily` | `string` | `'Courier New', Consolas, monospace` | Toast font |
| `fontSize` | `number` | `14` | Font size in pixels |
| `margin` | `number` | `16` | Margin from screen edges |
| `gap` | `number` | `6` | Gap between stacked toasts |
| `maxVisible` | `number` | `5` | Max visible toasts (0 = unlimited) |

## Color Themes

| Theme | Color | Use Case |
|-------|-------|----------|
| `green` | `#00ff00` | Success, confirmations |
| `cyan` | `#00ccff` | Info, neutral messages |
| `red` | `#ff3333` | Errors, warnings |
| `amber` | `#ffcc00` | Cautions, alerts |

Custom hex colors are also supported:

```typescript
toast('Custom color!', { theme: '#ff00ff' });
```

## Browser Support

- Chrome 85+
- Firefox 75+
- Safari 15.4+
- Edge 85+

Requires CSS `@property` support for smooth gradient animations.

## License

MIT
