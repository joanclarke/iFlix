const fetchData = async (searchTerm) => {
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
};

const root = document.querySelector('.autocomplete');
root.innerHTML = `
  <label><b>Search For a Movie</b></label>
  <input class="input" />
  <div class="dropdown">
    <div class="dropdown-menu">
      <div class="dropdown-content results"></div>
    </div>
  </div>
`;
const input = document.querySelector('input');
const dropdown = document.querySelector('.dropdown');
const resultsWrapper = document.querySelector('.results');

const onInput = async (event) => {
	const movies = await fetchData(event.target.value);

	// Close dropdown when it is empty
	if (!movies.length) {
		dropdown.classList.remove('is-active');
		return;
	}

	resultsWrapper.innerHTML = '';
	dropdown.classList.add('is-active');
	for (let movie of movies) {
		const option = document.createElement('a');
		// Fix broken images
		const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;

		option.classList.add('dropdown-item');
		option.innerHTML = `
      <img src="${imgSrc}" />
      ${movie.Title}
		`;
		option.addEventListener('click', () => {
			dropdown.classList.remove('is-active');
			input.value = movie.Title;
		});

		resultsWrapper.appendChild(option);
	}
};

input.addEventListener('input', debounce(onInput, 500));

// Close the dropdown if root does not contain the element that was clicked on
document.addEventListener('click', (event) => {
	if (!root.contains(event.target)) {
		// To close dropdown, remove the is-active class
		dropdown.classList.remove('is-active');
	}
});
