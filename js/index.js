const autoCompleteConfig = {
	renderOption(movie) {
		// Fix broken images
		const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
		return `
		<img src="${imgSrc}" />
		${movie.Title} (${movie.Year})
	`;
	},
	inputValue(movie) {
		return movie.Title;
	},
	async fetchData(searchTerm) {
		const response = await axios.get('http://www.omdbapi.com/', {
			params: {
				apikey: '9af29709',
				s: searchTerm
			}
		});

		if (response.data.Error) {
			// return error message response
			// console.log(response.data.Error);
			return [];
		}

		return response.data.Search;
	}
};

createAutoComplete({
	...autoCompleteConfig,
	root: document.querySelector('#top-autocomplete'),
	onOptionSelect(movie) {
		// document.querySelector('.tutorial').classList.add('is-hidden');
		onMovieSelect(movie, document.querySelector('#top-summary'), 'top');
	}
});

createAutoComplete({
	...autoCompleteConfig,
	root: document.querySelector('#left-autocomplete'),
	onOptionSelect(movie) {
		document.querySelector('.tutorial').classList.add('is-hidden');
		onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
	}
});

createAutoComplete({
	...autoCompleteConfig,
	root: document.querySelector('#right-autocomplete'),
	onOptionSelect(movie) {
		document.querySelector('.tutorial').classList.add('is-hidden');
		onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
	}
});

let searchMovie;
let leftMovie;
let rightMovie;
const onMovieSelect = async (movie, summaryElement, side) => {
	const response = await axios.get('http://www.omdbapi.com/', {
		params: {
			apikey: '9af29709',
			i: movie.imdbID
		}
	});

	if (side === 'top') {
		summaryElement.innerHTML = searchMovieTemplate(response.data);
		searchMovie = response.data;
		console.log(response.data);
	} else if (side === 'left') {
		summaryElement.innerHTML = movieTemplate(response.data);
		leftMovie = response.data;
	} else {
		rightMovie = response.data;
	}

	if (leftMovie && rightMovie) {
		summaryElement.innerHTML = movieTemplate(response.data);
		runComparison();
	}
};

const runComparison = () => {
	const leftSideStats = document.querySelectorAll('#left-summary .notification');
	const rightSideStats = document.querySelectorAll('#right-summary .notification');

	leftSideStats.forEach((leftStat, index) => {
		const rightStat = rightSideStats[index];

		const leftSideValue = parseInt(leftStat.dataset.value);
		const rightSideValue = parseInt(rightStat.dataset.value);

		if (rightSideValue > leftSideValue) {
			leftStat.classList.remove('has-background-grey-light');
			leftStat.classList.add('has-background-warning');
		} else {
			rightStat.classList.remove('has-background-grey-light');
			rightStat.classList.add('has-background-warning');
		}
	});
	// let leftSideCount;
	// let rightSideCount;
	// 	for(let i=0; i <=5; i++) {

	// 	}
};

const movieTemplate = (movieDetail) => {
	const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, ''));
	const metascore = parseInt(movieDetail.Metascore);
	const imdbRating = parseFloat(movieDetail.imdbRating);
	const imdbVotes = parseFloat(movieDetail.imdbVotes.replace(/,/g, ''));

	let count = 0;
	const awards = movieDetail.Awards.split(' ').reduce((prev, word) => {
		const value = parseInt(word);

		if (isNaN(value)) {
			return prev;
		} else {
			return prev + value;
		}
	}, 0);
	// console.log(awards);

	return `
		<article class="media">
			<figure class="media-left">
				<p class="image">
					<img src="${movieDetail.Poster}" />	
				</p>
			</figure>
			<div class="media-content">
				<div class="content">
					<h1>${movieDetail.Title}</h1>
					<h4>${movieDetail.Genre}</h4>
					<p>${movieDetail.Plot}</p>
				</div>
			</div>
		</article>

		<article data-value=${awards} class="notification has-text-grey-dark has-background-grey-light">
			<p class="title">${movieDetail.Awards}</p>
			<p class="subtitle">Awards</p>
		</article>
		<article data-value=${dollars} class="notification has-text-grey-dark has-background-grey-light">
			<p class="title">${movieDetail.BoxOffice}</p>
			<p class="subtitle">Box Office</p>
		</article>
		<article data-value=${metascore} class="notification has-text-grey-dark has-background-grey-light">
			<p class="title">${movieDetail.Metascore}</p>
			<p class="subtitle">Metascore</p>
		</article>
		<article data-value=${imdbRating} class="notification has-text-grey-dark has-background-grey-light">
			<p class="title">${movieDetail.imdbRating}</p>
			<p class="subtitle">IMDB Rating</p>
		</article>
		<article data-value=${imdbVotes} class="notification has-text-grey-dark has-background-grey-light">
			<p class="title">${movieDetail.imdbVotes}</p>
			<p class="subtitle">IMDB Votes</p>
		</article>
	`;
};

const searchMovieTemplate = (movieDetail) => {
	return `
		<article>
			<div class="media-content">
				<div class="content">
				<h1>${movieDetail.Title}</h1>
				</div>
			</div>
		</article>

		<article class="media">
			<figure class="media-left">
				<p class="image">
					<img src="${movieDetail.Poster}" />
				</p>
			</figure>
			<div class="media-content">
				<div class="content">
					<h4>${movieDetail.Genre}</h4>
					<ul class="detail"><li>${movieDetail.Rated}</li> <li>${movieDetail.Year}</li> <li>${movieDetail.Runtime}</li> </ul> 
					<p><i class="fas fa-star fa-2x"></i> <span class="ratings"><strong>${movieDetail.imdbRating}</strong></span> / ${movieDetail.imdbVotes} IMDb votes</p>
					<p>Awards: ${movieDetail.Awards}</p> 
					<p class="box-office">Box Office: <strong>${movieDetail.BoxOffice}</strong></p> 
				</div>
			</div>
		</article>

		<article class="results-summary">
			<div class="media-content">
				<div class="content">
					<p class="plot">${movieDetail.Plot}</p>
					<p class="media-content-p"><strong>Stars:</strong> <span>${movieDetail.Actors}</span></p>
					<hr class="line">
					<p class="media-content-p"><strong>Directors:</strong> ${movieDetail.Director}</p>
					<hr class="line">
					<p class="media-content-p"><strong>Writers:</strong> ${movieDetail.Writer}</p>
				</div>
			</div>
		</article>
	`;
};

// <article class="notification is-primary">
// <p class="title">${movieDetail.Awards}</p>
// <p class="subtitle">Awards</p>
// </article>
// <article class="notification is-primary">
// <p class="title">${movieDetail.BoxOffice}</p>
// <p class="subtitle">Box Office</p>
// </article>
// <article class="notification is-primary">
// <p class="title">${movieDetail.Metascore}</p>
// <p class="subtitle">Metascore</p>
// </article>
// <article class="notification is-primary">
// <p class="title">${movieDetail.imdbRating}</p>
// <p class="subtitle">IMDB Rating</p>
// </article>
// <article class="notification is-primary">
// <p class="title">${movieDetail.imdbVotes}</p>
// <p class="subtitle">IMDB Votes</p>
// </article>
