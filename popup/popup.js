
// add new note button
const addNoteBtn = document.getElementById('add-note');
addNoteBtn.addEventListener('click', async () => {
    const tabs = await chrome.tabs.query({active: true, currentWindow: true});
    chrome.tabs.sendMessage(tabs[0].id, { action: 'create-note' });
});


// live input from search bar
const searchInput = document.getElementById('search-input');
searchInput.addEventListener('input', () => {
    renderNotes(searchInput.value);
});


// clear search button
const clearBtn = document.getElementById('search-clear');
searchInput.addEventListener('input', () => {
    renderNotes(searchInput.value);
    clearBtn.classList.toggle('hidden', searchInput.value == '');
});
clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearBtn.classList.add('hidden');
});


// per page export function
const exportBtn = document.getElementById('export');
exportBtn.addEventListener('click', async () => {
    const tabs = await chrome.tabs.query({active: true, currentWindow: true});
    const pageKey = tabs[0].url;

    const result = await chrome.storage.local.get('notes');
    const notes = result.notes || {};
    const pageNotes = notes[pageKey]|| [];

    const exportData = { url: pageKey, notes: pageNotes};
    const dataBlob = new Blob( [JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const downloadUrl = URL.createObjectURL(dataBlob);
    console.log(exportData);
    
    const tempA = document.createElement('a');
    tempA.href = downloadUrl;
    tempA.download = "renote-export.json";
    tempA.click();
    URL.revokeObjectURL(downloadUrl);

})


// show notes on popup
async function renderNotes(searchTerms = '') {

    const tabs = await chrome.tabs.query({active: true, currentWindow: true});
    const pageKey = tabs[0].url;

    const result = await chrome.storage.local.get('notes');
    const notes = result.notes || {};
    const pageNotes = notes[pageKey] || [];
    const filteredNotes = pageNotes.filter(note => note.text.toLowerCase().includes(searchTerms.toLowerCase())
    );

    const notesListEl = document.getElementById('notes-list');
    const emptyStateEl = document.getElementById('empty-state');    
    notesListEl.innerHTML = '';

    if (filteredNotes.length === 0) {
        emptyStateEl.classList.remove('hidden');
    } else {
        emptyStateEl.classList.add('hidden');

        for (const note of filteredNotes) {
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