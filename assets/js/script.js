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
      slide.classList.toggle('active', idx === i);
    });

    // クローン画像も本来のスライドに対応するドットを点灯
    const realIndex =
      i === 0 ? slides.length - 2 :
        i === slides.length - 1 ? 1 :
          i;

    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === realIndex - 1);
    });
  }

  // ドラッグ操作
  let isDragging = false;
  let startX = 0;
  let startTranslateX = 0;
  let dragMoved = false;
  let suppressClick = false;

  const dragRatio = 0.8; // マウス移動に対するスライドの移動率
  const dragThreshold = 50; // スライド切り替え判定(px)

  function getTranslateX() {
    const transform = getComputedStyle(slideContainer).transform;

    if (transform === 'none') return 0;

    return new DOMMatrixReadOnly(transform).m41;
  }

  // 中央に最も近いスライドを取得
  function getClosestSlideIndex() {
    const center =
      slideContainer.parentElement.getBoundingClientRect().width / 2;

    const translateX = getTranslateX();
    let closestIndex = 0;
    let minDistance = Infinity;

    slides.forEach((slide, i) => {
      const slideCenter =
        slide.offsetLeft + slide.offsetWidth / 2 + translateX;

      const distance = Math.abs(center - slideCenter);

      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = i;
      }
    });

    return closestIndex;
  }

  // 押したとき
  slideContainer.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    isDragging = true;
    dragMoved = false;
    startX = e.clientX;
    startTranslateX = getTranslateX();

    // 自動スライドとアニメーションを一時停止
    isMoving = true;
    slideContainer.style.transition = 'none';

    slideContainer.setPointerCapture(e.pointerId);
  });

  // 押したまま動かす
  slideContainer.addEventListener('pointermove', (e) => {
    if (!isDragging) return;

    const deltaX = e.clientX - startX;

    if (Math.abs(deltaX) > 5) {
      dragMoved = true;
    }

    if (!dragMoved) return;

    // マウスより少しゆっくりスライドを動かす
    slideContainer.style.transform =
      `translateX(${startTranslateX + deltaX * dragRatio}px)`;

    // 中央のスライドに合わせてドットを更新
    const closestIndex = getClosestSlideIndex();
    updateActive(closestIndex);
  });

  // マウスを離したとき
  function endDrag(e) {
    if (!isDragging) return;

    isDragging = false;

    if (slideContainer.hasPointerCapture(e.pointerId)) {
      slideContainer.releasePointerCapture(e.pointerId);
    }

    // クリックだけなら通常動作
    if (!dragMoved) {
      isMoving = false;
      return;
    }

    suppressClick = true;

    const deltaX = (e.clientX - startX) * dragRatio;

    // 十分に動かした場合は、ドラッグ方向へ1枚移動
    if (Math.abs(deltaX) >= dragThreshold) {
      index += deltaX < 0 ? 1 : -1;
    } else {
      // 少しだけ動かした場合は、中央に最も近いスライドへ
      index = getClosestSlideIndex();
    }

    // 自動スライドと同じ0.5秒のアニメーションで中央へ
    moveToSlide(index, true);
    updateActive(index);
  }

  slideContainer.addEventListener('pointerup', endDrag);
  slideContainer.addEventListener('pointercancel', endDrag);

  // ドラッグ後にリンクが誤って開くのを防ぐ
  slideContainer.addEventListener('click', (e) => {
    if (suppressClick) {
      e.preventDefault();
      e.stopPropagation();
      suppressClick = false;
    }
  }, true);

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