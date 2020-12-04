const createAutoComplete = ({ root, renderOption, onOptionSelect, inputValue, fetchData }) => {
	// root.innerHTML = `
  //   <label for="search" ><b>Search</b></label>
  //   <input class="input" id="reset-input"/>
  //   <div class="dropdown">
  //     <div class="dropdown-menu">
  //       <div class="dropdown-content results"></div>
  //     </div>
  //   </div>
	// `;
	
	root.innerHTML = `
	<input class="input" id="reset-input"/>
	<div class="dropdown">
		<div class="dropdown-menu">
			<div class="dropdown-content results"></div>
		</div>
	</div>
`;

	const input = root.querySelector('input');
	const dropdown = root.querySelector('.dropdown');
	const resultsWrapper = root.querySelector('.results');

	const onInput = async (event) => {
		const items = await fetchData(event.target.value);

		// Close dropdown when it is empty
		if (!items.length) {
			dropdown.classList.remove('is-active');
			return;
		}

		resultsWrapper.innerHTML = '';
		dropdown.classList.add('is-active');
		for (let item of items) {
			const option = document.createElement('a');

			option.classList.add('dropdown-item');
			option.innerHTML = renderOption(item);
			option.addEventListener('click', () => {
				dropdown.classList.remove('is-active');
				input.value = inputValue(item);
				onOptionSelect(item);
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
};
