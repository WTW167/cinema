const slideContainer = document.querySelector('.p-main__slides');
let slides = document.querySelectorAll('.c-slide');
const dots = document.querySelectorAll('.c-dot');


// ==============================
// クローンを作成
// ==============================

const firstClone = slides[0].cloneNode(true);
const lastClone = slides[slides.length - 1].cloneNode(true);

firstClone.id = 'clone-first';
lastClone.id = 'clone-last';

slideContainer.appendChild(firstClone);
slideContainer.insertBefore(lastClone, slides[0]);

slides = document.querySelectorAll('.c-slide');


// ==============================
// 現在のスライド
// ==============================

// 0 = clone-slide10
// 1 = slide1
// 2 = slide2
// ...
// 10 = slide10
// 11 = clone-slide1

let index = 1;
let isMoving = false;


// ==============================
// スライドを中央に移動
// ==============================

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


// ==============================
// activeを更新
// ==============================

function updateActive(i) {
  slides.forEach((slide, idx) => {
    slide.classList.toggle('active', idx === i);
  });

  dots.forEach((dot, idx) => {
    dot.classList.toggle('active', idx === i - 1);
  });
}


// ==============================
// 初期位置
// ==============================

moveToSlide(index, false);
updateActive(index);


// ==============================
// ドットクリック
// ==============================

dots.forEach((dot, i) => {
  dot.addEventListener('click', (e) => {
    e.preventDefault();

    if (isMoving) return;

    index = i + 1;

    moveToSlide(index, true);
    updateActive(index);
  });
});


// ==============================
// 自動スライド
// ==============================

setInterval(() => {

  if (isMoving) return;

  isMoving = true;

  index++;

  moveToSlide(index, true);
  updateActive(index);

}, 3000);


// ==============================
// アニメーション終了後の処理
// ==============================

slideContainer.addEventListener('transitionend', (e) => {

  if (e.propertyName !== 'transform') return;


  // clone-slide1まで到達
  if (index === slides.length - 1) {

    index = 1;

    moveToSlide(index, false);
    updateActive(index);
  }


  // clone-slide10まで到達
  if (index === 0) {

    index = slides.length - 2;

    moveToSlide(index, false);
    updateActive(index);
  }

  isMoving = false;

});