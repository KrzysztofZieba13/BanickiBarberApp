/* eslint-disable*/
import * as L from 'leaflet';

export const displayMap = (location) => {
  const map = L.map('map').setView(
    [location.coordinates[1], location.coordinates[0]],
    18,
  );

  L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  const marker = L.marker([
    location.coordinates[1],
    location.coordinates[0],
  ]).addTo(map);
};
