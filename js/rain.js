const canvas = document.getElementById('rain-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const raindrops = [];
const rainCount = 100;

class Raindrop {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height - canvas.height;
        this.speed = Math.random() * 100 + 10;
        this.width = 2;
        this.height = 10;
    }

    update() {
        this.y += this.speed;
        if (this.y > canvas.height) {
            this.y = -this.height;
            this.x = Math.random() * canvas.width;
        }
    }

    draw() {
        ctx.fillStyle = 'rgba(162, 253, 255, 0.3)'; // Ghibli taupe
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

for (let i = 0; i < rainCount; i++) {
    raindrops.push(new Raindrop());
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    raindrops.forEach(drop => {
        drop.update();
        drop.draw();
    });

    requestAnimationFrame(animate);
}

animate();