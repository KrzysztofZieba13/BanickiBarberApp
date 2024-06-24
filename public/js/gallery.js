/* eslint-disable */
import axios from "axios";
let galleryImages;
const galleryMenu = document.querySelector(".gallery-menu");
const galleryPage = document.querySelector(".gallery-pages");
const galleryDots = document.querySelector(".gallery-dots");
const zoomed = document.querySelector(".zoomed-img");
const overlay = document.querySelector(".overlay");
const cross = document.querySelector(".cross");
let dotButtonsArray;
let maxSlide;
const images = [];
let curSlide = 0;

// Save gallery images to images array
export const getGalleryImages = async () => {
  try {
    const response = await axios({
      method: "get",
      url: "/api/v1/gallery/",
    });
    images.push(...response.data.data.images);
    maxSlide = Math.ceil(images.length / 9);

    insertHeroImages();
    insertImages();
    renderDots(maxSlide);
    goToSlide(0);
    zoomImageAfterClick();
  } catch (err) {
    console.log(err);
  }
};

const insertHeroImages = function () {
  if (window.location.pathname !== "/") return; // Poprawiony warunek
  const heroImages = document.querySelector(".hero-images");

  if (!heroImages) return; // Sprawdzamy czy kontener istnieje

  // Funkcja do przetasowania tablicy
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  // Tworzymy kopię tablicy i przetasowujemy ją
  const shuffledImages = [...images];
  shuffleArray(shuffledImages);

  // Wybieramy pierwsze 6 elementów
  const selectedImages = shuffledImages.slice(0, 6);

  // Tworzymy HTML dla wybranych obrazków i wstawiamy je do kontenera
  const heroHTML = selectedImages
    .map(
      (el) => `
    <div class='hero-item'>
      <img class='hero--client-img' src='/img/clients/${el}' alt='zdjęcie klienta' />
    </div>
  `
    )
    .join("");

  heroImages.innerHTML = heroHTML;
};

const insertImages = function () {
  const isEditGalleryPage =
    window.location.pathname === "/admin/edycja-galeria";

  let galleryHTML = '<div class="gallery-images">';

  images.forEach((el, i) => {
    if (i > 0 && i % 9 === 0) {
      galleryHTML += '</div><div class="gallery-images">';
    }

    galleryHTML += `
      <div class='gallery-item'>
        <img class='gallery-img' src='/img/clients/${el}' data-image='${el}' alt='zdjęcie klienta' />
        ${
          isEditGalleryPage
            ? `
        <div class="overlay-img" data-image='${el}'>
          <ion-icon class="overlay-text" name="trash-outline"></ion-icon>
        </div>`
            : ""
        }
      </div>
    `;
  });

  galleryHTML += "</div>";

  galleryPage.insertAdjacentHTML("beforeend", galleryHTML);

  galleryImages = document.querySelectorAll(".gallery-images");
};

const renderDots = function (dots) {
  const dotButtons = Array.from(
    { length: dots },
    (_, i) => `
    <button class='gallery-dot ${
      i === 0 ? "gallery--dot-active" : ""
    }' data-go-to='${i}'>
    </button>
  `
  ).join("");

  galleryDots.insertAdjacentHTML("beforeend", dotButtons);

  dotButtonsArray = document.querySelectorAll(".gallery-dot");
  dotButtonsArray.forEach((dot) =>
    dot.addEventListener("click", function () {
      dotButtonsArray.forEach((btn) =>
        btn.classList.remove("gallery--dot-active")
      );
      this.classList.add("gallery--dot-active");
      curSlide = this.dataset.goTo;
      goToSlide(this.dataset.goTo);
    })
  );
};

// Slide to demanded slide
const goToSlide = (slide) => {
  dotButtonsArray.forEach((dot, index) => {
    if (index === parseInt(slide)) {
      dot.classList.add("gallery--dot-active");
    } else {
      dot.classList.remove("gallery--dot-active");
    }
  });

  galleryImages.forEach((el, i) => {
    el.style.transform = `translateX(${100 * (i - slide)}%)`;
  });
};

// Slide to next slide
const nextSlide = () => {
  if (curSlide === maxSlide - 1) curSlide = 0;
  else curSlide++;

  goToSlide(curSlide);
};

// Slide to previous slide
const prevSlide = () => {
  if (curSlide === 0) curSlide = maxSlide - 1;
  else curSlide--;

  goToSlide(curSlide);
};

// Listen for menu actions
if (galleryMenu) {
  galleryMenu
    .querySelector(".gallery--arrow-right")
    .addEventListener("click", nextSlide);

  galleryMenu
    .querySelector(".gallery--arrow-left")
    .addEventListener("click", prevSlide);
}

const zoomImageAfterClick = function () {
  if (!zoomed) return;

  let image;
  galleryPage.addEventListener("click", function (e) {
    if (e.target.closest(".gallery-img") === null) return;

    image = e.target.closest(".gallery-img");
    if (zoomed) {
      zoomed.src = `/img/clients/${image.dataset.image}`;
      overlay.classList.toggle("hidden");
      zoomed.classList.toggle("hidden");
      cross.classList.toggle("hidden");
    }
  });
  overlay.addEventListener("click", (e) => {
    e.target.classList.toggle("hidden");
    zoomed.classList.toggle("hidden");
    cross.classList.toggle("hidden");
  });
  cross.addEventListener("click", (e) => {
    e.target.classList.toggle("hidden");
    zoomed.classList.toggle("hidden");
    overlay.classList.toggle("hidden");
  });
};
