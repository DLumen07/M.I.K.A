// M.I.K.A PWA - Main Application
(function() {
  'use strict';

  // ===== STATE =====
  let currentAralin = 'aralin1';
  let currentActivity = 0;
  let currentSlide = 0;
  let selectedWord = null;
  let quizState = { index: 0, score: 0, answered: false };
  let audioEl = null;

  // ===== DOM REFS (initialized in init()) =====
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);
  let loadingScreen, app, dashboard, container, headerTitle, headerSubtitle, hotspotPopup, feedbackOverlay;

  // ===== INIT =====
  function init() {
    // Initialize DOM refs
    loadingScreen = $('#loadingScreen');
    app = $('#app');
    dashboard = $('#dashboard');
    container = $('#activityContainer');
    headerTitle = $('#headerTitle');
    headerSubtitle = $('#headerSubtitle');
    hotspotPopup = $('#hotspotPopup');
    feedbackOverlay = $('#feedbackOverlay');

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    }

    // Preload ALL activity images for instant display
    const allImages = [];
    ACTIVITIES.forEach(act => {
      if (act.bg) allImages.push(act.bg);
      if (act.slides) {
        act.slides.forEach(slide => {
          if (slide.sentences) {
            slide.sentences.forEach(s => { if (s.image) allImages.push(s.image); });
          }
        });
      }
    });
    // Also preload dashboard images
    allImages.push('assets/images/sunrays.png');
    allImages.push('assets/images/MIKA_header.png');
    let loaded = 0;
    const total = allImages.length;
    let dashboardShown = false;
    const minLoadTime = 4500; // minimum 4.5s loading screen
    const loadStart = Date.now();

    function triggerDashboard() {
      if (dashboardShown) return;
      const elapsed = Date.now() - loadStart;
      const remaining = Math.max(0, minLoadTime - elapsed);
      setTimeout(() => {
        if (dashboardShown) return;
        dashboardShown = true;
        showDashboard();
      }, remaining);
    }

    function onImgDone() {
      loaded++;
      if (loaded >= total) triggerDashboard();
    }
    if (total === 0) {
      triggerDashboard();
    } else {
      allImages.forEach(src => {
        const img = new Image();
        img.onload = img.onerror = onImgDone;
        img.src = src;
      });
    }
    // Fallback timeout
    setTimeout(() => { if (!dashboardShown) { dashboardShown = true; showDashboard(); } }, 5000);

    // Setup navigation
    setupNavigation();
    setupFullscreen();
    setupPopup();
    setupDashboard();
    setupThemeToggle();
    initProgressDots();

    // Restore navigation state after refresh
    restoreState();
  }

  function saveState(inActivity, index) {
    try {
      sessionStorage.setItem('mika_state', JSON.stringify({ inActivity, index, aralin: currentAralin }));
    } catch(e) {}
  }

  function restoreState() {
    try {
      const raw = sessionStorage.getItem('mika_state');
      if (!raw) return;
      const state = JSON.parse(raw);
      if (state.aralin) switchAralin(state.aralin);
      if (state.inActivity && state.index >= 0 && state.index < ACTIVITIES.length) {
        dashboard.classList.add('hidden');
        app.classList.remove('hidden');
        navigateTo(state.index);
      }
    } catch(e) {}
  }

  function switchAralin(aralinKey) {
    if (!LESSONS[aralinKey]) return;
    currentAralin = aralinKey;
    ACTIVITIES = LESSONS[aralinKey].activities;
    initProgressDots();
  }

  function isAralinUnlocked(aralinKey) {
    try {
      const progress = JSON.parse(localStorage.getItem('mika_progress') || '{}');
      return !!progress[aralinKey];
    } catch(e) { return false; }
  }

  function markAralinComplete(aralinKey) {
    try {
      const progress = JSON.parse(localStorage.getItem('mika_progress') || '{}');
      progress[aralinKey] = true;
      localStorage.setItem('mika_progress', JSON.stringify(progress));
    } catch(e) {}
  }

  function updateDashboardLocks() {
    const card2 = document.getElementById('cardAralin2');
    if (!card2) return;
    if (isAralinUnlocked('aralin2')) {
      card2.classList.remove('locked');
      card2.classList.add('active');
      const lockIcon = card2.querySelector('.lock-icon');
      const numSpan = card2.querySelector('.unlock-number');
      if (lockIcon) lockIcon.style.display = 'none';
      if (numSpan) numSpan.style.display = '';
      const btn = card2.querySelector('#btnStartAralin2');
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Simulan →';
      }
      const desc = card2.querySelector('.dash-card-desc');
      if (desc) desc.textContent = 'Mga Salita sa Konteksto';
    }
  }

  function setupThemeToggle() {
    const toggle = $('#themeToggle');
    if (!toggle) return;
    // Restore saved theme
    const saved = localStorage.getItem('mika_theme');
    if (saved === 'light') document.body.classList.add('light-mode');
    toggle.addEventListener('click', () => {
      document.body.classList.toggle('light-mode');
      const isLight = document.body.classList.contains('light-mode');
      localStorage.setItem('mika_theme', isLight ? 'light' : 'dark');
    });
  }

  function showDashboard() {
    // Dismiss loading screen with animation
    if (loadingScreen && !loadingScreen.classList.contains('fade-out')) {
      loadingScreen.classList.add('fade-out');
      setTimeout(() => {
        loadingScreen.style.display = 'none';
        // Only show dashboard if user isn't already in an activity (e.g. restored state)
        if (!app.classList.contains('hidden')) return;
        dashboard.classList.remove('hidden');
      }, 400);
      return;
    }
    // Coming back from an activity (Home button)
    app.classList.add('hidden');
    dashboard.classList.remove('hidden');
    updateDashboardLocks();
    saveState(false, 0);
  }

  function setupDashboard() {
    const startBtn1 = $('#btnStartAralin1');
    if (startBtn1) {
      startBtn1.addEventListener('click', () => {
        switchAralin('aralin1');
        dashboard.classList.add('hidden');
        app.classList.remove('hidden');
        navigateTo(0);
      });
    }

    const startBtn2 = $('#btnStartAralin2');
    if (startBtn2) {
      startBtn2.addEventListener('click', () => {
        switchAralin('aralin2');
        dashboard.classList.add('hidden');
        app.classList.remove('hidden');
        navigateTo(0);
      });
    }

    const startBtn3 = $('#btnStartAralin3');
    if (startBtn3) {
      startBtn3.addEventListener('click', () => {
        switchAralin('aralin3');
        dashboard.classList.add('hidden');
        app.classList.remove('hidden');
        navigateTo(0);
      });
    }

    const homeBtn = $('#btnHome');
    if (homeBtn) {
      homeBtn.addEventListener('click', () => {
        stopAudio();
        showDashboard();
      });
    }

    updateDashboardLocks();
  }

  function showApp() {
    // Deprecated in favor of showDashboard logic, but kept if needed
    if (app.classList.contains('hidden')) {
      loadingScreen.classList.add('fade-out');
      setTimeout(() => {
        loadingScreen.remove();
        app.classList.remove('hidden');
        navigateTo(0);
      }, 400);
    }
  }

  // ===== PROGRESS DOTS =====
  function initProgressDots() {
    const nav = $('#navProgress');
    if (!nav) return;
    nav.innerHTML = '';
    ACTIVITIES.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = 'nav-dot' + (i === 0 ? ' active' : '');
      nav.appendChild(dot);
    });
  }

  function updateProgressDots(index) {
    const dots = document.querySelectorAll('.nav-dot');
    dots.forEach((dot, i) => {
      dot.classList.remove('active', 'completed');
      if (i === index) dot.classList.add('active');
      else if (i < index) dot.classList.add('completed');
    });
  }

  // ===== NAVIGATION =====
  function setupNavigation() {
    const prev = $('#prevBtn');
    const next = $('#nextBtn');
    
    if (prev) prev.addEventListener('click', () => {
      if (currentActivity > 0) navigateTo(currentActivity - 1);
    });
    
    if (next) next.addEventListener('click', () => {
      if (currentActivity < ACTIVITIES.length - 1) navigateTo(currentActivity + 1);
    });

    // Keyboard support
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        if (currentActivity > 0) navigateTo(currentActivity - 1);
      } else if (e.key === 'ArrowRight') {
        if (currentActivity < ACTIVITIES.length - 1) navigateTo(currentActivity + 1);
      }
    });
  }

  function navigateTo(index) {
    if (index < 0 || index >= ACTIVITIES.length) return;

    // Clean up previous
    stopAudio();
    selectedWord = null;
    currentSlide = 0;
    currentActivity = index;
    saveState(true, index);

    // Update navigation arrows
    const prevBtn = $('#prevBtn');
    const nextBtn = $('#nextBtn');
    if (prevBtn) prevBtn.classList.toggle('disabled', index <= 0);
    if (nextBtn) nextBtn.classList.toggle('disabled', index >= ACTIVITIES.length - 1);

    // Mark aralin complete when reaching last activity
    if (index >= ACTIVITIES.length - 1) {
      markAralinComplete(currentAralin);
      // Unlock next aralin
      if (currentAralin === 'aralin1') markAralinComplete('aralin2');
    }

    // Update progress dots
    updateProgressDots(index);

    // Update header
    const activity = ACTIVITIES[index];
    const lessonLabel = LESSONS[currentAralin] ? LESSONS[currentAralin].title : '';
    if (headerTitle) { headerTitle.textContent = lessonLabel + ' - ' + activity.title; }
    if (headerSubtitle) { headerSubtitle.textContent = activity.subtitle || ''; }

    // Render activity
    container.innerHTML = '';
    const view = document.createElement('div');
    view.classList.add('activity-enter');
    view.dataset.activityId = activity.id;

    switch (activity.type) {
      case 'image-audio': renderImageAudio(view, activity); break;
      case 'hotspots':    renderHotspots(view, activity); break;
      case 'drag-drop':   renderDragDrop(view, activity); break;
      case 'quiz':        renderQuiz(view, activity); break;
      case 'true-false':  renderTrueFalse(view, activity); break;
      case 'poem-audio':  renderPoemAudio(view, activity); break;
      case 'word-match':  renderWordMatch(view, activity); break;
    }

    container.appendChild(view);
  }

  // ===== FULLSCREEN =====
  function setupFullscreen() {
    $('#btnFullscreen').addEventListener('click', toggleFullscreen);
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      (document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen || function(){}).call(document.documentElement);
    } else {
      (document.exitFullscreen || document.webkitExitFullscreen || function(){}).call(document);
    }
  }

  // ===== POPUP =====
  function setupPopup() {
    hotspotPopup.querySelector('.popup-backdrop').addEventListener('click', (e) => {
      e.stopPropagation();
      closePopup();
    });
    hotspotPopup.querySelector('.popup-close').addEventListener('click', (e) => {
      e.stopPropagation();
      closePopup();
    });
  }

  function showPopup(title, content) {
    const popup = hotspotPopup.querySelector('.popup-content');
    popup.style.cssText = '';
    hotspotPopup.querySelector('.popup-title').textContent = title;
    hotspotPopup.querySelector('.popup-body').textContent = content;
    hotspotPopup.classList.remove('hidden');
  }

  function closePopup() {
    hotspotPopup.classList.add('hidden');
  }

  // ===== FEEDBACK =====
  function showFeedback(icon, title, message, btnText, callback) {
    feedbackOverlay.querySelector('.feedback-icon').textContent = icon;
    feedbackOverlay.querySelector('.feedback-title').textContent = title;
    feedbackOverlay.querySelector('.feedback-message').textContent = message;
    const btn = $('#feedbackBtn');
    btn.textContent = btnText || 'Magpatuloy';
    btn.onclick = () => {
      feedbackOverlay.classList.add('hidden');
      if (callback) callback();
    };
    feedbackOverlay.classList.remove('hidden');
  }

  // ===== AUDIO =====
  function stopAudio() {
    if (audioEl) {
      audioEl.pause();
      audioEl.currentTime = 0;
      audioEl = null;
    }
  }

  // ===== RENDERER: IMAGE + AUDIO (Aktibiti 1) =====
  function renderImageAudio(view, activity) {
    view.classList.add('view-image-audio');

    const img = document.createElement('img');
    img.classList.add('bg-image');
    img.src = activity.bg;
    img.alt = activity.title;
    img.draggable = false;
    view.appendChild(img);

    if (activity.audio) {
      audioEl = new Audio(activity.audio);
      const btn = document.createElement('button');
      btn.classList.add('audio-btn');
      btn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>`;
      btn.title = 'Pakinggan';

      // Position relative to image
      function positionBtn() {
        const rect = img.getBoundingClientRect();
        const cRect = view.getBoundingClientRect();
        btn.style.left = (rect.left - cRect.left + rect.width * (activity.audioX / 100)) + 'px';
        btn.style.top = (rect.top - cRect.top + rect.height * (activity.audioY / 100)) + 'px';        }
      img.onload = positionBtn;
      window.addEventListener('resize', () => {
        if (currentActivity === 0) positionBtn();
      });

      let playing = false;
      btn.addEventListener('click', () => {
        if (playing) {
          audioEl.pause();
          audioEl.currentTime = 0;
          btn.classList.remove('playing');
          playing = false;
        } else {
          audioEl.play();
          btn.classList.add('playing');
          playing = true;
        }
      });

      audioEl.addEventListener('ended', () => {
        btn.classList.remove('playing');
        playing = false;
      });

      view.appendChild(btn);
    }
  }

  // ===== RENDERER: HOTSPOTS (Aktibiti 2, 2.2) =====
  function renderHotspots(view, activity) {
    view.classList.add('view-hotspots');

    // Panuto — shown as popup overlay when activity opens
    if (activity.instruction) {
      let bodyText = activity.instruction;
      if (bodyText.startsWith('Panuto:')) {
        bodyText = bodyText.substring(7).trim();
      }
      const overlay = document.createElement('div');
      overlay.className = 'dd-panuto-overlay';
      overlay.innerHTML = `
        <div class="dd-panuto-modal">
          <div class="dd-panuto-icon">📖</div>
          <div class="dd-panuto-title">${activity.title}</div>
          <div class="dd-panuto-divider"></div>
          <div class="dd-panuto-label">Panuto</div>
          <div class="dd-panuto-body">${bodyText}</div>
          <button class="dd-panuto-close">Simulan →</button>
        </div>
      `;
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay || e.target.classList.contains('dd-panuto-close')) {
          overlay.classList.add('dd-panuto-hide');
          setTimeout(() => overlay.remove(), 300);
        }
      });
      view.appendChild(overlay);
    }

    // Check if hotspots have individual images (card layout) vs single bg image
    if (activity.hotspots[0] && activity.hotspots[0].img) {
      const grid = document.createElement('div');
      grid.className = 'hotspot-cards';
      view.appendChild(grid);

      activity.hotspots.forEach(hs => {
        const card = document.createElement('div');
        card.className = 'hotspot-card';

        const img = document.createElement('img');
        img.src = hs.img;
        img.alt = hs.title;
        img.draggable = false;
        card.appendChild(img);

        const label = document.createElement('div');
        label.className = 'hotspot-card-label';
        label.innerHTML = `<span class="hotspot-card-btn"><span class="hotspot-card-btn-ring"></span>+</span><span class="hotspot-card-title">${hs.title}</span>`;
        card.appendChild(label);

        card.addEventListener('click', () => {
          showPopup(hs.title, hs.content);
        });

        grid.appendChild(card);
      });
    } else {
      const container = document.createElement('div');
      container.className = 'hotspot-container-center';
      view.appendChild(container);

      const wrapper = document.createElement('div');
      wrapper.classList.add('hotspot-wrapper');
      container.appendChild(wrapper);

      const img = document.createElement('img');
      img.classList.add('bg-image');
      img.src = activity.bg;
      img.alt = activity.title;
      img.draggable = false;
      wrapper.appendChild(img);

      activity.hotspots.forEach(hs => {
        const marker = document.createElement('button');
        marker.classList.add('hotspot-marker');
        marker.innerHTML = '+';
        marker.title = hs.title;
        marker.style.left = hs.x + '%';
        marker.style.top = hs.y + '%';

        marker.addEventListener('click', () => {
          showPopup(hs.title, hs.content);
        });

        wrapper.appendChild(marker);
      });
    }
  }

  // ===== RENDERER: DRAG & DROP (Aktibiti 3, 5) =====
  function renderDragDrop(view, activity) {
    view.classList.add('view-drag-drop');

    // Check if this is a text-only activity (no images in slides)
    const hasImages = activity.slides.some(s => s.sentences.some(sen => sen.image));
    if (!hasImages) view.classList.add('dd-text-only');

    // Panuto — shown as popup overlay when activity opens
    if (activity.instruction) {
      const overlay = document.createElement('div');
      overlay.className = 'dd-panuto-overlay';
      overlay.innerHTML = `
        <div class="dd-panuto-modal">
          <div class="dd-panuto-icon">📖</div>
          <div class="dd-panuto-title">${activity.title}</div>
          <div class="dd-panuto-divider"></div>
          <div class="dd-panuto-label">Panuto</div>
          <div class="dd-panuto-body">${activity.instruction}</div>
          <button class="dd-panuto-close">Simulan →</button>
        </div>
      `;
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay || e.target.classList.contains('dd-panuto-close')) {
          overlay.classList.add('dd-panuto-hide');
          setTimeout(() => overlay.remove(), 300);
        }
      });
      view.appendChild(overlay);
    }

    // Shared state across all slides
    const sharedState = {
      usedWords: new Set(),
      selectedWord: null
    };

    // Collect all unique words from the activity
    const allWords = new Set(activity.words || []);
    activity.slides.forEach(slide => {
      if (slide.words) slide.words.forEach(w => allWords.add(w));
    });

    // Shared word choices header — sticky above scroll
    const wordsDiv = document.createElement('div');
    wordsDiv.classList.add('dd-words');
    const shuffled = [...allWords].sort(() => Math.random() - 0.5);
    shuffled.forEach(word => {
      const btn = document.createElement('button');
      btn.classList.add('dd-word');
      btn.textContent = word;
      btn.dataset.word = word;
      btn.draggable = true;

      // HTML5 drag start
      btn.addEventListener('dragstart', (e) => {
        if (btn.classList.contains('used')) { e.preventDefault(); return; }
        e.dataTransfer.setData('text/plain', word);
        e.dataTransfer.effectAllowed = 'move';
        btn.classList.add('dragging');
      });
      btn.addEventListener('dragend', () => {
        btn.classList.remove('dragging');
      });

      // Touch support: tap to select OR drag to drop
      let touchClone = null;
      let touchStartX = 0, touchStartY = 0;
      let isDragging = false;
      let touchDecided = false;
      const DRAG_THRESHOLD = 8;

      btn.addEventListener('touchstart', (e) => {
        if (btn.classList.contains('used')) return;
        const touch = e.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        isDragging = false;
        touchDecided = false;
        touchClone = null;
      }, { passive: true });

      btn.addEventListener('touchmove', (e) => {
        if (btn.classList.contains('used')) return;
        const touch = e.touches[0];
        const dx = touch.clientX - touchStartX;
        const dy = touch.clientY - touchStartY;

        // If not yet decided, determine intent
        if (!touchDecided && (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD)) {
          touchDecided = true;
          // Only start drag if horizontal movement dominates, or already on the word
          isDragging = true;
          e.preventDefault();
          touchClone = btn.cloneNode(true);
          touchClone.classList.add('dd-word-ghost');
          touchClone.style.position = 'fixed';
          touchClone.style.left = (touch.clientX - 40) + 'px';
          touchClone.style.top = (touch.clientY - 20) + 'px';
          touchClone.style.zIndex = '9999';
          touchClone.style.pointerEvents = 'none';
          touchClone.style.opacity = '0.85';
          document.body.appendChild(touchClone);
          btn.classList.add('dragging');
          view.classList.add('dd-dragging');
          view.querySelectorAll('.dd-drop-zone:not(.correct)').forEach(z => z.classList.add('highlight'));
        }

        if (isDragging && touchClone) {
          e.preventDefault();
          touchClone.style.left = (touch.clientX - 40) + 'px';
          touchClone.style.top = (touch.clientY - 20) + 'px';
        }
      }, { passive: false });

      btn.addEventListener('touchend', (e) => {
        if (btn.classList.contains('used')) return;

        if (isDragging && touchClone) {
          const touch = e.changedTouches[0];
          if (touchClone.parentNode) touchClone.parentNode.removeChild(touchClone);
          touchClone = null;
          btn.classList.remove('dragging');
          view.classList.remove('dd-dragging');
          view.querySelectorAll('.dd-drop-zone').forEach(z => z.classList.remove('highlight'));

          const target = document.elementFromPoint(touch.clientX, touch.clientY);
          const zone = target && (target.classList.contains('dd-drop-zone') ? target : target.closest('.dd-drop-zone'));
          if (zone && !zone.classList.contains('correct')) {
            placeWord(zone, word, sharedState.usedWords, wordsDiv);
          }
        } else {
          wordsDiv.querySelectorAll('.dd-word').forEach(b => b.classList.remove('selected'));
          if (sharedState.selectedWord === word) {
            sharedState.selectedWord = null;
          } else {
            sharedState.selectedWord = word;
            btn.classList.add('selected');
          }
        }
        isDragging = false;
      });

      btn.addEventListener('click', () => {
        if (btn.classList.contains('used')) return;
        wordsDiv.querySelectorAll('.dd-word').forEach(b => b.classList.remove('selected'));
        if (sharedState.selectedWord === word) {
          sharedState.selectedWord = null;
        } else {
          sharedState.selectedWord = word;
          btn.classList.add('selected');
        }
      });

      wordsDiv.appendChild(btn);
    });

    // Wrap word bank in a glass-effect header
    const wordBankHeader = document.createElement('div');
    wordBankHeader.classList.add('dd-words-header');
    wordBankHeader.appendChild(wordsDiv);
    view.appendChild(wordBankHeader);

    // Scroll-snap container — all slides stacked vertically
    const scrollContainer = document.createElement('div');
    scrollContainer.className = 'dd-scroll-container';
    view.appendChild(scrollContainer);

    // Track current slide index for navigation
    let ddCurrentSlide = 0;

    // Slide navigation bar (only for multi-slide activities)
    let slideNavDiv = null;
    let slideCounter = null;
    let prevBtn = null;
    let nextBtn = null;

    if (activity.slides.length > 1) {
      slideNavDiv = document.createElement('div');
      slideNavDiv.className = 'slide-nav';

      prevBtn = document.createElement('button');
      prevBtn.className = 'slide-nav-btn';
      prevBtn.innerHTML = '&#9664;';
      prevBtn.disabled = true;
      prevBtn.addEventListener('click', () => {
        if (ddCurrentSlide > 0) {
          ddCurrentSlide--;
          showDdSlide(ddCurrentSlide);
        }
      });

      nextBtn = document.createElement('button');
      nextBtn.className = 'slide-nav-btn';
      nextBtn.innerHTML = '&#9654;';
      nextBtn.addEventListener('click', () => {
        if (ddCurrentSlide < activity.slides.length - 1) {
          ddCurrentSlide++;
          showDdSlide(ddCurrentSlide);
        }
      });

      slideCounter = document.createElement('span');
      slideCounter.className = 'slide-counter';

      slideNavDiv.appendChild(prevBtn);
      slideNavDiv.appendChild(slideCounter);
      slideNavDiv.appendChild(nextBtn);
      view.appendChild(slideNavDiv);
    }

    // Build all slides upfront
    activity.slides.forEach((_, slideIndex) => {
      buildSlideSection(scrollContainer, activity, slideIndex, sharedState, wordsDiv);
    });

    // Function to show/hide slides and update word buttons per slide
    function showDdSlide(index) {
      ddCurrentSlide = index;
      const sections = scrollContainer.querySelectorAll('.dd-scroll-section');
      sections.forEach((s, i) => {
        s.style.display = i === index ? '' : 'none';
      });

      // Update word buttons: show only words for the current slide  
      const slideWords = activity.slides[index].words || activity.words || [];
      wordsDiv.querySelectorAll('.dd-word').forEach(btn => {
        const word = btn.dataset.word;
        if (slideWords.includes(word)) {
          btn.style.display = '';
        } else {
          btn.style.display = 'none';
        }
        // Reset selection state
        btn.classList.remove('selected');
      });
      sharedState.selectedWord = null;

      // Update nav buttons
      if (slideNavDiv) {
        prevBtn.disabled = index === 0;
        nextBtn.disabled = index === activity.slides.length - 1;
        slideCounter.textContent = (index + 1) + ' / ' + activity.slides.length;
      }
    }

    // Initialize first slide
    if (activity.slides.length > 1) {
      // Store showDdSlide on the view so checkDragDrop can access it
      view._showDdSlide = showDdSlide;
      showDdSlide(0);
    }
  }

  function buildSlideSection(scrollContainer, activity, slideIndex, sharedState, wordsDiv) {
    const slide = activity.slides[slideIndex];
    const dropZones = [];

    // Section — one scroll-snap point per slide
    const section = document.createElement('div');
    section.className = 'dd-scroll-section';
    section.dataset.slideIndex = slideIndex;

    // Image container — only created when slide has an image
    const slideImage = slide.sentences.find(s => s.image)?.image;
    let imgContainer = null;
    if (slideImage) {
      imgContainer = document.createElement('div');
      imgContainer.className = 'dd-img-container';
      const img = document.createElement('img');
      img.className = 'dd-sentence-img';
      img.src = slideImage;
      img.alt = '';
      imgContainer.appendChild(img);
      section.appendChild(imgContainer);
    }

    // Content wrapper — sentence text with drop zones, below the image
    const contentWrapper = document.createElement('div');
    contentWrapper.classList.add('dd-content-wrapper');

    const sentencesDiv = document.createElement('div');
    sentencesDiv.classList.add('dd-sentences');

    slide.sentences.forEach((s, i) => {
      const sentenceP = document.createElement('p');
      sentenceP.classList.add('dd-sentence');

      // First part of text
      const before = document.createElement('span');
      before.textContent = s.parts[0];
      sentenceP.appendChild(before);

      // Inline drop zone (the blank)
      const zone = document.createElement('span');
      zone.classList.add('dd-drop-zone');
      zone.dataset.index = i;
      zone.dataset.correct = s.correct;
      sentenceP.appendChild(zone);

      // Second part of text
      if (s.parts[1]) {
        const after = document.createElement('span');
        after.textContent = s.parts[1];
        sentenceP.appendChild(after);
      }

      // Drop zone: accept drops
      zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (!zone.classList.contains('correct')) zone.classList.add('highlight');
      });
      zone.addEventListener('dragleave', () => {
        zone.classList.remove('highlight');
      });
      zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('highlight');
        const word = e.dataTransfer.getData('text/plain');
        if (word && !zone.classList.contains('correct')) {
          placeWord(zone, word, sharedState.usedWords, wordsDiv);
        }
      });

      // Click to remove placed word, or place selected word
      zone.addEventListener('click', () => {
        if (sharedState.selectedWord && !zone.classList.contains('correct')) {
          placeWord(zone, sharedState.selectedWord, sharedState.usedWords, wordsDiv);
          sharedState.selectedWord = null;
        } else if (zone.classList.contains('filled') && !zone.classList.contains('correct')) {
          const word = zone.dataset.placed;
          sharedState.usedWords.delete(word);
          zone.innerHTML = '';
          zone.classList.remove('filled');
          delete zone.dataset.placed;
          updateWordButtons(wordsDiv, sharedState.usedWords);
        }
      });

      dropZones.push(zone);
      sentencesDiv.appendChild(sentenceP);
    });

    contentWrapper.appendChild(sentencesDiv);
    section.appendChild(contentWrapper);

    // Controls (Suriin/Ulitin)
    const controls = document.createElement('div');
    controls.classList.add('dd-controls');

    const checkBtn = document.createElement('button');
    checkBtn.classList.add('dd-check-btn');
    checkBtn.textContent = 'Suriin';
    checkBtn.addEventListener('click', () => checkDragDrop(dropZones, slide, section, scrollContainer, activity, slideIndex));
    controls.appendChild(checkBtn);

    const resetBtn = document.createElement('button');
    resetBtn.classList.add('dd-reset-btn');
    resetBtn.textContent = 'Ulitin';
    resetBtn.addEventListener('click', () => {
      // Clear used words for this section's zones
      section.querySelectorAll('.dd-drop-zone').forEach(z => {
        if (z.dataset.placed) sharedState.usedWords.delete(z.dataset.placed);
      });
      updateWordButtons(wordsDiv, sharedState.usedWords);
      buildSlideSection(scrollContainer, activity, slideIndex, sharedState, wordsDiv);
    });
    controls.appendChild(resetBtn);

    section.appendChild(controls);

    // Insert or replace existing section
    const existing = scrollContainer.querySelector('[data-slide-index="' + slideIndex + '"]');
    if (existing) {
      scrollContainer.replaceChild(section, existing);
      section.scrollIntoView({ behavior: 'instant' });
    } else {
      scrollContainer.appendChild(section);
    }
  }

  function placeWord(zone, word, usedWords, wordsDiv) {
    // Remove any existing word in this zone
    if (zone.dataset.placed) {
      usedWords.delete(zone.dataset.placed);
    }

    zone.innerHTML = `<span class="placed-word">${word}</span>`;
    zone.classList.add('filled');
    zone.dataset.placed = word;
    usedWords.add(word);

    // Update word buttons
    wordsDiv.querySelectorAll('.dd-word').forEach(b => b.classList.remove('selected'));
    updateWordButtons(wordsDiv, usedWords);
  }

  function updateWordButtons(wordsDiv, usedWords) {
    wordsDiv.querySelectorAll('.dd-word').forEach(btn => {
      btn.classList.toggle('used', usedWords.has(btn.dataset.word));
    });
  }

  function checkDragDrop(dropZones, slide, panel, viewport, activity, slideIndex) {
    let allCorrect = true;
    let allFilled = true;

    dropZones.forEach(zone => {
      const placed = zone.dataset.placed;
      const correct = zone.dataset.correct;

      if (!placed) {
        allFilled = false;
        allCorrect = false;
        zone.classList.add('highlight');
        setTimeout(() => zone.classList.remove('highlight'), 1000);
        return;
      }

      if (placed.toLowerCase() === correct.toLowerCase()) {
        zone.classList.remove('wrong', 'filled');
        zone.classList.add('correct');
      } else {
        zone.classList.remove('correct', 'filled');
        zone.classList.add('wrong');
        allCorrect = false;
        // Remove wrong word after delay
        setTimeout(() => {
          zone.classList.remove('wrong');
          zone.classList.add('filled');
        }, 800);
      }
    });

    if (!allFilled) return;

    if (allCorrect) {
      const isLast = slideIndex === activity.slides.length - 1;
      setTimeout(() => {
        showFeedback(
          '🎉',
          'Tama!',
          isLast ? 'Natapos mo na ang lahat ng slide!' : 'Magaling! Pumunta sa susunod na slide.',
          isLast ? 'Tapos na' : 'Susunod',
          () => {
            if (!isLast) {
              // Use slide navigation if available, otherwise scroll
              const viewEl = viewport.closest('.view-drag-drop');
              if (viewEl && viewEl._showDdSlide) {
                viewEl._showDdSlide(slideIndex + 1);
              } else {
                const nextSection = viewport.querySelector('[data-slide-index="' + (slideIndex + 1) + '"]');
                if (nextSection) nextSection.scrollIntoView({ behavior: 'smooth' });
              }
            }
          }
        );
      }, 600);
    }
  }

  // ===== RENDERER: QUIZ (Aktibiti 4) =====
  function renderQuiz(view, activity) {
    view.classList.add('view-quiz');
    quizState = { index: 0, score: 0, answered: false };
    renderQuizQuestion(view, activity, 0);

    // Panuto popup (appended after renderQuizQuestion so innerHTML='' doesn't wipe it)
    if (activity.instruction) {
      let bodyText = activity.instruction;
      if (bodyText.startsWith('Panuto:')) {
        bodyText = bodyText.substring(7).trim();
      }
      const overlay = document.createElement('div');
      overlay.className = 'dd-panuto-overlay';
      overlay.innerHTML = `
        <div class="dd-panuto-modal">
          <div class="dd-panuto-icon">📖</div>
          <div class="dd-panuto-title">${activity.title}</div>
          <div class="dd-panuto-divider"></div>
          <div class="dd-panuto-label">Panuto</div>
          <div class="dd-panuto-body">${bodyText}</div>
          <button class="dd-panuto-close">Simulan →</button>
        </div>
      `;
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay || e.target.classList.contains('dd-panuto-close')) {
          overlay.classList.add('dd-panuto-hide');
          setTimeout(() => overlay.remove(), 300);
        }
      });
      view.appendChild(overlay);
    }
  }

  function renderQuizQuestion(view, activity, qIndex) {
    view.innerHTML = '';
    quizState.index = qIndex;
    quizState.answered = false;
    const q = activity.questions[qIndex];

    const card = document.createElement('div');
    card.classList.add('quiz-card');

    // Progress dots
    const progress = document.createElement('div');
    progress.classList.add('quiz-progress');
    activity.questions.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.classList.add('quiz-progress-dot');
      if (i < qIndex) dot.classList.add('done');
      if (i === qIndex) dot.classList.add('active');
      progress.appendChild(dot);
    });
    card.appendChild(progress);

    // Counter
    const counter = document.createElement('div');
    counter.classList.add('quiz-counter');
    counter.textContent = `Tanong ${qIndex + 1} sa ${activity.questions.length}`;
    card.appendChild(counter);

    // Question text
    const questionDiv = document.createElement('div');
    questionDiv.classList.add('quiz-question');
    questionDiv.textContent = q.text;
    card.appendChild(questionDiv);

    // Choices - shuffle (keeping track of correct)
    const choices = q.choices.map((text, i) => ({ text, isCorrect: i === q.correct }));
    const shuffled = [...choices].sort(() => Math.random() - 0.5);

    const choicesDiv = document.createElement('div');
    choicesDiv.classList.add('quiz-choices');

    shuffled.forEach(choice => {
      const btn = document.createElement('button');
      btn.classList.add('quiz-choice');
      btn.textContent = choice.text;

      btn.addEventListener('click', () => {
        if (quizState.answered) return;
        quizState.answered = true;

        // Disable all choices
        choicesDiv.querySelectorAll('.quiz-choice').forEach(b => {
          b.disabled = true;
          if (b.textContent === choices.find(c => c.isCorrect).text) {
            b.classList.add('correct');
          }
        });

        if (choice.isCorrect) {
          btn.classList.add('correct');
          quizState.score++;
        } else {
          btn.classList.add('wrong');
        }

        // Auto advance
        setTimeout(() => {
          if (qIndex < activity.questions.length - 1) {
            renderQuizQuestion(view, activity, qIndex + 1);
          } else {
            // Quiz complete
            const total = activity.questions.length;
            const score = quizState.score;
            const percent = Math.round((score / total) * 100);
            const icon = percent >= 80 ? '🏆' : percent >= 60 ? '👍' : '📚';
            const msg = percent >= 80
              ? 'Napakagaling! Naunawaan mo ang mga salita.'
              : percent >= 60
                ? 'Maganda! Kaunti na lang at magiging perpekto ka.'
                : 'Subukan mo ulit upang mas matuto pa.';

            showFeedback(
              icon,
              `${score} / ${total} (${percent}%)`,
              msg,
              'Ulitin',
              () => renderQuiz(view, activity)
            );
          }
        }, choice.isCorrect ? 1200 : 2000);
      });

      choicesDiv.appendChild(btn);
    });

    card.appendChild(choicesDiv);
    view.appendChild(card);
  }

  // ===== RENDERER: TRUE-FALSE (Aralin 2 Aktibiti 5) =====
  function renderTrueFalse(view, activity) {
    view.classList.add('view-quiz');

    const state = { index: 0, score: 0 };
    renderTFSlide(view, activity, state);

    // Panuto — shown as popup overlay when activity opens (appended after renderTFSlide so innerHTML='' doesn't wipe it)
    if (activity.instruction) {
      let bodyText = activity.instruction;
      if (bodyText.startsWith('Panuto:')) {
        bodyText = bodyText.substring(7).trim();
      }
      const overlay = document.createElement('div');
      overlay.className = 'dd-panuto-overlay';
      overlay.innerHTML = `
        <div class="dd-panuto-modal">
          <div class="dd-panuto-icon">📖</div>
          <div class="dd-panuto-title">${activity.title}</div>
          <div class="dd-panuto-divider"></div>
          <div class="dd-panuto-label">Panuto</div>
          <div class="dd-panuto-body">${bodyText}</div>
          <button class="dd-panuto-close">Simulan →</button>
        </div>
      `;
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay || e.target.classList.contains('dd-panuto-close')) {
          overlay.classList.add('dd-panuto-hide');
          setTimeout(() => overlay.remove(), 300);
        }
      });
      view.appendChild(overlay);
    }
  }

  function renderTFSlide(view, activity, state) {
    view.innerHTML = '';
    const qIndex = state.index;
    const q = activity.questions[qIndex];
    const total = activity.questions.length;

    const card = document.createElement('div');
    card.classList.add('quiz-card');

    // Progress dots
    const progress = document.createElement('div');
    progress.classList.add('quiz-progress');
    activity.questions.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.classList.add('quiz-progress-dot');
      if (i < qIndex) dot.classList.add('done');
      if (i === qIndex) dot.classList.add('active');
      progress.appendChild(dot);
    });
    card.appendChild(progress);

    // Counter
    const counter = document.createElement('div');
    counter.classList.add('quiz-counter');
    counter.textContent = `Tanong ${qIndex + 1} sa ${total}`;
    card.appendChild(counter);

    // Question text
    const questionDiv = document.createElement('div');
    questionDiv.classList.add('quiz-question', 'tf-question');
    questionDiv.innerHTML = '\u201C' + q.text + '\u201D';
    card.appendChild(questionDiv);

    // Tama / Mali buttons
    const choicesDiv = document.createElement('div');
    choicesDiv.classList.add('tf-choices');
    let answered = false;

    const tamaBtn = document.createElement('button');
    tamaBtn.className = 'tf-btn tf-tama';
    tamaBtn.innerHTML = '<span class="tf-radio"></span> Tama';

    const maliBtn = document.createElement('button');
    maliBtn.className = 'tf-btn tf-mali';
    maliBtn.innerHTML = '<span class="tf-radio"></span> Mali';

    function handleAnswer(picked) {
      if (answered) return;
      answered = true;
      const isCorrect = picked === q.answer;
      if (isCorrect) state.score++;

      // Highlight correct and wrong
      const correctBtn = q.answer ? tamaBtn : maliBtn;
      const wrongBtn = q.answer ? maliBtn : tamaBtn;
      const pickedBtn = picked ? tamaBtn : maliBtn;

      correctBtn.classList.add('correct');
      if (!isCorrect) pickedBtn.classList.add('wrong');
      tamaBtn.disabled = true;
      maliBtn.disabled = true;
      checkBtn.disabled = true;

      // Auto advance
      setTimeout(() => {
        if (qIndex < total - 1) {
          state.index = qIndex + 1;
          renderTFSlide(view, activity, state);
        } else {
          const score = state.score;
          const percent = Math.round((score / total) * 100);
          const icon = percent >= 80 ? '\uD83C\uDFC6' : percent >= 60 ? '\uD83D\uDC4D' : '\uD83D\uDCDA';
          const msg = percent >= 80
            ? 'Napakagaling! Naunawaan mo ang mga salita.'
            : percent >= 60
              ? 'Maganda! Kaunti na lang at magiging perpekto ka.'
              : 'Subukan mo ulit upang mas matuto pa.';
          showFeedback(icon, `${score} / ${total} (${percent}%)`, msg, 'Ulitin', () => {
            state.index = 0; state.score = 0;
            renderTrueFalse(view, activity);
          });
        }
      }, isCorrect ? 1200 : 2000);
    }

    tamaBtn.addEventListener('click', () => { tamaBtn.classList.add('selected'); maliBtn.classList.remove('selected'); });
    maliBtn.addEventListener('click', () => { maliBtn.classList.add('selected'); tamaBtn.classList.remove('selected'); });

    choicesDiv.appendChild(tamaBtn);
    choicesDiv.appendChild(maliBtn);
    card.appendChild(choicesDiv);

    // Check button
    const checkBtn = document.createElement('button');
    checkBtn.className = 'tf-check-btn';
    checkBtn.innerHTML = '\u2714 Suriin';
    checkBtn.addEventListener('click', () => {
      if (tamaBtn.classList.contains('selected')) handleAnswer(true);
      else if (maliBtn.classList.contains('selected')) handleAnswer(false);
    });
    card.appendChild(checkBtn);

    view.appendChild(card);
  }

  // ===== RENDERER: WORD-MATCH (Aralin 2 Aktibiti 2) =====
  function renderWordMatch(view, activity) {
    const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const LINE_COLORS = ['#1976d2','#e65100','#6a1b9a','#2e7d32','#c62828','#00838f','#4e342e'];
    const wrapper = document.createElement('div');
    wrapper.className = 'wm-activity';

    // Panuto popup
    if (activity.instruction) {
      let bodyText = activity.instruction;
      if (bodyText.startsWith('Panuto:')) {
        bodyText = bodyText.substring(7).trim();
      }
      const overlay = document.createElement('div');
      overlay.className = 'dd-panuto-overlay';
      overlay.innerHTML =
        '<div class="dd-panuto-modal">' +
          '<div class="dd-panuto-icon">📖</div>' +
          '<div class="dd-panuto-title">' + escapeHtml(activity.title) + '</div>' +
          '<div class="dd-panuto-divider"></div>' +
          '<div class="dd-panuto-label">Panuto</div>' +
          '<div class="dd-panuto-body">' + bodyText + '</div>' +
          '<button class="dd-panuto-close">Simulan →</button>' +
        '</div>';
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay || e.target.classList.contains('dd-panuto-close')) {
          overlay.classList.add('dd-panuto-hide');
          setTimeout(() => overlay.remove(), 300);
        }
      });
      view.appendChild(overlay);
    }

    // Shuffle definitions
    const shuffledDefs = activity.pairs.map((p, i) => ({ text: p.definition, idx: i }));
    for (let i = shuffledDefs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledDefs[i], shuffledDefs[j]] = [shuffledDefs[j], shuffledDefs[i]];
    }

    const totalPairs = activity.pairs.length;
    const matches = {};       // wordIdx → shuffledDefPos
    let selectedWord = null;
    let checked = false;

    // Board: relative container for SVG lines + columns
    const board = document.createElement('div');
    board.className = 'wm-board';

    // SVG overlay for lines
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.classList.add('wm-lines');
    board.appendChild(svg);

    // Columns
    const columns = document.createElement('div');
    columns.className = 'wm-columns';

    // Words column (left, numbered 1-5)
    const wordsCol = document.createElement('div');
    wordsCol.className = 'wm-col wm-words-col';
    const wordEls = [];
    const wordDots = [];

    activity.pairs.forEach((pair, i) => {
      const row = document.createElement('div');
      row.className = 'wm-word';
      row.dataset.idx = i;
      row.innerHTML =
        '<span class="wm-word-num">' + (i + 1) + '</span>' +
        '<span class="wm-word-text">' + escapeHtml(pair.word) + '</span>' +
        '<span class="wm-dot wm-dot-r"></span>';
      row.addEventListener('click', () => onWordClick(i));
      wordsCol.appendChild(row);
      wordEls.push(row);
      wordDots.push(row.querySelector('.wm-dot'));
    });

    // Definitions column (right, lettered A-E)
    const defsCol = document.createElement('div');
    defsCol.className = 'wm-col wm-defs-col';
    const defEls = [];
    const defDots = [];

    shuffledDefs.forEach((def, si) => {
      const row = document.createElement('div');
      row.className = 'wm-def';
      row.dataset.sidx = si;
      row.dataset.idx = def.idx;
      row.innerHTML =
        '<span class="wm-dot wm-dot-l"></span>' +
        '<span class="wm-def-letter">' + LETTERS[si] + '</span>' +
        '<span class="wm-def-text">' + escapeHtml(def.text) + '</span>';
      row.addEventListener('click', () => onDefClick(si));
      defsCol.appendChild(row);
      defEls.push(row);
      defDots.push(row.querySelector('.wm-dot'));
    });

    columns.appendChild(wordsCol);
    columns.appendChild(defsCol);
    board.appendChild(columns);
    wrapper.appendChild(board);

    // Actions container
    const actions = document.createElement('div');
    actions.className = 'wm-actions';

    // Check button
    const checkBtn = document.createElement('button');
    checkBtn.className = 'wm-check-btn';
    checkBtn.textContent = 'Suriin';
    checkBtn.addEventListener('click', checkAnswers);
    actions.appendChild(checkBtn);

    // Clear button
    const clearBtn = document.createElement('button');
    clearBtn.className = 'wm-clear-btn';
    clearBtn.textContent = 'Alisin';
    clearBtn.addEventListener('click', clearAll);
    actions.appendChild(clearBtn);

    wrapper.appendChild(actions);

    view.appendChild(wrapper);

    // — Interaction logic —
    function clearAll() {
      if (checked) return; // Prevent clearing if already finished/checking
      
      // Clear data dictionary
      for (const key in matches) {
        delete matches[key];
      }
      // Reset variables
      selectedWord = null;
      
      // Remove visual classes
      wordEls.forEach(w => w.classList.remove('wm-selected', 'wm-linked', 'wm-correct', 'wm-incorrect'));
      defEls.forEach(d => d.classList.remove('wm-linked', 'wm-correct', 'wm-incorrect'));

      // Erase drawn lines
      drawLines();
    }
    function onWordClick(wi) {
      if (checked) return;
      // If already selected, deselect
      if (selectedWord === wi) {
        wordEls[wi].classList.remove('wm-selected');
        selectedWord = null;
        return;
      }
      // Remove previous selection highlight
      wordEls.forEach(w => w.classList.remove('wm-selected'));
      wordEls[wi].classList.add('wm-selected');
      selectedWord = wi;
    }

    function onDefClick(si) {
      if (checked || selectedWord === null) return;
      const wi = selectedWord;

      // Remove old match from this word if any
      if (matches[wi] !== undefined) {
        defEls[matches[wi]].classList.remove('wm-linked');
      }
      // Remove any other word that was pointing to this def
      Object.keys(matches).forEach(k => {
        if (parseInt(k) !== wi && matches[k] === si) {
          wordEls[k].classList.remove('wm-linked');
          delete matches[k];
        }
      });

      matches[wi] = si;
      wordEls[wi].classList.remove('wm-selected');
      wordEls[wi].classList.add('wm-linked');
      defEls[si].classList.add('wm-linked');
      selectedWord = null;
      drawLines();
    }

    function drawLines() {
      // Clear existing lines
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      const boardRect = board.getBoundingClientRect();
      svg.setAttribute('width', boardRect.width);
      svg.setAttribute('height', boardRect.height);

      Object.keys(matches).forEach((wi, ci) => {
        const si = matches[wi];
        const wDot = wordDots[wi];
        const dDot = defDots[si];
        const wr = wDot.getBoundingClientRect();
        const dr = dDot.getBoundingClientRect();

        const x1 = wr.left + wr.width / 2 - boardRect.left;
        const y1 = wr.top + wr.height / 2 - boardRect.top;
        const x2 = dr.left + dr.width / 2 - boardRect.left;
        const y2 = dr.top + dr.height / 2 - boardRect.top;

        const line = document.createElementNS(svgNS, 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('stroke', LINE_COLORS[parseInt(wi) % LINE_COLORS.length]);
        line.setAttribute('stroke-width', '3');
        line.setAttribute('stroke-linecap', 'round');
        line.dataset.wi = wi;
        svg.appendChild(line);
      });
    }

    // Redraw on resize
    window.addEventListener('resize', () => { if (!checked) drawLines(); });

    function checkAnswers() {
      if (Object.keys(matches).length < totalPairs) {
        showFeedback('\u26A0\uFE0F', 'Hindi pa kumpleto', 'Ikonekta muna ang lahat ng salita sa kahulugan bago suriin.', 'OK', null);
        return;
      }
      checked = true;
      checkBtn.disabled = true;
      checkBtn.classList.add('wm-btn-disabled');

      let correct = 0;
      // Color each line and card green/red
      Object.keys(matches).forEach(wi => {
        const si = matches[wi];
        const correctIdx = parseInt(wi);
        const defOrigIdx = parseInt(defEls[si].dataset.idx);
        const isCorrect = correctIdx === defOrigIdx;
        if (isCorrect) correct++;

        const cls = isCorrect ? 'wm-correct' : 'wm-incorrect';
        wordEls[wi].classList.add(cls);
        defEls[si].classList.add(cls);

        // Color SVG line
        const svgLine = svg.querySelector('line[data-wi="' + wi + '"]');
        if (svgLine) {
          svgLine.setAttribute('stroke', isCorrect ? '#2e7d32' : '#d32f2f');
          svgLine.setAttribute('stroke-width', isCorrect ? '3' : '3');
          if (!isCorrect) svgLine.setAttribute('stroke-dasharray', '6,4');
        }
      });

      setTimeout(() => {
        if (correct === totalPairs) {
          showFeedback('\u2705', 'Magaling!', 'Naitapat mo nang tama ang lahat ng salita sa kahulugan nito!', 'Magpatuloy', null);
        } else {
          showFeedback(
            correct > 0 ? '\uD83D\uDCA1' : '\u274C',
            correct + ' / ' + totalPairs + ' ang tama',
            'Suriin ang mga may pulang linya at subukan muli.',
            'Subukan Muli',
            () => retryMatch()
          );
        }
      }, 600);
    }

    function retryMatch() {
      checked = false;
      checkBtn.disabled = false;
      checkBtn.classList.remove('wm-btn-disabled');
      Object.keys(matches).forEach(wi => {
        wordEls[wi].classList.remove('wm-correct', 'wm-incorrect', 'wm-linked');
        defEls[matches[wi]].classList.remove('wm-correct', 'wm-incorrect', 'wm-linked');
      });
      // Clear only incorrect matches
      const toRemove = [];
      Object.keys(matches).forEach(wi => {
        const si = matches[wi];
        const defOrigIdx = parseInt(defEls[si].dataset.idx);
        if (parseInt(wi) !== defOrigIdx) {
          toRemove.push(wi);
        } else {
          // Keep correct ones locked
          wordEls[wi].classList.add('wm-correct', 'wm-linked');
          defEls[si].classList.add('wm-correct', 'wm-linked');
        }
      });
      toRemove.forEach(wi => delete matches[wi]);
      drawLines();
    }
  }

  // ===== RENDERER: POEM + AUDIO (Aralin 2 Aktibiti 1) =====
  function renderPoemAudio(view, activity) {
    const wrapper = document.createElement('div');
    wrapper.className = 'poem-activity';

    // Panuto popup overlay (auto-show)
    if (activity.instruction) {
      let bodyText = activity.instruction;
      if (bodyText.startsWith('Panuto:')) {
        bodyText = bodyText.substring(7).trim();
      }
      const overlay = document.createElement('div');
      overlay.className = 'dd-panuto-overlay';
      overlay.innerHTML =
        '<div class="dd-panuto-modal">' +
          '<div class="dd-panuto-icon">📖</div>' +
          '<div class="dd-panuto-title">' + escapeHtml(activity.title) + '</div>' +
          '<div class="dd-panuto-divider"></div>' +
          '<div class="dd-panuto-label">Panuto</div>' +
          '<div class="dd-panuto-body">' + bodyText + '</div>' +
          '<button class="dd-panuto-close">Simulan →</button>' +
        '</div>';
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay || e.target.classList.contains('dd-panuto-close')) {
          overlay.classList.add('dd-panuto-hide');
          setTimeout(() => overlay.remove(), 300);
        }
      });
      view.appendChild(overlay);
    }

    // Poem card
    const card = document.createElement('div');
    card.className = 'poem-card';

    // Title
    const titleWrap = document.createElement('div');
    titleWrap.className = 'poem-title-wrapper';
    const title = document.createElement('h2');
    title.className = 'poem-title';
    title.textContent = '\u201C' + activity.poemTitle + '\u201D';
    titleWrap.appendChild(title);
    card.appendChild(titleWrap);

    // Stanzas
    activity.stanzas.forEach(stanza => {
      const stanzaEl = document.createElement('div');
      stanzaEl.className = 'poem-stanza';
      stanza.lines.forEach(line => {
        const lineEl = document.createElement('span');
        lineEl.className = 'poem-line';
        if (line.bold) {
          lineEl.innerHTML = escapeHtml(line.text) +
            '<span class="poem-bold">' + escapeHtml(line.bold) + '</span>' +
            (line.after ? escapeHtml(line.after) : '');
        } else {
          lineEl.textContent = line.text;
        }
        stanzaEl.appendChild(lineEl);
      });
      card.appendChild(stanzaEl);
    });

    wrapper.appendChild(card);

    // Audio player bar
    const player = document.createElement('div');
    player.className = 'poem-player';

    const playBtn = document.createElement('button');
    playBtn.className = 'poem-play-btn';
    const playSVG = '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
    const pauseSVG = '<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
    playBtn.innerHTML = playSVG;

    const progressWrap = document.createElement('div');
    progressWrap.className = 'poem-progress-wrap';
    const progressFill = document.createElement('div');
    progressFill.className = 'poem-progress-fill';
    progressWrap.appendChild(progressFill);

    const timeLabel = document.createElement('span');
    timeLabel.className = 'poem-time';
    timeLabel.textContent = '0:00';

    player.appendChild(playBtn);
    player.appendChild(progressWrap);
    player.appendChild(timeLabel);
    wrapper.appendChild(player);

    const fmtTime = (s) => {
      const m = Math.floor(s / 60);
      const sec = Math.floor(s % 60);
      return m + ':' + (sec < 10 ? '0' : '') + sec;
    };

    let scrollRAF = null;
    let currentScroll = 0;

    const updateProgress = () => {
      if (!audioEl) return;
      const pct = audioEl.duration ? (audioEl.currentTime / audioEl.duration) * 100 : 0;
      progressFill.style.width = pct + '%';
      timeLabel.textContent = fmtTime(audioEl.currentTime);
    };

    progressWrap.addEventListener('click', (e) => {
      if (!audioEl || !audioEl.duration) return;
      const rect = progressWrap.getBoundingClientRect();
      const pct = (e.clientX - rect.left) / rect.width;
      audioEl.currentTime = pct * audioEl.duration;
      currentScroll = card.scrollTop;
    });

    playBtn.addEventListener('click', () => {
      if (audioEl && !audioEl.paused) {
        audioEl.pause();
        playBtn.innerHTML = playSVG;
        playBtn.classList.remove('playing');
      } else if (audioEl && audioEl.paused && audioEl.currentTime > 0) {
        audioEl.play().catch(() => {});
        playBtn.innerHTML = pauseSVG;
        playBtn.classList.add('playing');
      } else {
        audioEl = new Audio(activity.audio);
        audioEl.addEventListener('timeupdate', updateProgress);
        audioEl.play().catch(() => {});
        playBtn.innerHTML = pauseSVG;
        playBtn.classList.add('playing');
        audioEl.onended = () => {
          playBtn.innerHTML = playSVG;
          playBtn.classList.remove('playing');
          progressFill.style.width = '100%';
          audioEl = null;
        };
      }
    });

    view.appendChild(wrapper);
  }

  // ===== UTILS =====
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ===== START =====
  document.addEventListener('DOMContentLoaded', init);
})();
