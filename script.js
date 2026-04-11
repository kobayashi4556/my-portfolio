/* ===========================
   Portfolio Script
=========================== */

// ---- ナビゲーション ----
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navLinks.classList.toggle('open');
});

// ナビリンクをクリックしたらメニューを閉じる
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

// ---- スライドショー生成関数 ----
/**
 * @param {string} folder   - 画像フォルダ（例: 'image'）
 * @param {number} count    - 画像枚数
 * @param {string} wrapId   - slides-wrap の id
 * @param {string} prevId   - prev ボタン id
 * @param {string} nextId   - next ボタン id
 * @param {string} dotsId   - dots コンテナ id
 * @param {string} counterId- カウンター id
 * @param {string} altPrefix- alt テキスト prefix
 */
function createSlideshow(folder, count, wrapId, prevId, nextId, dotsId, counterId, altPrefix) {
  const wrap = document.getElementById(wrapId);
  const prev = document.getElementById(prevId);
  const next = document.getElementById(nextId);
  const dotsContainer = document.getElementById(dotsId);
  const counter = document.getElementById(counterId);

  let current = 0;
  let autoTimer = null;

  // スライド生成
  for (let i = 1; i <= count; i++) {
    const item = document.createElement('div');
    item.className = 'slide-item';
    const img = document.createElement('img');
    img.src = `${folder}/${i}.png`;
    img.alt = `${altPrefix} ${i}`;
    img.loading = 'lazy';
    item.appendChild(img);
    wrap.appendChild(item);

    // ドット生成
    const dot = document.createElement('span');
    dot.className = 'dot' + (i === 1 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i - 1));
    dotsContainer.appendChild(dot);
  }

  const dots = dotsContainer.querySelectorAll('.dot');

  function update() {
    wrap.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
    counter.textContent = `${current + 1} / ${count}`;
  }

  function goTo(index) {
    current = (index + count) % count;
    update();
  }

  prev.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  next.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

  // 自動スライド（4秒）
  function startAuto() {
    autoTimer = setInterval(() => goTo(current + 1), 4000);
  }
  function resetAuto() {
    clearInterval(autoTimer);
    startAuto();
  }
  startAuto();

  // タッチスワイプ
  let startX = 0;
  wrap.parentElement.addEventListener('touchstart', e => { startX = e.touches[0].clientX; });
  wrap.parentElement.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? goTo(current + 1) : goTo(current - 1);
      resetAuto();
    }
  });

  update();
}

// ---- AI Works スライドショー（imageフォルダ, 1.png〜5.png）----
createSlideshow(
  'image',   // フォルダ名
  5,         // 画像枚数（実際の枚数に合わせて変更してください）
  'aiSlidesWrap',
  'aiPrev',
  'aiNext',
  'aiDots',
  'aiCounter',
  'AI作品'
);

// ---- Competition Works スライドショー（workフォルダ, 1.png〜5.png）----
createSlideshow(
  'work',    // フォルダ名
  5,         // 画像枚数（実際の枚数に合わせて変更してください）
  'workSlidesWrap',
  'workPrev',
  'workNext',
  'workDots',
  'workCounter',
  'コンペ作品'
);

// ---- スクロールアニメーション ----
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.section-title, .about-grid, .web-card, .skill-group, .channel-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

document.addEventListener('DOMContentLoaded', () => {});

// visible クラスを CSS で受け取る（インラインに追記）
const style = document.createElement('style');
style.textContent = '.visible { opacity: 1 !important; transform: translateY(0) !important; }';
document.head.appendChild(style);
