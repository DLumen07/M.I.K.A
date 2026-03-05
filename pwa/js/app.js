// Aralin 1 PWA - Main Application
(function() {
  'use strict';

  // ===== STATE =====
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
    let loaded = 0;
    const total = allImages.length;
    function onImgDone() {
      loaded++;
      if (loaded >= total) showDashboard();
    }
    allImages.forEach(src => {
      const img = new Image();
      img.onload = img.onerror = onImgDone;
      img.src = src;
    });
    // Fallback timeout
    setTimeout(showDashboard, 5000);

    // Setup navigation
    setupNavigation();
    setupFullscreen();
    setupPopup();
    setupDashboard();
  }

  function showDashboard() {
    if (loadingScreen && !loadingScreen.classList.contains('fade-out')) {
      loadingScreen.classList.add('fade-out');
      setTimeout(() => {
        loadingScreen.style.display = 'none';
        dashboard.classList.remove('hidden');
      }, 400);
    } else {
      app.classList.add('hidden');
      dashboard.classList.remove('hidden');
    }
    // Ensure dashboard is properly visible if coming back from an activity
    if (dashboard.classList.contains('hidden')) {
        dashboard.classList.remove('hidden');
    }
  }

  function setupDashboard() {
    const startBtn = $('#btnStartAralin1');
    if (startBtn) {
        startBtn.addEventListener('click', () => {
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

    // Update navigation arrows
    const prevBtn = $('#prevBtn');
    const nextBtn = $('#nextBtn');
    if (prevBtn) prevBtn.classList.toggle('disabled', index <= 0);
    if (nextBtn) nextBtn.classList.toggle('disabled', index >= ACTIVITIES.length - 1);

    // Update header
    const activity = ACTIVITIES[index];
    if (headerTitle) { headerTitle.textContent = activity.title; }
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

  function showPopup(title, content, anchorRect) {
    const popup = hotspotPopup.querySelector('.popup-content');
    popup.classList.remove('tail-top', 'tail-bottom');
    popup.style.cssText = '';
    hotspotPopup.querySelector('.popup-title').textContent = title;
    hotspotPopup.querySelector('.popup-body').textContent = content;
    hotspotPopup.classList.remove('hidden');
    if (anchorRect) positionPopup(anchorRect);
  }

  function positionPopup(anchorRect) {
    const popup = hotspotPopup.querySelector('.popup-content');
    const vpW = window.innerWidth;
    const vpH = window.innerHeight;

    // Mobile: disable JS positioning so it snaps to the bottom correctly via CSS
    if (vpW <= 600) {
      popup.classList.remove('tail-top', 'tail-bottom');
      popup.style.cssText = '';
      return;
    }

    const tailH = 14;
    const margin = 10;
    // Measure actual rendered dimensions (handles mobile max-width)
    const popRect = popup.getBoundingClientRect();
    const popW = popRect.width || 300;
    const popH = popRect.height || 185;

    const ax = anchorRect.left + anchorRect.width / 2;

    // Center horizontally on anchor, clamp to viewport
    let left = ax - popW / 2;
    left = Math.max(margin, Math.min(left, vpW - popW - margin));

    // Tail X offset relative to popup left edge
    const tailX = Math.max(16, Math.min(ax - left, popW - 16));

    // Show above if there's enough room, otherwise below
    let top, tailClass;
    if (anchorRect.top - popH - tailH - margin > 0) {
      top = anchorRect.top - popH - tailH;
      tailClass = 'tail-bottom';
    } else {
      top = anchorRect.bottom + tailH;
      tailClass = 'tail-top';
    }
    top = Math.max(margin, Math.min(top, vpH - popH - margin));

    popup.classList.add(tailClass);
    popup.style.left = left + 'px';
    popup.style.top  = top  + 'px';
    popup.style.setProperty('--tail-x', tailX + 'px');
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

    // Add Instruction Overlay
    if (activity.instruction) {
      const instr = document.createElement('div');
      instr.className = 'hotspot-instruction';
      
      const ribbonText = activity.title; // Use title (e.g. "Aktibiti 2")
      let bodyText = activity.instruction;
      
      // Optional: Bold "Panuto:" if present
      if (bodyText.startsWith('Panuto:')) {
        bodyText = '<strong>Panuto:</strong> ' + bodyText.substring(7);
      }

      instr.innerHTML = `
        <div class="instr-inner">
          <div class="instr-ribbon">${ribbonText}</div>
          <div class="instr-text">${bodyText}</div>
        </div>
      `;
      view.appendChild(instr);
    }

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
      // marker.style.backgroundColor = activity.hotspotColor; // Use CSS theme instead
      marker.innerHTML = '+';
      marker.title = hs.title;
      marker.style.left = hs.x + '%';
      marker.style.top = hs.y + '%';

      marker.addEventListener('click', () => {
        showPopup(hs.title, hs.content, marker.getBoundingClientRect());
      });

      wrapper.appendChild(marker);
    });

    // view.appendChild(wrapper); // Removed: wrapper is now inside container
  }

  // ===== RENDERER: DRAG & DROP (Aktibiti 3, 5) =====
  function renderDragDrop(view, activity) {
    view.classList.add('view-drag-drop');

    // Panuto — above the scroll container, always visible
    if (activity.instruction) {
      const instr = document.createElement('div');
      instr.className = 'hotspot-instruction';
      instr.innerHTML = `
        <div class="instr-inner">
          <div class="instr-ribbon">${activity.title}</div>
          <div class="instr-text"><strong>Panuto:</strong> ${activity.instruction}</div>
        </div>
      `;
      view.appendChild(instr);
    }

    // Scroll-snap container — all slides stacked vertically
    const scrollContainer = document.createElement('div');
    scrollContainer.className = 'dd-scroll-container';
    view.appendChild(scrollContainer);

    // Render all slides at once as scroll-snap sections
    activity.slides.forEach((_, slideIndex) => {
      buildSlideSection(scrollContainer, activity, slideIndex);
    });
  }

  function buildSlideSection(scrollContainer, activity, slideIndex) {
    let sectionSelectedWord = null;
    const slide = activity.slides[slideIndex];
    const words = slide.words || activity.words;
    const usedWords = new Set();
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
          placeWord(zone, word, usedWords);
        }
      });

      // Click to remove placed word, or place selected word (click fallback)
      zone.addEventListener('click', () => {
        if (sectionSelectedWord && !zone.classList.contains('correct')) {
          placeWord(zone, sectionSelectedWord, usedWords);
          sectionSelectedWord = null;
        } else if (zone.classList.contains('filled') && !zone.classList.contains('correct')) {
          const word = zone.dataset.placed;
          usedWords.delete(word);
          zone.innerHTML = '';
          zone.classList.remove('filled');
          delete zone.dataset.placed;
          updateWordButtons(section, usedWords);
        }
      });

      dropZones.push(zone);
      sentencesDiv.appendChild(sentenceP);
    });

    contentWrapper.appendChild(sentencesDiv);
    section.appendChild(contentWrapper);

    // Word choices — overlaid on image if present, otherwise below content
    const wordsDiv = document.createElement('div');
    wordsDiv.classList.add('dd-words');
    if (imgContainer) {
      imgContainer.appendChild(wordsDiv);
    } else {
      section.appendChild(wordsDiv);
    }

    const shuffled = [...words].sort(() => Math.random() - 0.5);
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

      // Touch drag support
      let touchClone = null;
      btn.addEventListener('touchstart', (e) => {
        if (btn.classList.contains('used')) return;
        e.preventDefault();
        const touch = e.touches[0];
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
        section.querySelectorAll('.dd-drop-zone:not(.correct)').forEach(z => z.classList.add('highlight'));
      }, { passive: false });

      btn.addEventListener('touchmove', (e) => {
        if (!touchClone) return;
        e.preventDefault();
        const touch = e.touches[0];
        touchClone.style.left = (touch.clientX - 40) + 'px';
        touchClone.style.top = (touch.clientY - 20) + 'px';
      }, { passive: false });

      btn.addEventListener('touchend', (e) => {
        if (!touchClone) return;
        const touch = e.changedTouches[0];
        if (touchClone.parentNode) touchClone.parentNode.removeChild(touchClone);
        touchClone = null;
        btn.classList.remove('dragging');
        section.querySelectorAll('.dd-drop-zone').forEach(z => z.classList.remove('highlight'));

        const target = document.elementFromPoint(touch.clientX, touch.clientY);
        const zone = target && (target.classList.contains('dd-drop-zone') ? target : target.closest('.dd-drop-zone'));
        if (zone && !zone.classList.contains('correct')) {
          placeWord(zone, word, usedWords);
        }
      });

      btn.addEventListener('click', () => {
        if (btn.classList.contains('used')) return;
        section.querySelectorAll('.dd-word').forEach(b => b.classList.remove('selected'));
        if (sectionSelectedWord === word) {
          sectionSelectedWord = null;
        } else {
          sectionSelectedWord = word;
          btn.classList.add('selected');
        }
      });

      wordsDiv.appendChild(btn);
    });

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
    resetBtn.addEventListener('click', () => buildSlideSection(scrollContainer, activity, slideIndex));
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

  function placeWord(zone, word, usedWords) {
    // Remove any existing word in this zone
    if (zone.dataset.placed) {
      usedWords.delete(zone.dataset.placed);
    }

    zone.innerHTML = `<span class="placed-word">${word}</span>`;
    zone.classList.add('filled');
    zone.dataset.placed = word;
    usedWords.add(word);

    // Update word buttons
    const panelEl = zone.closest('.dd-scroll-section');
    panelEl.querySelectorAll('.dd-word').forEach(b => b.classList.remove('selected'));
    updateWordButtons(panelEl, usedWords);
  }

  function updateWordButtons(view, usedWords) {
    view.querySelectorAll('.dd-word').forEach(btn => {
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
              const nextSection = viewport.querySelector('[data-slide-index="' + (slideIndex + 1) + '"]');
              if (nextSection) nextSection.scrollIntoView({ behavior: 'smooth' });
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

  // ===== START =====
  document.addEventListener('DOMContentLoaded', init);
})();
