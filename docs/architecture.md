# Architecture

## High-Level Overview

BreachFin is a **single-page, client-side application** with zero server-side logic. It follows a straightforward data-flow:

```
┌─────────────┐      fetch()      ┌──────────────┐
│ tools.json  │ ───────────────►  │   app.js     │
│  (static)   │                   │  (runtime)   │
└─────────────┘                   └──────┬───────┘
                                         │
                           renderArsenal()│ DOM manipulation
                                         ▼
                                  ┌──────────────┐
                                  │  index.html  │
                                  │   + CSS      │
                                  └──────────────┘
                                         │
                                   localStorage
                                  ┌──────────────┐
                                  │ breachFin_   │
                                  │   state      │
                                  └──────────────┘
```

---

## Application Lifecycle

### 1. Page Load (`DOMContentLoaded`)

The entry point is the `initApp()` function which runs on `DOMContentLoaded`:

```
DOMContentLoaded
  └─► initApp()
        ├─► loadState()          // Restore env vars from localStorage
        ├─► fetch('data/tools.json')  // Load tool database
        ├─► renderArsenal(data)  // Build the UI
        └─► setupEventListeners()  // Bind all interactivity
```

### 2. State Management

Environment variables are managed via `localStorage` under the key `breachFin_state`.

| Function | Purpose |
|---|---|
| `loadState()` | Reads `localStorage`, populates the sidebar input fields |
| `saveState()` | Reads all sidebar inputs, writes to `localStorage`, returns current state object |

The state object shape:

```json
{
  "target_ip": "",
  "target_port": "",
  "local_ip": "",
  "interface": "",
  "wordlist": "",
  "username": ""
}
```

Every input change triggers `saveState()` → `renderArsenal()`, which re-interpolates all command templates with the latest values.

### 3. Rendering Pipeline

`renderArsenal(data, searchQuery)` is the core render function:

1. **Filter** — Each category's tools are filtered against `searchQuery` (matches on `name`, `description`, and `syntax`).
2. **Interpolate** — Template placeholders like `{target_ip}` are replaced:
   - If a value exists: rendered as a highlighted `<span class="dynamic-var">`.
   - If empty: rendered as a dimmed `<span class="missing-var">`.
3. **Copy text** — A separate copy-ready string is built with raw values (no HTML).
4. **Build DOM** — Category sections → tool cards → command blocks are constructed and appended.

### 4. Event System

All events are set up in `setupEventListeners()`:

| Event | Trigger | Action |
|---|---|---|
| Sidebar input `input` | User types an env var | Save state → re-render |
| Search `input` | User types in search | Re-render with filter |
| Reset button `click` | "Reset Environment" | Clear `localStorage`, reset inputs, re-render |
| Copy button `click` | Click on any "Copy" | Copy interpolated command to clipboard |
| FAB button `click` | "Environment Target" | Open config overlay |
| Overlay `click` | Click backdrop | Close config overlay |
| `keydown` (Escape) | Press Escape | Close config overlay |
| `keydown` (Konami) | ↑↑↓↓←→←→BA | Toggle between Apple and Matrix theme |

---

## Key Design Decisions

### No Framework

The entire app is ~335 lines of vanilla JavaScript. The decision to avoid React, Vue, or similar frameworks keeps the project:
- **Instantly deployable** — no build step
- **Maximally portable** — works on any static host
- **Easy to fork** — zero learning curve for contributors

### Single Render Function

Rather than maintaining fine-grained DOM updates, `renderArsenal()` rebuilds the entire tool grid on every change. This is a deliberate trade-off:
- **Pro:** Simpler code, no state synchronization bugs.
- **Con:** Full DOM rebuild on each keystroke — acceptable because the dataset is small (~15 tools).

### Theme Switching via Stylesheet Swap

Themes are implemented as completely separate CSS files (`style.css` and `style_matrix.css`) that target the **same HTML structure**. Switching themes simply swaps the `<link>` tag's `href`:

```javascript
document.getElementById('theme-stylesheet').setAttribute('href', 'css/style_matrix.css');
```

This avoids CSS class toggles or runtime style computation and makes each theme fully independent.

### Clip-Path Card Variants

Tool cards use `nth-child` CSS selectors with different `clip-path` polygons to create visual variety (faceted, origami-style shapes) without requiring different HTML per card. Four shape variants rotate automatically.

---

## Utility Functions

| Function | Purpose |
|---|---|
| `escapeHtml(str)` | Prevents XSS by escaping `&`, `<`, `>`, `"`, `'` |
| `showNotification(msg)` | Creates/shows a toast notification at the bottom of the screen, auto-hides after 3 seconds |
