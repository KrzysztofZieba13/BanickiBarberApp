/* eslint-disable*/
const map = L.map('map').setView([50.027019, 21.9915], 18);

L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

const marker = L.marker([50.02697, 21.99156]).addTo(map);
