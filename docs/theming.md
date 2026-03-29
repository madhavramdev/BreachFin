# Theming

BreachFin ships with two visual themes that share the same HTML structure but use completely separate CSS files.

---

## Available Themes

### 1. Apple Theme (Default)

**File:** `css/style.css`  
**Entry point:** `index.html`

A clean, light-mode design inspired by Apple's design language:
- Light background (`#F8FAFC`)
- System font stack (SF Pro, Segoe UI, Roboto)
- Frosted-glass overlays with `backdrop-filter: blur()`
- Brutalist card shapes using `clip-path` polygons with hard drop shadows
- Four rotating card shape variants via `nth-child` selectors
- Watermark logo images in the background

### 2. Matrix Theme

**File:** `css/style_matrix.css`  
**Entry point:** `index_matrix.html` (or toggled dynamically)

A dark, terminal-inspired hacker aesthetic:
- Pure black background (`#000000`)
- Fira Code monospace font throughout
- Green-on-black color scheme (`#00FF41`)
- CRT scanline overlay via `body::before`
- Always-visible sidebar (no overlay toggle)
- Left-bordered cards with dashed separators
- Blinking cursor animation on the logo

---

## How Theme Switching Works

### Dynamic Switch (Konami Code)

Entering the Konami code (`↑ ↑ ↓ ↓ ← → ← → B A`) on any page swaps the active stylesheet:

```javascript
const sheet = document.getElementById('theme-stylesheet');
sheet.setAttribute('href', 'css/style_matrix.css'); // or 'css/style.css'
```

Both HTML files include a `<link>` tag with `id="theme-stylesheet"` that the JavaScript targets.

### Static Entry Points

- `index.html` — Loads `css/style.css` by default
- `index_matrix.html` — Loads `css/style_matrix.css` by default (also has a different HTML layout for the sidebar)

---

## CSS Architecture

### Design Tokens (CSS Custom Properties)

Both themes define their own design tokens in `:root`. Here's a comparison:

| Token Purpose | Apple Theme | Matrix Theme |
|---|---|---|
| Background | `--bg-light: #F8FAFC` | `--bg-dark: #000000` |
| Primary text | `--apple-text-dark: #0A0A0B` | `--text-main: #b2c9ab` |
| Muted text | `--apple-text-gray: #64748B` | `--text-muted: #5e7358` |
| Accent | `--apple-blue: #0A192F` | `--matrix-primary: #00FF41` |
| Code background | `--code-bg: #0A0A0B` | `rgba(0, 0, 0, 0.8)` |
| Code text | `--code-text: #F8FAFC` | `#e2e8f0` |
| UI font | System font stack | `Fira Code` monospace |
| Code font | `SF Mono`, Consolas, Menlo | `Fira Code` |
| Transition | `all 0.4s cubic-bezier(…)` | `all 0.2s ease-out` |

### Key CSS Patterns

#### Clip-Path Cards (Apple Theme)

The Apple theme uses four `clip-path` polygon variants that rotate via `nth-child`:

```css
.tool-card:nth-child(4n+1) {
    clip-path: polygon(1% 0%, 98% 1%, 100% 12%, 99% 98%, ...);
}
/* ...4n+2, 4n+3, 4n+4 each with different polygons */
```

Each variant also has a unique hover direction and drop-shadow offset.

#### CRT Scanline Effect (Matrix Theme)

The Matrix theme creates a faux-CRT effect using a pseudo-element:

```css
body::before {
    background: 
        linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.25) 50%),
        linear-gradient(90deg, rgba(255,0,0,0.06), rgba(0,255,0,0.02), rgba(0,0,255,0.06));
    background-size: 100% 2px, 3px 100%;
    pointer-events: none;
    z-index: 999;
}
```

#### Frosted Glass (Apple Theme)

```css
.config-overlay {
    background: rgba(251, 251, 253, 0.6);
    backdrop-filter: blur(28px);
}
```

---

## Creating a New Theme

1. **Copy an existing theme CSS file** as your starting point:
   ```bash
   cp css/style.css css/style_mytheme.css
   ```

2. **Modify the `:root` custom properties** to set your color palette and fonts.

3. **Adjust component styles** — the major sections to customize:
   - `body` — background, text color, font
   - `.sidebar` — panel background, borders
   - `.tool-card` — card appearance, clip-path shapes
   - `.command-snippet-container` — code block styling
   - `.dynamic-var` / `.missing-var` — variable highlight colors
   - `.notification` — toast appearance

4. **Create an entry HTML** (optional):
   ```bash
   cp index.html index_mytheme.html
   ```
   Update the `<link>` tag to point to your new CSS file.

5. **Register in the theme toggle** (optional): Update the Konami code handler in `app.js` to cycle through your new theme.

---

## Layout Differences Between Themes

| Feature | Apple Theme | Matrix Theme |
|---|---|---|
| Sidebar display | Floating overlay (toggle via FAB button) | Always-visible side panel |
| FAB button | Visible | Hidden (`display: none !important`) |
| Body layout | Block | Flexbox row (sidebar + content) |
| Body overflow | Scroll | Hidden (content area scrolls independently) |
| Brand logo | Large icon + text | Text only (with blinking cursor) |
| Card shapes | 4 clip-path variants | Single clip-path with left border accent |
| Background | Watermark logos | Repeating scanline gradient |
