// Formelsammlung auf der Seite ein- und ausblenden
const pdfButton = document.getElementById('pdf-button');
const pdfContainer = document.getElementById('pdf-container');
pdfButton.addEventListener('click', function () {
    const open = pdfContainer.hidden;
    pdfContainer.hidden = !open;
    if (open) document.getElementById('pdf-viewer').src = 'Formelsammlung.pdf';
    pdfButton.textContent = open ? 'PDF schließen' : 'PDF hier öffnen';
});

// Code-Vorlagen kopieren
document.querySelectorAll('.copy').forEach(function (btn) {
    btn.addEventListener('click', async function () {
        const text = btn.closest('.snippet').querySelector('pre').innerText;
        try {
            await navigator.clipboard.writeText(text);
            btn.textContent = 'Kopiert';
        } catch (e) {
            btn.textContent = 'Bitte von Hand markieren';
        }
        setTimeout(function () { btn.textContent = 'Kopieren'; }, 1800);
    });
});
