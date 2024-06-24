/*eslint-disable */
import axios from "axios";

import { showAlert } from "../alerts.js";

const update = async (data) => {
  try {
    const res = await axios({
      method: "patch",
      url: "/api/v1/landingPage/",
      data: data,
    });

    return res;
  } catch (err) {
    throw new Error(err.response.data.message);
  }
};

export const updateCoordinates = async (data) => {
  try {
    if (!data.lng || !data.lat)
      throw new Error("Wprowadź współrzędne Lat i Lng!");
    const location = { coordinates: [+data.lng, +data.lat] };

    const res = await update({ location });

    if (res.data.status === "success")
      showAlert("success", "Współrzędne zaktualizowane");
  } catch (err) {
    if (err.response) return showAlert("error", err.response.data.message);
    showAlert("error", err.message);
  }
};

export const updateRouteLink = async (link) => {
  try {
    if (!link.routeLink) throw new Error("Wprowadź poprawny link do trasy");
    const location = link;
    const res = await update({ location });

    if (res.data.status === "success")
      showAlert("success", "Trasa zaktualizowana");
  } catch (err) {
    if (err.response) return showAlert("error", err.response.data.message);
    showAlert("error", err.message);
  }
};
