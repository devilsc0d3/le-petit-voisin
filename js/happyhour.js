(function() {
  const statusEl = document.getElementById('hh-status');
  const timerEl = document.getElementById('hh-timer');
  if (!statusEl || !timerEl) return;

  function pad(n) { return n.toString().padStart(2,'0'); }

  function getNextHappyHour(now) {
    const day = now.getDay(); // 0 = Sunday

    if (day === 0) {
      const target = new Date(now);
      target.setDate(now.getDate() + ((1 + 7 - day) % 7 || 7));
      target.setHours(19,0,0,0);
      return { type: 'closed-countdown', target };
    }

    const today19 = new Date(now);
    today19.setHours(19,0,0,0);
    const today21 = new Date(now);
    today21.setHours(21,0,0,0);

    if (now >= today19 && now < today21) {
      return { type: 'now' };
    }

    if (now < today19) {
      return { type: 'countdown', target: today19 };
    }

    let next = new Date(now);
    next.setDate(now.getDate() + 1);
    while (next.getDay() === 0) { next.setDate(next.getDate() + 1); }
    next.setHours(19,0,0,0);
    return { type: 'countdown', target: next };
  }

  function formatDiff(diffMs) {
    const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    let parts = [];
    if (days > 0) parts.push(days + 'j');
    parts.push(hours + 'h');
    parts.push(pad(minutes) + 'm');
    parts.push(pad(seconds) + 's');
    return parts.join(' ');
  }

  function update() {
    const now = new Date();
    const info = getNextHappyHour(now);

    if (info.type === 'now') {
      statusEl.textContent = "C'est maintenant !!!";
      timerEl.textContent = "Profitez-en";
      timerEl.classList.add('countdown__timer--now');
      timerEl.classList.remove('countdown__timer--closed');
      return;
    }

    timerEl.classList.remove('countdown__timer--now');

    const target = info.target;
    const diff = target - now;

    if (info.type === 'countdown') {
      statusEl.textContent = 'Prochain Happy Hour dans';
      timerEl.textContent = formatDiff(diff);
      timerEl.classList.remove('countdown__timer--closed');
    } else if (info.type === 'closed-countdown') {
      statusEl.textContent = "Fermé aujourd\'hui";
      timerEl.textContent = formatDiff(diff);
      timerEl.classList.add('countdown__timer--closed');
    }
  }

  update();
  setInterval(update, 1000);
})();