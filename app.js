const formEl = document.querySelector("form");
const list = document.getElementById("mainList");
const indicatorEl = document.getElementById("indicatorEl");
key = "QrOd5aoq5GxWD3kTyGcl1YcolFwVpuxs94RB4JRg3ms";
const api = `https://api.unsplash.com/photos/?client_id=${key}`;
// `https://api.unsplash.com/photos/random/?client_id=QrOd5aoq5GxWD3kTyGcl1YcolFwVpuxs94RB4JRg3ms`
indicatorEl.innerHTML = "";
getData(api)
	.then((data) => {
		updateUL(data);
	})
	.catch((err) => {
		console.log(err);
	});
formEl.addEventListener("submit", (e) => {
	e.preventDefault();
	const text = formEl.serchText.value;

	const searchApi = `https://api.unsplash.com/search/photos?page=1&query=${text}&client_id=${key}`;
	checker(text, searchApi);
});

function checker(text, api) {
	if (text) {
		getData(api)
			.then((data) => {
				if (data.results && data.results.length == 0) {
					statusEl("red", "bunday rasm yo'q");
					list.innerHTML = "";
				} else {
					updateUL(data);
					statusEl("green", "muvaffaqiyatli");
				}
			})
			.catch((err) => {
				statusEl("red", "limit tugadi yoki xatolik");
				list.innerHTML = "";
				console.log(err);
			});
	} else {
		statusEl("red", "plece enter text");
	}
}
function statusEl(color, indicator) {
	indicatorEl.innerHTML = indicator;
	indicatorEl.style.color = `${color}`;
}
function loader(data) {
	if (data) {
		indicatorEl.innerHTML = `<p class="loadingText">Loading...</p>
	<div class="loader">
		<div class="inner one"></div>
		<div class="inner two"></div>
		<div class="inner three"></div>
	</div>`;
	} else {
		indicatorEl.innerHTML = "";
	}
}
function getData(recourse) {
	return new Promise((revolse, reject) => {
		const request = new XMLHttpRequest();
		request.addEventListener("readystatechange", () => {
			if (request.readyState < 4) {
				loader(true);
			} else if (request.readyState == 4 && request.status == 200) {
				loader(false);
				const data = JSON.parse(request.responseText);
				revolse(data);
			} else if (request.readyState == 4) {
				loader(false);
				reject("error");
			}
		});

		request.open("GET", recourse);
		request.send();
	});
}

function updateUL(data) {
	list.innerHTML = "";
	(data.results ? data.results : data).forEach((item) => {
		const { likes, urls, links, user } = item;

		list.innerHTML += `<li  class="mainItem">
        <a href = "${links.html}"><img class="itemImg" src="${
			urls.regular
		}" alt="" /></a>
        <div class="itemInfo">
            <div class="infoText">
                <p class="itemTitle">${user.name}</p>
                <p class="likes">${likes} likes</p>
            </div>
            <a class="imgLink" href="${user.links.html}">
                <img
                    class="authorImg"
                    src="${user ? user.profile_image.medium : "./nobody.png"}"
                    alt=""
                    width="15"
                    height="15" />
            </a>
        </div>
    </li>`;
	});
}
