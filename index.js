// JavaScript für Interaktivität

document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('change-color-btn');
    const message = document.getElementById('message');
    const body = document.body;

    let colorIndex = 0;
    const colors = [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    ];

    button.addEventListener('click', function() {
        colorIndex = (colorIndex + 1) % colors.length;
        body.style.background = colors[colorIndex];
        message.textContent = 'Hintergrundfarbe geändert! Klicke erneut für mehr.';
        message.style.color = '#fff';
        message.style.fontWeight = 'bold';
    });

    // Zusätzliche Animation für die Sektionen
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.transition = 'transform 0.3s';
        });
        section.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});