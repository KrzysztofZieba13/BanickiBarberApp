/* eslint-disable */
import * as nav from "./navigation.js";
import * as smoothScrolling from "./smoothScrolling.js";
import { getGalleryImages } from "./gallery.js";
import { updateLandingPage } from "./editPages/editLandingPage.js";
import { updateBarber, updateBarberPassword } from "./editPages/editBarber.js";
import * as editTablecost from "./editPages/editTablecost.js";
import * as editOpenhours from "./editPages/editOpenhours.js";
import * as editMapRoute from "./editPages/editMapRoute.js";
import * as editGallery from "./editPages/editGallery.js";
import * as authorization from "./auth/authorization.js";
import { displayMap } from "./leafletMap.js";
import { showAlert } from "./alerts.js";

const galleryPage = document.querySelector(".gallery-pages");
const landingPage = document.querySelector("#landingPage");
// elements
const updateLandingPageForm = document.querySelector(".form--edit-landingPage");
//barber data
const updateBarberPhotoForm = document.querySelector(".edit--barber-upload");
const updateBarberPlainDataForm = document.querySelector(
  ".form--edit-barberdata-plain"
);
const updateBarberPasswordDataForm = document.querySelector(
  ".form--edit-barberdata-password"
);
const deleteTablecostModal = document.querySelector(".delete--tablecost-modal");
const editTablecostModal = document.querySelector(".edit--tablecost-modal");
const editServiceBtn = document.querySelectorAll(".edit--service-edit");
const deleteServiceBtn = document.querySelectorAll(".edit--service-remove");

const addServiceForm = document.querySelector(".form--edit-tablecost");
const editTablecostForm = document.querySelector(".edit--tablecost");
const updateServiceForm = document.querySelector(".modal--form-edit-tablecost");

//openhours
const openhoursEditPage = document.querySelector(".edit--openhours-grid");
const closeOpenhoursModalBtn = document.querySelector(
  ".openhour--modal-close__btn"
);
const openhoursEditForm = document.querySelector(".modal--update-openhours");
//editMapRoute
const mapBox = document.getElementById("map");
const editMapRoutePage = document.querySelector(".edit-maproute");
const editCoordinatesForm = document.querySelector(".edit--coordinates-form");
const editRouteForm = document.querySelector(".edit--route-form");
//editGallery
const editGalleryPage = document.querySelector(".edit--gallery-page");
const deleteImagesFromGalleryBtn = document.getElementById("btnDeleteImages");
const addImagesToGallery = document.getElementById("btnAddImages");
const addImagesToGalleryInput = document.getElementById("add--images-input");
//authorization
const loginForm = document.querySelector(".login-form");
const logoutBtn = document.querySelector(".logout-btn");
//forgotpassword
const forgotPasswordForm = document.querySelector(".forgot--password-form");
const renewPasswordForm = document.querySelector(".renew--password-form");
const handleFormSubmit = function (form, fields, updateFunction, id) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let elementID;
    if (id) elementID = id;

    const data = fields.reduce((acc, fieldName) => {
      const field = document.getElementById(fieldName);
      if (field.type === "checkbox") {
        acc[fieldName.split("-")[0]] = field.checked; // Użyj właściwości `checked`
      } else {
        if (field.value) acc[fieldName.split("-")[0]] = field.value.trim();
      }
      field.value = "";
      return acc;
    }, {});

    if (id) updateFunction(data, elementID);
    else updateFunction(data);
  });
};

if (galleryPage) getGalleryImages();

// Update Landing Page
if (updateLandingPageForm)
  handleFormSubmit(
    updateLandingPageForm,
    ["title-edit", "description-edit", "bookingLink-edit"],
    updateLandingPage
  );

//////////////////////////
/*BARBER DATA MANAGEMENT*/
//////////////////////////
if (updateBarberPhotoForm)
  updateBarberPhotoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = new FormData();
    const fileInput = document.getElementById("edit-photo");

    if (fileInput.files.length > 0) {
      form.append("photo", document.getElementById("edit-photo").files[0]);
      updateBarber(form, true);
      updateBarberPhotoForm.reset();
    } else showAlert("error", "Zdjęcie nie zostało wybrane.");
  });

if (updateBarberPlainDataForm)
  handleFormSubmit(
    updateBarberPlainDataForm,
    ["name-edit", "surname-edit", "address-edit", "telephoneNumber-edit"],
    updateBarber
  );

if (updateBarberPasswordDataForm)
  handleFormSubmit(
    updateBarberPasswordDataForm,
    ["passwordCurrent-edit", "password-edit", "passwordConfirm-edit"],
    updateBarberPassword
  );

///////////////////////
/*SERVICES MANAGEMENT*/
///////////////////////
if (editServiceBtn) {
  editServiceBtn.forEach((el) =>
    el.addEventListener("click", (e) => {
      editTablecost.toggleModalEdit(editTablecostModal);
      handleFormSubmit(
        updateServiceForm,
        ["titlePL--modal-edit", "titleEN--modal-edit", "price--modal-edit"],
        editTablecost.updateTablecost,
        e.target.closest(".edit--service-btns").dataset.serviceId
      );
    })
  );
}

if (deleteServiceBtn) {
  deleteServiceBtn.forEach((el) => {
    el.addEventListener("click", (e) => {
      editTablecost.toggleModalEdit(deleteTablecostModal);
      editTablecost.deleteService(
        e.target.closest(".edit--service-btns").dataset.serviceId,
        deleteTablecostModal
      );
    });
  });
}

if (addServiceForm)
  handleFormSubmit(
    addServiceForm,
    ["titlePL-edit", "titleEN-edit", "price-edit"],
    editTablecost.addTablecost
  );

if (editTablecostForm) editTablecost.addListeners();

////////////////////////
/*OPENHOURS MANAGEMENT*/
////////////////////////
if (openhoursEditPage) {
  openhoursEditPage.addEventListener("click", (e) => {
    const editBtn = e.target.closest(".edit--openhour-edit");
    if (!editBtn) return;
    editOpenhours.toggleModal();
    handleFormSubmit(
      openhoursEditForm,
      [
        "name-modal-edit-openhours",
        "openHour-modal-edit-openhours",
        "closeHour-modal-edit-openhours",
        "isClosed-modal-edit-openhours",
      ],
      editOpenhours.updateOpenHour,
      editBtn.dataset.openhourId
    );
  });
  closeOpenhoursModalBtn.addEventListener("click", editOpenhours.toggleModal);
}

////////////////////////
/*MAP_ROUTE MANAGEMENT*/
////////////////////////
if (mapBox) {
  const location = JSON.parse(mapBox.dataset.location);
  displayMap(location);
}

if (editMapRoutePage) {
  handleFormSubmit(
    editCoordinatesForm,
    ["lat-input", "lng-input"],
    editMapRoute.updateCoordinates
  );
  handleFormSubmit(
    editRouteForm,
    ["routeLink-input"],
    editMapRoute.updateRouteLink
  );
}

//////////////////////
/*GALLERY MANAGEMENT*/
//////////////////////
if (editGalleryPage) {
  editGalleryPage.addEventListener("click", (e) => {
    if (!e.target.closest(".overlay-img")) return;
    const element = e.target.closest(".overlay-img");
    editGallery.actionDeleteSet(element);
  });

  deleteImagesFromGalleryBtn.addEventListener("click", () => {
    editGallery.deleteImages();
  });
}

if (addImagesToGallery) {
  addImagesToGallery.addEventListener("click", (e) => {
    const form = new FormData();
    const fileInput = addImagesToGalleryInput;
    if (fileInput.files.length > 0) {
      for (let i = 0; i < fileInput.files.length; i++) {
        form.append("images", fileInput.files[i]);
      }
      editGallery.addImages(form);
    } else showAlert("error", "Nie wybrano żadnych zdjęć");
  });
}

///////////////////
/*AUTH MANAGEMENT*/
///////////////////
if (loginForm)
  handleFormSubmit(
    loginForm,
    ["email-login", "password-login"],
    authorization.login
  );

if (logoutBtn) logoutBtn.addEventListener("click", authorization.logout);

if (forgotPasswordForm)
  handleFormSubmit(
    forgotPasswordForm,
    ["email-forgot"],
    authorization.sendResetToken
  );

if (renewPasswordForm)
  handleFormSubmit(
    renewPasswordForm,
    ["password-renew", "passwordConfirm-renew"],
    authorization.resetPassword
  );

////////////////////
/*SMOOTH SCROLLING*/
////////////////////
if (landingPage) {
  smoothScrolling.init();
}
