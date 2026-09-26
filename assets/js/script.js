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

      // 最後のクローン → 1枚目へ
      if (index === slides.length - 1) {

        index = 1;

        moveToSlide(index, false);
        updateActive(index);

      }

      // 最初のクローン → 最後の実画像へ
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

  let dateIndex = 0;

  function scrollToCenter(
    i,
    animate = true
  ) {

    const target = items[i];

    if (!target) return;

    const swiperWidth =
      swiper.clientWidth;

    const datesWidth =
      dates.scrollWidth;

    const targetCenter =
      target.offsetLeft +
      target.offsetWidth / 2;

    let moveX =
      swiperWidth / 2 -
      targetCenter;

    const minMoveX =
      swiperWidth - datesWidth;

    const maxMoveX = 0;

    moveX =
      Math.max(
        minMoveX,
        moveX
      );

    moveX =
      Math.min(
        maxMoveX,
        moveX
      );

    dates.style.transition =
      animate
        ? 'transform 0.5s ease'
        : 'none';

    dates.style.transform =
      `translateX(${moveX}px)`;
  }

  // 初期表示
  scrollToCenter(
    dateIndex,
    false
  );

  // 前の日付
  prev.addEventListener(
    'click',
    () => {

      if (dateIndex <= 0) {
        return;
      }

      dateIndex--;

      scrollToCenter(
        dateIndex
      );

    }
  );

  // 次の日付
  next.addEventListener(
    'click',
    () => {

      if (
        dateIndex >=
        items.length - 1
      ) {
        return;
      }

      dateIndex++;

      scrollToCenter(
        dateIndex
      );

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

        // タブのactiveを削除
        tabs.forEach((t) => {
          t.classList.remove('active');
        });

        // クリックしたタブをactive
        tab.classList.add('active');

        const target =
          tab.dataset.tab;

        // パネルのactiveを削除
        panels.forEach((panel) => {
          panel.classList.remove('active');
        });

        // タイトルタブ
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
  document.querySelector(
    '.p-header__menuButton'
  );

const siteMenu =
  document.querySelector(
    '.p-header__siteMenu'
  );

if (menuButton && siteMenu) {

  menuButton.addEventListener(
    'click',
    function () {

      console.log(
        'menuButton クリック'
      );

      siteMenu.classList.toggle(
        'is-active'
      );

    }
  );

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