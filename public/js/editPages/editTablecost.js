/* eslint-disable */
import axios from "axios";
import { showAlert } from "../alerts.js";
const tablecostModal = document.querySelector(".edit--tablecost-modal");
const overlay = document.querySelector(".overlay-edit");
const closeModal = document.querySelector(".edit--close-modal");
const deleteServiceConfirmBtn = document.querySelector(
  ".delete--service-confirm"
);
const cancelServiceConfirmBtn = document.querySelector(
  ".cancel--service-confirm"
);
const deleteTablecostModal = document.querySelector(".delete--tablecost-modal");

// add once listener to cancel delete service in modal

export const addListeners = function () {
  cancelServiceConfirmBtn.addEventListener("click", (e) => {
    toggleModalEdit(deleteTablecostModal);
  });

  // add listener for 'X' button in edit modal
  closeModal.addEventListener("click", (e) => {
    toggleModalEdit(e.target.closest(".edit-modal"));
  });
};

export const deleteService = async function (serviceID, modal) {
  deleteServiceConfirmBtn.addEventListener("click", async () => {
    try {
      const res = await axios({
        method: "delete",
        url: `/api/v1/service/${serviceID}`,
      });
      if (res.data.status === "success") location.reload();
      toggleModalEdit(modal);
    } catch (err) {
      if (err.response) return showAlert("error", err.response.data.message);
      showAlert("error", err.message);
    }
  });
};

export const toggleModalEdit = function (modal) {
  overlay.classList.toggle("hidden");
  modal.classList.toggle("hidden");
};

export const updateTablecost = async function (data, serviceID) {
  try {
    if (data.price) data.price = +data.price;
    const res = await axios({
      method: "patch",
      url: `/api/v1/service/${serviceID}`,
      data,
    });
    toggleModalEdit(tablecostModal);
    if (res.data.status === "success") location.reload();
  } catch (err) {
    if (err.response) return showAlert("error", err.response.data.message);
    showAlert("error", err.message);
  }
};

export const addTablecost = async function (data) {
  try {
    if (!data.titlePL || !data.titleEN || !data.price)
      throw new Error("Nie wprowadzono wszystkich danych.");
    if (data.price) data.price = +data.price;
    const res = await axios({
      method: "post",
      url: "/api/v1/service/",
      data,
    });

    if (res.data.status === "success") location.reload();
  } catch (err) {
    if (err.response) return showAlert("error", err.response.data.message);
    showAlert("error", err.message);
  }
};
