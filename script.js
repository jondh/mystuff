// Get references to the canvas element and the window object
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Set the canvas size to match the window dimensions
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Call the resizeCanvas function initially and whenever the window is resized
resizeCanvas();
window.addEventListener('resize', resizeCanvas);