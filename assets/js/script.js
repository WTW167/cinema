// ========================================
// メインカルーセル
// ========================================

const slideContainer = document.querySelector('.p-slides');
let slides = document.querySelectorAll('.c-slide');
const dots = document.querySelectorAll('.c-dot');

if (slideContainer && slides.length > 0) {

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

    const containerCenter =
      slideContainer.parentElement.offsetWidth / 2;

    const slideCenter =
      target.offsetLeft + target.offsetWidth / 2;

    const moveX =
      containerCenter - slideCenter;

    if (animate) {
      slideContainer.style.transition =
        'transform 0.5s ease';
    } else {
      slideContainer.style.transition = 'none';
    }

    slideContainer.style.transform =
      `translateX(${moveX}px)`;
  }

  function updateActive(i) {
    slides.forEach((slide, idx) => {
      slide.classList.toggle(
        'active',
        idx === i
      );
    });

    dots.forEach((dot, idx) => {
      dot.classList.toggle(
        'active',
        idx === i - 1
      );
    });
  }

  // 初期表示
  moveToSlide(index, false);
  updateActive(index);

  // ドットクリック
  dots.forEach((dot, i) => {

    dot.addEventListener('click', (e) => {
      e.preventDefault();
      if (isMoving) return;

      index = i + 1;

      moveToSlide(index, true);
      updateActive(index);

    });

  });

  // 自動スライド
  setInterval(() => {
    if (isMoving) return;

    isMoving = true;
    index++;

    moveToSlide(index, true);
    updateActive(index);

  }, 3000);

  // スライド切り替え完了
  slideContainer.addEventListener(
    'transitionend',
    (e) => {
      if (e.propertyName !== 'transform') {
        return;
      }

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

    }
  );
}


// ========================================
// 日付スライダー
// ========================================

const items =
  document.querySelectorAll('.p-dateItem');

const dates =
  document.querySelector('.p-dateTransform__dates');

const swiper =
  document.querySelector('.p-dateTransform--swiper');

const arrows =
  document.querySelectorAll('.p-dateTransform__arrow');

if (
  items.length > 0 &&
  dates &&
  swiper &&
  arrows.length >= 2
) {

  const prev = arrows[0];
  const next = arrows[1];

  let moveX = 0;

  // 1回のクリックで動かす距離
  const moveAmount = 200;

  function moveSlider(distance) {

    const swiperWidth = swiper.clientWidth;
    const datesWidth = dates.scrollWidth;

    const minMoveX =
      swiperWidth - datesWidth;

    const maxMoveX = 0;

    moveX += distance;

    // 左端・右端を超えないようにする
    moveX = Math.max(
      minMoveX,
      moveX
    );

    moveX = Math.min(
      maxMoveX,
      moveX
    );

    dates.style.transition =
      'transform 0.3s ease-in-out';

    dates.style.transform =
      `translateX(${moveX}px)`;
  }

  // 前へ
  prev.addEventListener(
    'click',
    () => {
      moveSlider(moveAmount);
    }
  );

  // 次へ
  next.addEventListener(
    'click',
    () => {
      moveSlider(-moveAmount);
    }
  );
}
// ========================================
// タブ切り替え
// ========================================

const tabs =
  document.querySelectorAll('.tab');

const panels =
  document.querySelectorAll('.tab-panel');

if (tabs.length > 0 && panels.length > 0) {
  tabs.forEach((tab) => {

    tab.addEventListener(
      'click',
      () => {

        tabs.forEach((t) => {
          t.classList.remove('active');
        });

        tab.classList.add('active');

        const target =
          tab.dataset.tab;

        panels.forEach((panel) => {
          panel.classList.remove('active');
        });

        if (target === 'title') {
          const titlePanel =
            document.getElementById(
              'tab-title'
            );

          if (titlePanel) {
            titlePanel.classList.add(
              'active'
            );
          }

        }

        // 時間順タブ
        if (target === 'time') {

          const timePanel =
            document.getElementById(
              'tab-time'
            );

          if (timePanel) {
            timePanel.classList.add(
              'active'
            );
          }

          // 320px以下の場合
          const timeSpPanel =
            document.getElementById(
              'tab-time--sp'
            );

          if (
            window.innerWidth <= 320 &&
            timeSpPanel
          ) {
            timeSpPanel.classList.add(
              'active'
            );
          }

        }

      }
    );

  });

}


// ========================================
// ヘッダーメニュー
// index / access 共通
// ========================================

console.log(
  'script.js 読み込みOK'
);

const menuButton =
  document.querySelector('.p-header__menuButton');
const hamburgerMenu =
  document.querySelector('.p-header__hamburgerMenu');

if (menuButton && hamburgerMenu) {

  menuButton.addEventListener('click', function () {
    menuButton.classList.toggle('is-active');
    hamburgerMenu.classList.toggle('is-active');

  });

}

// ========================================
// コンテンツ開閉
// ========================================

const toggleButtons =
  document.querySelectorAll(
    '.p-contentToggle'
  );

if (toggleButtons.length > 0) {
  toggleButtons.forEach((button) => {

    button.addEventListener(
      'click',
      () => {

        button.classList.toggle(
          'is-open'
        );

        const contentItem =
          button.closest(
            '.p-contentItem'
          );

        if (!contentItem) {
          return;
        }

        const contentSchedule =
          contentItem.querySelector(
            '.p-contentSchedule'
          );

        if (!contentSchedule) {
          return;
        }

        contentSchedule.classList.toggle(
          'is-open'
        );
      }
    );
  });

}