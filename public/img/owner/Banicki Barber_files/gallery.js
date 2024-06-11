/* eslint-disable */
//TODO: REFACTORING TO CLEANER CODE
let galleryImages;
const galleryMenu = document.querySelector('.gallery-menu');
const galleryPage = document.querySelector('.gallery-page');
const galleryDots = document.querySelector('.gallery-dots');
const zoomed = document.querySelector('.zoomed-img');
const overlay = document.querySelector('.overlay');
const cross = document.querySelector('.cross');
let dotButtonsArray;
let maxSlide;
const images = [];
let curSlide = 0;

// Save gallery images to images array
const getGalleryImages = async () => {
  const response = await axios({
    method: 'get',
    url: 'http://127.0.0.1:3000/api/v1/gallery/',
  });
  images.push(...response.data.data.images);

  maxSlide = Math.ceil(images.length / 9);

  insertImages();
  renderDots(maxSlide);
  goToSlide(0);
  zoomImageAfterClick();
};

// Insert images to HTML
const insertImages = function () {
  galleryPage.insertAdjacentHTML(
    'beforeend',
    `
  <div class='gallery-images'>
    ${images
      .map(
        (el, i) =>
          `
    ${
      i % 9 === 0 && i != 0
        ? `
      </div>
      <div class="gallery-images">
        <div class='gallery-item'>
          <img class='gallery-img' src='http://127.0.0.1:3000/img/clients/${el}' data-image='${el}' alt='zdjęcie klienta' />
        </div>
      `
        : `
      <div class='gallery-item'>
        <img class='gallery-img' src='http://127.0.0.1:3000/img/clients/${el}' data-image='${el}' alt='zdjęcie klienta' />
      </div>
      `
    }
    `,
      )
      .join('')}
  </div>
  `,
  );

  galleryImages = document.querySelectorAll('.gallery-images');
};

const renderDots = function (dots) {
  const dotButtons = Array.from(
    { length: dots },
    (_, i) => `
    <button class='gallery-dot ${i === 0 ? 'gallery--dot-active' : ''}' data-go-to='${i}'>
    </button>
  `,
  ).join('');

  galleryDots.insertAdjacentHTML('beforeend', dotButtons);

  dotButtonsArray = document.querySelectorAll('.gallery-dot');
  dotButtonsArray.forEach((dot) =>
    dot.addEventListener('click', function () {
      dotButtonsArray.forEach((btn) =>
        btn.classList.remove('gallery--dot-active'),
      );
      this.classList.add('gallery--dot-active');
      curSlide = this.dataset.goTo;
      goToSlide(this.dataset.goTo);
    }),
  );
};

// Slide to demanded slide
const goToSlide = (slide) => {
  dotButtonsArray.forEach((dot, index) => {
    if (index === parseInt(slide)) {
      dot.classList.add('gallery--dot-active');
    } else {
      dot.classList.remove('gallery--dot-active');
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
galleryMenu
  .querySelector('.gallery--arrow-right')
  .addEventListener('click', nextSlide);

galleryMenu
  .querySelector('.gallery--arrow-left')
  .addEventListener('click', prevSlide);

const zoomImageAfterClick = function () {
  let image;
  galleryPage.addEventListener('click', function (e) {
    if (e.target.closest('.gallery-img') === null) return;
    // console.log(e.target.closest('.gallery-img').dataset.image);
    image = e.target.closest('.gallery-img');
    zoomed.src = `http://127.0.0.1:3000/img/clients/${image.dataset.image}`;
    overlay.classList.toggle('hidden');
    zoomed.classList.toggle('hidden');
    cross.classList.toggle('hidden');
  });
  overlay.addEventListener('click', (e) => {
    e.target.classList.toggle('hidden');
    zoomed.classList.toggle('hidden');
    cross.classList.toggle('hidden');
  });
  cross.addEventListener('click', (e) => {
    e.target.classList.toggle('hidden');
    zoomed.classList.toggle('hidden');
    overlay.classList.toggle('hidden');
  });
};

// Init function
const init = function () {
  getGalleryImages();
};

init();
