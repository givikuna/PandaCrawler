const pages = ['settings', 'search', 'documentation', 'about', 'extensions', 'home', 'password_manager', 'search_history', 'feedback_page', 'contact', 'services'];

function loader(page) {
	var xhttp = new XMLHttpRequest();
	var url = "http://localhost:8094/?page=" + page + "&type=data&dataType=json";
	xhttp.open("GET", url, true);

	xhttp.onreadystatechange = function () {
		if (this.readyState == 4) {
			if (this.status == 200) {
				const userInfo = JSON.parse(this.responseText);
				if (!pages.includes(page)) page = 'home';
				const b = new builder(page);
				b['build_' + page].bind(b)(userInfo);
			} else { }
		}
	};

	xhttp.send();
}

class builder {
	constructor(page) {
		this.page;
	}

	build_home(data) {
		build(['homePageSearchBar', 'homePageTopIcons']);
	}
}

var build = (components) => {
	let s = "";
	for (let i = 0; i < components.length; i++) {
		s += "buildComponent(" + components[i] + ")";
		if (i !== 0) s += ")";
		if (i < components.length - 1) s += ".then("
		if (i === components.length - 1) s += ";";
	}
	eval(s);
}

var buildComponent = (componentID) => {
	var xhttp = new XMLHttpRequest();
	xhttp.open("GET", "http://localhost:8093/?page=" + page + "&type=data&dataType=component&componentID=" + componentID, true);

	xhttp.onreadystatechange = function () {
		if (this.readyState == 4) {
			if (this.status == 200) {
				document.getElementById('main').innerHTML += this.responseText.toString();

				let link = document.createElement('link');
				link.rel = 'stylesheet';
				link.href = 'http://localhost:8093/?page=undefined&type=data&dataType=component_style&componentID=' + componentID;
				document.head.appendChild(link);
			}
		}
	};

	xhttp.send();
}
