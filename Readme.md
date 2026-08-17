# ReNote

> Leave sticky notes anywhere on the web, auto saved where you left them.


## Quick Start 

1. Clone or download this repository
2. Open `chrome://extensions` (or `brave://extensions`)
3. Enable **Developer mode** (top-right toggle)
4. Click **Load unpacked** and select the project folder
5. Pin the ReNote icon to your toolbar and start noting


# Features
 
- Create sticky notes on any webpage
- Drag notes anywhere on the page
- Auto-save as you type — no save button needed
- Notes restore automatically when you revisit a page
- Delete notes with one click
- Manage all notes for the current page from the popup
- Search through your notes *(coming soon)*


# How It Works
 
ReNote is a Manifest V3 Chrome extension built from three parts:
 
- **Content script** — injects the floating "+" button and note cards directly onto the page you're viewing, and handles creating, dragging, editing, and deleting notes.
- **Popup** — shows all notes saved for the current page, with a matching "+" button that talks to the content script via `chrome.runtime` messaging.
- **Storage** — notes are saved locally with `chrome.storage.local`, keyed by page URL, so each page remembers its own notes and restores them automatically on reload.


## Tech Stack
 
- Manifest V3
- Vanilla JavaScript, HTML, CSS
- `chrome.storage.local`
- `chrome.tabs` / `chrome.runtime` messaging