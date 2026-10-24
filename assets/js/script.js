
// ========================================
// メインカルーセル
// ========================================

const slideContainer = document.querySelector('.js-slides');
let slides = document.querySelectorAll('.js-slide');
const dots = document.querySelectorAll('.js-dot');

if (slideContainer && slides.length > 0) {
  const firstClone = slides[0].cloneNode(true);
  const lastClone = slides[slides.length - 1].cloneNode(true);

  firstClone.id = 'clone-first';
  lastClone.id = 'clone-last';

  slideContainer.appendChild(firstClone);
  slideContainer.insertBefore(lastClone, slides[0]);

  slides = document.querySelectorAll('.js-slide');

  let index = 1;
  let isMoving = false;

  // スライドを指定位置へ移動
  function moveToSlide(i, animate = true) {
    const target = slides[i];

    if (!target) {
      console.log(
        'moveToSlide ERROR',
        'index=',
        i,
        'target not found'
      );
      return;

      console.log(
        "containerWidth=",
        slideContainer.parentElement.offsetWidth
      );

      document.title =
        `containerWidth=${slideContainer.parentElement.offsetWidth
        }`;
    }

    const containerCenter =
      slideContainer.parentElement.offsetWidth / 2;

    const slideCenter =
      target.offsetLeft + target.offsetWidth / 2;

    const moveX =
      containerCenter - slideCenter;

    console.log(
      'moveToSlide',
      'index=', i,
      'offsetLeft=', target.offsetLeft,
      'width=', target.offsetWidth,
      'moveX=', moveX
    );

    slideContainer.style.transition = animate
      ? 'transform 0.5s ease'
      : 'none';

    slideContainer.style.transform =
      `translateX(${moveX}px)`;
  }

  // アクティブ状態を更新
  function updateActive(i) {
    slides.forEach((slide, idx) => {
      slide.classList.toggle('active', idx === i);
    });

    // クローン画像も本来のスライドに対応するドットを点灯
    const realIndex =
      i === 0
        ? slides.length - 2
        : i === slides.length - 1
          ? 1
          : i;

    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === realIndex - 1);
    });
  }

  // ========================================
  // ドラッグ操作
  // ========================================

  let isDragging = false;
  let startX = 0;
  let startTranslateX = 0;
  let dragMoved = false;
  let suppressClick = false;

  const dragRatio = 0.8;
  const dragThreshold = 50;

  // 現在のtranslateXを取得
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

    console.log(
      'closestIndex=',
      closestIndex,
      'translateX=',
      translateX
    );

    return closestIndex;
  }

  // 押したとき
  slideContainer.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    // ブラウザ標準のドラッグ・選択動作を抑制
    e.preventDefault();

    isDragging = true;
    dragMoved = false;
    startX = e.clientX;
    startTranslateX = getTranslateX();

    // ドラッグ中は自動スライドを一時停止
    isMoving = true;
    slideContainer.style.transition = 'none';

    slideContainer.setPointerCapture(e.pointerId);
  });

  // 押したまま動かす
  slideContainer.addEventListener('pointermove', (e) => {
    if (!isDragging) return;

    const deltaX = e.clientX - startX;

    console.log({
      startX,
      currentX: e.clientX,
      deltaX,
      startTranslateX,
      currentTranslateX: getTranslateX()
    });

    if (Math.abs(deltaX) > 5) {
      dragMoved = true;
    }

    if (!dragMoved) return;

    // マウスの移動量に合わせてスライドを動かす
    slideContainer.style.transform =
      `translateX(${startTranslateX + deltaX * dragRatio}px)`;

    // 中央のスライドに合わせてドットを更新
    const closestIndex = getClosestSlideIndex();

    console.log(
      'pointermove',
      'closestIndex=',
      closestIndex,
      'index=',
      index
    );

    updateActive(closestIndex);
  });

  // マウスを離したとき
  function endDrag(e) {
    if (!isDragging) return;

    console.log('UP clientX=', e.clientX);
    console.log('DOWN clientX=', startX);

    isDragging = false;

    if (slideContainer.hasPointerCapture(e.pointerId)) {
      slideContainer.releasePointerCapture(e.pointerId);
    }

    // ドラッグしていない場合
    if (!dragMoved) {
      isMoving = false;
      return;
    }

    suppressClick = true;

    const deltaX = (e.clientX - startX) * dragRatio;

    console.log('FINAL deltaX=', deltaX);
    console.log('BEFORE index=', index);

    // 一定以上ドラッグした場合は前後のスライドへ移動
    if (Math.abs(deltaX) >= dragThreshold) {
      index += deltaX < 0 ? 1 : -1;
    }

    // スライドの範囲外に出ないようにする
    index = Math.max(0, Math.min(index, slides.length - 1));

    console.log('AFTER index=', index);

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

  window.addEventListener('load', () => {

    moveToSlide(index, false);
    updateActive(index);

  });

  window.addEventListener('resize', () => {

    moveToSlide(index, false);
    updateActive(index);

  });

  // 画像読込完了後にも再計算
  slides.forEach(slide => {

    const img = slide.querySelector('img');

    if (!img) return;

    img.addEventListener('load', () => {

      moveToSlide(index, false);

    });

  });

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
  slideContainer.addEventListener('transitionend', (e) => {
    if (e.propertyName !== 'transform') return;

    console.log('transitionend', 'index=', index);

    // 最後のクローンから最初の実スライドへ戻す
    if (index === slides.length - 1) {
      index = 1;
      moveToSlide(index, false);
      updateActive(index);
    }

    // 最初のクローンから最後の実スライドへ戻す
    if (index === 0) {
      index = slides.length - 2;
      moveToSlide(index, false);
      updateActive(index);
    }

    isMoving = false;
  });
}


// ========================================
// 日付スライダー
// ========================================

const items =
  document.querySelectorAll('.js-dateItem');

const dates =
  document.querySelector('.js-dateTransform__dates');

const swiper =
  document.querySelector('.js-dateTransform--swiper');

const arrows =
  document.querySelectorAll('.js-dateTransform__arrow');

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

    const minMoveX = swiperWidth - datesWidth;
    const maxMoveX = 0;

    moveX += distance;

    // 左端・右端を超えないようにする
    moveX = Math.max(minMoveX, moveX);
    moveX = Math.min(maxMoveX, moveX);

    dates.style.transition = 'transform 0.3s ease-in-out';
    dates.style.transform = `translateX(${moveX}px)`;
  }

  // 前へ
  prev.addEventListener('click', () => {
    moveSlider(moveAmount);
  });

  // 次へ
  next.addEventListener('click', () => {
    moveSlider(-moveAmount);
  });
}


// ========================================
// タブ切り替え
// ========================================


const tabs = document.querySelectorAll('.js-tab');
const panels = document.querySelectorAll('.js-tab-panel');

const titlePanel = document.getElementById('tab-title');
const timePanel = document.getElementById('tab-time');
const timeSpPanel = document.getElementById('tab-time--sp');

// 表示するパネルを切り替える関数
function switchTab(target) {
  panels.forEach((panel) => {
    panel.classList.remove('active');
  });

  // タイトル別に表示
  if (target === 'title') {
    if (titlePanel) {
      titlePanel.classList.add('active');
    }
    return;
  }

  // 上映時間順に表示
  if (target === 'time') {
    if (window.innerWidth <= 900) {
      if (timeSpPanel) {
        timeSpPanel.classList.add('active');
      }
    } else {
      if (timePanel) {
        timePanel.classList.add('active');
      }
    }
  }
}

if (tabs.length > 0 && panels.length > 0) {
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => {
        t.classList.remove('active');
      });

      tab.classList.add('active');

      switchTab(tab.dataset.tab);
    });
  });
}

// 画面幅が変更されたとき
window.addEventListener('resize', () => {
  const activeTab = document.querySelector('.js-tab.active');

  if (activeTab) {
    switchTab(activeTab.dataset.tab);
  }
});

// ========================================
// ヘッダーハンバーガーメニュー
// index / access 共通
// ========================================

console.log('script.js 読み込みOK');

const menuButton =
  document.querySelector('.js-header__menuButton');

const hamburgerMenu =
  document.querySelector('.js-header__hamburgerMenu');

let savedScrollY = 0;

if (menuButton && hamburgerMenu) {
  menuButton.addEventListener('click', function () {
    const isOpen =
      hamburgerMenu.classList.contains('is-active');

    if (!isOpen) {
      // メニューを開く前のスクロール位置を保存
      savedScrollY = window.scrollY;

      // 背景ページのスクロールをロック
      document.body.style.top = `-${savedScrollY}px`;
      document.body.classList.add('is-scrollLocked');

      // メニューを開く
      menuButton.classList.add('is-active');
      hamburgerMenu.classList.add('is-active');
    } else {
      // メニューを閉じる
      menuButton.classList.remove('is-active');
      hamburgerMenu.classList.remove('is-active');

      // 背景ページのスクロールロックを解除
      document.body.classList.remove('is-scrollLocked');
      document.body.style.top = '';

      // 開く前のスクロール位置に戻す
      window.scrollTo(0, savedScrollY);
    }
  });
}


// ========================================
// メディアクエリ時のp-scheduleBoxの展開
// ========================================

const toggleButtons =
  document.querySelectorAll('.js-contentToggle');

if (toggleButtons.length > 0) {
  toggleButtons.forEach((button) => {
    button.addEventListener('click', () => {
      button.classList.toggle('is-open');

      const contentItem =
        button.closest('.p-contentItem');

      if (!contentItem) return;

      const contentSchedule =
        contentItem.querySelector('.js-contentSchedule');

      if (!contentSchedule) return;

      contentSchedule.classList.toggle('is-open');
    });
  });
}
