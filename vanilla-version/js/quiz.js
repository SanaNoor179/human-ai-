/**
 * 15-Round Challenge & Results Matrix Logic (Vanilla JS)
 */

class VanillaQuizManager {
  constructor(app) {
    this.app = app;
    this.currentRoundIndex = 0;
    this.userResponses = [];
    this.currentGuess = null;
    this.isRevealed = false;
    this.selectedFactors = [];

    this.initElements();
    this.bindEvents();
  }

  initElements() {
    this.quizSection = document.getElementById('quiz-view');
    this.resultsSection = document.getElementById('results-view');

    // Quiz elements
    this.roundTracker = document.getElementById('quiz-round-tracker');
    this.tierBadge = document.getElementById('quiz-tier-badge');
    this.subjectTitle = document.getElementById('quiz-subject-title');
    this.quizImg = document.getElementById('quiz-main-img');
    this.zoomInspectBtn = document.getElementById('quiz-zoom-btn');
    
    // Guess buttons
    this.btnGuessHuman = document.getElementById('btn-guess-human');
    this.btnGuessAI = document.getElementById('btn-guess-ai');
    this.guessContainer = document.getElementById('quiz-guess-actions');

    // Outcome Reveal Container
    this.outcomeContainer = document.getElementById('quiz-outcome-container');
    this.outcomeBanner = document.getElementById('quiz-outcome-banner');
    this.outcomeTitle = document.getElementById('quiz-outcome-title');
    this.outcomeOriginBadge = document.getElementById('quiz-outcome-badge');
    this.outcomeExplanation = document.getElementById('quiz-outcome-explanation');
    this.outcomeCreator = document.getElementById('quiz-outcome-creator');
    this.factorsContainer = document.getElementById('quiz-factors-container');
    this.nextRoundBtn = document.getElementById('quiz-next-btn');

    // Image Modal for Inspect
    this.modal = document.getElementById('image-inspect-modal');
    this.modalImg = document.getElementById('inspect-modal-img');
    this.modalClose = document.getElementById('inspect-modal-close');
    this.modalCategory = document.getElementById('inspect-modal-category');
  }

  bindEvents() {
    this.btnGuessHuman.addEventListener('click', () => this.handleGuess('HUMAN'));
    this.btnGuessAI.addEventListener('click', () => this.handleGuess('AI'));

    this.zoomInspectBtn.addEventListener('click', () => this.openInspectModal());
    this.quizImg.addEventListener('click', () => this.openInspectModal());
    this.modalClose.addEventListener('click', () => this.closeInspectModal());
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.closeInspectModal();
    });

    this.nextRoundBtn.addEventListener('click', () => this.handleNextRound());

    // Factors click delegate
    this.factorsContainer.addEventListener('click', (e) => {
      const chip = e.target.closest('.v-factor-chip');
      if (chip) {
        const factor = chip.getAttribute('data-factor');
        if (this.selectedFactors.includes(factor)) {
          this.selectedFactors = this.selectedFactors.filter(f => f !== factor);
          chip.classList.remove('is-selected');
        } else {
          this.selectedFactors.push(factor);
          chip.classList.add('is-selected');
        }
      }
    });
  }

  startTest() {
    this.currentRoundIndex = 0;
    this.userResponses = [];
    this.currentGuess = null;
    this.isRevealed = false;
    this.selectedFactors = [];
    this.renderRound();
    this.app.navigateTo('quiz');
  }

  renderRound() {
    const item = window.TEST_DATA[this.currentRoundIndex];
    if (!item) return;

    this.currentGuess = null;
    this.isRevealed = false;
    this.selectedFactors = [];

    // Header info
    this.roundTracker.textContent = `Round ${item.round} of ${window.TEST_DATA.length}`;
    this.tierBadge.textContent = item.difficulty;
    this.subjectTitle.textContent = item.category;

    // Image
    this.quizImg.src = item.image;
    this.quizImg.alt = item.category;

    // Reset view states
    this.guessContainer.style.display = 'flex';
    this.outcomeContainer.style.display = 'none';
    this.btnGuessHuman.classList.remove('active', 'disabled');
    this.btnGuessAI.classList.remove('active', 'disabled');

    // Build factor chips
    this.factorsContainer.innerHTML = '';
    window.INFLUENCE_FACTORS.forEach(factor => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'v-factor-chip';
      chip.setAttribute('data-factor', factor);
      chip.innerHTML = `<span>${factor}</span>`;
      this.factorsContainer.appendChild(chip);
    });

    // Next button text
    const isLast = this.currentRoundIndex === window.TEST_DATA.length - 1;
    this.nextRoundBtn.innerHTML = `<span>${isLast ? 'Finish Test & View Score Matrix' : 'Next Subject'}</span> <span>→</span>`;

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  handleGuess(choice) {
    if (this.isRevealed) return;
    this.currentGuess = choice;
    this.isRevealed = true;

    const item = window.TEST_DATA[this.currentRoundIndex];
    const isCorrect = choice === item.actualOrigin;

    // Record response
    this.userResponses[this.currentRoundIndex] = {
      round: item.round,
      difficulty: item.difficulty,
      guess: choice,
      actual: item.actualOrigin,
      isCorrect,
      factors: []
    };

    // Style buttons
    if (choice === 'HUMAN') {
      this.btnGuessHuman.classList.add('active');
    } else {
      this.btnGuessAI.classList.add('active');
    }

    // Configure Outcome Banner
    if (isCorrect) {
      this.outcomeBanner.className = 'v-outcome-banner is-correct';
      this.outcomeTitle.textContent = 'CORRECT DECISION!';
    } else {
      this.outcomeBanner.className = 'v-outcome-banner is-incorrect';
      this.outcomeTitle.textContent = 'INCORRECT EVALUATION.';
    }

    const isAI = item.actualOrigin === 'AI';
    this.outcomeOriginBadge.className = `v-outcome-origin-badge ${isAI ? 'is-ai' : 'is-human'}`;
    this.outcomeOriginBadge.textContent = item.actualLabel;

    this.outcomeExplanation.textContent = item.explanation;
    if (item.creatorDetails) {
      this.outcomeCreator.style.display = 'block';
      this.outcomeCreator.innerHTML = `<strong>Production Context:</strong> ${item.creatorDetails}`;
    } else {
      this.outcomeCreator.style.display = 'none';
    }

    // Show outcome section smoothly
    this.outcomeContainer.style.display = 'block';
    this.outcomeContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  handleNextRound() {
    // Save selected factors
    if (this.userResponses[this.currentRoundIndex]) {
      this.userResponses[this.currentRoundIndex].factors = [...this.selectedFactors];
    }

    if (this.currentRoundIndex < window.TEST_DATA.length - 1) {
      this.currentRoundIndex++;
      this.renderRound();
    } else {
      this.renderResults();
      this.app.navigateTo('results');
    }
  }

  renderResults() {
    const total = this.userResponses.length;
    const correctCount = this.userResponses.filter(r => r && r.isCorrect).length;
    const scorePct = total > 0 ? Math.round((correctCount / total) * 100) : 0;

    // Summary Score
    document.getElementById('res-score-pct').textContent = `${scorePct}%`;
    document.getElementById('res-score-ratio').textContent = `${correctCount} of ${total} subjects correctly identified`;

    // Tier Accuracy
    const tiers = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];
    tiers.forEach(tier => {
      const inTier = window.TEST_DATA.filter(t => t.difficulty === tier);
      const answersInTier = this.userResponses.filter(r => r && r.difficulty === tier);
      const correctInTier = answersInTier.filter(r => r.isCorrect).length;
      const pct = inTier.length > 0 ? Math.round((correctInTier / inTier.length) * 100) : 0;

      const pctEl = document.getElementById(`res-tier-${tier.toLowerCase()}-pct`);
      const ratioEl = document.getElementById(`res-tier-${tier.toLowerCase()}-ratio`);
      const barEl = document.getElementById(`res-tier-${tier.toLowerCase()}-bar`);
      if (pctEl) pctEl.textContent = `${pct}%`;
      if (ratioEl) ratioEl.textContent = `${correctInTier}/${inTier.length}`;
      if (barEl) barEl.style.width = `${pct}%`;
    });

    // Human vs AI Accuracy
    const humanRounds = window.TEST_DATA.filter(t => t.actualOrigin === 'HUMAN');
    const aiRounds = window.TEST_DATA.filter(t => t.actualOrigin === 'AI');
    const humanCorrect = this.userResponses.filter(r => r && r.actual === 'HUMAN' && r.isCorrect).length;
    const aiCorrect = this.userResponses.filter(r => r && r.actual === 'AI' && r.isCorrect).length;
    const humanPct = humanRounds.length > 0 ? Math.round((humanCorrect / humanRounds.length) * 100) : 0;
    const aiPct = aiRounds.length > 0 ? Math.round((aiCorrect / aiRounds.length) * 100) : 0;

    document.getElementById('res-human-pct').textContent = `${humanPct}%`;
    document.getElementById('res-human-bar').style.width = `${humanPct}%`;
    document.getElementById('res-ai-pct').textContent = `${aiPct}%`;
    document.getElementById('res-ai-bar').style.width = `${aiPct}%`;

    // Bias Statement
    const biasEl = document.getElementById('res-bias-statement');
    if (humanPct > aiPct + 10) {
      biasEl.textContent = 'You demonstrated strong sensitivity to human physical craft and photographic imperfection, but occasionally mistook subtle AI synthesis for authentic art.';
    } else if (aiPct > humanPct + 10) {
      biasEl.textContent = 'You excelled at detecting generative diffusion artifacts and mathematical specular highlights, though you occasionally suspected real human photographs were synthetic.';
    } else {
      biasEl.textContent = 'Balanced perceptual evaluation: your discernment was remarkably even across both physical human craft and algorithmic synthesis.';
    }

    // Factors Breakdown
    const factorCounts = {};
    window.INFLUENCE_FACTORS.forEach(f => { factorCounts[f] = 0; });
    this.userResponses.forEach(r => {
      if (r && r.factors) {
        r.factors.forEach(f => {
          factorCounts[f] = (factorCounts[f] || 0) + 1;
        });
      }
    });

    const factorListEl = document.getElementById('res-factors-list');
    factorListEl.innerHTML = '';
    const maxCount = Math.max(1, ...Object.values(factorCounts));

    window.INFLUENCE_FACTORS.forEach(f => {
      const count = factorCounts[f] || 0;
      const barPct = Math.round((count / maxCount) * 100);
      const row = document.createElement('div');
      row.className = 'v-factor-bar-row';
      row.innerHTML = `
        <div class="v-factor-bar-label">
          <span>${f}</span>
          <span class="v-factor-bar-count">${count} selections</span>
        </div>
        <div class="v-factor-bar-track">
          <div class="v-factor-bar-fill" style="width: ${barPct}%;"></div>
        </div>
      `;
      factorListEl.appendChild(row);
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  openInspectModal() {
    const item = window.TEST_DATA[this.currentRoundIndex];
    if (!item) return;
    this.modalImg.src = item.image;
    this.modalCategory.textContent = item.category;
    this.modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  closeInspectModal() {
    this.modal.classList.remove('is-open');
    document.body.style.overflow = '';
  }
}

window.VanillaQuizManager = VanillaQuizManager;
