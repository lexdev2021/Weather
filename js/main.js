import {UI_ELEMENT, NOW, DETAILS} from './view.js';
import {STORAGE} from './storage.js';

const URL = {
    WEATHER         : 'http://api.openweathermap.org/data/2.5/weather',
    WEATHER_FORECAST: 'http://api.openweathermap.org/data/2.5/forecast',
    API_KEY         : 'f660a2fb1e4bad108d6160b7f58c555f',
    ICON_WEATHER    : 'http://openweathermap.org/img/wn/',
}



UI_ELEMENT.FORM_SEARCH.addEventListener('submit', getWeatherCity);
UI_ELEMENT.BUTTON_FAVORITE.addEventListener('click', addFavoriteCity);

function getWeatherCity() {
    const cityName = UI_ELEMENT.INPUT_SEARCH.value;
    const url = `${URL.WEATHER}?q=${cityName}&appid=${URL.API_KEY}&units=metric`;
    const urlForecast = `${URL.WEATHER_FORECAST}?q=${cityName}&appid=${URL.API_KEY}&units=metric`;

    fetch(url)
    .then(response => response.json())
    .then(renderWeather)
    .catch(alert)

    fetch(urlForecast)
    .then(response => response.json())
    .then(renderWeatherForecast)
}

function renderWeather(res) {
    const isNotCityName = !res.name;
    if(isNotCityName) throw new Error('invalid city name!');

    NOW.TEMPERATURE.textContent = `${Math.round(res.main.temp)}°`;
    NOW.ICON_WEATHER.src = `${URL.ICON_WEATHER}${res.weather[0].icon}@4x.png`;
    NOW.CITY_NAME.textContent = res.name;

    DETAILS.CITY_NAME.textContent = res.name;
    DETAILS.TEMPERATURE.textContent = `Temperature: ${Math.round(res.main.temp)}°`;
    DETAILS.FEELS_LIKE.textContent = `Feels like: ${Math.round(res.main.feels_like)}°`;
    DETAILS.WEATHER.textContent = `Weather: ${res.weather[0].main}`;
    DETAILS.SUNRISE.textContent = `Sunrise: ${convertTime(res.sys.sunrise)}`;
    DETAILS.SUNSET.textContent = `Sunset: ${convertTime(res.sys.sunset)}`;

    STORAGE.setCurrentCity(res.name);
}

function renderWeatherForecast(res) {

    for (let i = 0; i < 3; i++) {
        
        const FORECAST = {
            CITY_NAME   : document.querySelector('.forecast-location'),
            DATE        : document.querySelector(`.date-block-${i}`),
            TEMPERATURE : document.querySelector(`.temp-block-${i}`),
            FEELS_LIKE  : document.querySelector(`.feelslike-block-${i}`),
            TIME        : document.querySelector(`.time-block-${i}`),
            WEATHER     : document.querySelector(`.weather-block-${i}`),
            ICON_WEATHER: document.querySelector(`.icon-block-${i}`),
        }

        FORECAST.CITY_NAME.textContent = res.city.name;
        FORECAST.DATE.textContent = convertDate(res.list[i].dt);
        FORECAST.TEMPERATURE.textContent = `Temperature: ${Math.round(res.list[i].main.temp)}`;
        FORECAST.FEELS_LIKE.textContent = `Feels like: ${Math.round(res.list[i].main.feels_like)}`;
        FORECAST.TIME.textContent = convertTime(res.list[i].dt);
        FORECAST.WEATHER.textContent = res.list[i].weather[0].main;
        FORECAST.ICON_WEATHER.src = `${URL.ICON_WEATHER}${res.list[i].weather[0].icon}@4x.png`
    }
}

function addFavoriteCity() {
    let favoriteCities = STORAGE.getFavoriteCities();
    const currentCity = NOW.CITY_NAME.textContent;
    if (favoriteCities === null) favoriteCities = [];
    const cityInFavoriteCities = favoriteCities.find(item => item === currentCity);
    if (!cityInFavoriteCities) {
        favoriteCities.push(currentCity);
    }
    STORAGE.setFavoriteCities(favoriteCities);
    renderFavoriteCity();
}

function removeFavoriteCity() {
    let favoriteCities = STORAGE.getFavoriteCities();
    const city = this.previousElementSibling.textContent;
    const index = favoriteCities.indexOf(city);
    console.log(index);
    favoriteCities.splice(index, 1);
    STORAGE.setFavoriteCities(favoriteCities);
    renderFavoriteCity();
}

function renderFavoriteCity() {
    
    let favoriteCities = STORAGE.getFavoriteCities();
    UI_ELEMENT.LIST_CITY.innerHTML = '';
    favoriteCities.forEach(item => {
        const favoriteCity = document.createElement('div');
        favoriteCity.className = 'favorite-city';
        favoriteCity.innerHTML = `<span class="loc-elem">${item}</span>
        <button class="btn-delete"><img src="img/delete-icon.svg" alt="Delete city"></button>`
        UI_ELEMENT.LIST_CITY.append(favoriteCity);

        favoriteCity.querySelector('.loc-elem').addEventListener('click', function() {
            UI_ELEMENT.INPUT_SEARCH.value = this.textContent;
            getWeatherCity();
        })
        favoriteCity.querySelector('.btn-delete').addEventListener('click', removeFavoriteCity);
    })
    STORAGE.setFavoriteCities(favoriteCities);
}

function showCurrentCity() {
    UI_ELEMENT.INPUT_SEARCH.value = STORAGE.getCurrentCity();
    getWeatherCity();
}

function convertTime(arg) {
    const date = new Date(arg*1000);
    const hours = date.getHours();
    const minutes = `0${date.getMinutes()}`.slice(-2);
    return `${hours}:${minutes}`;
}

function convertDate(arg) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December ',]
    const date = new Date(arg*1000);
    const day = date.getDate();
    const month = months[date.getMonth()];
    return `${day} ${month}`;
}

showCurrentCity()
renderFavoriteCity()



























/* import {UI, NOW, DETAILS} from './view.js';

const URL = {
    SERVER_WEATHER : 'http://api.openweathermap.org/data/2.5/weather',
    SERVER_FORECAST: 'http://api.openweathermap.org/data/2.5/forecast',
    API_KEY        : 'f660a2fb1e4bad108d6160b7f58c555f',
    ICON_WEATHER   : 'http://openweathermap.org/img/wn/',
}

UI.FORM_SEARCH.addEventListener('submit', getWeather);
UI.BUTTON_FAVORITE.addEventListener('click', addFavoriteCity);

function getWeather() {
    
    const cityName = UI.INPUT_SEARCH.value;
    const url = `${URL.SERVER_WEATHER}?q=${cityName}&appid=${URL.API_KEY}&units=metric`;
    const urlForecast = `${URL.SERVER_FORECAST}?q=${cityName}&appid=${URL.API_KEY}&units=metric`;

    fetch(url)
    .then(response => response.json())
    // .then(res => console.log(res))
    .then(renderWeather)
    .catch(alert)

    fetch(urlForecast)
    .then(response => response.json())
    // .then(res => console.log(res))
    .then(renderWeatherForecast)
}

function renderWeather(res) {

    const isNotCityName = !res.name;
    if(isNotCityName) throw new Error('Invalid city name!');

    NOW.TEMPERATURE.textContent = `${Math.round(res.main.temp)}°`;
    NOW.ICON_WEATHER.src = `${URL.ICON_WEATHER}${res.weather[0].icon}@4x.png`;
    NOW.CITY_NAME.textContent = res.name;

    DETAILS.CITY_NAME.textContent = res.name;
    DETAILS.TEMPERATURE.textContent = `Temperature: ${Math.round(res.main.temp)}°`;
    DETAILS.FEELS_LIKE.textContent = `Feels Like: ${Math.round(res.main.feels_like)}°`;
    DETAILS.WEATHER.textContent = `Weather: ${res.weather[0].main}`;
    DETAILS.SUNRISE.textContent = `Sunrise: ${convertTime(res.sys.sunrise)}`;
    DETAILS.SUNSET.textContent = `Sunset: ${convertTime(res.sys.sunset)}`;
}

function renderWeatherForecast(res) {
    for (let i = 0; i < 3; i++) {
        
        const FORECAST = {
            CITY_NAME   : document.querySelector('.forecast-location'),
            DATE        : document.querySelector(`.date-block-${i}`),
            TEMPERATURE : document.querySelector(`.temp-block-${i}`),
            FEELS_LIKE  : document.querySelector(`.feelslike-block-${i}`),
            TIME        : document.querySelector(`.time-block-${i}`),
            WEATHER     : document.querySelector(`.weather-block-${i}`),
            ICON_WEATHER: document.querySelector(`.icon-block-${i}`),
        }

        FORECAST.CITY_NAME.textContent = res.city.name;
        FORECAST.DATE.textContent = convertDate(res.list[i].dt);
        FORECAST.TEMPERATURE.textContent = `Temperature: ${Math.round(res.list[i].main.temp)}°`;
        FORECAST.FEELS_LIKE.textContent = `Feels like: ${Math.round(res.list[i].main.feels_like)}°`;
        FORECAST.TIME.textContent = `${convertTime(res.list[i].dt)}`;
        FORECAST.WEATHER.textContent = `${res.list[i].weather[0].main}`;
        FORECAST.ICON_WEATHER.src = `${URL.ICON_WEATHER}${res.list[i].weather[0].icon}@4x.png`
    }
}

function addFavoriteCity() {
    const cityFavorite = document.createElement('div');
    cityFavorite.className = 'favorite-city';
    cityFavorite.innerHTML = `<span class="loc-elem">${NOW.CITY_NAME.textContent}</span>
    <button class="btn-delete"><img src="img/delete-icon.svg" alt=""></button>`;
    UI.LIST_FAVORITE.append(cityFavorite);

    cityFavorite.querySelector('.btn-delete').addEventListener('click', removeFavoriteCity);
    function removeFavoriteCity() {
        cityFavorite.remove();
    }
}

function convertTime(arg) {
    const date = new Date(arg*1000);
    const hours = date.getHours();
    const minutes =('0' + date.getMinutes()).slice(-2);
    return `${hours}:${minutes}`;
}

function convertDate(arg) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December ',];
    const date = new Date(arg*1000);
    const day = date.getDate();
    const month = months[date.getMonth()];
    return `${day} ${month}`;
} */































/* import {UI, NOW, DETAILS} from './view.js';

const URL = {
    WEATHER     : 'http://api.openweathermap.org/data/2.5/weather',
    FORECAST    : 'http://api.openweathermap.org/data/2.5/forecast',
    API_KEY     : 'f660a2fb1e4bad108d6160b7f58c555f',
    ICON_WEATHER: 'http://openweathermap.org/img/wn/',
}

UI.FORM_SEARCH.addEventListener('submit', getWeatherCity);
UI.BTN_FAVORITE.addEventListener('click', addFavoriteCity);

function getWeatherCity() {

    const cityName = UI.INPUT_SEARCH.value;
    const url = `${URL.WEATHER}?q=${cityName}&appid=${URL.API_KEY}&units=metric`;
    const urlForecast = `${URL.FORECAST}?q=${cityName}&appid=${URL.API_KEY}&units=metric`;

    fetch(url)
    .then(response => response.json())
    .then(renderWeather)
    .catch(alert)

    fetch(urlForecast)
    .then(response => response.json())
    .then(renderWeatherForecast)
}

function renderWeather(res) {

    const isNotCityName = !res.name;
    if(isNotCityName) throw new Error('Invalid city name!');

    NOW.TEMPERATURE.textContent = Math.round(res.main.temp) + '°';
    NOW.ICON_WEATHER.src = `${URL.ICON_WEATHER}${res.weather[0].icon}@4x.png`;
    NOW.CITY_NAME.textContent = res.name;

    DETAILS.CITY_NAME.textContent = res.name;
    DETAILS.TEMPERATURE.textContent = `Temperature: ${Math.round(res.main.temp)}°`;
    DETAILS.FEELS_LIKE.textContent = `Feels like: ${Math.round(res.main.feels_like)}°`;
    DETAILS.WEATHER.textContent = `Weather: ${res.weather[0].main}`;
    DETAILS.SUNRISE.textContent = `Sunrise: ${convertTime(res.sys.sunrise)}`;
    DETAILS.SUNSET.textContent = `Sunset: ${convertTime(res.sys.sunset)}`;
}

function renderWeatherForecast(res) {

    for (let i = 0; i < 3; i++) {
        
        const FORECAST = {
            CITY_NAME   : document.querySelector('.forecast-location'),
            DATE        : document.querySelector(`.date-block-${i}`),
            TEMPERATURE : document.querySelector(`.temp-block-${i}`),
            FEELS_LIKE  : document.querySelector(`.feelslike-block-${i}`),
            TIME        : document.querySelector(`.time-block-${i}`),
            WEATHER     : document.querySelector(`.weather-block-${i}`),
            ICON_WEATHER: document.querySelector(`.icon-block-${i}`),
        }

        FORECAST.CITY_NAME.textContent = res.city.name;
        FORECAST.DATE.textContent = convertDate(res.list[i].dt);
        FORECAST.TEMPERATURE.textContent = `Temperature: ${Math.round(res.list[i].main.temp)}°`;
        FORECAST.FEELS_LIKE.textContent = `Feels like: ${Math.round(res.list[i].main.feels_like)}°`;
        FORECAST.TIME.textContent = convertTime(res.list[i].dt);
        FORECAST.WEATHER.textContent = res.list[i].weather[0].main;
        FORECAST.ICON_WEATHER.src = `${URL.ICON_WEATHER}${res.list[i].weather[0].icon}@4x.png`;
    }
}

function addFavoriteCity() {
    const cityFavorite = document.createElement('div');
    cityFavorite.className = 'favorite-city';
    cityFavorite.innerHTML = `<span class="loc-elem">${NOW.CITY_NAME.textContent}</span>
    <button class="btn-delete"><img src="img/delete-icon.svg" alt="Delete icon"></button>`
    UI.LIST_FAVORITE.append(cityFavorite);

    cityFavorite.querySelector('.btn-delete').addEventListener('click', removeFavoriteCity);
    function removeFavoriteCity() {
        cityFavorite.remove();
    }
}

function convertTime(arg) {
    const date = new Date(arg*1000);
    const hours = date.getHours();
    const minutes = ('0' + date.getMinutes()).slice(-2);
    return `${hours}:${minutes}`;
}

function convertDate(arg) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December ',];
    const date = new Date(arg*1000);
    const day = date.getDate();
    const month = months[date.getMonth()];
    return `${day} ${month}`;
} */ 
 





































/* import {UI, NOW, DETAILS} from './view.js';

const URL = {
    WEATHER     : 'http://api.openweathermap.org/data/2.5/weather',
    FORECAST    : 'http://api.openweathermap.org/data/2.5/forecast',         
    API_KEY     : 'f660a2fb1e4bad108d6160b7f58c555f',
    ICON_WEATHER: 'http://openweathermap.org/img/wn/',
}

UI.FORM_SEARCH.addEventListener('submit', getWeatherCity);

function getWeatherCity() {
    const cityName = UI.INPUT_SEARCH.value;
    const url = `${URL.WEATHER}?q=${cityName}&appid=${URL.API_KEY}&units=metric`;
    const urlForecast = `${URL.FORECAST}?q=${cityName}&appid=${URL.API_KEY}&units=metric`;              
    
    fetch(url)
    .then(response => response.json())
    // .then(res => console.log(res))
    .then(renderWeatherCity)
    .catch(alert)

    fetch(urlForecast)
    .then(response => response.json())
    // .then(res => console.log(res))
    .then(renderWeatherForecast)
}

function renderWeatherCity(res) {
    const isNotCityName = !res.name;
    if(isNotCityName) throw new Error('Invalid city name!');

    NOW.TEMPERATURE.textContent = Math.round(res.main.temp) + '°';
    NOW.ICON_WEATHER.src = `${URL.ICON_WEATHER}${res.weather[0].icon}@4x.png`;
    NOW.CITY_NAME.textContent = res.name;

    DETAILS.CITY_NAME.textContent = res.name;
    DETAILS.TEMPERATURE.textContent = 'Temperature: ' + Math.round(res.main.temp) + '°';
    DETAILS.FEELS_LIKE.textContent = 'Feels Like: ' + Math.round(res.main.feels_like) + '°';
    DETAILS.WEATHER.textContent = 'Weather: ' + res.weather[0].main;
    DETAILS.SUNRISE.textContent = 'Sunrise: ' + convertTime(res.sys.sunrise);
    DETAILS.SUNSET.textContent = 'Sunset: ' + convertTime(res.sys.sunset);
}

function renderWeatherForecast(res) {
    for (let i = 0; i < 3; i++) {

        const FORECAST = {
            CITY_NAME   : document.querySelector('.forecast-location'),
            DATE        : document.querySelector(`.date-block-${i}`),
            TEMPERATURE : document.querySelector(`.temp-block-${i}`),
            FEELS_LIKE  : document.querySelector(`.feelslike-block-${i}`),
            TIME        : document.querySelector(`.time-block-${i}`),
            WEATHER     : document.querySelector(`.weather-block-${i}`),
            ICON_WEATHER: document.querySelector(`.icon-block-${i}`),
        }

        FORECAST.CITY_NAME.textContent = res.city.name;
        FORECAST.DATE.textContent = convertDate(res.list[i].dt);
        FORECAST.TEMPERATURE.textContent = `Temperature: ${Math.round(res.list[i].main.temp)}°`;
        FORECAST.FEELS_LIKE.textContent = `Feels like: ${Math.round(res.list[i].main.feels_like)}°`;
        FORECAST.TIME.textContent = convertTime(res.list[i].dt);
        FORECAST.WEATHER.textContent = res.list[i].weather[0].main;
        FORECAST.ICON_WEATHER.src = `${URL.ICON_WEATHER}${res.list[i].weather[0].icon}@4x.png`;
    }
}

UI.BTN_FAVORITE.addEventListener('click', addFavoriteCity);
function addFavoriteCity() {
    const cityFavorite = document.createElement('div');
    cityFavorite.className = 'favorite-city';
    cityFavorite.innerHTML = `<span class="loc-elem">${NOW.CITY_NAME.textContent}</span>
    <button class="btn-delete"><img src="img/delete-icon.svg" alt="Delete city"></button>`
    UI.LIST_FAVORITE.append(cityFavorite);

    cityFavorite.querySelector('.btn-delete').addEventListener('click', removeFavoriteCity);
    function removeFavoriteCity() {
        cityFavorite.remove();
    }
}

function convertTime(arg) {
    const date = new Date(arg*1000);
    const hours = date.getHours();
    const minutes = ('0' + date.getMinutes()).slice(-2);
    return `${hours}:${minutes}`;
}

function convertDate(arg) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December ',]
    const date = new Date(arg*1000);
    const month = months[date.getMonth()];
    const day = date.getDate();
    return `${day} ${month}`;
} */



































// NOW.WEATHER.src = `${URL.ICON_WEATHER}${res.weather[0].icon}@4x.png`;






























/* const URL = {
    SERVER : 'http://api.openweathermap.org/data/2.5/weather',
    API_KEY: 'f660a2fb1e4bad108d6160b7f58c555f',
    ICON_WEATHER: 'https://openweathermap.org/img/wn/',
}
const UI = {
    FORM_SEARCH : document.querySelector('.weather__search'),
    INPUT_SEARCH: document.querySelector('.input-search'),
}
const NOW = {
    TEMPERATURE  : document.querySelector('.temperature'),
    WEATHER      : document.querySelector('.icon-weather-img'),
    NAME_LOCATION: document.querySelector('.now-location'),
}


UI.FORM_SEARCH.addEventListener('submit', getWeatherCity);

function getWeatherCity() {

    const cityName = UI.INPUT_SEARCH.value;
    const url = `${URL.SERVER}?q=${cityName}&appid=${URL.API_KEY}`;

    fetch(url)
    .then(result => result.json())
    // .then(a => console.log(a))
    .then(renderWeather)
    .catch(alert)
}

function renderWeather(result) {

    NOW.TEMPERATURE.textContent = Math.round(result.main.temp-273) + '°';
    NOW.WEATHER.src = `${URL.ICON_WEATHER}${result.weather[0].icon}@4x.png`;
    NOW.NAME_LOCATION.textContent = result.name;

} */

/* const serverUrl = 'http://api.openweathermap.org/data/2.5/weather';
const cityName = 'boston';
const apiKey = 'f660a2fb1e4bad108d6160b7f58c555f';
const url = ${serverUrl}?q=${cityName}&appid=${apiKey}; */

