export const STORAGE = {

    setCurrentCity(city) {
        return localStorage.setItem('currentCity', JSON.stringify(city));
    },

    getCurrentCity() {
        return JSON.parse(localStorage.getItem('currentCity'));
    },

    setFavoriteCities(city) {
        return localStorage.setItem('favoriteCity', JSON.stringify(city));
    },

    getFavoriteCities() {
        return JSON.parse(localStorage.getItem('favoriteCity'));
    },
}