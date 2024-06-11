/*eslint-disable */
import axios from 'axios';

import { showAlert } from '../alerts.js';

const selectedImagesCounter = document.querySelector('.amount-info');
const imagesToRemove = new Set([]);

const updateSelectedImagesCounter = () => {
  selectedImagesCounter.textContent = `Liczba zdjęc do usunięcia: ${imagesToRemove.size}`;
};

export const actionDeleteSet = (element) => {
  if (imagesToRemove.has(element.dataset.image)) {
    imagesToRemove.delete(element.dataset.image);
    element.style.opacity = 0;
  } else {
    imagesToRemove.add(element.dataset.image);
    element.style.opacity = 1;
  }
  updateSelectedImagesCounter();
};

export const deleteImages = async () => {
  try {
    const res = await axios({
      method: 'patch',
      url: 'https://drkrzysztofzieba.usermd.net/api/v1/gallery/remove',
      data: { imagesToRemove: [...imagesToRemove] },
    });
    if (res.status === 204) location.reload();
  } catch (err) {
    if (err.response) return showAlert('error', err.response.data.message);
    showAlert('error', err.message);
  }
};

export const addImages = async (images) => {
  try {
    const res = await axios({
      method: 'patch',
      url: 'https://drkrzysztofzieba.usermd.net/api/v1/gallery/',
      data: images,
    });

    if (res.data.status) location.reload();
  } catch (err) {
    if (err.response) return showAlert('error', err.response.data.message);
    showAlert('error', err.message);
  }
};
