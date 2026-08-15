
const addNoteBtn = document.getElementById('add-note');
addNoteBtn.addEventListener('click', async () => {
    const tabs = await chrome.tabs.query({active: true, currentWindow: true});
    chrome.tabs.sendMessage(tabs[0].id, { action: 'create-note' });
});

async function renderNotes() {
    
    const tabs = await chrome.tabs.query({active: true, currentWindow: true});
    const pageKey = tabs[0].url;

    const result = await chrome.storage.local.get('notes');
    const notes = result.notes || {};
    const pageNotes = notes[pageKey] || [];
    const notesListEl = document.getElementById('notes-list');
    const emptyStateEl = document.getElementById('empty-state');    

    if (pageNotes.length === 0) {
        emptyStateEl.classList.remove('hidden');
    } else {
        emptyStateEl.classList.add('hidden');

        notesListEl.innerHTML = '';
        for (const note of pageNotes) {
            const li = document.createElement('li');
            const preview = document.createElement('span');
            preview.className = 'note-preview';
            preview.textContent = note.text || 'Empty note';
            li.appendChild(preview);
            notesListEl.appendChild(li);
        }
    }

    
}
renderNotes();