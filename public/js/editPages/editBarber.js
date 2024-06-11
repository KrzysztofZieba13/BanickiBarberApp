/*eslint-disable */
import axios from 'axios';

import { showAlert } from '../alerts.js';

export const updateBarber = async function (data, isPhoto = false) {
  try {
    if (Object.keys(data).length === 0 && !isPhoto)
      throw new Error('Żadne dane nie zostały zaktualizowane.');
    const res = await axios({
      method: 'patch',
      url: 'https://drkrzysztofzieba.usermd.net/api/v1/owner',
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', `Dane zaktualizowane`);
    }
  } catch (err) {
    showAlert('error', err.message);
  }
};

export const updateBarberPassword = async function (data) {
  try {
    if (Object.keys(data).length === 0)
      throw new Error('Brak danych, hasło nie zostało zaktualizowane.');

    const res = await axios({
      method: 'patch',
      url: 'https://drkrzysztofzieba.usermd.net/api/v1/owner/updateMyPassword',
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', `Hasło zaktualizowane`);
    }
  } catch (err) {
    if (err.response) return showAlert('error', err.response.data.message);
    showAlert('error', err.message);
  }
};
