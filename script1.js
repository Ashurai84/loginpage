const tmdbApiKey = 'e3d140518c00e7ea7cc7a87ac15f9261';

function showLoading() {
    document.getElementById('loading-spinner').style.display = 'block';
    document.getElementById('welcome-message').classList.add('hide-welcome-message');
}

function hideLoading() {
    document.getElementById('loading-spinner').style.display = 'none';
}

function searchMovies(page = 1) {
    const query = document.getElementById('search-bar').value.trim();
    if (query === '') return;

    showLoading();
    const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${tmdbApiKey}&query=${query}&language=en-US&page=${page}`;

    fetch(searchUrl)
        .then(response => response.json())
        .then(data => {
            hideLoading();
            displayMovies(data.results);
            setupPagination(data.total_pages, page);  // Adjust pagination to show the current page
        })
        .catch(error => {
            hideLoading();
            alert("Error fetching movie data.");
        });
}

function displayMovies(movies) {
    const moviesContainer = document.querySelector('.movies');
    moviesContainer.innerHTML = '';

    if (movies.length === 0) {
        moviesContainer.innerHTML = '<p>No movies found. Please try again.</p>';
    } else {
        movies.forEach(movie => {
            const movieElement = document.createElement('div');
            movieElement.classList.add('movie');
            movieElement.innerHTML = `
                <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="${movie.title}">
                <h3>${movie.title}</h3>
                <p>Release Date: ${movie.release_date}</p>
                <button onclick="openTrailer('${movie.id}')">Watch Trailer</button>
            `;
            moviesContainer.appendChild(movieElement);
        });
    }
}

function openTrailer(movieId) {
    showLoading();
    const trailerUrl = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${tmdbApiKey}&language=en-US`;

    fetch(trailerUrl)
        .then(response => response.json())
        .then(data => {
            hideLoading();
            const trailer = data.results.find(item => item.type === 'Trailer');
            if (trailer) {
                const trailerModal = document.getElementById('trailer-modal');
                document.getElementById('trailer-video').src = `https://www.youtube.com/embed/${trailer.key}?autoplay=1`;
                trailerModal.style.display = 'block';
            } else {
                alert("Trailer not available for this movie.");
            }
        })
        .catch(error => {
            hideLoading();
            alert("Error fetching trailer.");
        });
}

function closeTrailer() {
    document.getElementById('trailer-modal').style.display = 'none';
    document.getElementById('trailer-video').src = ''; // Stop video when closing modal
}

function setupPagination(totalPages, currentPage = 1) {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';

    // Add "Previous" button
    if (currentPage > 1) {
        const prevButton = document.createElement('button');
        prevButton.innerText = 'Previous';
        prevButton.onclick = () => changePage(currentPage - 1);
        paginationContainer.appendChild(prevButton);
    }

    // Add page buttons (show only a limited number of pages)
    const pageLimit = 5;
    let startPage = Math.max(1, currentPage - Math.floor(pageLimit / 2));
    let endPage = Math.min(totalPages, startPage + pageLimit - 1);

    for (let i = startPage; i <= endPage; i++) {
        const button = document.createElement('button');
        button.innerText = i;
        button.classList.toggle('active', i === currentPage);  // Highlight current page
        button.onclick = () => changePage(i);
        paginationContainer.appendChild(button);
    }

    // Add "Next" button
    if (currentPage < totalPages) {
        const nextButton = document.createElement('button');
        nextButton.innerText = 'Next';
        nextButton.onclick = () => changePage(currentPage + 1);
        paginationContainer.appendChild(nextButton);
    }
}

function changePage(pageNumber) {
    const query = document.getElementById('search-bar').value.trim();
    if (!query) return;
    
    searchMovies(pageNumber);
}

function fetchMoviesByGenre(genreId) {
    if (!genreId) return;

    showLoading();
    const genreUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${tmdbApiKey}&with_genres=${genreId}`;

    fetch(genreUrl)
        .then(response => response.json())
        .then(data => {
            hideLoading();
            displayMovies(data.results);
            setupPagination(data.total_pages);
        })
        .catch(error => {
            hideLoading();
            alert("Error fetching movie data.");
        });
}
