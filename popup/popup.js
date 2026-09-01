
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
    const pageNotes = notes[pageKey] || [];

    const exportData = { url: pageKey, notes: pageNotes};
    const dataBlob = new Blob( [JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const downloadUrl = URL.createObjectURL(dataBlob);

    
    const tempA = document.createElement('a');
    tempA.href = downloadUrl;
    tempA.download = "renote-export.json";
    tempA.click();
    URL.revokeObjectURL(downloadUrl);

})


// per page import function
const importButton = document.getElementById('import');
const importFileInput = document.getElementById('import-file');
importButton.addEventListener('click', () => {
    importFileInput.click();
})

importFileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader()
    reader.onload = async function(e) {
        const fileContent = e.target.result;
        let parsedData;
        try {
            parsedData = JSON.parse(fileContent);
        } catch (err) {
            console.error('Invalid JSON file:', err);
            return;
        }

        const tabs = await chrome.tabs.query({active: true, currentWindow: true});
        const currentPageKey =  tabs[0].url;

        let targetKey = currentPageKey;
        if (parsedData.url !== currentPageKey) {
            const restoreToOriginal = confirm(
                `This file contains notes from:\n${parsedData.url}\n\nClick OK to restore to that page, or Cancel to import into the current page instead.`
            );
        targetKey = restoreToOriginal ? parsedData.url : currentPageKey;
        }

        const result = await chrome.storage.local.get('notes');
        const notes = result.notes || {};
        const existingNotes = notes[targetKey] || [];

        const importedNotesWithNewIds = parsedData.notes.map((note, index) => ({
            ...note,
            id: String(Date.now() + index)
        }));
        const mergedNotes = [...existingNotes, ...importedNotesWithNewIds];


        notes[targetKey] = mergedNotes;
        await chrome.storage.local.set({notes});

        chrome.tabs.sendMessage(tabs[0].id, { action: 'load-note' });
        renderNotes();
    }
    reader.readAsText(file);

})


// Total notes count
async function notesCount() {
    notesCount = document.getElementById('note-count');
    const tabs = await chrome.tabs.query({active: true, currentWindow: true});
    const pageKey = tabs[0].url;

    const result = await chrome.storage.local.get('notes');
    const notes = result.notes || {};    

    

}

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