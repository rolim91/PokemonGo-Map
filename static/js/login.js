

var baseURL = location.protocol + "//" + location.hostname + (location.port ? ":" + location.port : "");
var currPath = location.pathname;
init();



function init() {
	var session = getCookie("session");

	if (session !== undefined) {	
		// console.log("Logged In");
		// console.log(session);
		$.post(
			baseURL + "/login",
			{
				session: session
			},
			function(data) {	
				// console.log(data);
				if (currPath == "/") {
					if (data.response == "accepted") {
						var path = "/map"
						redirect(path);
					}
					else
						console.log("not accepted");
				}
				else if (currPath == "/map") {
					if (data.response != "accepted") {
						var path = "/"
						redirect(path);
					}
				}
			}
		);
	}
	else {
		if (currPath == "/map") {
			var path = "/"
			redirect(path);
		}
	}
}


function loginUser(currUser, currPass){
	// console.log("The username is " + currUser + " and password is " + currPass);
	$.post(
		baseURL + "/login",
		{
			username: currUser,
			password: currPass
		},
		function(data)
		{	
			if (data.response == "accepted")
			{
				//store session as cookie
				setCookie("session", data.session)

				//redirect
				redirect("/map");
			}
			else
				console.log("not accepted");
		}
	);
}



function setCookie(cookieName, cookieValue) {
	//Set date to a month from now
	var now = new Date();
	now.setMonth( now.getMonth + 1 );

	var tempCookie = cookieName + "=" + cookieValue + ";"
	var expiration = " expires=" + now.toUTCString() + ";"

	document.cookie = tempCookie + expiration;
}

function redirect(path) {
	
	var newURL = baseURL + path;
	window.location = newURL;
}


function getCookie(cookieName) {
	var cookies = document.cookie;
	var splitCookies = cookies.split(";");
	var jsonStringCookies = "{"
	for(var i = 0; i < splitCookies.length; i++) {
		var temp = splitCookies[i].split("=");
		if (i == splitCookies.length - 1)
			var value = "\"" + temp[0] + "\":\"" + temp[1] + "\"";
		else
			var value = "\"" + temp[0] + "\":\"" + temp[1] + "\",";
		jsonStringCookies += value;
	}

	jsonStringCookies += "}";
	var jsonCookies = JSON.parse(jsonStringCookies);

	return jsonCookies[cookieName];
}

if (currPath == "/") {
	document.getElementById("loginButton").addEventListener("click", function(){
		var username = document.getElementById('username').value;
		var password = document.getElementById('password').value;
	    loginUser(username, password);
	});
}