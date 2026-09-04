const slideContainer = document.querySelector('.p-main__slides');
let slides = document.querySelectorAll('.c-slide');
const dots = document.querySelectorAll('.c-dot');

// 無限ループ用クローン作成
const firstClone = slides[0].cloneNode(true);
const lastClone = slides[slides.length - 1].cloneNode(true);

firstClone.id = "clone-first";
lastClone.id = "clone-last";

slideContainer.appendChild(firstClone);
slideContainer.insertBefore(lastClone, slides[0]);

// クローン込みで再取得
slides = document.querySelectorAll('.c-slide');

// 実スライドは index=1 から始まる
let index = 1;

// 初期位置を slide1 に合わせる
function setInitialPosition() {
  const firstRealSlide = slides[index];
  const centerPos =
    firstRealSlide.offsetLeft - (slideContainer.offsetWidth / 2) + (firstRealSlide.offsetWidth / 2);
  slideContainer.scrollLeft = centerPos;
}
setInitialPosition();


// 中央にスクロールする関数
function scrollToSlide(i) {
  const target = slides[i];
  const centerPos =
    target.offsetLeft - (slideContainer.offsetWidth / 2) + (target.offsetWidth / 2);

  slideContainer.scrollTo({
    left: centerPos,
    behavior: "smooth",
  });
}


// active クラス更新
function updateActive(i) {
  slides.forEach((slide, idx) => {
    slide.classList.toggle('active', idx === i);
  });

  dots.forEach((dot, idx) => {
    dot.classList.toggle('active', idx === i - 1);
  });
}


// ドットクリック
dots.forEach((dot, i) => {
  dot.addEventListener("click", (e) => {
    e.preventDefault();
    index = i + 1;
    scrollToSlide(index);
    updateActive(index);
  });
});


// 自動スクロール（右方向）
setInterval(() => {
  index++;
  scrollToSlide(index);
  updateActive(index);
}, 3000);


// 無限ループ補正（右方向に自然に流れるように調整）
slideContainer.addEventListener("scroll", () => {
  const maxScroll = slideContainer.scrollWidth - slideContainer.offsetWidth;

  // 左端（clone-last）→ slide10 に瞬間移動
  if (slideContainer.scrollLeft <= 0) {
    index = slides.length - 2; // slide10
    slideContainer.scrollLeft =
      slides[index].offsetLeft -
      (slideContainer.offsetWidth / 2) +
      (slides[index].offsetWidth / 2);

    updateActive(index);
  }

  // 右端（clone-first）→ slide1 に瞬間移動（右方向ループの要）
  if (slideContainer.scrollLeft >= maxScroll) {
    index = 1; // slide1

    // ★瞬間ジャンプ（ユーザーは見えない）
    slideContainer.scrollLeft =
      slides[index].offsetLeft -
      (slideContainer.offsetWidth / 2) +
      (slides[index].offsetWidth / 2);

    updateActive(index);

    // ★次の自動スクロールで右方向に slide2 へ進む
  }
});
