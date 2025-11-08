document.addEventListener('DOMContentLoaded', function(){
  // Highlight active nav link on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      const id = entry.target.getAttribute('id');
      const link = document.querySelector(`.nav-link[href="#${id}"]`);
      if(entry.isIntersecting){
        navLinks.forEach(l=>l.classList.remove('active'));
        if(link) link.classList.add('active');
      }
    });
  },{threshold:0.5});
  sections.forEach(sec=>observer.observe(sec));

  // Fill current year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

// Opening overlay logic
(function(){
  const intro = document.getElementById('intro');
  if (!intro) return;

  // Trigger animations
  document.body.classList.add('intro-lock', 'opening-playing');

  // Timings
  const PLAY_MS = 700;  // nameDrop 1.5s + 0.35s delay
  const HOLD_MS = 700;  // keep fish+water+name visible
  const FADE_MS = 780;   // matches #intro::before transition

  // After play + hold, fade overlay (keep .opening-playing during fade)
  setTimeout(() => {
    intro.classList.add('is-gone'); // start blur fade
    // remove classes only AFTER the fade completes so elements don't pop out early
    setTimeout(() => {
      document.body.classList.remove('intro-lock', 'opening-playing');
      intro.remove();
    }, FADE_MS);
  }, PLAY_MS + HOLD_MS);
})();


// Spotlight logic (blended list + bigger left meta + fade)
(function(){
  const dishes = [
    {zh:'蒸蟹',       en:'Steamed Crab',                            jp:'蒸しロブスター', img:'image/donggang-steamed-crab.png', alt: '阿慶鮮魚湯招牌菜：清蒸螃蟹'},
    {zh:'烤草蝦',     en:'Grilled Giant Tiger Shrimp',             jp:'蒸し カニ',       img:'image/donggang-grilled-shrimp.jpeg', alt: '鹽烤草蝦，阿慶鮮魚湯推薦的東港美食'},
    {zh:'黑鮪魚生魚片',   en:'Bluefin Tuna Sashimi', jp:'クロマグロ刺身',     img:'image/donggang-sashimi.png', alt: '阿慶鮮魚湯的招牌東港生魚片，來自鹽埔漁港每日現撈'},
    {zh:'螃蟹味噌湯',   en:'Crab Miso Soup',                         jp:'カニ味噌汁',       img:'image/donggang-lobster-soup.png', alt: '螃蟹味噌湯，阿慶鮮魚湯的暖胃湯品，東港海鮮餐廳必點'},
    {zh:'螺肉生魚片', en:'Sliced Sea Whelk (Conch) Sashimi',                   jp:'つぶ貝刺身',   img:'image/donggang-seasnail.png', alt: '螺肉生魚片，阿慶鮮魚湯的東港隱藏版美食'},
  ];

  const imgEl   = document.getElementById('spotlight-img');
  const metaEl  = document.getElementById('spotlight-meta');
  const titleEl = document.getElementById('spotlight-title');
  const enEl    = document.getElementById('spotlight-sub');
  const jpEl    = document.getElementById('spotlight-subjp');
  const listEl  = document.getElementById('spotlight-list');
  const section = document.getElementById('spotlight');

  let current = 0, timer = null;
  const INTERVAL_MS = 3000;
  const FADE_MS = 350;

  function buildList(){
    listEl.innerHTML = dishes
      .map((d,i)=>`<li class="spotlight-item ${i===current?'active':''}" role="option" aria-selected="${i===current}" data-index="${i}" tabindex="0">${d.zh}</li>`)
      .join('');
  }

  function fadeSwap(update){
    imgEl.classList.add('is-fading');
    metaEl.classList.add('is-fading');
    setTimeout(()=>{
      update();
      // reflow so fade-in runs
      void imgEl.offsetWidth; void metaEl.offsetWidth;
      imgEl.classList.remove('is-fading');
      metaEl.classList.remove('is-fading');
    }, FADE_MS);
  }

  function show(i){
    current = (i + dishes.length) % dishes.length;
    const d = dishes[current];
    fadeSwap(()=>{
      imgEl.src = d.img; imgEl.alt = d.zh;
      titleEl.textContent = d.zh;
      enEl.textContent    = d.en;
      jpEl.textContent    = d.jp || '';
      buildList();
    });
  }

  function next(){ show(current+1); }
  function start(){ stop(); timer = setInterval(next, INTERVAL_MS); }
  function stop(){ if(timer){ clearInterval(timer); timer = null; } }

  listEl.addEventListener('click', (e)=>{
    const li = e.target.closest('.spotlight-item');
    if(!li) return; show(parseInt(li.dataset.index,10)); start();
  });
  listEl.addEventListener('keydown', (e)=>{
    const li = e.target.closest('.spotlight-item');
    if(!li) return;
    if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); show(parseInt(li.dataset.index,10)); start(); }
  });
  section.addEventListener('mouseenter', stop);
  section.addEventListener('mouseleave', start);

  // init
  buildList(); show(0); start();
})();


// Reviews logic
(function(){
  const defaultReviews = [
    { author: '陳憶雯', date: '2025/01/24', text: '好豐盛的海產桌菜，料理很好吃，食材也很新鮮！服務親切，下次還要再來。', avatar: 'image/review1.png' },
    { author: '秀風', date: '2025/08/25', text: '涼拌海菜口感獨特必點；小鰭鐮齒魚炸後仍軟嫩；海味天蠶包蝦肉與花枝漿，超推。', avatar: 'image/review2.png' },
    { author: 'Shu Shu Chung', date: '2023/06/21', text: '東西新鮮好吃！老闆娘很熱情，來很多次了。', avatar: 'image/review3.png' },
    { author: '蔡詩雯', date: '2025/08/22', text: '漁貨多樣選擇，很新鮮', avatar: 'image/review4.png' },
    { author: 'Summer Hsiao', date: '2024/09/20', text: '新鮮又好吃，價格合理；不用到東港人擠人也吃得到美味。生意很好，建議提早或先訂位！', avatar: 'image/review5.png' },
    { author: '黃Leo', date: '2025/08/19', text: '室內有冷氣、廁所乾淨舒適；塔香西施舌鮮味十足、超級下飯，服務態度也很好。', avatar: 'image/review6.png' },
    { author: '陳柏睿', date: '2025/03/16', text: '從舊地點吃到新店；大熱天有冷氣很舒服、海鮮新鮮好吃。二訪嚐黑鮪魚聖杯，細嫩好吃，推薦！', avatar: 'image/review7.png' },
    { author: 'Erin Ho', date: '2025/07/28', text: '食材絕對有青，板娘的海鮮都是野生，不賣養殖。', avatar: 'image/review8.png' }
  ];

  function cardHTML(r){
    const avatarHtml = r.avatar
      ? `<img class="review-avatar" src="${r.avatar}" alt="${r.author} 的頭像" loading="lazy">`
      : `<i class="bi bi-person-circle fs-4"></i>`;
    const nameHtml = r.authorUrl
      ? `<a href="${r.authorUrl}" target="_blank" rel="noopener" class="text-decoration-none">${r.author}</a>`
      : `${r.author}`;
    return `
      <figure class="review-card">
        <div class="review-header">
          ${avatarHtml}
          <div>
            <div class="review-name">${nameHtml}</div>
            <div class="small text-secondary">${r.date}</div>
          </div>
          <span class="g-badge" aria-label="Google review"><img src="image/google-review-logo.png" alt=""></span>
        </div>
        <div class="stars mb-2">★★★★★</div>
        <figcaption class="mb-0">${r.text}</figcaption>
      </figure>
    `;
  }

  function setMarqueeSpeed(group){
    requestAnimationFrame(()=>{
      const width = group.scrollWidth;
      const pxPerSec = 60;
      const duration = Math.max(25, Math.round(width / pxPerSec));
      const track = document.getElementById('reviewTrack');
      if(track) track.style.setProperty('--marquee-duration', duration + 's');
    });
  }

  function updateReviewTrack(items){
    const track = document.getElementById('reviewTrack');
    if(!track) return;
    const group = document.createElement('div');
    group.className = 'review-group';
    group.innerHTML = items.map(cardHTML).join('');
    const clone = group.cloneNode(true);
    track.innerHTML = '';
    track.appendChild(group);
    track.appendChild(clone);
    setMarqueeSpeed(group);
  }

  // init marquee with defaults
  updateReviewTrack(defaultReviews);
  const seeAll = document.getElementById('seeAllReviews');
  if(seeAll && !seeAll.href){ seeAll.href = 'https://maps.google.com/?q=阿慶鮮魚湯'; }

  // Optional: live Google Reviews (requires key + place id)
  const GOOGLE_PLACE_ID = window.GOOGLE_PLACE_ID || '';
  const GOOGLE_MAPS_API_KEY = window.GOOGLE_MAPS_API_KEY || '';
  async function fetchGoogleReviews(){
    if(!GOOGLE_MAPS_API_KEY || !GOOGLE_PLACE_ID){ return; }
    try{
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(GOOGLE_PLACE_ID)}&fields=rating,reviews,url,user_ratings_total&key=${GOOGLE_MAPS_API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();
      const list = (data.result?.reviews || []).filter(r=>Math.round(r.rating)===5);
      const normalized = list.map(r=>({
        author: r.author_name || 'Google 使用者',
        authorUrl: r.author_url || '',
        avatar: r.profile_photo_url || '',
        date: new Date((r.time? r.time*1000 : Date.now())).toLocaleDateString(),
        text: r.text || ''
      }));
      if(normalized.length){ updateReviewTrack(normalized); }
      if(data.result?.url && seeAll){ seeAll.href = data.result.url; }
    }catch(err){ console.error('Places API error:', err); }
  }
  fetchGoogleReviews();
})();


// Back-to-top button logic
(function(){
  const btn = document.getElementById('backToTop');
  if(!btn) return;

  const showAt = 240; // px scrolled before showing
  const onScroll = () => {
    if (window.scrollY > showAt) btn.style.display = 'inline-flex';
    else btn.style.display = 'none';
  };
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// Highlight active nav link based on URL (for FAQ.html)
(function(){
  const currentPath = window.location.pathname.split('/').pop();
  if (!currentPath) return; // index.html

  const navLink = document.querySelector(`.nav-link[href="${currentPath}"]`);
  if (navLink) {
    // Remove active class from all links
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    // Add active class to the current page's link
    navLink.classList.add('active');
  }
})();