// Öffnen
document.getElementById('pdf-button').addEventListener('click', function() {
    document.getElementById('pdf-container').style.display = 'block';
    document.getElementById('pdf-viewer').src = 'Formelsammlung.pdf';
    this.style.display = 'none';
});

// Schließen
document.getElementById('pdf-close').addEventListener('click', function() {
    document.getElementById('pdf-container').style.display = 'none';
    document.getElementById('pdf-button').style.display = 'block';
});