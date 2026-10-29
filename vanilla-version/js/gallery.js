/**
 * 3D Curved Semi-Circle Image Library Archive (Vanilla JS)
 * Features 3D arched positioning, left-to-right drift motion, drag rotation, click-to-zoom, and 3D card flipping.
 */

class VanillaCircularGallery {
  constructor(containerEl, options = {}) {
    this.container = containerEl;
    this.items = options.items || window.TEST_DATA || [];
    this.totalItems = this.items.length;
    this.scrollEase = options.scrollEase || 0.05;
    this.bend = options.bend || 2.5;
    this.gap = options.gap || 0.85;

    this.targetScroll = 0;
    this.currentScroll = 0;
    this.isDown = false;
    this.startX = 0;
    this.lastX = 0;
    this.dragDistance = 0;
    this.velocity = 0;
    this.isPointerOver = false;
    this.zoomedIndex = null;
    this.isFlipped = false;
    this.activeIdx = 0;

    this.rafId = null;

    this.initDOM();
    this.measure();
    this.bindEvents();
    this.startLoop();
  }

  initDOM() {
    this.container.classList.add('v-gallery-wrapper');
    this.container.innerHTML = `
      <div class="v-gallery-stage">
        <div class="v-gallery-camera">
          <div class="v-gallery-ring"></div>
        </div>
      </div>

      <!-- Close button when zoomed in -->
      <div class="v-gallery-close-btn-wrap" style="display: none;">
        <button class="v-gallery-close-btn" title="Return to Archive (Esc)">
          <span style="font-size: 14px; line-height: 1;">✕</span>
          <span>Close View</span>
        </button>
      </div>

      <!-- Bottom UI Control -->
      <div class="v-gallery-bottom-ui">
        <p class="v-gallery-category"></p>
        <div class="v-gallery-actions">
          <button class="v-gallery-flip-trigger">
            <span class="v-gallery-status-dot"></span>
            <span class="v-gallery-btn-text">Click Card to Zoom In & Inspect</span>
          </button>
        </div>
        <p class="v-gallery-hint">Click any card to zoom in • Drag to rotate archive</p>
      </div>
    `;

    this.stage = this.container.querySelector('.v-gallery-stage');
    this.camera = this.container.querySelector('.v-gallery-camera');
    this.ring = this.container.querySelector('.v-gallery-ring');
    this.closeBtnWrap = this.container.querySelector('.v-gallery-close-btn-wrap');
    this.closeBtn = this.container.querySelector('.v-gallery-close-btn');
    this.categoryEl = this.container.querySelector('.v-gallery-category');
    this.flipTrigger = this.container.querySelector('.v-gallery-flip-trigger');
    this.statusDot = this.container.querySelector('.v-gallery-status-dot');
    this.btnText = this.container.querySelector('.v-gallery-btn-text');
    this.hintEl = this.container.querySelector('.v-gallery-hint');

    this.cards = [];
    this.items.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'v-gallery-card';
      card.setAttribute('data-index', index);

      const isAI = item.actualOrigin === 'AI';
      const originColor = isAI ? '#3b82f6' : '#10b981';
      const originLabel = isAI ? 'AI GENERATED' : 'HUMAN MADE';
      const originSub = isAI ? 'Algorithmic Neural Synthesis' : 'Photographic & Fine Craft';

      card.innerHTML = `
        <div class="v-gallery-card-inner">
          <!-- Front Face: Image -->
          <div class="v-gallery-card-face v-gallery-card-front">
            <img class="v-gallery-card-img" src="${item.image}" alt="${item.category}" draggable="false" />
            <div class="v-gallery-card-border"></div>
          </div>

          <!-- Back Face: Inspection Details -->
          <div class="v-gallery-card-face v-gallery-card-back">
            <div class="v-card-back-header">
              <span class="v-card-back-badge" style="background: ${originColor}20; color: ${originColor}; border: 1px solid ${originColor}40;">
                <span class="v-card-back-dot" style="background: ${originColor};"></span>
                <span>${originLabel}</span>
              </span>
              <span class="v-card-back-tier">ROUND ${item.round} • ${item.difficulty}</span>
            </div>

            <div class="v-card-back-title-section">
              <h4 class="v-card-back-category">${item.category}</h4>
              <p class="v-card-back-origin-sub">${originSub}</p>
            </div>

            <div class="v-card-back-body">
              <div class="v-card-back-block">
                <span class="v-card-back-label">PERCEPTUAL CUES & ANALYSIS</span>
                <p class="v-card-back-text">${item.explanation}</p>
              </div>

              ${item.creatorDetails ? `
              <div class="v-card-back-block" style="margin-top: 8px;">
                <span class="v-card-back-label">CREATOR & MEDIUM SPECIFICATIONS</span>
                <p class="v-card-back-text v-card-back-sub">${item.creatorDetails}</p>
              </div>` : ''}
            </div>

            <div class="v-card-back-footer">
              <span class="v-card-back-flip-hint">Click card to flip front ↺</span>
            </div>
          </div>
        </div>
      `;

      this.ring.appendChild(card);
      this.cards.push({
        element: card,
        inner: card.querySelector('.v-gallery-card-inner'),
        item,
        index,
        zoomProgress: 0,
        flipAngle: 0,
        targetFlip: 0
      });
    });

    this.updateBottomUI();
  }

  measure() {
    const w = this.container.clientWidth || window.innerWidth;
    const h = this.container.clientHeight || window.innerHeight;
    const isMobile = w < 640;

    this.cardWidth = isMobile ? Math.min(270, Math.round(w * 0.70)) : Math.min(320, Math.round(w * 0.24));
    this.cardHeight = Math.round(this.cardWidth * 1.25);

    // Compute semi-circle arc radius
    this.radius = Math.max(w * 0.48, this.cardWidth * 2.8);
    this.angleStep = (2 * Math.PI) / this.totalItems;

    this.cards.forEach(c => {
      c.element.style.width = `${this.cardWidth}px`;
      c.element.style.height = `${this.cardHeight}px`;
      c.element.style.marginLeft = `${-this.cardWidth / 2}px`;
      c.element.style.marginTop = `${-this.cardHeight / 2}px`;
    });
  }

  bindEvents() {
    window.addEventListener('resize', () => this.measure());

    const onPointerDown = (e) => {
      this.isDown = true;
      this.startX = e.clientX;
      this.lastX = e.clientX;
      this.dragDistance = 0;
      this.velocity = 0;
    };

    const onPointerMove = (e) => {
      this.isPointerOver = true;
      if (!this.isDown) return;
      const deltaX = e.clientX - this.lastX;
      this.lastX = e.clientX;
      this.dragDistance += Math.abs(deltaX);

      if (this.zoomedIndex === null) {
        // Drag carousel
        this.velocity = deltaX * 0.0022;
        this.targetScroll += this.velocity;
      }
    };

    const onPointerUp = (e) => {
      if (!this.isDown) return;
      this.isDown = false;

      // Swipe inertia
      if (this.zoomedIndex === null && Math.abs(this.velocity) > 0.0008) {
        this.targetScroll += this.velocity * 3.5;
      }

      // Click detected (small drag distance < 8px)
      if (this.dragDistance < 8) {
        const targetCardEl = e.target.closest('.v-gallery-card');
        if (targetCardEl) {
          const idx = parseInt(targetCardEl.getAttribute('data-index'), 10);
          this.handleCardClick(idx);
        } else if (this.zoomedIndex !== null) {
          // Clicked outside zoomed card
          this.closeZoom();
        }
      }
    };

    this.container.addEventListener('pointerdown', onPointerDown);
    this.container.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    this.container.addEventListener('pointerleave', () => {
      this.isPointerOver = false;
    });

    // Wheel support
    this.container.addEventListener('wheel', (e) => {
      if (this.zoomedIndex !== null) return;
      e.preventDefault();
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      this.targetScroll -= delta * 0.0010;
    }, { passive: false });

    // Keyboard support (Escape to close zoom)
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.zoomedIndex !== null) {
        this.closeZoom();
      }
    });

    // Close button
    this.closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.closeZoom();
    });

    // Bottom action button (Zoom in or Flip)
    this.flipTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      if (this.zoomedIndex !== null) {
        this.toggleFlip();
      } else {
        this.zoomCard(this.activeIdx);
      }
    });
  }

  handleCardClick(idx) {
    if (this.zoomedIndex === null) {
      // First click: zoom into card!
      this.zoomCard(idx);
    } else if (this.zoomedIndex === idx) {
      // Clicked on active zoomed card: Flip it!
      this.toggleFlip();
    } else {
      // Clicked on a different card while one was zoomed: switch zoom
      this.cards[this.zoomedIndex].targetFlip = 0;
      this.zoomCard(idx);
    }
  }

  zoomCard(idx) {
    this.zoomedIndex = idx;
    this.isFlipped = false;
    this.cards.forEach((c, i) => {
      c.targetFlip = 0;
    });
    this.closeBtnWrap.style.display = 'block';
    this.updateBottomUI();
  }

  closeZoom() {
    if (this.zoomedIndex !== null) {
      this.cards[this.zoomedIndex].targetFlip = 0;
      this.zoomedIndex = null;
      this.isFlipped = false;
      this.closeBtnWrap.style.display = 'none';
      this.updateBottomUI();
    }
  }

  toggleFlip() {
    if (this.zoomedIndex !== null) {
      const card = this.cards[this.zoomedIndex];
      card.targetFlip = card.targetFlip === 0 ? 180 : 0;
      this.isFlipped = card.targetFlip !== 0;
      this.updateBottomUI();
    }
  }

  updateBottomUI() {
    const activeItem = this.zoomedIndex !== null
      ? this.items[this.zoomedIndex]
      : this.items[this.activeIdx] || this.items[0];

    if (!activeItem) return;

    if (this.zoomedIndex === null) {
      this.categoryEl.textContent = activeItem.category;
      this.categoryEl.style.opacity = '1';
      this.statusDot.className = 'v-gallery-status-dot';
      this.btnText.textContent = 'Click Card to Zoom In & Inspect';
      this.hintEl.textContent = 'Click any card to zoom in • Drag to rotate archive';
    } else {
      this.categoryEl.style.opacity = '0';
      const isAI = activeItem.actualOrigin === 'AI';
      if (this.isFlipped) {
        this.statusDot.className = `v-gallery-status-dot ${isAI ? 'is-ai' : 'is-human'}`;
        this.btnText.textContent = `Flipped: ${isAI ? 'AI GENERATED' : 'HUMAN MADE'} (Click to Flip Back ↺)`;
      } else {
        this.statusDot.className = 'v-gallery-status-dot';
        this.btnText.textContent = 'Click Card to Flip ↺';
      }
      this.hintEl.textContent = 'Click card to flip 3D • Click outside or ✕ to return';
    }
  }

  startLoop() {
    const archFactor = 0.58;

    const loop = () => {
      this.rafId = requestAnimationFrame(loop);

      // Smooth drift motion: from left to right (-= driftSpeed)
      // When idle, relaxed speed (0.00085); when mouse hovers, slows down (0.0003)
      if (!this.isDown && this.zoomedIndex === null) {
        const driftSpeed = this.isPointerOver ? 0.0003 : 0.00085;
        this.targetScroll -= driftSpeed;

        if (Math.abs(this.targetScroll) > 1000 * Math.PI) {
          this.targetScroll %= (2 * Math.PI);
          this.currentScroll %= (2 * Math.PI);
        }
      }

      // Smooth scroll interpolation
      this.currentScroll += (this.targetScroll - this.currentScroll) * this.scrollEase;

      // Track center active card
      let closestDist = Infinity;
      let newActiveIdx = 0;

      // Position each card
      this.cards.forEach((cardObj, i) => {
        // Zoom transition lerp (0 in arch, 1 zoomed in)
        const targetZProg = this.zoomedIndex === i ? 1.0 : 0.0;
        cardObj.zoomProgress += (targetZProg - cardObj.zoomProgress) * 0.12;

        // Flip angle lerp (0 to 180 deg)
        cardObj.flipAngle += (cardObj.targetFlip - cardObj.flipAngle) * 0.12;
        cardObj.inner.style.transform = `rotateY(${cardObj.flipAngle}deg)`;

        // Normalized angle along arc
        let normAngle = (i * this.angleStep + this.currentScroll) % (2 * Math.PI);
        if (normAngle > Math.PI) normAngle -= 2 * Math.PI;
        if (normAngle < -Math.PI) normAngle += 2 * Math.PI;

        const distFromCenter = Math.abs(normAngle);
        if (distFromCenter < closestDist) {
          closestDist = distFromCenter;
          newActiveIdx = i;
        }

        // 3D semi-circle arch position
        const arcX = Math.sin(normAngle) * this.radius;
        const arcY = (Math.cos(normAngle) - 1.0) * this.radius * archFactor + 25;
        const arcZ = -distFromCenter * 40;
        const arcRotZ = -normAngle * (180 / Math.PI) * 0.42;

        // Zoom position: centered and brought forward
        const zoomX = 0;
        const zoomY = -20;
        const zoomZ = 240;
        const zoomRotZ = 0;

        const p = cardObj.zoomProgress;
        const x = arcX * (1 - p) + zoomX * p;
        const y = arcY * (1 - p) + zoomY * p;
        const z = arcZ * (1 - p) + zoomZ * p;
        const rotZ = arcRotZ * (1 - p) + zoomRotZ * p;

        cardObj.element.style.transform = `translate3d(${x}px, ${y}px, ${z}px) rotateZ(${rotZ}deg)`;

        // Z-Index hierarchy: zoomed card is on top
        if (this.zoomedIndex === i) {
          cardObj.element.style.zIndex = '50';
          cardObj.element.style.opacity = '1';
        } else if (this.zoomedIndex !== null) {
          cardObj.element.style.zIndex = '1';
          cardObj.element.style.opacity = '0.35';
        } else {
          cardObj.element.style.zIndex = `${Math.round(100 - distFromCenter * 30)}`;
          cardObj.element.style.opacity = `${Math.max(0.2, 1 - distFromCenter * 0.35)}`;
        }
      });

      if (this.zoomedIndex === null && newActiveIdx !== this.activeIdx) {
        this.activeIdx = newActiveIdx;
        this.updateBottomUI();
      }
    };

    this.rafId = requestAnimationFrame(loop);
  }

  destroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }
}

window.VanillaCircularGallery = VanillaCircularGallery;
