/**
 * 3D Orbit Circular Carousel for Landing Page (Vanilla JS)
 * Accurately replicates the 3D orbit perspective, continuous drift, momentum drag, and card styling.
 */

class VanillaCircularCarousel {
  constructor(containerEl, options = {}) {
    this.container = containerEl;
    this.items = options.items || window.CAROUSEL_DESTINATIONS || [];
    this.speed = options.speed || 8;
    this.tilt = options.tilt !== undefined ? options.tilt : -6;
    this.momentum = options.momentum || 0.47;
    this.parallax = options.parallax || 0.61;
    this.cornerRadius = options.cornerRadius || 20;
    this.onItemClick = options.onItemClick || null;
    this.onChange = options.onChange || null;

    this.angle = 0;
    this.target = null;
    this.velocity = 0;
    this.dir = -1;
    this.isDragging = false;
    this.press = null;
    this.rafId = null;
    this.lastTime = 0;
    this.hover = false;
    this.pointerX = 0;
    this.pointerY = 0;
    this.yaw = 0;
    this.pitch = 0;
    this.activeIdx = 0;

    this.initDOM();
    this.measure();
    this.bindEvents();
    this.startLoop();
  }

  initDOM() {
    this.container.classList.add('v-carousel-root');
    this.container.innerHTML = `
      <div class="v-carousel-view">
        <div class="v-carousel-stage">
          <div class="v-carousel-camera">
            <div class="v-carousel-ring"></div>
          </div>
        </div>
      </div>
    `;

    this.stage = this.container.querySelector('.v-carousel-stage');
    this.camera = this.container.querySelector('.v-carousel-camera');
    this.ring = this.container.querySelector('.v-carousel-ring');

    this.cards = [];
    this.items.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'v-carousel-card';
      card.setAttribute('data-index', index);
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');

      card.innerHTML = `
        <div class="v-carousel-frame">
          <img class="v-carousel-photo" src="${item.coverImage}" alt="${item.title}" draggable="false" />
          <div class="v-carousel-card-overlay">
            ${item.tag ? `<div class="v-carousel-tag-wrapper"><span class="v-carousel-tag">${item.tag}</span></div>` : ''}
            <div class="v-carousel-info">
              <h3 class="v-carousel-title">${item.title}</h3>
              ${item.subtitle ? `<p class="v-carousel-subtitle">${item.subtitle}</p>` : ''}
              ${item.actionText ? `
                <div class="v-carousel-btn">
                  <span>${item.actionText}</span>
                  <span class="v-carousel-btn-arrow">→</span>
                </div>` : ''}
            </div>
          </div>
          <div class="v-carousel-shade"></div>
        </div>
      `;

      this.ring.appendChild(card);
      this.cards.push(card);
    });

    requestAnimationFrame(() => {
      this.stage.style.opacity = '1';
    });
  }

  measure() {
    const w = this.container.clientWidth || window.innerWidth;
    const isMobile = w < 640;
    const isTablet = w < 1024;

    this.cardW = isMobile ? Math.min(310, Math.round(w * 0.78)) : isTablet ? 330 : 380;
    this.cardH = this.cardW;
    const count = this.items.length;
    this.step = 360 / count;

    const radiusRatio = isMobile ? 0.44 : isTablet ? 0.30 : 0.28;
    this.radius = Math.max(this.cardW * 1.05, w * radiusRatio);
    this.perspective = Math.min(2200, Math.max(1000, Math.round(w * 1.15)));

    this.container.style.perspective = `${this.perspective}px`;

    this.cards.forEach(card => {
      card.style.width = `${this.cardW}px`;
      card.style.height = `${this.cardH}px`;
      card.style.left = `${-this.cardW / 2}px`;
      card.style.top = `${-this.cardH / 2}px`;
      const frame = card.querySelector('.v-carousel-frame');
      if (frame) frame.style.borderRadius = `${this.cornerRadius}px`;
    });
  }

  bindEvents() {
    window.addEventListener('resize', () => this.measure());

    const onPointerDown = (e) => {
      this.isDragging = false;
      this.press = {
        id: e.pointerId,
        startX: e.clientX,
        lastX: e.clientX,
        angle: this.angle,
        time: performance.now(),
        moved: false,
        samples: [{ time: performance.now(), angle: this.angle }]
      };
      this.target = null;
      this.velocity = 0;
      try { this.container.setPointerCapture(e.pointerId); } catch (err) {}
    };

    const onPointerMove = (e) => {
      if (this.press && this.press.id === e.pointerId) {
        const deltaX = e.clientX - this.press.startX;
        if (!this.press.moved && Math.abs(deltaX) > 6) {
          this.press.moved = true;
          this.isDragging = true;
          this.container.classList.add('is-dragging');
        }

        const perPixel = 180 / (Math.PI * this.radius);
        this.angle = this.press.angle - deltaX * perPixel;

        const now = performance.now();
        this.press.samples.push({ time: now, angle: this.angle });
        while (this.press.samples.length > 2 && now - this.press.samples[0].time > 110) {
          this.press.samples.shift();
        }
      }

      const rect = this.container.getBoundingClientRect();
      this.pointerX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.pointerY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };

    const onPointerUp = (e) => {
      if (!this.press || this.press.id !== e.pointerId) return;
      const moved = this.press.moved;
      const first = this.press.samples[0];
      const last = this.press.samples[this.press.samples.length - 1];
      const span = (last.time - first.time) / 1000;
      const v = span > 0.008 ? Math.max(-1200, Math.min(1200, (last.angle - first.angle) / span)) : 0;

      this.velocity = v;
      if (Math.abs(v) > 50) this.dir = Math.sign(v);

      if (!moved) {
        // Direct click without dragging
        const targetCard = e.target.closest('.v-carousel-card');
        if (targetCard) {
          const idx = parseInt(targetCard.getAttribute('data-index'), 10);
          if (this.onItemClick) this.onItemClick(this.items[idx], idx);
        }
      } else {
        const tau = 0.18 + this.momentum * 1.5;
        this.target = Math.round((this.angle + v * tau * 0.55) / this.step) * this.step;
      }

      this.press = null;
      this.isDragging = false;
      this.container.classList.remove('is-dragging');
    };

    this.container.addEventListener('pointerdown', onPointerDown);
    this.container.addEventListener('pointermove', onPointerMove);
    this.container.addEventListener('pointerup', onPointerUp);
    this.container.addEventListener('pointercancel', onPointerUp);

    this.container.addEventListener('pointerenter', () => { this.hover = true; });
    this.container.addEventListener('pointerleave', () => {
      this.hover = false;
      this.pointerX = 0;
      this.pointerY = 0;
    });

    // Keyboard support
    this.container.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') this.target = (this.target ?? this.angle) + this.step;
      else if (e.key === 'ArrowLeft') this.target = (this.target ?? this.angle) - this.step;
      else if (e.key === 'Enter' || e.key === ' ') {
        if (this.onItemClick) this.onItemClick(this.items[this.activeIdx], this.activeIdx);
      }
    });
  }

  startLoop() {
    const TO_RAD = Math.PI / 180;

    const loop = (now) => {
      this.rafId = requestAnimationFrame(loop);
      const dt = this.lastTime ? Math.min((now - this.lastTime) / 1000, 0.05) : 1 / 60;
      this.lastTime = now;

      // Autoplay drift when not dragging or hovering
      if (!this.press) {
        if (this.target !== null) {
          const diff = this.target - this.angle;
          const k = 1 - Math.exp(-dt / (0.16 + this.momentum * 0.22));
          this.angle += diff * k;
          if (Math.abs(diff) < 0.05) {
            this.angle = this.target;
            this.target = null;
          }
        } else {
          // Continuous smooth drift (matching speed 8 from React app)
          const driftSpeed = this.hover ? 1.5 : this.speed;
          this.angle += this.dir * driftSpeed * dt;
        }
      }

      // Parallax yaw & pitch ease
      const ease = 1 - Math.exp(-dt / 0.35);
      const aimYaw = this.hover ? this.pointerX * this.parallax * 9 : 0;
      const aimPitch = this.hover ? -this.pointerY * this.parallax * 6 : 0;
      this.yaw += (aimYaw - this.yaw) * ease;
      this.pitch += (aimPitch - this.pitch) * ease;

      // Camera & ring 3D transforms
      this.camera.style.transform = `translate3d(0, 0, ${-this.radius}px) rotateX(${this.tilt + this.pitch}deg) rotateY(${this.yaw}deg)`;
      this.ring.style.transform = `rotateY(${this.angle}deg)`;

      // Position each card along the 3D orbit
      this.cards.forEach((card, index) => {
        const base = index * this.step;
        // Billboard rotation: face camera
        card.style.transform = `rotateY(${base}deg) translateZ(${this.radius}px) rotateY(${-(base + this.angle)}deg)`;

        // Depth fade calculation
        let worldAngle = (base + this.angle) % 360;
        if (worldAngle < 0) worldAngle += 360;
        const facing = Math.cos(worldAngle * TO_RAD);
        const depth = 0.55 * Math.pow((1 - facing) / 2, 1.25);
        card.style.setProperty('--cc-depth', depth.toFixed(3));
      });

      // Active card index tracking
      const count = this.items.length;
      const active = ((Math.round(-this.angle / this.step) % count) + count) % count || 0;
      if (active !== this.activeIdx) {
        this.activeIdx = active;
        if (this.onChange) this.onChange(active);
      }
    };

    this.rafId = requestAnimationFrame(loop);
  }

  destroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }
}

window.VanillaCircularCarousel = VanillaCircularCarousel;
