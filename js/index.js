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
// CHECKKKKK!!!!
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

	
		let star = document.createElement("div");
		const starImg = document.createElement('img'); 
		star.setAttribute('class', 'winning-star');
		starImg.src = "img/gold-star2.png";
		star.appendChild(starImg);	

		if(rightSideValue == leftSideValue){
			leftStat.classList.add('losing-stat');
			rightStat.classList.add('losing-stat');

			if(leftStat.classList.contains('winning-stat')) {
				leftStat.classList.remove('winning-stat');
			} else if(rightStat.classList.contains('winning-stat')){
				rightStat.classList.remove('winning-stat');
			} 

			} else if (rightSideValue > leftSideValue) {
				leftStat.classList.remove('winning-stat');
				leftStat.classList.add('losing-stat');
				if(rightStat.querySelector(".title").innerHTML !== "N/A") {
					rightStat.classList.add('winning-stat');
					rightStat.appendChild(star);
				} else {
					rightStat.classList.add('losing-stat');
				}

		} else {
			rightStat.classList.remove('winning-stat');
			rightStat.classList.add('losing-stat');
			if(leftStat.querySelector(".title").innerHTML !== "N/A") {
				leftStat.classList.add('winning-stat');
				leftStat.appendChild(star);
			} else {
				leftStat.classList.add('losing-stat');
			}
		}
	});
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
		<article data-value=${awards} class="notification ">
			<p class="title">${movieDetail.Awards}</p>
			<p class="subtitle">Awards</p>
		</article>
		<article data-value=${dollars} class="notification ">
			<p class="title">${movieDetail.BoxOffice}</p>
			<p class="subtitle">Box Office</p>
		</article>
		<article data-value=${metascore} class="notification ">
			<p class="title">${movieDetail.Metascore}</p>
			<p class="subtitle">Metascore</p>
		</article>
		<article data-value=${imdbRating} class="notification ">
			<p class="title">${movieDetail.imdbRating}</p>
			<p class="subtitle">IMDB Rating</p>
		</article>
		<article data-value=${imdbVotes} class="notification ">
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

// Show input field
function showSearch() {
	document.getElementById('top-search-content').style.display = 'block';
}

let showcaseTopId = document.getElementById('showcase-top-id');
let searchBtn = document.getElementById('search-btn');
let topInput = document.getElementById('top-autocomplete').getElementsByClassName('input')[0];
topInput.setAttribute('placeholder', 'Search Movie');
let leftInput = document.getElementById('left-autocomplete').getElementsByClassName('input')[0];
leftInput.setAttribute('placeholder', 'Search Movie # 1');
let rightInput = document.getElementById('right-autocomplete').getElementsByClassName('input')[0];
rightInput.setAttribute('placeholder', 'Search Movie # 2');
let refreshPage = document.getElementById('refresh-page')
let searchRefresh = document.getElementById('search-refresh-btn');
let close = Array.from(document.getElementsByClassName('close'));
// let refreshSearch = document.getElementById('refresh-search');
let topSearch = document.getElementById('top-search-content');
let resetInput = document.getElementById('reset-input');
let input = Array.from(document.getElementsByClassName('input'));
let summary = Array.from(document.getElementsByClassName('summary'));


// document.addEventListener('click', function(root){
// 	console.log(root);
// })



searchBtn.addEventListener('click', function() {
	showSearch(topSearch, event);
});


// Show input field
function showSearch(x, event)  {
	event.preventDefault();
	x.style.display = 'block';
}

// function spin(){
// 	refreshSearch.classList.add('fa-spin');
// }

searchRefresh.addEventListener('click', function() {
	location.reload()
});


// refreshPage.forEach( el => {
// 	el.addEventListener('click', function() {
// 		el.location.reload()
// 	});
// })

close.forEach( el => {
	el.addEventListener('click', function() {
		closeSearch(topSearch);
		resetInputFunc(input);
		clearSummary(summary);
	});
})

// Hide input field
function closeSearch(x) {
	x.style.display = 'none';
}

// Empty out input field
function resetInputFunc(el) {
	input.forEach( el => {
		let emptyInput = (el.value = '');
		if (el) {
			emptyInput;
		}
	})

}

// Empty out div content without destroying it
function clearSummary(el) {
	summary.forEach( el => {
		el.innerHTML = '';
	})
}

// info-tab-content
const infoTabItems = document.querySelectorAll('.info-tab-item');
const tabContentItems = document.querySelectorAll('.info-tab-content-item');

// Select tab content item
function selectItem(e) {
	// Remove all show and border classes
	removeBorder();
	removeShow();
	// Add border to current tab item
	this.classList.add('tab-border');
	// Grab content item from DOM
	const infoTabContentItem = document.querySelector(`#${this.id}-content`);
	console.log(`${this.id}`);
	// Add show class
	infoTabContentItem.classList.add('show');
}

// Remove bottom borders from all tab items
function removeBorder() {
	infoTabItems.forEach((item) => {
		item.classList.remove('tab-border');
	});
}

// Remove show class from all content items
function removeShow() {
	tabContentItems.forEach((item) => {
		item.classList.remove('show');
	});
}

// Listen for tab item click
infoTabItems.forEach((item) => {
	item.addEventListener('click', selectItem);
});

// slideshow
let slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
	showSlides((slideIndex += n));
}

function currentSlide(n) {
	showSlides((slideIndex = n));
}

function showSlides(n) {
	let i;
	let slides = document.getElementsByClassName('mySlides');
	let dots = document.getElementsByClassName('dot');
	if (n > slides.length) {
		slideIndex = 1;
	}
	if (n < 1) {
		slideIndex = slides.length;
	}
	for (i = 0; i < slides.length; i++) {
		slides[i].style.display = 'none';
	}
	for (i = 0; i < dots.length; i++) {
		dots[i].className = dots[i].className.replace(' active', '');
	}
	slides[slideIndex - 1].style.display = 'grid';
	dots[slideIndex - 1].className += ' active';
}