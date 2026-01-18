const username = 'AnthonyQi';
let allRepos = [];
let favoriteRepos = [];

// MANUALLY ADD YOUR FAVORITE PROJECTS HERE
const manualFavorites = [
    {
        name: 'Project 1',
        description: 'Description of your favorite project',
        language: 'JavaScript',
        html_url: 'https://github.com/AnthonyQi/project-1',
        stargazers_count: 0
    },
    {
        name: 'Project 2',
        description: 'Another favorite project description',
        language: 'C',
        html_url: 'https://github.com/AnthonyQi/project-2',
        stargazers_count: 0
    },
    {
        name: 'Project 3',
        description: 'Third favorite project',
        language: 'Python',
        html_url: 'https://github.com/AnthonyQi/project-3',
        stargazers_count: 0
    },
    {
        name: 'Project 4',
        description: 'Fourth favorite project',
        language: 'C#',
        html_url: 'https://github.com/AnthonyQi/project-4',
        stargazers_count: 0
    },
    {
        name: 'Project 5',
        description: 'Fifth favorite project',
        language: 'Java',
        html_url: 'https://github.com/AnthonyQi/project-5',
        stargazers_count: 0
    }
];

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
                    ${repo.stargazers_count > 0 ? `<span class="tag">⭐ ${repo.stargazers_count}</span>` : ''}
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