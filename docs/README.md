# BreachFin Documentation

> A cybersecurity command-reference dashboard — your personal "cheat sheet" for penetration testing, traffic analysis, and defensive tooling.

---

## Table of Contents

| Document | Description |
|---|---|
| [Getting Started](./getting-started.md) | Installation, local development, and deployment |
| [Architecture](./architecture.md) | Project structure, data flow, and design decisions |
| [Tools Database](./tools-database.md) | How to add, edit, and organize tools in `tools.json` |
| [Theming](./theming.md) | Theme system, CSS architecture, and how to create new themes |
| [Features](./features.md) | Detailed feature reference (search, variables, copy, easter eggs) |

---

## What is BreachFin?

BreachFin is a **static, client-side web application** that serves as an interactive command reference for cybersecurity tools. It is designed for use during CTFs, penetration testing labs, and security coursework.

### Core Capabilities

- **Command Reference** — Browse categorized security tools (Nmap, Gobuster, Radare2, Tcpdump, etc.) with copy-ready command snippets.
- **Environment Variables** — Set global values (Target IP, Port, Interface, LHOST, Wordlist, Username) once and have them automatically interpolated into every command.
- **Instant Search** — Filter across tool names, descriptions, and command syntax in real time.
- **Dual Themes** — A clean Apple-inspired light theme (default) and a Matrix/hacker terminal theme, switchable via a hidden Konami code.
- **Zero Backend** — Everything runs in the browser. Tool data lives in a single JSON file. State persists via `localStorage`.

### Quick Start

```bash
# Clone the repo
git clone https://github.com/madhavramdev/BreachFin.git
cd BreachFin

# Serve locally (any static file server works)
python3 -m http.server 8080

# Open http://localhost:8080 in your browser
```

> **Note:** Opening `index.html` directly via `file://` will fail because `fetch()` is blocked by the browser's CORS policy. You must use a local HTTP server.
