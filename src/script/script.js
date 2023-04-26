let page = "";

function loader(givenPage) {
	page = givenPage;
	var xhttp = new XMLHttpRequest(); //use to connect to the servers
	var url = "@dynamicLink:8090/?request=userinfo";
	xhttp.open("GET", url, true);

	xhttp.onreadystatechange = function () {
		if (this.readyState == 4) {
			if (this.status == 200) {
				const userInfo = JSON.parse(this.responseText);
				const translationData = userInfo[0];
				const extensions = userInfo[1];
				const pageAdditions = userInfo[2];
				const miscellaneous = userInfo[3];
				translator(translationData);
			} else {
				serverDisconnectErr();
			}
		}
	};
	xhttp.send();
}

function translator(translationData) {
	for (let i = 0; i < translationData.length; i++) {
		if (translationData[i].page == page) {
			Document.getElementById(translationData[i].id).value = translationData[i].value;
		}
	}
}
