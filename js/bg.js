//Background
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function bg() {
    document.body.style.backgroundImage = `radial-gradient(circle at ${mouseX}px ${mouseY}px, rgb(66, 13, 66), rgb(123, 35, 123))`;
    requestAnimationFrame(bg);
}

bg();