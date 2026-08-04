const floatingButton =  document.createElement('button');

floatingButton.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"> <path d="M5 12h14"/><path d="M12 5v14"/> </svg>';
floatingButton.className = 'rn-add-btn';
floatingButton.title = 'New note';

floatingButton.addEventListener('click', () => {
    createNote();
});


function createNote() {
    const container = document.createElement('div');
    container.className = 'rn-note';
    

}

document.body.append(floatingButton);