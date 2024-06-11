/* eslint-disable*/

const landingPageNav = document.querySelector('.landing--page-nav');
const navItems = document.querySelector('.nav-items');
const openNav = document.querySelector('.open-nav');
const closeNav = document.querySelector('.close-nav');

if (navItems) {
  navItems.addEventListener('click', (e) => {
    const element = e.target.closest('.link');
    if (!element) return;

    landingPageNav.classList.remove('nav-open');
  });

  openNav.addEventListener('click', () => {
    landingPageNav.classList.add('nav-open');
  });

  closeNav.addEventListener('click', () => {
    landingPageNav.classList.remove('nav-open');
  });
}
