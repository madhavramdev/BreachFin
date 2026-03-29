# Tools Database

The entire tool catalog lives in a single file: **`data/tools.json`**.

---

## Schema

```jsonc
{
  "categories": [
    {
      "name": "Category Name",          // Displayed as a section heading
      "tools": [
        {
          "name": "Tool Name",           // Card title
          "description": "What it does", // Card subtitle
          "commands": [
            {
              "title": "Command Title",  // Label above the snippet
              "syntax": "tool -flag {target_ip}",  // The command template
              "flags": {                 // Optional: flag explanations
                "-flag": "What this flag does"
              }
            }
          ]
        }
      ]
    }
  ]
}
```

### Field Reference

| Field | Type | Required | Description |
|---|---|---|---|
| `categories` | `array` | ✅ | Top-level array of tool categories |
| `categories[].name` | `string` | ✅ | Section heading (e.g. "Reconnaissance") |
| `categories[].tools` | `array` | ✅ | Tools within this category |
| `tools[].name` | `string` | ✅ | Tool name displayed on the card |
| `tools[].description` | `string` | ✅ | Brief description of the tool |
| `tools[].commands` | `array` | ✅ | One or more command snippets |
| `commands[].title` | `string` | ✅ | Label for this specific command |
| `commands[].syntax` | `string` | ✅ | The command template (supports variable placeholders) |
| `commands[].flags` | `object` | ❌ | Key-value pairs of flag → description |

---

## Template Variables

Command `syntax` fields support placeholder variables wrapped in curly braces. These are automatically replaced with values from the Environment panel:

| Placeholder | Sidebar Field | Example Value |
|---|---|---|
| `{target_ip}` | Target IP | `10.10.10.5` |
| `{target_port}` | Target Port | `80` |
| `{local_ip}` | Local IP (LHOST) | `10.10.14.8` |
| `{interface}` | Network Interface | `tun0` |
| `{wordlist}` | Wordlist Path | `/usr/share/wordlists/rockyou.txt` |
| `{username}` | Target Username | `admin` |

### How Interpolation Works

- **When a value is set:** The placeholder is replaced with the value and highlighted in blue/green depending on the active theme.
- **When empty:** The placeholder remains visible but is rendered in a dimmed, italic style to indicate it needs to be filled.
- **Copy behavior:** When copying a command, the raw value is used (no HTML). If a variable is empty, the raw `{placeholder}` text is copied.

---

## Adding a New Tool

### Step 1: Pick or Create a Category

Find the appropriate category in `tools.json`, or add a new one:

```json
{
  "name": "Your New Category",
  "tools": []
}
```

### Step 2: Add the Tool Object

```json
{
  "name": "Hydra",
  "description": "Network logon cracker supporting numerous protocols.",
  "commands": [
    {
      "title": "SSH Brute Force",
      "syntax": "hydra -l {username} -P {wordlist} ssh://{target_ip}",
      "flags": {
        "-l": "Login with a single username.",
        "-P": "Load passwords from a file."
      }
    }
  ]
}
```

### Step 3: Validate

- Open the app in a browser and verify the new card appears.
- Test that variable interpolation works by filling in the sidebar fields.
- Test the copy button.

---

## Existing Categories

The current database includes the following categories and tools:

| Category | Tools |
|---|---|
| **Reconnaissance** | Nmap, Gobuster |
| **Weaponization & Environment** | Inotifywait, Chkrootkit |
| **Exploitation & Binary Analysis** | Radare2, Readelf, Syscall/Library Trace, GDB, LSOF |
| **Command & Control (C2)** | Ncat (Encrypted) |
| **Defender Toolkit & Traffic Analysis** | Tcpdump, Tshark, Dig |

---

## Tips

- **Multiple commands per tool:** A single tool can have as many `commands` entries as needed (e.g., Nmap has both a stealth scan and an aggressive scan).
- **Empty flags:** If a command has no flags worth documenting, use an empty object: `"flags": {}`.
- **HTML safety:** All values from `tools.json` are passed through `escapeHtml()` before rendering, so you don't need to worry about XSS from your data file.
