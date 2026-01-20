const username = 'AnthonyQi';
let allRepos = [];
let favoriteRepos = [];

// MANUALLY ADD YOUR FAVORITE PROJECTS HERE
const manualFavorites = [
    {
        name: 'EL_Malloc & Matrix Optimization',
        description: 'Explicit list memory allocator implementing malloc/free with block splitting and merging, plus cache-optimized and multi-threaded matrix transpose multiplication with performance benchmarking.',
        language: 'C',
        html_url: 'https://github.com/AnthonyQi/el_malloc_matata',
        image: '../images/p5-code/malloc.png',
    },
    {
        name: 'Battery Meter & Treeset Implementation',
        description: 'C project featuring bit-level LCD display control for a battery meter simulator, debugging puzzles using gdb, and a binary search tree-based set data structure with save/load functionality. Please contact me if you want to see the code.',
        language: 'C',
        html_url: 'https://github.com/AnthonyQi/BatteryMeter_TreeSet',
        image: '../images/p2-code/batt_meter.png',
    },
    {
        name: 'Battery Meter Project Assembly Translation',
        description: 'Manually translated C code into its x86-64 assembly implementation of battery meter display functions using bit manipulation and struct field access, plus reverse engineering and solving a binary executable puzzle using gdb without source code.',
        language: 'x86 Assembly (AT&T Syntax)',
        html_url: 'https://github.com/AnthonyQi/batteryASM',
        image: '../images/p3-code/puzzlebox_asm.png',
    },
    {
        name: 'Binary Search Tree Implmentation',
        description: 'Java BST with insertion, deletion (with preferred successor option), and comprehensive tree property checks (perfect, complete, full) plus recursive and non-recursive traversal methods (inorder, preorder, postorder, level-order).',
        language: 'Java',
        html_url: 'https://github.com/AnthonyQi/Proj7',
        image: '../images/Proj7.png',
    },
    {
        name: 'Doubly Linked List with Deque, Queue, and Stack implementation',
        description: 'Java implementation of a doubly linked list with iterator support and insertion sort, plus Deque, Queue, and Stack data structures built on top with O(1) operations.',
        language: 'Java',
        html_url: 'https://github.com/AnthonyQi/Proj5',
        image: '../images/Proj5,png',
    }
];

const privateProjects = [
    {
        name: 'Stock Visualizer',
        description: 'C program for loading stock price data from files, analyzing highs/lows, computing optimal buy/sell times, and generating ASCII-based graphical plots with customizable time ranges and visualization heights. Please contact me if you want to see the code.',
        language: 'C',
    },
    {
        name: 'Battery Meter & Treeset Implementation',
        description: 'C project featuring bit-level LCD display control for a battery meter simulator, debugging puzzles using gdb, and a binary search tree-based set data structure with save/load functionality. Please contact me if you want to see the code.',
        language: 'C',
    },
    {
        name: 'Battery Meter Project Assembly Translation',
        description: 'Manually translated C code into its x86-64 assembly implementation of battery meter display functions using bit manipulation and struct field access, plus reverse engineering and solving a binary executable puzzle using gdb without source code.',
        language: 'x86 Assembly (AT&T Syntax)',
    },
    {
        name: 'Shellac: Unix Shell',
        description: 'Interactive command-line shell implementation in C supporting foreground/background job execution, I/O redirection (input/output files), job management, and built-in commands using fork(), exec(), and process control system calls.',
        language: 'C',
    },
    {
        name: 'EL_Malloc & Matrix Optimization',
        description: 'Explicit list memory allocator implementing malloc/free with block splitting and merging, plus cache-optimized and multi-threaded matrix transpose multiplication with performance benchmarking.',
        language: 'C',
    }

]
// Use manual favorites for carousel
favoriteRepos = manualFavorites;

// Fetch repos from GitHub for the list
fetch(`https://api.github.com/users/${username}/repos?sort=stars&per_page=100`)
    .then(res => res.json())
    .then(repos => {
        allRepos = repos.filter(repo => !repo.fork).sort((a, b) => b.stargazers_count - a.stargazers_count);
        renderCarousel();
        renderAllProjects();
    })
    .catch(err => console.error('Error fetching repos:', err));

function renderCarousel() {
    const track = document.getElementById('carouselTrack');
    track.innerHTML = favoriteRepos.map((repo, index) => `
        <div class="carousel-slide" data-index="${index}">
            <div class="project-card">
                <div class="project-image"></div>
                <div class="project-overlay">
                    <div class="project-info">
                        <h3>${repo.name}</h3>
                        <p>${repo.description || 'No description available'}</p>
                        <div class="project-tags">
                            ${repo.language ? `<span class="tag">${repo.language}</span>` : ''}
                            ${repo.stargazers_count > 0 ? `<span class="tag">⭐ ${repo.stargazers_count}</span>` : ''}
                        </div>
                    </div>
                    <a href="${repo.html_url}" target="_blank" class="project-button">View on GitHub →</a>
                </div>
            </div>
        </div>
    `).join('');

    setupCarouselButtons();
}

function renderAllProjects() {
    const list = document.getElementById('projectsList');
    list.innerHTML = allRepos.map(repo => `
        <div class="project-list-item">
            <div class="project-list-content">
                <h3>${repo.name}</h3>
                <p>${repo.description || 'No description available'}</p>
                <div class="project-tags">
                    ${repo.language ? `<span class="tag">${repo.language}</span>` : ''}
                </div>
            </div>
            <a href="${repo.html_url}" target="_blank" class="project-button">View on GitHub →</a>
        </div>
    `).join('');
}

function setupCarouselButtons() {
    let currentIndex = 0;
    const slides = document.querySelectorAll('.carousel-slide');
    const track = document.getElementById('carouselTrack');
    let autoRotateTimer;

    function updateCarousel() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        updateCarousel();
        resetAutoRotate();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateCarousel();
        resetAutoRotate();
    }

    function startAutoRotate() {
        autoRotateTimer = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }

    function resetAutoRotate() {
        clearInterval(autoRotateTimer);
        startAutoRotate();
    }

    document.getElementById('nextBtn').addEventListener('click', nextSlide);
    document.getElementById('prevBtn').addEventListener('click', prevSlide);

    // Start auto-rotation when page loads
    startAutoRotate();
}