import playList from "./playList.js";

const time = document.querySelector(".time");
const date = document.querySelector(".date");
const greeting = document.querySelector(".greeting");
const name = document.querySelector(".name");
const body = document.querySelector("body");
const slidePrev = document.querySelector(".slide-prev");
const slideNext = document.querySelector(".slide-next");
const weatherIcon = document.querySelector(".weather-icon");
const temperature = document.querySelector(".temperature");
const weatherDescription = document.querySelector(".weather-description");
const weatherError = document.querySelector(".weather-error");
const city = document.querySelector(".city");
const wind = document.querySelector(".wind");
const humidity = document.querySelector(".humidity");
const quote = document.querySelector(".quote");
const author = document.querySelector(".author");
const changeQuote = document.querySelector(".change-quote");

const play = document.querySelector(".play");
const playNextBtn = document.querySelector(".play-next");
const playPrevBtn = document.querySelector(".play-prev");
const playListUl = document.querySelector(".play-list");

const modal = document.querySelector(".modal");
const myPopup = document.querySelector(".myPopup");
const popupBtn = document.querySelector(".popupBtn");
const closePopup = document.querySelector(".closePopup");

let language = "ru";
let source = "collection";

const lang = document.querySelector(".selectLang");
const photoSource = document.querySelector(".photoSource");

// document.querySelector(".language");
photoSource.addEventListener("change", function () {
	source = this.value;
	updateBackground(source);
});

lang.addEventListener("change", function () {
	language = this.value;

	getWeather();
	showGreeting();
	getQuotes();
});

let randomNum;
let isPlay = false;
let playNum = 0;

// time date

function showTime() {
	time.innerHTML = new Date().toLocaleTimeString();
	setTimeout(showTime, 1000);

	const options = { weekday: "long", month: "long", day: "numeric" };

	function showDate() {
		date.innerHTML = new Date().toLocaleDateString(lang.value, options);
	}
	showDate();
}

showTime();

//greeting

function getTimeOfDay() {
	const hours = new Date().getHours();
	if (hours >= 0 && hours < 6) {
		return "night";
	} else if (hours >= 6 && hours < 12) {
		return "morning";
	} else if (hours >= 12 && hours < 18) {
		return "afternoon";
	} else {
		return "evening";
	}
}

const timeOfDay = getTimeOfDay();

//translation
const greetingTranslation = {
	ru: {
		night: "Доброй ночи",
		afternoon: "Добрый день",
		morning: "Доброе утро",
		evening: "Добрый вечер ",
		windSpeed: "Скорость ветра",
		humidity: "Влажность",
	},
	en: {
		night: "Good night",
		afternoon: "Good afternoon",
		morning: "Good morning",
		evening: "Good evening ",
		windSpeed: "Wind speed",
		humidity: "Humidity: ",
	},
};

function showGreeting() {
	greeting.innerHTML = greetingTranslation[lang.value][timeOfDay];
}
showGreeting();

function setLocalStorage() {
	localStorage.setItem("name", name.value);
	localStorage.setItem("city", city.value);
	localStorage.setItem("language", lang.value);
}
window.addEventListener("beforeunload", setLocalStorage);

function getLocalStorage() {
	if (localStorage.getItem("name")) {
		name.value = localStorage.getItem("name");
	}
	if (localStorage.getItem("city")) {
		city.value = localStorage.getItem("city");
	}
	if (localStorage.getItem("language")) {
		lang.value = localStorage.getItem("language");
		language = localStorage.getItem("language");
	}

	getWeather();
	showGreeting();
	getQuotes();
}
window.addEventListener("load", getLocalStorage);

//background
randomNum = getRandomNum(20);

updateBackground();

slideNext.addEventListener("click", () => {
	getSlideNext();
});
slidePrev.addEventListener("click", () => {
	getSlidePrev();
});

function getRandomNum(maxNum) {
	return Math.floor(Math.random() * maxNum) + 1;
}

function numberWithPadstart() {
	return randomNum.toString().padStart(2, "0");
}

function getSlideNext() {
	if (parseInt(randomNum) === 20) {
		randomNum = 0;
	}
	randomNum = parseInt(randomNum) + 1;
	updateBackground();
}

function getSlidePrev() {
	if (parseInt(randomNum) === 1) {
		randomNum = 21;
	}
	randomNum = parseInt(randomNum) - 1;
	updateBackground();
}

async function updateBackground(source) {
	if (source === "collection") {
		body.style.backgroundImage = `url('https://raw.githubusercontent.com/Tsvetinskaya-L/stage1-tasks/assets/images/${timeOfDay}/${numberWithPadstart()}.jpg')`;
	}
	if (source === "unsplash") {
		const xx = await getLinkToImageUnsplash();
		body.style.backgroundImage = `url(${xx})`;
	} else {
		const yy = await getLinkToImageFlickr();
		body.style.backgroundImage = `url(${yy})`;
	}

	body.style.backgroundSize = "cover";
	body.style.transition = "all 1s";
}

//weather

async function getWeather() {
	weatherError.textContent = "";
	if (!city.value) {
		temperature.textContent = "";
		weatherDescription.textContent = "";
		wind.textContent = "";
		humidity.textContent = "";

		return;
	}
	try {
		const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=${lang.value}&appid=f335c1a65415dcd131dbdc061475f0fc&units=metric`;
		const res = await fetch(url);
		const data = await res.json();

		weatherIcon.className = "weather-icon owf";
		weatherIcon.classList.add(`owf-${data.weather[0].id}`);
		temperature.textContent = `${parseInt(data.main.temp)}°C`;
		weatherDescription.textContent = data.weather[0].description;
		wind.textContent =
			greetingTranslation[lang.value]["windSpeed"] +
			`: ${parseInt(data.wind.speed)} m/s`;
		humidity.textContent =
			greetingTranslation[lang.value]["humidity"] +
			` ${parseInt(data.main.humidity)}%`;
	} catch (e) {
		weatherError.textContent = `Error! city not found for ${city.value} !!!`;
		temperature.textContent = "";
		weatherDescription.textContent = "";
		wind.textContent = "";
		humidity.textContent = "";
	}
}

function setCity(event) {
	if (event.key === "Enter") {
		getWeather();
		city.blur();
	}
}

document.addEventListener("DOMContentLoaded", getWeather);
city.addEventListener("keypress", setCity);

//quote

async function getQuotes() {
	randomNum = getRandomNum(6);
	const quotes = "./quote.json";
	const res = await fetch(quotes);
	const quotesArr = await res.json();
	if (lang.value === "ru") {
		quote.textContent = quotesArr[randomNum].ru_text;
		author.textContent = quotesArr[randomNum].ru_author;
	} else {
		quote.textContent = quotesArr[randomNum].en_text;
		author.textContent = quotesArr[randomNum].en_author;
	}
}
getQuotes();

changeQuote.addEventListener("click", () => {
	getQuotes();
});

//player

const player = {
	state: "stop",
	trackIndex: 0,
	tracksLength: playList.length - 1,
};

// init play
const audio = new Audio();
audio.src = playList[player.trackIndex].src;
audio.addEventListener("ended", function () {
	playNextHandler();
});

playPrevBtn.addEventListener("click", playPrevHandler);
play.addEventListener("click", playButtonHandler);
playNextBtn.addEventListener("click", playNextHandler);

function playButtonHandler() {
	if (player.state === "stop") {
		setPlayButtonState("play");
	} else {
		setPlayButtonState("stop");
	}
}

function playNextHandler() {
	if (player.trackIndex < player.tracksLength) {
		player.trackIndex++;
	} else {
		player.trackIndex = 0;
	}

	audio.src = playList[player.trackIndex].src;
	setPlayButtonState("play");
}

function playPrevHandler() {
	if (player.trackIndex === 0) {
		player.trackIndex = player.tracksLength;
	} else {
		player.trackIndex--;
	}
	audio.src = playList[player.trackIndex].src;
	setPlayButtonState("play");
}

function setPlayButtonState(state) {
	if (state === "play") {
		audio.play();
		play.classList.remove("play");
		play.classList.add("pause");
		player.state = "play";
	} else {
		audio.pause();
		play.classList.remove("pause");
		play.classList.add("play");
		player.state = "stop";
	}

	updateCurrentTrack();
}

function updateCurrentTrack() {
	const nodes = Array.from(playListUl.childNodes);
	nodes.forEach((item) => {
		if (item.classList?.contains("play-item")) {
			item.classList.remove("play-current");
		}
	});

	nodes[player.trackIndex + 1].classList.add("play-current");
}

//playList

playList.forEach((_, index) => {
	const li = document.createElement("li");
	li.classList.add("play-item");
	li.textContent = `${playList[index].title}`;
	playListUl.appendChild(li);
});

//api

async function getLinkToImageUnsplash() {
	const url =
		"https://api.unsplash.com/photos/random?orientation=landscape&query=nature&client_id=_dJTyGQOLHO4XTB0piDljZe0LQR0x-YdIaKhCJKoIFw";
	const res = await fetch(url);
	const data = await res.json();
	return data.urls.regular;
	console.log(
		"есть возможность вывода фонового изображения  Unsplash API " +
			data.urls.regular
	);
}
getLinkToImageUnsplash();

async function getLinkToImageFlickr() {
	const url =
		"https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=80a37ee301e50f219a41115d5eefe9d1&tags=nature&extras=url_l&format=json&nojsoncallback=1";
	const res = await fetch(url);
	const data = await res.json();
	return data.photos.photo[Math.floor(Math.random() * 90 + 1)].url_l;
	console.log(
		"есть возможность вывода фонового изображения  Flickr API " +
			data.photos.photo[Math.floor(Math.random() * 90 + 1)].url_l
	);
}
getLinkToImageFlickr();

//setting

popupBtn.onclick = function () {
	myPopup.style.display = "block";
};

closePopup.onclick = function () {
	myPopup.style.display = "none";
};

//todo

const todoInput = document.querySelector(".todo-input");
const addTodoButton = document.querySelector(".add-todo-button");
const todoList = document.querySelector(".todo-list");

let createElements = (value) => {
	const todoDiv = document.createElement("div");
	todoDiv.classList.add("todo");

	const newTodo = document.createElement("li");
	newTodo.innerText = value;
	newTodo.classList.add("todo-item");

	todoDiv.appendChild(newTodo);

	const checkButton = document.createElement("button");
	checkButton.classList.add("fas", "fa-check", "check-btn");

	todoDiv.appendChild(checkButton);

	const deleteButton = document.createElement("button");
	deleteButton.classList.add("fas", "fa-trash", "delete-btn");
	todoDiv.appendChild(deleteButton);

	todoList.appendChild(todoDiv);
};

function addTodo(e) {
	e.preventDefault();

	createElements(todoInput.value);

	saveTodoInLocalStorage(todoInput.value);

	todoInput.value = "";
}

let checkOrDelete = (e) => {
	const item = e.target;

	if (item.classList[2] === "check-btn") {
		const todo = item.parentElement;

		todo.classList.toggle("check");
		
	}

	if (item.classList[2] === "delete-btn") {
		const todo = item.parentElement;
		removeTodoFromLocalStorage(todo);
		todo.remove();
	}
};

let existOrNot = () => {
	let items;
	if (localStorage.getItem("items") === null) {
		items = [];
	} else {
		items = JSON.parse(localStorage.getItem("items"));
	}
	return items;
};

let saveTodoInLocalStorage = (item) => {
	let items = existOrNot();
	items.push(item);

	localStorage.setItem("items", JSON.stringify(items));
};

let getTodoFromLocalStorage = () => {
	let items = existOrNot();

	items.forEach((item) => {
		createElements(item);
	});
};

let removeTodoFromLocalStorage = (item) => {
	let items = existOrNot();
	const itemIndex = item.children[0].innerText;
	items.splice(items.indexOf(itemIndex), 1);
	localStorage.setItem("items", JSON.stringify(items));
};

document.addEventListener("DOMContentLoaded", getTodoFromLocalStorage);
addTodoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", checkOrDelete);
