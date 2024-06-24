/*eslint-disable */
import axios from "axios";

const overlay = document.querySelector(".overlay-edit");
const editModal = document.querySelector(".edit--openhours-modal");

export const toggleModal = () => {
  overlay.classList.toggle("hidden");
  editModal.classList.toggle("hidden");
};

export const updateOpenHour = async (data, openhourID) => {
  try {
    const res = await axios({
      method: "patch",
      url: `/api/v1/openHours/${openhourID}`,
      data,
    });

    if (res.data.status === "success") location.reload();
  } catch (err) {
    if (err.response) return showAlert("error", err.response.data.message);
    showAlert("error", err.message);
  }
};
