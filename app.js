/* ========================================
   APP CONTROLLER
   UI logic, event handling, state management
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ======== INITIALIZATION ========
  const canvas = document.getElementById('pitchCanvas');
  const renderer = new PitchRenderer(canvas);
  const engine = new AnimationEngine(renderer);

  let currentFormation = '433';

  // ======== DOM REFERENCES ========
  const tabs = document.querySelectorAll('.tab');
  const btnPlay = document.getElementById('btnPlay');
  const btnReset = document.getElementById('btnReset');
  const btnPrevStep = document.getElementById('btnPrevStep');
  const btnNextStep = document.getElementById('btnNextStep');
  const playIcon = document.getElementById('playIcon');
  const pauseIcon = document.getElementById('pauseIcon');
  const progressFill = document.getElementById('progressFill');
  const progressSteps = document.getElementById('progressSteps');
  const progressBar = document.getElementById('progressBar');
  const speedSlider = document.getElementById('speedSlider');
  const speedValue = document.getElementById('speedValue');
  const btnSmooth = document.getElementById('btnSmooth');
  const btnStepwise = document.getElementById('btnStepwise');
  const btnCompare = document.getElementById('btnCompare');
  const compareModal = document.getElementById('compareModal');
  const modalClose = document.getElementById('modalClose');

  // Panels
  const formationTitle = document.getElementById('formationTitle');
  const formationSubtitle = document.getElementById('formationSubtitle');
  const formationStyle = document.getElementById('formationStyle');
  const formationOverview = document.getElementById('formationOverview');
  const strengthsList = document.getElementById('strengthsList');
  const weaknessesList = document.getElementById('weaknessesList');
  const famousTeams = document.getElementById('famousTeams');
  const commentaryFeed = document.getElementById('commentaryFeed');
  const phaseTimeline = document.getElementById('phaseTimeline');
  const phaseIndicator = document.getElementById('phaseIndicator');
  const phaseNumber = document.getElementById('phaseNumber');
  const phaseLabel = document.getElementById('phaseLabel');
  const phaseDesc = document.getElementById('phaseDesc');
  const insightText = document.getElementById('insightText');

  // ======== FORMATION SWITCHING ========
  function loadFormation(key) {
    currentFormation = key;
    engine.setFormation(key);
    updateInfoPanel(key);
    updateTimeline(key);
    updateProgressSteps(key);
    clearCommentary();
    hidePhaseIndicator();
    updatePlayButton();
    addCommentaryItem('Ready', `${FORMATIONS[key].name} formation loaded. Press play to see the attacking pattern unfold, or use the step buttons to go through each phase.`);
    insightText.textContent = FORMATIONS[key].overview;
  }

  function updateInfoPanel(key) {
    const f = FORMATIONS[key];
    formationTitle.textContent = f.name;
    formationSubtitle.textContent = f.subtitle;
    formationStyle.textContent = f.style;
    formationOverview.textContent = f.overview;

    strengthsList.innerHTML = f.strengths.map(s => `<li>${s}</li>`).join('');
    weaknessesList.innerHTML = f.weaknesses.map(w => `<li>${w}</li>`).join('');
    famousTeams.innerHTML = f.famousTeams.map(t => `<span class="team-chip">${t}</span>`).join('');
  }

  function updateTimeline(key) {
    const phases = FORMATIONS[key].attackPattern.phases;
    phaseTimeline.innerHTML = phases.map((p, i) => `
      <div class="timeline-item" data-phase="${i}">
        <div class="timeline-dot">${i + 1}</div>
        <div class="timeline-info">
          <div class="timeline-title">${p.name}</div>
          <div class="timeline-desc">${p.shortDesc}</div>
        </div>
      </div>
    `).join('');

    // Click to jump to phase
    phaseTimeline.querySelectorAll('.timeline-item').forEach(item => {
      item.addEventListener('click', () => {
        const idx = parseInt(item.dataset.phase);
        engine.goToPhase(idx);
        if (engine.mode === 'step') {
          engine.playPhaseOnce(idx);
        }
      });
    });
  }

  function updateProgressSteps(key) {
    const phases = FORMATIONS[key].attackPattern.phases;
    progressSteps.innerHTML = phases.map((_, i) => {
      const pct = ((i + 0.5) / phases.length) * 100;
      return `<div class="progress-step-marker" data-phase="${i}" style="left:${pct}%"></div>`;
    }).join('');

    progressSteps.querySelectorAll('.progress-step-marker').forEach(marker => {
      marker.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(marker.dataset.phase);
        engine.goToPhase(idx);
        if (engine.mode === 'step') {
          engine.playPhaseOnce(idx);
        }
      });
    });
  }

  function highlightTimelinePhase(phaseIndex) {
    phaseTimeline.querySelectorAll('.timeline-item').forEach((item, i) => {
      item.classList.remove('active', 'completed');
      if (i === phaseIndex) item.classList.add('active');
      else if (i < phaseIndex) item.classList.add('completed');
    });

    progressSteps.querySelectorAll('.progress-step-marker').forEach((marker, i) => {
      marker.classList.remove('active', 'completed');
      if (i === phaseIndex) marker.classList.add('active');
      else if (i < phaseIndex) marker.classList.add('completed');
    });
  }

  // ======== COMMENTARY ========
  function addCommentaryItem(phaseName, text) {
    const existing = commentaryFeed.querySelectorAll('.commentary-item');
    existing.forEach(el => el.classList.remove('active'));

    const item = document.createElement('div');
    item.className = 'commentary-item active';
    item.innerHTML = `<div class="comment-phase">${phaseName}</div>${text}`;
    commentaryFeed.prepend(item);

    // Keep only last 10 items
    const items = commentaryFeed.querySelectorAll('.commentary-item');
    if (items.length > 10) {
      items[items.length - 1].remove();
    }
  }

  function clearCommentary() {
    commentaryFeed.innerHTML = '';
  }

  // ======== PHASE INDICATOR ========
  function showPhaseIndicator(phase, index) {
    phaseNumber.textContent = index + 1;
    phaseLabel.textContent = phase.name;
    phaseDesc.textContent = phase.shortDesc;
    phaseIndicator.classList.add('visible');
  }

  function hidePhaseIndicator() {
    phaseIndicator.classList.remove('visible');
  }

  // ======== ENGINE CALLBACKS ========
  engine.onPhaseChange = (phaseIndex) => {
    if (phaseIndex < 0) {
      hidePhaseIndicator();
      highlightTimelinePhase(-1);
      return;
    }

    const phase = FORMATIONS[currentFormation].attackPattern.phases[phaseIndex];
    showPhaseIndicator(phase, phaseIndex);
    highlightTimelinePhase(phaseIndex);
    addCommentaryItem(phase.name, phase.description);
    insightText.textContent = phase.insight;
  };

  engine.onProgressUpdate = (progress) => {
    progressFill.style.width = (progress * 100) + '%';
  };

  engine.onComplete = () => {
    updatePlayButton();
    addCommentaryItem('Complete', `The ${FORMATIONS[currentFormation].name} attacking pattern is complete. Use the step buttons to review each phase, or try another formation.`);
  };

  // ======== PLAYBACK CONTROLS ========
  function updatePlayButton() {
    if (engine.isPlaying) {
      playIcon.style.display = 'none';
      pauseIcon.style.display = '';
    } else {
      playIcon.style.display = '';
      pauseIcon.style.display = 'none';
    }
  }

  btnPlay.addEventListener('click', () => {
    if (engine.isPlaying) {
      engine.pause();
    } else {
      if (engine.progress >= 1) {
        engine.reset();
        loadFormation(currentFormation);
      }
      engine.play();
    }
    updatePlayButton();
  });

  btnReset.addEventListener('click', () => {
    engine.reset();
    loadFormation(currentFormation);
    updatePlayButton();
  });

  btnPrevStep.addEventListener('click', () => {
    engine.prevStep();
    updatePlayButton();
  });

  btnNextStep.addEventListener('click', () => {
    engine.nextStep();
    updatePlayButton();
  });

  // Speed
  speedSlider.addEventListener('input', () => {
    engine.speed = parseFloat(speedSlider.value);
    speedValue.textContent = speedSlider.value + 'x';
  });

  // Mode toggle
  btnSmooth.addEventListener('click', () => {
    engine.mode = 'smooth';
    btnSmooth.classList.add('active');
    btnStepwise.classList.remove('active');
  });

  btnStepwise.addEventListener('click', () => {
    engine.mode = 'step';
    btnStepwise.classList.add('active');
    btnSmooth.classList.remove('active');
    engine.pause();
    updatePlayButton();
  });

  // Progress bar click
  progressBar.addEventListener('click', (e) => {
    const rect = progressBar.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) / rect.width;
    const phases = FORMATIONS[currentFormation].attackPattern.phases;
    const phaseIndex = Math.min(Math.floor(clickX * phases.length), phases.length - 1);
    engine.goToPhase(phaseIndex);
    if (engine.mode === 'step') {
      engine.playPhaseOnce(phaseIndex);
    }
    updatePlayButton();
  });

  // ======== FORMATION TABS ========
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      loadFormation(tab.dataset.formation);
    });
  });

  // ======== COMPARE MODAL ========
  btnCompare.addEventListener('click', () => {
    buildCompareModal();
    compareModal.classList.add('visible');
  });

  modalClose.addEventListener('click', () => {
    compareModal.classList.remove('visible');
  });

  compareModal.addEventListener('click', (e) => {
    if (e.target === compareModal) {
      compareModal.classList.remove('visible');
    }
  });

  function buildCompareModal() {
    const grid = document.getElementById('compareGrid');
    grid.innerHTML = '';

    ['433', '442', '4231'].forEach(key => {
      const f = FORMATIONS[key];
      const card = document.createElement('div');
      card.className = 'compare-card';
      card.innerHTML = `
        <div class="compare-card-header">
          <h3>${f.name}</h3>
          <p>${f.subtitle}</p>
        </div>
        <div class="compare-card-body">
          <div class="compare-section">
            <h4>Ratings</h4>
            ${Object.entries(f.stats).map(([stat, val]) => `
              <div class="compare-stat-row">
                <span class="compare-stat-label">${stat.charAt(0).toUpperCase() + stat.slice(1)}</span>
                <div class="compare-stat-bar">
                  <div class="stat-bar-track">
                    <div class="stat-bar-fill" style="width:${val}%"></div>
                  </div>
                  <span class="compare-stat-value">${val}</span>
                </div>
              </div>
            `).join('')}
          </div>
          <div class="compare-section">
            <h4>Strengths</h4>
            <div class="compare-traits">
              ${f.strengths.slice(0, 2).map(s => `<div class="compare-trait strength">${s}</div>`).join('')}
            </div>
          </div>
          <div class="compare-section">
            <h4>Weaknesses</h4>
            <div class="compare-traits">
              ${f.weaknesses.slice(0, 2).map(w => `<div class="compare-trait weakness">${w}</div>`).join('')}
            </div>
          </div>
          <div class="compare-section">
            <h4>Best For</h4>
            <p>${getBestFor(key)}</p>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });

    // Animate stat bars
    requestAnimationFrame(() => {
      grid.querySelectorAll('.stat-bar-fill').forEach(bar => {
        const w = bar.style.width;
        bar.style.width = '0%';
        requestAnimationFrame(() => {
          bar.style.width = w;
        });
      });
    });
  }

  function getBestFor(key) {
    const descriptions = {
      '433': 'Teams with fast, skillful wingers who want to dominate possession and press high. Ideal when you have a numerical advantage in attack and can afford to leave the midfield lighter.',
      '442': 'Teams that value defensive solidity and direct play. Perfect when you have a strong strike partnership and wide midfielders who can deliver quality crosses and track back.',
      '4231': 'Teams that want tactical flexibility and control. Great for sides with a creative number 10 and a strong lone striker. The safest choice when facing an unknown opponent.'
    };
    return descriptions[key];
  }

  // ======== KEYBOARD SHORTCUTS ========
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT') return;

    switch (e.code) {
      case 'Space':
        e.preventDefault();
        btnPlay.click();
        break;
      case 'ArrowRight':
        e.preventDefault();
        btnNextStep.click();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        btnPrevStep.click();
        break;
      case 'KeyR':
        btnReset.click();
        break;
      case 'Digit1':
        tabs[0].click();
        break;
      case 'Digit2':
        tabs[1].click();
        break;
      case 'Digit3':
        tabs[2].click();
        break;
      case 'KeyC':
        btnCompare.click();
        break;
      case 'Escape':
        compareModal.classList.remove('visible');
        break;
    }
  });

  // ======== WINDOW RESIZE ========
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      renderer.resize();
      engine.render();
    }, 100);
  });

  // ======== INITIAL LOAD ========
  loadFormation('433');
});
