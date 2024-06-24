/* eslint-disable */
import axios from "axios";

import { showAlert } from "../alerts.js";

export const updateLandingPage = async function (data) {
  try {
    if (Object.keys(data).length === 0)
      throw new Error("Nie wprowadzono danych.");
    const res = await axios({
      method: "patch",
      url: "/api/v1/landingPage",
      data,
    });
    if (res.data.status === "success") {
      showAlert("success", `Strona Zaktualizowana`);
    }
  } catch (err) {
    if (err.response) return showAlert("error", err.response.data.message);
    showAlert("error", err.message);
  }
};
