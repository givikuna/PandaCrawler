function loader(page) {
	var xhttp = new XMLHttpRequest();
	var url = "http://localhost:8091/?page=" + page + "&type=data&dataType=json";
	xhttp.open("GET", url, true);

	xhttp.onreadystatechange = function () {
		if (this.readyState == 4) {
			if (this.status == 200) {
				const userInfo = JSON.parse(this.responseText);
				// make this into a switch later
				if (page == "settings_general") {
					//
				} else if (page == "settings_appearance") {
					//
				} else if (page == "settings_privacy") {
					//
				} else if (page == "search") {
					//
				} else if (page == "documentation") {
					//
				} else if (page == "about") {
					//
				} else if (page == "extensions") {
					//
				} else if (page == "password_manager") {
					//
				} else if (page == "search_history") {
					//
				} else if (page == "feedback_page") {
					//
				} else if (page == "contact") {
					//
				} else if (page == "services") {
					//
				} else {
					buildHomePage();
				}
			} else {
				serverDisconnectErr(page);
			}
		}
	};

	xhttp.send();
}

function buildHomePage(page) {
	buildHomePage_add_homePageTopIcons(page);
	buildHomePage_add_homePageSearchBar(page);
}

function buildHomePage_add_homePageTopIcons(page) {
	var xhttp = new XMLHttpRequest();
	var url = "http://localhost:8091/?page=" + page + "&type=data&dataType=component&componentID=homePageTopIcons";
	xhttp.open("GET", url, true);

	xhttp.onreadystatechange = function () {
		if (this.readyState == 4) {
			if (this.status == 200) {
				const component = this.responseText.toString();
				document.getElementById('main').innerHTML += component;

				var link = document.createElement('link');
				link.rel = 'stylesheet';
				link.href = 'http://localhost:8091/?page=undefined&type=data&dataType=component_style&componentID=homePageTopIcons';
				document.head.appendChild(link);
			}
		}
	};

	xhttp.send();
}

function buildHomePage_add_homePageSearchBar(page) {
	/*
		<div class="search-container">
			<form>
				<label for="search-input" style="display: none;">Search with..</label>
				<input type="text" id="search-input" class="search-input" placeholder="Search with PandaCrawler">
				<button type="submit" class="search-button" onclick="">Search</button>
			</form>
		</div>
	*/
	var xhttp = new XMLHttpRequest();
	var url = "http://localhost:8091/?page=" + page + "&type=data&dataType=component&componentID=homePageSearchBar";
	xhttp.open("GET", url, true);

	xhttp.onreadystatechange = function () {
		if (this.readyState == 4) {
			if (this.status == 200) {
				const component = this.responseText.toString();
				document.getElementById('main').innerHTML += component;

				var link = document.createElement('link');
				link.rel = 'stylesheet';
				link.href = 'http://localhost:8091/?page=undefined&type=data&dataType=component_style&componentID=homePageSearchBar';
				document.head.appendChild(link);
			}
		}
	};

	xhttp.send();
}
