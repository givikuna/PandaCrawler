function loader(page) {
	var xhhtp = new XMLHttpRequest();
	var url = "http://localhost:8091/?page=" + page;
	xhttp.open("GET", url, true);

	xhttp.onreadystatechange = function () {
		if (this.readyState == 4) {
			if (this.status == 200) {
				const userInfo = JSON.parse(this.responseText);
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
					buildSearchbar();
				}
			} else {
				serverDisconnectErr();
			}
		}
	};

	xhttp.send();
}

function buildSearchbar() {
	
}