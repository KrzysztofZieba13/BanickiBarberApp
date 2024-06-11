/* eslint-disable */
import axios from 'axios';
import { showAlert } from '../alerts.js';

export const login = async (auth) => {
  try {
    const res = await axios({
      url: 'http://drkrzysztofzieba.usermd.net/api/v1/owner/login',
      method: 'post',
      data: auth,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Zalogowano pomyślnie!');
      window.setTimeout(() => {
        location.assign('/admin');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'get',
      url: 'http://drkrzysztofzieba.usermd.net/api/v1/owner/logout',
    });

    if (res.data.status === 'success') location.assign('/');
  } catch (err) {
    showAlert('error', 'Bład wylogowywania. Spróbuj ponownie');
  }
};

export const sendResetToken = async (data) => {
  try {
    showAlert('success', 'Wysyłanie...');
    const res = await axios({
      method: 'post',
      url: 'http://drkrzysztofzieba.usermd.net/api/v1/owner/forgotPassword',
      data,
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Token wysłany na podany adres email');
    }
  } catch (err) {
    showAlert('error', 'Błąd! Spróbuj ponownie');
  }
};

export const resetPassword = async (data) => {
  try {
    const token = location.pathname.split('/')[2];
    const res = await axios({
      method: 'post',
      url: `http://drkrzysztofzieba.usermd.net/api/v1/owner/odnow-haslo/${token}`,
      data,
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Hasło zaktualizowane');
      window.setTimeout(() => {
        location.assign('/admin');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', 'Błąd! Spróbuj ponownie');
  }
};
