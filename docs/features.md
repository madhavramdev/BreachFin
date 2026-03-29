# Features

A detailed reference of every feature in BreachFin.

---

## Environment Variables Panel

**Access:** Click the "Environment Target" FAB button (bottom-right) or open `index_matrix.html` where the panel is always visible.

The panel lets you set global values that are automatically injected into every command across the dashboard:

| Field | ID | Placeholder |
|---|---|---|
| Target IP | `target_ip` | `10.10.10.5` |
| Network Interface | `interface` | `eth0 / tun0 / wlan0` |
| Target Port | `target_port` | `80` |
| Local IP (LHOST) | `local_ip` | `10.10.14.8` |
| Wordlist Path | `wordlist` | `/usr/share/wordlists/rockyou.txt` |
| Target Username | `username` | `admin` |

### Behavior

- **Live updates:** Every keystroke saves the current state to `localStorage` and re-renders all commands with the new values.
- **Persistence:** Values survive page reloads and browser restarts (stored under `localStorage` key `breachFin_state`).
- **Reset:** The "Reset Environment" / "INIT_PURGE" button clears all values and wipes `localStorage`.

### Visual Indicators

- **Filled variable:** Highlighted in accent color (blue in Apple theme, green in Matrix theme).
- **Empty variable:** Shown as dimmed italic placeholder text (`{target_ip}`).

---

## Search

**Location:** Top of the main content area.

Type any keyword to filter the tool catalog in real time. Search matches against:

- Tool names (e.g. "nmap")
- Tool descriptions (e.g. "network mapper")
- Command syntax (e.g. "gobuster dir")

When no results match, an empty-state message is displayed.

---

## Copy to Clipboard

Every command snippet has a **Copy** button. Clicking it:

1. Copies the fully-interpolated command to the system clipboard (with your env var values substituted in).
2. Shows a "Copied" confirmation on the button (reverts after 2 seconds).
3. Displays a toast notification: *"Payload copied to clipboard"*.

> **Note:** If an environment variable is not set, the raw `{placeholder}` text is included in the copied command so you can fill it in manually.

---

## Toast Notifications

A notification toast appears at the bottom of the screen for:

- Copying a command
- Resetting the environment
- Easter egg triggers
- Theme switches

The toast auto-dismisses after **3 seconds**. On the Apple theme it appears centered; on the Matrix theme it slides in from the right.

---

## Theme Switching

### Konami Code

Enter the classic Konami code on your keyboard to toggle between themes:

```
↑ ↑ ↓ ↓ ← → ← → B A
```

- From Apple theme → switches to Matrix theme with notification: *"ACCESS GRANTED: Matrix UI Unlocked 🟢"*
- From Matrix theme → switches back with notification: *"ACCESS RESTORED: Apple Steve Jobs UI"*

The switch is instantaneous — only the CSS file reference changes; no page reload occurs.

---

## Easter Eggs 🥚

BreachFin includes two hidden easter eggs triggered via the search bar:

### Barrel Roll

**Trigger:** Type `do a barrel roll` in the search bar.

**Effect:** The entire page performs a 360° rotation animation (1.5s duration). The search field is cleared and the tool list is restored afterward.

### Kernel Panic

**Trigger:** Type `sudo rm -rf /` in the search bar.

**Effect:** The page goes full black with a fake kernel panic message:
```
KERNEL PANIC - NOT SYNCING: FATAL EXCEPTION IN INTERRUPT
```
The page automatically reloads after 3 seconds.

---

## Configuration Panel Toggle

### Apple Theme

- **Open:** Click the FAB button (gear icon + "Environment Target" label) in the bottom-right corner.
- **Close:** Click the backdrop overlay, or press `Escape`.
- The panel animates in from the bottom with a scale+translate transition.
- The FAB button fades out while the panel is open.

### Matrix Theme

- The sidebar is **always visible** on the left side of the screen.
- The FAB button is hidden (`display: none !important`).
- No overlay or toggle is needed.

---

## Responsive Design

Both themes include responsive breakpoints:

```css
@media (max-width: 1200px) {
    .tools-grid { grid-template-columns: 1fr; }
}
```

Below 1200px viewport width, the tool card grid switches from multi-column to a single column layout.

---

## Staggered Card Animations

Tool cards animate in on page load with a staggered delay based on their position in the grid:

```javascript
card.style.setProperty('--stagger-delay', `${(index * 100) + (tIndex * 80)}ms`);
```

This creates a cascading entrance effect where cards appear sequentially rather than all at once.
