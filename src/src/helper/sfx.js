// Simple sound effects without needing audio assets.
// Uses Web Audio API to generate a short "pin drop" blip.
// Works on modern browsers; requires a user interaction at least once to unlock audio.

let _ctx = null;

function getCtx() {
  if (_ctx) return _ctx;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return null;
  _ctx = new AudioContext();
  return _ctx;
}

export async function playPinSfx() {
  const ctx = getCtx();
  if (!ctx) return;

  // If the browser suspended audio (common on mobile), try to resume.
  if (ctx.state === "suspended") {
    try { await ctx.resume(); } catch { /* ignore */ }
  }

  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  // A quick descending tone feels like a "drop".
  osc.type = "triangle";
  osc.frequency.setValueAtTime(740, now);
  osc.frequency.exponentialRampToValueAtTime(420, now + 0.08);

  // Envelope
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.22, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.14);
}
