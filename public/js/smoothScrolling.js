const reviewNavBtn = document.getElementById("review--nav-btn");
const reviewBox = document.getElementById("testimonials");
const galleryNavBtn = document.getElementById("gallery--nav-btn");
const galleryBox = document.getElementById("gallery");
const tablecostNavBtn = document.getElementById("tablecost--nav-btn");
const tablecostBox = document.getElementById("tablecost");
const contactNavBtn = document.getElementById("contact--nav-btn");
const contactBox = document.getElementById("contact");
const roadNavBtn = document.getElementById("road--nav-btn");
const roadBox = document.getElementById("road");
const goUpFooterBtn = document.getElementById("goUpFooter");
const landingPageBox = document.getElementById("landingPage");
const landingPageGalleryBtn = document.getElementById(
  "landingPage--gallery-btn"
);

const landingPageFooterBtn = document.getElementById("landingPageFooter");
const galleryFooterBtn = document.getElementById("galleryFooter");
const reviewsFooterBtn = document.getElementById("reviewsFooter");
const contactFooterBtn = document.getElementById("contactFooter");
const routeFooterBtn = document.getElementById("routeFooter");

const smoothScrolling = (element, elementTarget) => {
  element.addEventListener("click", (e) => {
    e.preventDefault();
    elementTarget.scrollIntoView({ behavior: "smooth" });
  });
};

export const init = () => {
  smoothScrolling(reviewNavBtn, reviewBox);
  smoothScrolling(galleryNavBtn, galleryBox);
  smoothScrolling(tablecostNavBtn, tablecostBox);
  smoothScrolling(contactNavBtn, contactBox);
  smoothScrolling(roadNavBtn, roadBox);
  smoothScrolling(goUpFooterBtn, landingPageBox);
  smoothScrolling(landingPageFooterBtn, landingPageBox);
  smoothScrolling(galleryFooterBtn, galleryBox);
  smoothScrolling(reviewsFooterBtn, reviewBox);
  smoothScrolling(contactFooterBtn, contactBox);
  smoothScrolling(routeFooterBtn, roadBox);
  smoothScrolling(landingPageGalleryBtn, galleryBox);
};
