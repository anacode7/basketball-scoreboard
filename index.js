// Find the Home score element once so we can update it on clicks
const homeScoreEl = document.getElementById('home-score');

// Find the Guest score element once so we can update it on clicks
const guestScoreEl = document.getElementById('guest-score');

// Reset button: set both scores back to 0 when clicked
const resetBtn = document.getElementById('reset-btn');
resetBtn.addEventListener('click', () => {
  homeScoreEl.textContent = '0';
  guestScoreEl.textContent = '0';
  // Briefly flash both displays to signal reset
  document.querySelectorAll('.display').forEach((el) => {
    el.classList.add('flash');
    setTimeout(() => el.classList.remove('flash'), 340);
  });
  updateLeader();
});

// Decide which team is leading and toggle highlight class
function updateLeader() {
  const home = Number(homeScoreEl.textContent);
  const guest = Number(guestScoreEl.textContent);
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
    updateLeader();
  });
document
  .querySelector('button[data-team="home"][data-points="2"]')
  .addEventListener('click', () => {
    homeScoreEl.textContent = Number(homeScoreEl.textContent) + 2;
    updateLeader();
  });
document
  .querySelector('button[data-team="home"][data-points="3"]')
  .addEventListener('click', () => {
    homeScoreEl.textContent = Number(homeScoreEl.textContent) + 3;
    updateLeader();
  });
document
  .querySelector('button[data-team="guest"][data-points="1"]')
  .addEventListener('click', () => {
    guestScoreEl.textContent = Number(guestScoreEl.textContent) + 1;
    updateLeader();
  });
document
  .querySelector('button[data-team="guest"][data-points="2"]')
  .addEventListener('click', () => {
    guestScoreEl.textContent = Number(guestScoreEl.textContent) + 2;
    updateLeader();
  });
document
  .querySelector('button[data-team="guest"][data-points="3"]')
  .addEventListener('click', () => {
    guestScoreEl.textContent = Number(guestScoreEl.textContent) + 3;
    updateLeader();
  });