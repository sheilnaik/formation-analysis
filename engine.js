/* ========================================
   ANIMATION ENGINE
   Canvas rendering + animation system
   ======================================== */

class PitchRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.dpr = window.devicePixelRatio || 1;

    // Pitch dimensions (aspect ratio ~1.5:1, landscape)
    this.pitchAspect = 0.68; // height/width

    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    const container = this.canvas.parentElement;
    const maxW = container.clientWidth - 40;
    const maxH = container.clientHeight - 40;

    let w = maxW;
    let h = w * this.pitchAspect;

    if (h > maxH) {
      h = maxH;
      w = h / this.pitchAspect;
    }

    this.width = w;
    this.height = h;

    this.canvas.style.width = w + 'px';
    this.canvas.style.height = h + 'px';
    this.canvas.width = w * this.dpr;
    this.canvas.height = h * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);
  }

  // Convert percentage coordinates to pixel coordinates
  toPixel(xPct, yPct) {
    const padding = 30;
    const usableW = this.width - padding * 2;
    const usableH = this.height - padding * 2;
    return {
      x: padding + (xPct / 100) * usableW,
      y: padding + (yPct / 100) * usableH
    };
  }

  drawPitch() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;
    const pad = 30;

    // Clear
    ctx.clearRect(0, 0, w, h);

    // Pitch gradient background
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#1a6b37');
    grad.addColorStop(0.5, '#1f7d40');
    grad.addColorStop(1, '#1a6b37');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(0, 0, w, h, 12);
    ctx.fill();

    // Grass stripes
    const stripeCount = 12;
    const stripeH = h / stripeCount;
    for (let i = 0; i < stripeCount; i++) {
      if (i % 2 === 0) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
        ctx.fillRect(0, i * stripeH, w, stripeH);
      }
    }

    // Field lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.lineWidth = 1.5;

    const l = pad;
    const r = w - pad;
    const t = pad;
    const b = h - pad;
    const cx = w / 2;
    const cy = h / 2;
    const fw = r - l;
    const fh = b - t;

    // Outline
    ctx.strokeRect(l, t, fw, fh);

    // Halfway line
    ctx.beginPath();
    ctx.moveTo(l, cy);
    ctx.lineTo(r, cy);
    ctx.stroke();

    // Centre circle
    ctx.beginPath();
    ctx.arc(cx, cy, fh * 0.1, 0, Math.PI * 2);
    ctx.stroke();

    // Centre spot
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.fill();

    // Penalty areas (top = attacking)
    const paW = fw * 0.44;
    const paH = fh * 0.16;
    // Top
    ctx.strokeRect(cx - paW / 2, t, paW, paH);
    // Bottom
    ctx.strokeRect(cx - paW / 2, b - paH, paW, paH);

    // Goal areas
    const gaW = fw * 0.2;
    const gaH = fh * 0.06;
    ctx.strokeRect(cx - gaW / 2, t, gaW, gaH);
    ctx.strokeRect(cx - gaW / 2, b - gaH, gaW, gaH);

    // Penalty spots
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.beginPath();
    ctx.arc(cx, t + fh * 0.12, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, b - fh * 0.12, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Penalty arcs
    ctx.beginPath();
    ctx.arc(cx, t + fh * 0.12, fh * 0.088, 0.65, Math.PI - 0.65);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, b - fh * 0.12, fh * 0.088, Math.PI + 0.65, -0.65);
    ctx.stroke();

    // Corner arcs
    const ca = fh * 0.02;
    ctx.beginPath(); ctx.arc(l, t, ca, 0, Math.PI / 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(r, t, ca, Math.PI / 2, Math.PI); ctx.stroke();
    ctx.beginPath(); ctx.arc(l, b, ca, -Math.PI / 2, 0); ctx.stroke();
    ctx.beginPath(); ctx.arc(r, b, ca, Math.PI, Math.PI * 1.5); ctx.stroke();

    // Goals
    const goalW = fw * 0.1;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.strokeRect(cx - goalW / 2, t - 8, goalW, 8);
    ctx.strokeRect(cx - goalW / 2, b, goalW, 8);

    // Attacking direction arrow
    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.beginPath();
    ctx.moveTo(cx - 12, cy - fh * 0.3);
    ctx.lineTo(cx + 12, cy - fh * 0.3);
    ctx.lineTo(cx, cy - fh * 0.3 - 14);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.font = '600 9px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ATTACK', cx, cy - fh * 0.3 + 16);
  }

  drawPlayer(x, y, label, isHighlighted, glowIntensity = 0) {
    const ctx = this.ctx;
    const pos = this.toPixel(x, y);
    const r = 14;

    // Glow
    if (isHighlighted || glowIntensity > 0) {
      const intensity = isHighlighted ? 1 : glowIntensity;
      const glowGrad = ctx.createRadialGradient(pos.x, pos.y, r, pos.x, pos.y, r * 3);
      glowGrad.addColorStop(0, `rgba(59, 130, 246, ${0.3 * intensity})`);
      glowGrad.addColorStop(1, 'rgba(59, 130, 246, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, r * 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(pos.x, pos.y + r + 3, r * 0.8, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Player circle
    const grad = ctx.createRadialGradient(pos.x - 3, pos.y - 3, 0, pos.x, pos.y, r);
    if (isHighlighted) {
      grad.addColorStop(0, '#60a5fa');
      grad.addColorStop(1, '#2563eb');
    } else {
      grad.addColorStop(0, '#4b9cf5');
      grad.addColorStop(1, '#1d4ed8');
    }
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
    ctx.fill();

    // Border
    ctx.strokeStyle = isHighlighted ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = isHighlighted ? 2.5 : 1.5;
    ctx.stroke();

    // Label
    ctx.fillStyle = '#fff';
    ctx.font = `700 ${label.length > 2 ? 9 : 10}px 'JetBrains Mono', monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, pos.x, pos.y + 0.5);
  }

  drawBall(x, y, trail = []) {
    const ctx = this.ctx;
    const pos = this.toPixel(x, y);

    // Trail
    if (trail.length > 1) {
      ctx.beginPath();
      const first = this.toPixel(trail[0].x, trail[0].y);
      ctx.moveTo(first.x, first.y);
      for (let i = 1; i < trail.length; i++) {
        const p = this.toPixel(trail[i].x, trail[i].y);
        ctx.lineTo(p.x, p.y);
      }
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.3)';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Ball glow
    const glowGrad = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 28);
    glowGrad.addColorStop(0, 'rgba(251, 191, 36, 0.35)');
    glowGrad.addColorStop(1, 'rgba(251, 191, 36, 0)');
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 28, 0, Math.PI * 2);
    ctx.fill();

    // Ball shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(pos.x + 2, pos.y + 10, 7, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Ball
    const ballGrad = ctx.createRadialGradient(pos.x - 2, pos.y - 2, 0, pos.x, pos.y, 8);
    ballGrad.addColorStop(0, '#fff');
    ballGrad.addColorStop(0.7, '#f0f0f0');
    ballGrad.addColorStop(1, '#ddd');
    ctx.fillStyle = ballGrad;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.lineWidth = 0.5;
    ctx.stroke();

    // Pentagon pattern
    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
    ctx.beginPath();
    ctx.arc(pos.x - 1, pos.y - 1, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  drawPassLine(from, to, progress = 1, isFuture = false) {
    const ctx = this.ctx;
    const p1 = this.toPixel(from.x, from.y);
    const p2 = this.toPixel(to.x, to.y);

    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const endX = p1.x + dx * progress;
    const endY = p1.y + dy * progress;

    if (isFuture) {
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.12)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 6]);
    } else {
      ctx.strokeStyle = `rgba(251, 191, 36, ${0.5 * progress})`;
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
    }

    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Arrow head
    if (!isFuture && progress > 0.3) {
      const angle = Math.atan2(dy, dx);
      const arrowSize = 6;
      ctx.fillStyle = `rgba(251, 191, 36, ${0.5 * progress})`;
      ctx.beginPath();
      ctx.moveTo(endX, endY);
      ctx.lineTo(endX - arrowSize * Math.cos(angle - 0.4), endY - arrowSize * Math.sin(angle - 0.4));
      ctx.lineTo(endX - arrowSize * Math.cos(angle + 0.4), endY - arrowSize * Math.sin(angle + 0.4));
      ctx.closePath();
      ctx.fill();
    }
  }

  drawRunLine(from, to, progress = 1) {
    const ctx = this.ctx;
    const p1 = this.toPixel(from.x, from.y);
    const p2 = this.toPixel(to.x, to.y);

    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const endX = p1.x + dx * progress;
    const endY = p1.y + dy * progress;

    ctx.strokeStyle = `rgba(59, 130, 246, ${0.25 * progress})`;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Small arrow
    if (progress > 0.5) {
      const angle = Math.atan2(dy, dx);
      const sz = 4;
      ctx.fillStyle = `rgba(59, 130, 246, ${0.3 * progress})`;
      ctx.beginPath();
      ctx.moveTo(endX, endY);
      ctx.lineTo(endX - sz * Math.cos(angle - 0.5), endY - sz * Math.sin(angle - 0.5));
      ctx.lineTo(endX - sz * Math.cos(angle + 0.5), endY - sz * Math.sin(angle + 0.5));
      ctx.closePath();
      ctx.fill();
    }
  }
}


class AnimationEngine {
  constructor(renderer) {
    this.renderer = renderer;
    this.formation = null;
    this.currentPhase = -1;
    this.isPlaying = false;
    this.mode = 'smooth'; // 'smooth' or 'step'
    this.speed = 1;
    this.progress = 0; // 0-1 overall progress
    this.phaseProgress = 0; // 0-1 within current phase
    this.playerPositions = {};
    this.ballPosition = { x: 50, y: 92 };
    this.ballTrail = [];
    this.animFrame = null;
    this.lastTime = 0;
    this.ballCarrier = null;

    this.onPhaseChange = null;
    this.onProgressUpdate = null;
    this.onComplete = null;

    // Transition state
    this.transitioning = false;
    this.transitionProgress = 0;
    this.transitionFrom = {};
    this.transitionTo = {};
    this.transitionDuration = 600;
  }

  setFormation(formationKey) {
    this.stop();
    this.formation = FORMATIONS[formationKey];
    this.currentPhase = -1;
    this.progress = 0;
    this.phaseProgress = 0;
    this.ballTrail = [];
    this.ballCarrier = null;

    // Set initial positions
    this.playerPositions = {};
    this.formation.basePositions.forEach(p => {
      this.playerPositions[p.id] = { x: p.x, y: p.y };
    });
    this.ballPosition = { x: 50, y: 92 }; // GK

    this.render();
  }

  getPositionForId(id) {
    const base = this.formation.basePositions.find(p => p.id === id);
    return base ? { x: base.x, y: base.y } : null;
  }

  play() {
    if (!this.formation) return;

    if (this.currentPhase === -1) {
      this.currentPhase = 0;
      this.phaseProgress = 0;
      if (this.onPhaseChange) this.onPhaseChange(0);
    }

    this.isPlaying = true;
    this.lastTime = performance.now();
    this.animate();
  }

  pause() {
    this.isPlaying = false;
    if (this.animFrame) {
      cancelAnimationFrame(this.animFrame);
      this.animFrame = null;
    }
  }

  stop() {
    this.pause();
    this.currentPhase = -1;
    this.progress = 0;
    this.phaseProgress = 0;
    this.ballTrail = [];
    this.ballCarrier = null;

    if (this.formation) {
      this.formation.basePositions.forEach(p => {
        this.playerPositions[p.id] = { x: p.x, y: p.y };
      });
      this.ballPosition = { x: 50, y: 92 };
      this.render();
    }

    if (this.onProgressUpdate) this.onProgressUpdate(0);
  }

  reset() {
    this.stop();
    if (this.onPhaseChange) this.onPhaseChange(-1);
  }

  goToPhase(phaseIndex) {
    if (!this.formation) return;
    const phases = this.formation.attackPattern.phases;
    if (phaseIndex < 0 || phaseIndex >= phases.length) return;

    this.pause();

    // Set positions for start of the target phase
    // First reset to base
    this.formation.basePositions.forEach(p => {
      this.playerPositions[p.id] = { x: p.x, y: p.y };
    });
    this.ballTrail = [];

    // Apply all completed phases
    for (let i = 0; i < phaseIndex; i++) {
      const phase = phases[i];
      if (phase.movements) {
        Object.entries(phase.movements).forEach(([id, pos]) => {
          this.playerPositions[id] = { x: pos.x, y: pos.y };
        });
      }
      // Ball ends at last position in ballPath
      const lastBallId = phase.ballPath[phase.ballPath.length - 1];
      const lastBallPos = this.playerPositions[lastBallId] || this.getPositionForId(lastBallId);
      if (lastBallPos) {
        this.ballPosition = { x: lastBallPos.x, y: lastBallPos.y };
      }
    }

    this.currentPhase = phaseIndex;
    this.phaseProgress = 0;

    // Calculate overall progress
    const totalPhases = phases.length;
    this.progress = phaseIndex / totalPhases;

    if (this.onPhaseChange) this.onPhaseChange(phaseIndex);
    if (this.onProgressUpdate) this.onProgressUpdate(this.progress);

    this.render();

    if (this.mode === 'smooth') {
      this.play();
    }
  }

  nextStep() {
    if (!this.formation) return;
    const phases = this.formation.attackPattern.phases;
    const next = this.currentPhase + 1;

    if (next >= phases.length) {
      // Completed - do nothing or loop
      return;
    }

    this.goToPhase(next);
    if (this.mode === 'step') {
      // In step mode, animate the phase then stop
      this.playPhaseOnce(next);
    }
  }

  prevStep() {
    if (!this.formation) return;
    const prev = Math.max(0, this.currentPhase - 1);
    if (this.currentPhase <= 0 && this.phaseProgress < 0.05) {
      this.reset();
      return;
    }
    this.goToPhase(prev);
    if (this.mode === 'step') {
      this.playPhaseOnce(prev);
    }
  }

  playPhaseOnce(phaseIndex) {
    this.currentPhase = phaseIndex;
    this.phaseProgress = 0;
    this.isPlaying = true;
    this._stopAfterPhase = true;
    this.lastTime = performance.now();
    this.animate();
  }

  animate() {
    if (!this.isPlaying) return;

    const now = performance.now();
    const dt = (now - this.lastTime) * this.speed;
    this.lastTime = now;

    const phases = this.formation.attackPattern.phases;
    const phase = phases[this.currentPhase];
    if (!phase) return;

    const phaseDuration = phase.duration || 3000;
    this.phaseProgress += dt / phaseDuration;

    if (this.phaseProgress >= 1) {
      this.phaseProgress = 1;
      this.applyPhaseEnd(this.currentPhase);

      // Progress to next phase or complete
      if (this.currentPhase < phases.length - 1 && !this._stopAfterPhase) {
        this.currentPhase++;
        this.phaseProgress = 0;
        if (this.onPhaseChange) this.onPhaseChange(this.currentPhase);
      } else {
        this.isPlaying = false;
        this._stopAfterPhase = false;
        this.progress = 1;
        if (this.onProgressUpdate) this.onProgressUpdate(1);
        if (this.onComplete) this.onComplete();
        this.render();
        return;
      }
    }

    // Update overall progress
    const totalPhases = phases.length;
    this.progress = (this.currentPhase + this.phaseProgress) / totalPhases;
    if (this.onProgressUpdate) this.onProgressUpdate(this.progress);

    // Interpolate positions for current phase
    this.interpolatePhase(this.currentPhase, this.phaseProgress);

    this.render();

    this.animFrame = requestAnimationFrame(() => this.animate());
  }

  interpolatePhase(phaseIndex, t) {
    const phase = this.formation.attackPattern.phases[phaseIndex];
    if (!phase) return;

    // Easing function
    const ease = x => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    const et = ease(Math.min(t, 1));

    // Get start positions (from previous phase end, or base)
    const startPositions = {};
    this.formation.basePositions.forEach(p => {
      startPositions[p.id] = { x: p.x, y: p.y };
    });

    // Apply all previous phases
    for (let i = 0; i < phaseIndex; i++) {
      const prev = this.formation.attackPattern.phases[i];
      if (prev.movements) {
        Object.entries(prev.movements).forEach(([id, pos]) => {
          startPositions[id] = { x: pos.x, y: pos.y };
        });
      }
    }

    // Interpolate player movements
    if (phase.movements) {
      Object.entries(phase.movements).forEach(([id, endPos]) => {
        const start = startPositions[id] || { x: 50, y: 50 };
        this.playerPositions[id] = {
          x: start.x + (endPos.x - start.x) * et,
          y: start.y + (endPos.y - start.y) * et
        };
      });

      // Players that don't move stay at start
      this.formation.basePositions.forEach(p => {
        if (!phase.movements[p.id]) {
          this.playerPositions[p.id] = startPositions[p.id];
        }
      });
    }

    // Interpolate ball along path
    this.interpolateBall(phase, t, startPositions);
  }

  interpolateBall(phase, t, startPositions) {
    const path = phase.ballPath;
    if (!path || path.length === 0) return;

    // Determine previous ball position
    let prevBallPos;
    const phaseIdx = this.formation.attackPattern.phases.indexOf(phase);
    if (phaseIdx > 0) {
      const prevPhase = this.formation.attackPattern.phases[phaseIdx - 1];
      const lastId = prevPhase.ballPath[prevPhase.ballPath.length - 1];
      prevBallPos = startPositions[lastId] || this.getPositionForId(lastId);
    } else {
      prevBallPos = { x: 50, y: 92 };
    }

    // Build full ball path: [prevBallPos] + path positions
    const allPositions = [prevBallPos];
    path.forEach(id => {
      // Use current interpolated position if available
      const pos = this.playerPositions[id] || startPositions[id] || this.getPositionForId(id);
      if (pos) allPositions.push({ x: pos.x, y: pos.y });
    });

    if (allPositions.length < 2) return;

    const segments = allPositions.length - 1;
    const ballT = Math.min(t * 1.1, 1); // Ball slightly ahead of player movement
    const rawSeg = ballT * segments;
    const segIndex = Math.min(Math.floor(rawSeg), segments - 1);
    const segT = rawSeg - segIndex;

    const ease = x => x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
    const est = ease(Math.min(segT, 1));

    const from = allPositions[segIndex];
    const to = allPositions[segIndex + 1];

    this.ballPosition = {
      x: from.x + (to.x - from.x) * est,
      y: from.y + (to.y - from.y) * est
    };

    // Update ball trail
    this.ballTrail = allPositions.slice(0, segIndex + 1);
    this.ballTrail.push({ x: this.ballPosition.x, y: this.ballPosition.y });

    // Track ball carrier
    const targetId = path[Math.min(segIndex, path.length - 1)];
    this.ballCarrier = segT > 0.8 ? targetId : null;
  }

  applyPhaseEnd(phaseIndex) {
    const phase = this.formation.attackPattern.phases[phaseIndex];
    if (phase && phase.movements) {
      Object.entries(phase.movements).forEach(([id, pos]) => {
        this.playerPositions[id] = { x: pos.x, y: pos.y };
      });
    }
  }

  render() {
    const renderer = this.renderer;
    renderer.drawPitch();

    if (!this.formation) return;

    const phase = this.currentPhase >= 0 ? this.formation.attackPattern.phases[this.currentPhase] : null;

    // Draw run lines (movement arrows)
    if (phase && phase.movements && this.phaseProgress > 0) {
      // Get start positions
      const startPositions = {};
      this.formation.basePositions.forEach(p => {
        startPositions[p.id] = { x: p.x, y: p.y };
      });
      for (let i = 0; i < this.currentPhase; i++) {
        const prev = this.formation.attackPattern.phases[i];
        if (prev.movements) {
          Object.entries(prev.movements).forEach(([id, pos]) => {
            startPositions[id] = { x: pos.x, y: pos.y };
          });
        }
      }

      Object.entries(phase.movements).forEach(([id, endPos]) => {
        const start = startPositions[id];
        if (start) {
          const dx = endPos.x - start.x;
          const dy = endPos.y - start.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 3) {
            renderer.drawRunLine(start, endPos, Math.min(this.phaseProgress * 1.5, 1));
          }
        }
      });
    }

    // Draw pass lines (future passes shown faintly)
    if (phase && phase.ballPath && this.phaseProgress > 0) {
      const phaseIdx = this.currentPhase;
      const prevPhase = phaseIdx > 0 ? this.formation.attackPattern.phases[phaseIdx - 1] : null;
      let prevPos;
      if (prevPhase) {
        const lastId = prevPhase.ballPath[prevPhase.ballPath.length - 1];
        prevPos = this.playerPositions[lastId] || this.getPositionForId(lastId);
      } else {
        prevPos = { x: 50, y: 92 };
      }

      const allPos = [prevPos];
      phase.ballPath.forEach(id => {
        const pos = this.playerPositions[id] || this.getPositionForId(id);
        if (pos) allPos.push({ x: pos.x, y: pos.y });
      });

      for (let i = 0; i < allPos.length - 1; i++) {
        const segProgress = (this.phaseProgress * (allPos.length - 1)) - i;
        if (segProgress > 0) {
          renderer.drawPassLine(allPos[i], allPos[i + 1], Math.min(segProgress, 1));
        }
      }
    }

    // Draw players
    this.formation.basePositions.forEach(p => {
      const pos = this.playerPositions[p.id] || { x: p.x, y: p.y };
      const isHighlighted = this.ballCarrier === p.id;
      const isBallPath = phase && phase.ballPath && phase.ballPath.includes(p.id);
      renderer.drawPlayer(pos.x, pos.y, p.label, isHighlighted, isBallPath ? 0.3 : 0);
    });

    // Draw ball
    if (this.currentPhase >= 0) {
      renderer.drawBall(this.ballPosition.x, this.ballPosition.y, this.ballTrail);
    } else {
      renderer.drawBall(50, 92, []);
    }
  }
}
