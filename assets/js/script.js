const slideContainer = document.querySelector('.p-main__slides');
let slides = document.querySelectorAll('.c-slide');
const dots = document.querySelectorAll('.c-dot');

const firstClone = slides[0].cloneNode(true);
const lastClone = slides[slides.length - 1].cloneNode(true);
firstClone.id = 'clone-first';
lastClone.id = 'clone-last';
slideContainer.appendChild(firstClone);
slideContainer.insertBefore(lastClone, slides[0]);
slides = document.querySelectorAll('.c-slide');

let index = 1;
let isMoving = false;

function moveToSlide(i, animate = true) {
  const target = slides[i];
  if (!target) return;
  const containerCenter = slideContainer.parentElement.offsetWidth / 2;
  const slideCenter = target.offsetLeft + target.offsetWidth / 2;
  const moveX = containerCenter - slideCenter;
  if (animate) {
    slideContainer.style.transition = 'transform 0.5s ease';
  } else {
    slideContainer.style.transition = 'none';
  }
  slideContainer.style.transform = `translateX(${moveX}px)`;
}


function updateActive(i) {
  slides.forEach((slide, idx) => {
    slide.classList.toggle('active', idx === i);
  });
  dots.forEach((dot, idx) => {
    dot.classList.toggle('active', idx === i - 1);
  });
}

moveToSlide(index, false);
updateActive(index);

dots.forEach((dot, i) => {
  dot.addEventListener('click', (e) => {
    e.preventDefault();
    if (isMoving) return;
    index = i + 1;
    moveToSlide(index, true);
    updateActive(index);
  });
});

setInterval(() => {
  if (isMoving) return;
  isMoving = true;
  index++;
  moveToSlide(index, true);
  updateActive(index);
}, 3000);

slideContainer.addEventListener('transitionend', (e) => {

  if (e.propertyName !== 'transform') return;
  if (index === slides.length - 1) {
    index = 1;
    moveToSlide(index, false);
    updateActive(index);
  }


  if (index === 0) {
    index = slides.length - 2;
    moveToSlide(index, false);
    updateActive(index);
  }
  isMoving = false;
});

const items = document.querySelectorAll('.p-dateItem');
const dates = document.querySelector('.p-main__dates');
const swiper = document.querySelector('.p-main__dateCarousel--swiper');
const arrows = document.querySelectorAll('.p-main__dateCarousel__arrow');

const prev = arrows[0];
const next = arrows[1];

function scrollToCenter(i, animate = true) {
  const target = items[i];

  if (!target) return;

  const swiperWidth = swiper.clientWidth;
  const datesWidth = dates.scrollWidth;

  const targetCenter =
    target.offsetLeft + target.offsetWidth / 2;

  let moveX =
    swiperWidth / 2 - targetCenter;
  const minMoveX = swiperWidth - datesWidth;
  const maxMoveX = 0;

  moveX = Math.max(minMoveX, moveX);
  moveX = Math.min(maxMoveX, moveX);

  dates.style.transition = animate
    ? 'transform 0.5s ease'
    : 'none';

  dates.style.transform = `translateX(${moveX}px)`;
}

scrollToCenter(index, false);
prev.addEventListener('click', () => {
  if (index <= 0) return;

  index--;
  scrollToCenter(index);
});

next.addEventListener('click', () => {
  if (index >= items.length - 1) return;

  index++;
  scrollToCenter(index);
});

const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.tab-panel');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {

    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const target = tab.dataset.tab;

    panels.forEach(panel => {
      panel.classList.remove('active');
    });

    document.getElementById(`tab-${target}`).classList.add('active');
  });
});