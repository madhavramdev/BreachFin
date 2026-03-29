const DEFAULT_STATE = {
    target_ip: '',
    target_port: '',
    local_ip: '',
    interface: '',
    wordlist: '',
    username: ''
};

const STORAGE_KEY = 'breachFin_state';

// Data cache
let arsenalData = null;

// Init
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

async function initApp() {
    // Load state
    loadState();
    
    // Load data
    try {
        const response = await fetch('data/tools.json');
        if (!response.ok) throw new Error('Failed to load JSON');
        arsenalData = await response.json();
        
        // Render view
        renderArsenal(arsenalData);
        
        // Bind events
        setupEventListeners();
        
    } catch (error) {
        document.getElementById('arsenal-container').innerHTML = `
            <div style="color: #ff3333; font-family: var(--font-code); padding: 24px;">
                <h3>[!] SYSTEM ERROR</h3>
                <p>Failed to load tools database: ${error.message}</p>
                <p style="margin-top: 10px; opacity: 0.8; font-size: 0.9em;">
                    If you are opening this file directly in the browser (file://), CORS policies might block the JSON fetch.<br>
                    Please serve this directory using a local web server (e.g. <code>python3 -m http.server</code>).
                </p>
            </div>`;
    }
}

// State
function loadState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    const state = saved ? JSON.parse(saved) : DEFAULT_STATE;
    
    // Fill inputs
    Object.keys(DEFAULT_STATE).forEach(key => {
        const el = document.getElementById(key);
        if (el) {
            el.value = state[key] || '';
        }
    });
}

function saveState() {
    const state = {};
    Object.keys(DEFAULT_STATE).forEach(key => {
        const el = document.getElementById(key);
        if (el) {
            state[key] = el.value.trim();
        }
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return state;
}

// Render
function renderArsenal(data, searchQuery = '') {
    const container = document.getElementById('arsenal-container');
    container.innerHTML = ''; // Clear state
    
    if (!data || !data.categories) return;
    
    const state = saveState(); // Current state
    
    data.categories.forEach((cat, index) => {
        // Filter items
        const filteredTools = cat.tools.filter(tool => {
            if (!searchQuery) return true;
            const q = searchQuery.toLowerCase();
            return tool.name.toLowerCase().includes(q) || 
                   tool.description.toLowerCase().includes(q) ||
                   tool.commands.some(c => c.syntax.toLowerCase().includes(q));
        });
        
        if (filteredTools.length === 0) return;
        
        // Build section
        const catSection = document.createElement('section');
        catSection.className = 'category-section';
        
        const catTitle = document.createElement('h2');
        catTitle.className = 'category-title';
        catTitle.textContent = cat.name;
        catSection.appendChild(catTitle);
        
        const grid = document.createElement('div');
        grid.className = 'tools-grid';
        
        filteredTools.forEach((tool, tIndex) => {
            const card = document.createElement('div');
            card.className = 'tool-card';
            
            // Delay offset
            card.style.setProperty('--stagger-delay', `${(index * 100) + (tIndex * 80)}ms`);
            
            let commandsHTML = '';
            tool.commands.forEach((cmd) => {
                
                // Render text
                let renderedSyntax = escapeHtml(cmd.syntax); // Escape source
                
                // Copy text
                let copyText = cmd.syntax;
                
                Object.keys(DEFAULT_STATE).forEach(key => {
                    const rawValue = state[key];
                    
                    // View replace
                    const displayRegex = new RegExp(`{${key}}`, 'g');
                    if (rawValue) {
                        renderedSyntax = renderedSyntax.replace(displayRegex, `<span class="dynamic-var">${escapeHtml(rawValue)}</span>`);
                    } else {
                        renderedSyntax = renderedSyntax.replace(displayRegex, `<span class="missing-var">{${key}}</span>`);
                    }
                    
                // Copy replace
                const copyRegex = new RegExp(`{${key}}`, 'g');
                copyText = copyText.replace(copyRegex, rawValue || `{${key}}`);
            });
            
            let flagsHTML = '';
            if (cmd.flags && Object.keys(cmd.flags).length > 0) {
                flagsHTML += `<div class="command-flags">`;
                for (const [flag, desc] of Object.entries(cmd.flags)) {
                    flagsHTML += `<div class="flag-row"><span class="flag-name">${escapeHtml(flag)}</span><span class="flag-desc">${escapeHtml(desc)}</span></div>`;
                }
                flagsHTML += `</div>`;
            }
            
            commandsHTML += `
                <div class="command-block">
                    <div class="command-title">${escapeHtml(cmd.title)}</div>
                    <div class="command-snippet-container">
                        <div class="command-text">${renderedSyntax}</div>
                        <button class="copy-btn" data-clipboard="${escapeHtml(copyText)}" title="Copy Command">Copy</button>
                    </div>
                    ${flagsHTML}
                </div>
            `;
        });
            
            card.innerHTML = `
                <div class="tool-header">
                    <h3 class="tool-name">${escapeHtml(tool.name)}</h3>
                    <p class="tool-desc">${escapeHtml(tool.description)}</p>
                </div>
                <div class="tool-commands">
                    ${commandsHTML}
                </div>
            `;
            
            grid.appendChild(card);
        });
        
        catSection.appendChild(grid);
        container.appendChild(catSection);
    });
    
    // Empty state
    if (container.children.length === 0) {
        container.innerHTML = `
            <div style="color: var(--text-muted); font-family: var(--font-code); padding: 40px; text-align: center;">
                Cannot find any modules matching: "<span style="color: var(--matrix-primary)">${escapeHtml(searchQuery)}</span>"
            </div>
        `;
    }
}

// Events
function setupEventListeners() {
    // Input sync
    Object.keys(DEFAULT_STATE).forEach(key => {
        const el = document.getElementById(key);
        if (el) {
            el.addEventListener('input', () => {
                saveState(); // Save state
                const searchQ = document.getElementById('search-tools').value;
                renderArsenal(arsenalData, searchQ);
            });
        }
    });
    
    // Search input
    document.getElementById('search-tools').addEventListener('input', (e) => {
        const val = e.target.value.toLowerCase().trim();
        
        if (val === 'do a barrel roll') {
            document.body.classList.add('barrel-roll');
            setTimeout(() => document.body.classList.remove('barrel-roll'), 1500);
            e.target.value = '';
            renderArsenal(arsenalData, '');
            showNotification("Whoa! 🛩️");
        } else if (val === 'sudo rm -rf /') {
            document.body.innerHTML = '<div style="color:#0f0; background:#000; height:100vh; width:100%; display:flex; align-items:center; justify-content:center; font-family:monospace; font-size:24px;">KERNEL PANIC - NOT SYNCING: FATAL EXCEPTION IN INTERRUPT</div>';
            setTimeout(() => location.reload(), 3000);
        } else {
            renderArsenal(arsenalData, e.target.value);
        }
    });
    
    // Reset state
    document.getElementById('reset-state').addEventListener('click', () => {
        localStorage.removeItem(STORAGE_KEY);
        Object.keys(DEFAULT_STATE).forEach(key => {
            const el = document.getElementById(key);
            if (el) el.value = '';
        });
        
        // Keep search
        const searchInput = document.getElementById('search-tools');
        renderArsenal(arsenalData, searchInput ? searchInput.value : '');
        showNotification("Environment Reset Complete.");
    });
    
    // Copy action
    document.getElementById('arsenal-container').addEventListener('click', (e) => {
        const btn = e.target.closest('.copy-btn');
        if (!btn) return;
        
        const textToCopy = btn.getAttribute('data-clipboard');
        navigator.clipboard.writeText(textToCopy).then(() => {
            // Button state
            btn.classList.add('copied');
            btn.innerHTML = 'Copied';
            
            showNotification("Payload copied to clipboard");
            
            setTimeout(() => {
                btn.classList.remove('copied');
                btn.innerHTML = 'Copy';
            }, 2000);
        });
    });

    // Theme toggle
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;
    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                const sheet = document.getElementById('theme-stylesheet');
                if (sheet && sheet.getAttribute('href') === 'css/style.css') {
                    sheet.setAttribute('href', 'css/style_matrix.css');
                    showNotification("ACCESS GRANTED: Matrix UI Unlocked 🟢");
                } else if (sheet) {
                    sheet.setAttribute('href', 'css/style.css');
                    showNotification("ACCESS RESTORED: Apple Steve Jobs UI ");
                }
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });

    // Panel toggle
    const fabButton = document.getElementById('config-fab');
    const configOverlay = document.getElementById('config-overlay');
    
    if (fabButton && configOverlay) {
        fabButton.addEventListener('click', () => {
            document.body.classList.add('config-open');
            // Focus input
            setTimeout(() => document.getElementById('target_ip').focus(), 100);
        });
        
        configOverlay.addEventListener('click', (e) => {
            // Close overlay
            if (e.target === configOverlay) {
                document.body.classList.remove('config-open');
            }
        });
        
        // Escape close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.body.classList.contains('config-open')) {
                document.body.classList.remove('config-open');
            }
        });
    }
}

// Utils
function escapeHtml(unsafe) {
    if (!unsafe) return "";
    return String(unsafe)
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

let notifTimeout;
function showNotification(message) {
    let el = document.getElementById('sys-notification');
    if (!el) {
        el = document.createElement('div');
        el.id = 'sys-notification';
        el.className = 'notification';
        document.body.appendChild(el);
    }
    
    el.textContent = message;
    
    // Reflow
    void el.offsetWidth;
    el.classList.add('show');
    
    clearTimeout(notifTimeout);
    notifTimeout = setTimeout(() => {
        el.classList.remove('show');
    }, 3000);
}
