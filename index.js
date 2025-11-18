// Find the Home score element once so we can update it on clicks
const homeScoreEl = document.getElementById('home-score');
const homeTotalEl = document.getElementById('home-total');

// Find the Guest score element once so we can update it on clicks
const guestScoreEl = document.getElementById('guest-score');
const guestTotalEl = document.getElementById('guest-total');

// Reset button: set both scores back to 0 when clicked
const resetBtn = document.getElementById('reset-btn');
resetBtn.addEventListener('click', () => {
  homeScoreEl.textContent = '0';
  guestScoreEl.textContent = '0';
  if (homeTotalEl) homeTotalEl.textContent = '0';
  if (guestTotalEl) guestTotalEl.textContent = '0';
  // Briefly flash both displays to signal reset
  document.querySelectorAll('.display').forEach((el) => {
    el.classList.add('flash');
    setTimeout(() => el.classList.remove('flash'), 340);
  });
  updateLeader();

  // Clear quarter and overtime tables
  for (let q = 1; q <= 4; q++) {
    const hq = document.getElementById(`home-q${q}`);
    const gq = document.getElementById(`guest-q${q}`);
    if (hq) hq.textContent = '-';
    if (gq) gq.textContent = '-';
  }
  for (let ot = 1; ot <= 4; ot++) {
    const hot = document.getElementById(`home-ot${ot}`);
    const got = document.getElementById(`guest-ot${ot}`);
    if (hot) hot.textContent = '-';
    if (got) got.textContent = '-';
  }

  // Reset timers and states
  if (typeof quarterInterval !== 'undefined' && quarterInterval) {
    clearInterval(quarterInterval);
    quarterInterval = null;
  }
  quarterSeconds = 0;
  if (typeof renderQuarterTime === 'function') renderQuarterTime();
  if (quarterStartBtn) {
    quarterStartBtn.textContent = 'Start Quarter';
    quarterStartBtn.disabled = false;
  }
  if (quarterResetBtn) quarterResetBtn.disabled = false;
  currentQuarter = 1;

  if (typeof overtimeInterval !== 'undefined' && overtimeInterval) {
    clearInterval(overtimeInterval);
    overtimeInterval = null;
  }
  overtimeSeconds = 0;
  if (typeof renderOvertimeTime === 'function') renderOvertimeTime();
  if (overtimeStartBtn) {
    overtimeStartBtn.textContent = 'Start Overtime';
    overtimeStartBtn.disabled = false;
  }
  if (overtimeResetBtn) overtimeResetBtn.disabled = false;
  currentOvertime = 1;
});

// Decide which team is leading and toggle highlight class
function updateLeader() {
  const home = homeTotalEl ? Number(homeTotalEl.textContent) : Number(homeScoreEl.textContent);
  const guest = guestTotalEl ? Number(guestTotalEl.textContent) : Number(guestScoreEl.textContent);
  const homePanel = document.querySelector('.panel--home');
  const guestPanel = document.querySelector('.panel--guest');

  homePanel.classList.remove('is-leader');
  guestPanel.classList.remove('is-leader');

  if (home > guest) {
    homePanel.classList.add('is-leader');
  } else if (guest > home) {
    guestPanel.classList.add('is-leader');
  }
}

// Call updateLeader after each scoring action
document
  .querySelector('button[data-team="home"][data-points="1"]')
  .addEventListener('click', () => {
    homeScoreEl.textContent = Number(homeScoreEl.textContent) + 1;
    if (homeTotalEl) homeTotalEl.textContent = Number(homeTotalEl.textContent) + 1;
    updateLeader();
  });
document
  .querySelector('button[data-team="home"][data-points="2"]')
  .addEventListener('click', () => {
    homeScoreEl.textContent = Number(homeScoreEl.textContent) + 2;
    if (homeTotalEl) homeTotalEl.textContent = Number(homeTotalEl.textContent) + 2;
    updateLeader();
  });
document
  .querySelector('button[data-team="home"][data-points="3"]')
  .addEventListener('click', () => {
    homeScoreEl.textContent = Number(homeScoreEl.textContent) + 3;
    if (homeTotalEl) homeTotalEl.textContent = Number(homeTotalEl.textContent) + 3;
    updateLeader();
  });
document
  .querySelector('button[data-team="guest"][data-points="1"]')
  .addEventListener('click', () => {
    guestScoreEl.textContent = Number(guestScoreEl.textContent) + 1;
    if (guestTotalEl) guestTotalEl.textContent = Number(guestTotalEl.textContent) + 1;
    updateLeader();
  });
document
  .querySelector('button[data-team="guest"][data-points="2"]')
  .addEventListener('click', () => {
    guestScoreEl.textContent = Number(guestScoreEl.textContent) + 2;
    if (guestTotalEl) guestTotalEl.textContent = Number(guestTotalEl.textContent) + 2;
    updateLeader();
  });
document
  .querySelector('button[data-team="guest"][data-points="3"]')
  .addEventListener('click', () => {
    guestScoreEl.textContent = Number(guestScoreEl.textContent) + 3;
    if (guestTotalEl) guestTotalEl.textContent = Number(guestTotalEl.textContent) + 3;
    updateLeader();
  });

// ===== Quarter timer (count-up to 12:00) and quarter score recording =====
const quarterTimeEl = document.getElementById('quarter-time');
const quarterStartBtn = document.getElementById('quarter-start');
const quarterResetBtn = document.getElementById('quarter-reset');

let quarterInterval = null;
let quarterSeconds = 0; // count-up
const QUARTER_LIMIT = 12 * 60; // 12 minutes
let currentQuarter = 1; // Q1..Q4

function formatMMSS(totalSeconds) {
  const m = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const s = String(totalSeconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}

function renderQuarterTime() {
  if (quarterTimeEl) quarterTimeEl.textContent = formatMMSS(quarterSeconds);
}

function startPauseQuarter() {
  if (!quarterStartBtn) return;
  if (quarterInterval) {
    clearInterval(quarterInterval);
    quarterInterval = null;
    quarterStartBtn.textContent = 'Start Quarter';
    return;
  }
  periodMode = 'quarter';
  renderCurrentPeriod();
  // If already at the limit, reset to zero before starting again
  if (quarterSeconds >= QUARTER_LIMIT) {
    quarterSeconds = 0;
    renderQuarterTime();
  }
  quarterInterval = setInterval(() => {
    quarterSeconds += 1;
    renderQuarterTime();
    if (quarterSeconds >= QUARTER_LIMIT) {
      clearInterval(quarterInterval);
      quarterInterval = null;
      quarterStartBtn.textContent = 'Start Quarter';
    }
  }, 1000);
  quarterStartBtn.textContent = 'Pause Quarter';
}

function recordQuarterScore() {
  if (currentQuarter > 4) {
    alert('All 4 quarters have been recorded.');
    return false;
  }
  const homeCell = document.getElementById(`home-q${currentQuarter}`);
  const guestCell = document.getElementById(`guest-q${currentQuarter}`);
  if (homeCell && guestCell) {
    homeCell.textContent = homeScoreEl.textContent;
    guestCell.textContent = guestScoreEl.textContent;
  }
  currentQuarter += 1;
  return true;
}

function resetQuarter() {
  // Record current quarter scores, then reset for next quarter
  const recorded = recordQuarterScore();

  // Reset scores for the next quarter
  homeScoreEl.textContent = '0';
  guestScoreEl.textContent = '0';
  updateLeader();
  document.querySelectorAll('.display').forEach((el) => {
    el.classList.add('flash');
    setTimeout(() => el.classList.remove('flash'), 340);
  });

  // Reset timer to 00:00 and stop
  if (quarterInterval) {
    clearInterval(quarterInterval);
    quarterInterval = null;
  }
  quarterSeconds = 0;
  renderQuarterTime();
  if (quarterStartBtn) quarterStartBtn.textContent = 'Start Quarter';

  // If we have recorded all quarters, disable the reset and start buttons
  if (currentQuarter > 4) {
    if (quarterResetBtn) quarterResetBtn.disabled = true;
    if (quarterStartBtn) quarterStartBtn.disabled = true;
  }

  periodMode = 'quarter';
  renderCurrentPeriod();
}

if (quarterStartBtn && quarterTimeEl && quarterResetBtn) {
  // Initialize timer display and button label
  renderQuarterTime();
  quarterStartBtn.textContent = 'Start Quarter';
  quarterStartBtn.addEventListener('click', startPauseQuarter);
  quarterResetBtn.addEventListener('click', resetQuarter);
}

// ===== Overtime timer (count-up to 5:00) and overtime score recording =====
const overtimeTimeEl = document.getElementById('overtime-time');
const overtimeStartBtn = document.getElementById('overtime-start');
const overtimeResetBtn = document.getElementById('overtime-reset');

let overtimeInterval = null;
let overtimeSeconds = 0; // count-up
const OVERTIME_LIMIT = 5 * 60; // 5 minutes
let currentOvertime = 1; // OT1..OT4

function renderOvertimeTime() {
  if (overtimeTimeEl) overtimeTimeEl.textContent = formatMMSS(overtimeSeconds);
}

function startPauseOvertime() {
  if (!overtimeStartBtn) return;
  if (overtimeInterval) {
    clearInterval(overtimeInterval);
    overtimeInterval = null;
    overtimeStartBtn.textContent = 'Start Overtime';
    return;
  }
  periodMode = 'overtime';
  renderCurrentPeriod();
  if (overtimeSeconds >= OVERTIME_LIMIT) {
    overtimeSeconds = 0;
    renderOvertimeTime();
  }
  overtimeInterval = setInterval(() => {
    overtimeSeconds += 1;
    renderOvertimeTime();
    if (overtimeSeconds >= OVERTIME_LIMIT) {
      clearInterval(overtimeInterval);
      overtimeInterval = null;
      overtimeStartBtn.textContent = 'Start Overtime';
    }
  }, 1000);
  overtimeStartBtn.textContent = 'Pause Overtime';
}

function recordOvertimeScore() {
  if (currentOvertime > 4) {
    alert('All 4 overtimes have been recorded.');
    return false;
  }
  const homeCell = document.getElementById(`home-ot${currentOvertime}`);
  const guestCell = document.getElementById(`guest-ot${currentOvertime}`);
  if (homeCell && guestCell) {
    homeCell.textContent = homeScoreEl.textContent;
    guestCell.textContent = guestScoreEl.textContent;
  }
  currentOvertime += 1;
  return true;
}

function resetOvertime() {
  // Record current overtime scores, then reset for next overtime
  const recorded = recordOvertimeScore();

  // Reset scores for the next overtime
  homeScoreEl.textContent = '0';
  guestScoreEl.textContent = '0';
  updateLeader();
  document.querySelectorAll('.display').forEach((el) => {
    el.classList.add('flash');
    setTimeout(() => el.classList.remove('flash'), 340);
  });

  // Reset timer to 00:00 and stop
  if (overtimeInterval) {
    clearInterval(overtimeInterval);
    overtimeInterval = null;
  }
  overtimeSeconds = 0;
  renderOvertimeTime();
  if (overtimeStartBtn) overtimeStartBtn.textContent = 'Start Overtime';

  // If all overtimes recorded, disable the buttons
  if (currentOvertime > 4) {
    if (overtimeResetBtn) overtimeResetBtn.disabled = true;
    if (overtimeStartBtn) overtimeStartBtn.disabled = true;
  }

  periodMode = 'overtime';
  renderCurrentPeriod();
}

if (overtimeStartBtn && overtimeTimeEl && overtimeResetBtn) {
  renderOvertimeTime();
  overtimeStartBtn.textContent = 'Start Overtime';
  overtimeStartBtn.addEventListener('click', startPauseOvertime);
  overtimeResetBtn.addEventListener('click', resetOvertime);
}

// Current Period indicator (Q1–Q4, OT1–OT4)
const currentPeriodEl = document.getElementById('current-period');
let periodMode = 'quarter'; // 'quarter' or 'overtime'

function renderCurrentPeriod() {
  if (!currentPeriodEl) return;
  if (periodMode === 'quarter') {
    const q = Math.min(currentQuarter, 4);
    currentPeriodEl.textContent = `Q${q}`;
  } else {
    const ot = Math.min(currentOvertime, 4);
    currentPeriodEl.textContent = `OT${ot}`;
  }
}

// Initialize period indicator on load
renderCurrentPeriod();