/**
 * CodeVigil — Score Gauge Component
 * Animated SVG circular gauge for threat scores
 */

/**
 * Render a threat score gauge
 * @param {number} score - 0-100
 * @param {string} [severity] - Determines colour
 * @returns {string} HTML string
 */
export function renderScoreGauge(score, severity) {
  const color = gaugeColor(score, severity);
  const circumference = 2 * Math.PI * 70; // radius 70
  const offset = circumference - (score / 100) * circumference;

  return `
    <div class="score-gauge" id="score-gauge">
      <svg class="score-gauge__svg" viewBox="0 0 160 160">
        <circle class="score-gauge__bg" cx="80" cy="80" r="70" />
        <circle
          class="score-gauge__fill"
          cx="80" cy="80" r="70"
          stroke="${color}"
          stroke-dasharray="${circumference}"
          stroke-dashoffset="${circumference}"
          data-target-offset="${offset}"
          id="gauge-fill"
        />
      </svg>
      <div class="score-gauge__label">
        <div class="score-gauge__value" style="color: ${color}" id="gauge-value">0</div>
        <div class="score-gauge__text">Threat Score</div>
      </div>
    </div>
  `;
}

/**
 * Animate the gauge after rendering
 */
export function animateGauge(targetScore) {
  const fill = document.getElementById('gauge-fill');
  const valueEl = document.getElementById('gauge-value');
  if (!fill || !valueEl) return;

  const targetOffset = parseFloat(fill.getAttribute('data-target-offset'));

  // Animate stroke-dashoffset
  requestAnimationFrame(() => {
    fill.style.strokeDashoffset = targetOffset;
  });

  // Animate counter
  const duration = 1200;
  const startTime = performance.now();

  function tick(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = Math.round(eased * targetScore);
    valueEl.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  }

  requestAnimationFrame(tick);
}

function gaugeColor(score, severity) {
  if (severity === 'critical' || score >= 80) return '#ff3366';
  if (severity === 'high' || score >= 55) return '#ff6b35';
  if (severity === 'medium' || score >= 30) return '#ffaa00';
  if (severity === 'low' || score >= 10) return '#4da6ff';
  return '#00ff88';
}
