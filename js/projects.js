const username = 'AnthonyQi';
let allRepos = [];
let favoriteRepos = [];

// MANUALLY ADD YOUR FAVORITE PROJECTS HERE
const manualFavorites = [
    {
        name: 'EL_Malloc & Matrix Optimization',
        description: 'Explicit list memory allocator implementing malloc/free with block splitting and merging, plus cache-optimized and multi-threaded matrix transpose multiplication with performance benchmarking.',
        language: 'C',
        html_url: 'https://gitshare.me/repo/89a9c808-dd1d-4ff6-b0e1-043c4f0b3e70',
        image: '../assets/images/p5-code/malloc.png',
    },
    {
        name: 'Battery Meter & Treeset Implementation',
        description: 'C project featuring bit-level LCD display control for a battery meter simulator, debugging puzzles using gdb, and a binary search tree-based set data structure with save/load functionality. Please contact me if you want to see the code.',
        language: 'C',
        html_url: 'https://github.com/AnthonyQi/BatteryMeter_TreeSet',
        image: '../assets/images/p2-code/batt_meter.png',
    },
    {
        name: 'Battery Meter Project Assembly Translation',
        description: 'Manually translated C code into its x86-64 assembly implementation of battery meter display functions using bit manipulation and struct field access, plus reverse engineering and solving a binary executable puzzle using gdb without source code.',
        language: 'x86 Assembly (AT&T Syntax)',
        html_url: 'https://github.com/AnthonyQi/batteryASM',
        image: '../assets/images/p3-code/puzzlebox_asm.png',
    },
    {
        name: 'Binary Search Tree Implmentation',
        description: 'Java BST with insertion, deletion (with preferred successor option), and comprehensive tree property checks (perfect, complete, full) plus recursive and non-recursive traversal methods (inorder, preorder, postorder, level-order).',
        language: 'Java',
        html_url: 'https://github.com/AnthonyQi/Proj7',
        image: '../assets/images/Proj7.png',
    },
    {
        name: 'Doubly Linked List with Deque, Queue, and Stack implementation',
        description: 'Java implementation of a doubly linked list with iterator support and insertion sort, plus Deque, Queue, and Stack data structures built on top with O(1) operations.',
        language: 'Java',
        html_url: 'https://github.com/AnthonyQi/Proj5',
        image: '../assets/images/Proj5.png',
    }
];

const privateProjects = [
    {
        name: 'Stock Visualizer',
        description: 'C program for loading stock price data from files, analyzing highs/lows, computing optimal buy/sell times, and generating ASCII-based graphical plots with customizable time ranges and visualization heights. Please contact me if you want to see the code.',
        language: 'C',
        html_url: 'https://github.com/AnthonyQi/StockVisualizer',
        image: '../assets/images/p1-code/Stock_Visualizer_Graph.png',
    },
    {
        name: 'Shellac: Unix Shell',
        description: 'Interactive command-line shell implementation in C supporting foreground/background job execution, I/O redirection (input/output files), job management, and built-in commands using fork(), exec(), and process control system calls.',
        language: 'C',
        html_url: 'https://github.com/AnthonyQi/shellac',
        image: '../assets/images/p4-code/shellac_cmds.png',
    },
]

const overrideRepo = {
    'Proj3': {
        name: 'Circular Deque Implementation',
        description: 'Generic circular deque data structure with add/remove operations from both ends, plus utility methods for palindrome checking and sliding window maximum.',
        html_url: 'https://github.com/AnthonyQi/Proj3',
        image: '../assets/images/Proj3.png',
    },
    'Proj4': {
        name: 'Priority List and Search/Sort Utilities',
        description: 'Java implementation of a generic priority list maintaining sorted order with custom comparators, plus utility classes for merging priority lists and performing bidirectional search and sort algorithms.',
        html_url: 'https://github.com/AnthonyQi/Proj3',
        image: '../assets/images/Proj4.png',
    },
    'Proj5': {
        name: 'Doubly Linked List with Deque, Queue, and Stack implementation',
        description: 'Java implementation of a doubly linked list with iterator support and insertion sort, plus Deque, Queue, and Stack data structures built on top with O(1) operations.',
        html_url: 'https://github.com/AnthonyQi/Proj5',
        image: '../assets/images/Proj5.png',
    },
    'Proj6': {
        name: 'Hash Map and Hash Set Implementation',
        description: 'Java implementations of a chained hash map with separate chaining collision resolution and a hash set using open addressing with linear probing, both with dynamic resizing.',
        html_url: 'https://github.com/AnthonyQi/Proj6',
        image: '../assets/images/Proj6.png',
    },
    'Proj7': {
        name: 'Binary Search Tree Implmentation',
        description: 'Java BST with insertion, deletion (with preferred successor option), and comprehensive tree property checks (perfect, complete, full) plus recursive and non-recursive traversal methods (inorder, preorder, postorder, level-order).',
        html_url: 'https://github.com/AnthonyQi/Proj7',
        image: '../assets/images/Proj7.png',
    },
    'Proj8': {
        name: 'Heap and Priority Queue Implementation',
        description: 'Java implementation of heap data structures (min and max heap) with heapify and heap sort algorithms, plus a priority queue built on top with insert and remove operations.',
        html_url: 'https://github.com/AnthonyQi/Proj8',
        image: '../assets/images/Proj8.png',
    },
    'MyList': {
        name: 'Custom ArrayList and Stack Implementation',
        description: 'Java implementation of a generic ArrayList with dynamic resizing, and a Stack class built on top of it following LIFO principles.',
        html_url: 'https://github.com/AnthonyQi/MyList',
        image: '../assets/images/MyList.png',
    },
    'Zoo': {
        name: 'Zoo Class/Managment Implementation',
        description: 'Java application for managing a zoo with animals (lions, eagles, snakes) and habitats, including placement, removal, sorting, and filtering by animal type and characteristics.',
        html_url: 'https://github.com/AnthonyQi/Zoo',
        image: '../assets/images/Zoo.png',
    },
    'DiagramSystems': {
        name: 'Diagram System Implementation',
        description: 'Java system for creating and animating ASCII art diagrams (flags, bars, combinations) with support for 2D array operations like rotation and combining multiple diagrams.',
        html_url: 'https://github.com/AnthonyQi/DiagramSystems',
        image: '../assets/images/DiagramSystems.png',
    },
    'ArrayUtilities': {
        name: 'Array Utilities Implementation',
        description: 'Java utility class with static methods for array operations including filtering by range, converting to strings, rotating left/right, and filtering StringBuffer arrays by length.',
        html_url: 'https://github.com/AnthonyQi/ArrayUtilities',
        image: '../assets/images/ArrayUtilities.png',
    },
    'DrawingApp': {
        name: 'Drawing App Implementation',
        description: 'Java utility for generating text-based ASCII art patterns including rectangles, flags, and horizontal/vertical color bars.',
        html_url: 'https://github.com/AnthonyQi/DrawingApp',
        image: '../assets/images/DrawingApp.png',
    },
    'PassportClass': {
        name: 'Passport Class Implementation',
        description: 'Java class representing a person\'s passport with name validation, stamp tracking, comparison methods, and normalization utilities.',
        html_url: 'https://github.com/AnthonyQi/PassportClass',
        image: '../assets/images/PassportClass.png',
    },
    'Alchemy_Roguelike': {
        name: 'Ingredient Inferno',
        description: 'UMD Fall 2025 Game Jam project. A 3-day team effort to build an alchemy-themed roguelike inspired by the jam\’s theme. I collaborated closely with two other developers on core gameplay systems and mechanics. The project was ultimately scrapped due to time constraints, but it was a valuable rapid-prototyping and teamwork experience.',
        language: ['C# (Unity)', 'Git'],
        image: '/assets/images/ii_shoot.gif'
    },
    'Clock': {
        description: 'Followed a tutorial from my IMDM101 professor to create a clock, then extended it by adding second-by-second ticking with both sound and movement, and a rotating global light that syncs with the user\’s local time to simulate daylight.',
        language: 'C# (Unity)',
        image: '../assets/images/clock.gif'
    },
    'RollABall': {
        name: 'Roll a Ball Minigame',
        description: 'Followed a tutorial provided by my IMDM101 professor to create a minigame that had the player controlling a ball to collect "coins" while avoiding an NPC that would constantly be chasing the player.',
        language: 'C# (Unity)',
        image: '../assets/images/roll.gif'
    },
    'IMD_Final': {
        name: 'Road to the Olympics',
        description: 'Worked closely with classmates to create a track and field simulation. Implemented two events: 100m dash and long jump, both featuring engaging controls. I focused on the menu, scene transitions, and all UI, while acting as team lead, keeping the project on schedule and assisting teammates with Git and collaboration.',
        language: ['C# (Unity)', 'Git'],
        image: '../assets/images/'
    },
    'PhotoManager': {
        name: 'Photo Manager Implementation',
        description: 'Java application for managing a collection of photos with features to add/remove photos, add comments, load from files, sort by date, and generate HTML pages displaying the photos.',
        language: 'Java',
        image: '../assets/images/PhotoManager.png'
    },
    'Assignment_4': {
        name: 'Echoes in the Rain',
        description: 'Created a prototype with a partner where the player walks through a rainy forest following a spirit to a hotel. Inside, the player can explore, read notes, and eventually reach the rooftop. The game is unfinished and has been scrapped. The prototype was meant to showcase scene changes, animation, ambience, environment, and storytelling, focusing on a narrative about the player searching for closure with someone they lost.',
        language: ['C# (Unity)', 'Git'],
        image: '../assets/images/rain.gif',
    }
};
// Use manual favorites for carousel
favoriteRepos = manualFavorites;

// Fetch repos from GitHub for the list
fetch(`https://api.github.com/users/${username}/repos?sort=stars&per_page=100`)
    .then(res => res.json())
    .then(repos => {
        // Get all favorite repo names to filter them out
        const favoriteNames = new Set(manualFavorites.map(p => p.html_url));
        
        allRepos = repos
            .filter(repo => !repo.fork && !favoriteNames.has(repo.html_url))
            .sort((a, b) => b.stargazers_count - a.stargazers_count);
        
        // Apply manual overrides
        allRepos = allRepos.map(repo => {
            if (overrideRepo[repo.name]) {
                return { ...repo, ...overrideRepo[repo.name] };
            }
            return repo;
        });
        
        allRepos = [...manualFavorites, ...privateProjects, ...allRepos];
        renderCarousel();
        renderAllProjects();
    })
    .catch(err => console.error('Error fetching repos:', err));
function renderCarousel() {
    const track = document.getElementById('carouselTrack');
    track.innerHTML = favoriteRepos.map((repo, index) => `
        <div class="carousel-slide" data-index="${index}">
            <div class="project-card">
                <div class="project-image" style="background-image: url('${repo.image}'); background-size: cover; background-position: center;"></div>
                <div class="project-overlay">
                    <div class="project-info">
                        <h3>${repo.name}</h3>
                        <div class="description-box">
                            <p>${repo.description || 'No description available'}</p>
                        </div>
                        <div class="project-tags">
                            ${repo.language ? 
                                (Array.isArray(repo.language) 
                                    ? repo.language.map(lang => `<span class="tag">${lang}</span>`).join('')
                                    : `<span class="tag">${repo.language}</span>`
                                )
                            : ''
                            }
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
            ${repo.image ? `<div class="project-list-image" style="background-image: url('${repo.image}'); background-size: cover; background-position: center;"></div>` : ''}
            <div class="project-list-content">
                <h3>${repo.name}</h3>
                <p>${repo.description || 'No description available'}</p>
                <div class="project-tags">
                    ${repo.language ? 
                        (Array.isArray(repo.language) 
                            ? repo.language.map(lang => `<span class="tag">${lang}</span>`).join('')
                            : `<span class="tag">${repo.language}</span>`
                        )
                    : ''
                    }
                </div>
            </div>
            ${repo.html_url ? `<a href="${repo.html_url}" target="_blank" class="project-button">View on GitHub →</a>` : `<span class="project-button" style="opacity: 0.5; cursor: default;">Private Project</span>`}
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
        autoRotateTimer = setInterval(nextSlide, 7000); // Change slide every 5 seconds
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

// Back to top button
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
});

backToTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});