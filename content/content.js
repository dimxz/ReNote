
function createNote() {

    const card = document.createElement('div');
    card.className = 'rn-note';
    card.innerHTML = `
        <div class="rn-header"> <div class="rn-header-left"> <svg class="rn-grip-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <line x1="3" y1="9"  x2="21" y2="9"/> <line x1="3" y1="15" x2="21" y2="15"/> </svg> <span class="rn-header-label">Note</span> </div> <div class="rn-header-actions"> <div class="rn-divider"></div> <button class="rn-btn-close" title="Close"> <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.30)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <path d="M18 6 6 18"/><path d="m6 6 12 12"/> </svg> </button> </div> </div>
        <div class="rn-accent-line"></div> 
        <div class="rn-note-textarea"> <textarea class="rn-note-textarea-input" placeholder="Start writing…" spellcheck="true" autocomplete="off" ></textarea> </div>
        <div class="rn-note-footer"> <span class="rn-note-footer-text">Empty note</span> </div>
    `;
    document.body.appendChild(card);

    const btnClose = card.querySelector('.rn-btn-close');
    const bodyTextarea = card.querySelector('.rn-note-textarea-input');
    const handle = card.querySelector('.rn-header');
    card.dataset.id = Date.now();


    bodyTextarea.addEventListener("input", function () {
        console.log(bodyTextarea.value)
    });

    // Close button
    btnClose.addEventListener("click", function () {
        card.style.opacity  = "0";
        card.style.transform = "scale(0.95)";
        card.style.transition = "opacity 0.15s, transform 0.15s";
        setTimeout(function () { card.remove(); }, 160);
    });

    // Dragging
    let dragging = false;
    let startX, startY, originLeft, originTop;
    card.style.position = "absolute";
    card.style.left     = (card.offsetLeft || 100) + "px";
    card.style.top      = (card.offsetTop  || 100) + "px";

    handle.addEventListener("mousedown", function (e) {
        if (e.target.closest("button")) return;
        dragging  = true;
        startX    = e.clientX;
        startY    = e.clientY;
        originLeft = parseInt(card.style.left, 10);
        originTop  = parseInt(card.style.top,  10);
        document.body.style.userSelect = "none";
    });

    document.addEventListener("mousemove", function (e) {
        if (!dragging) return;
        card.style.left = (originLeft + e.clientX - startX) + "px";
        card.style.top  = (originTop  + e.clientY - startY) + "px";
    });

    document.addEventListener("mouseup", function () {
        if (dragging) {
            dragging = false;
            document.body.style.userSelect = "";
        }
    });

    bodyTextarea.focus();
    return card;
}


const floatingButton =  document.createElement('button');
floatingButton.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"> <path d="M5 12h14"/><path d="M12 5v14"/> </svg>';
floatingButton.className = 'rn-add-btn';
floatingButton.title = 'New note';

floatingButton.addEventListener('click', () => {
    createNote();
});

createNote();
document.body.append(floatingButton);