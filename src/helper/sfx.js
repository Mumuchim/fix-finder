// SFX/BGM helper
// - Click SFX on every click (installed via SfxBoot component)
// - Hover SFX for selectable pins (wired in PinSidebar)
// - Slide SFX when drawers open
// - Looping BGM (bgm.mp3)
// - Volume persisted in localStorage

import clickUrl from '../assets/audio/click.wav';
import hoverUrl from '../assets/audio/hover.wav';
import pinHoverUrl from '../assets/audio/hover_pin.wav';
import slideUrl from '../assets/audio/slide.wav';
import bgmUrl from '../assets/audio/bgm.mp3';

const LS_SFX = 'ff_sfx_volume';
const LS_BGM = 'ff_bgm_volume';

const clamp01 = (v) => {
  const n = Number(v);
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(1, n));
};

let _unlocked = false;
let _bgm = null;
let _lastHoverAt = 0;
let _pendingBgmStart = false;

function ensureBgm() {
  if (_bgm) return _bgm;
  _bgm = new Audio(bgmUrl);
  _bgm.loop = true;
  _bgm.preload = 'auto';
  _bgm.volume = getBgmVolume();
  return _bgm;
}

function newSfx(url) {
  const a = new Audio(url);
  a.preload = 'auto';
  return a;
}

// Use base audio instances and clone for overlap
const _base = {
  click: null,
  hover: null,
  pinHover: null,
  slide: null,
};

function playSfx(key) {
  const vol = getSfxVolume();
  if (vol <= 0) return;

  let url;
  if (key === 'click') url = clickUrl;
  else if (key === 'hover') url = hoverUrl;
  else if (key === 'pinHover') url = pinHoverUrl;
  else if (key === 'slide') url = slideUrl;
  else return;

  if (!_base[key]) _base[key] = newSfx(url);
  const inst = _base[key].cloneNode(true);
  inst.volume = vol;
  inst.play().catch(() => {});
}

export function unlockAudio() {
  if (_unlocked) return;
  _unlocked = true;

  // iOS/Safari likes a real play attempt after user interaction.
  try {
    const bgm = ensureBgm();
    bgm.muted = true;
    const p = bgm.play();
    if (p && typeof p.then === 'function') {
      p.then(() => {
        bgm.pause();
        bgm.currentTime = 0;
        bgm.muted = false;
      }).catch(() => {
        bgm.muted = false;
      });
    } else {
      bgm.pause();
      bgm.currentTime = 0;
      bgm.muted = false;
    }
  } catch {
    // ignore
  }

  // If BGM start was requested before the browser allowed audio,
  // retry now that we're unlocked.
  if (_pendingBgmStart) {
    _pendingBgmStart = false;
    try { startBgm(); } catch {}
  }
}

export function getSfxVolume() {
  const v = localStorage.getItem(LS_SFX);
  return v == null ? 0.6 : clamp01(v);
}

export function getBgmVolume() {
  const v = localStorage.getItem(LS_BGM);
  return v == null ? 0.25 : clamp01(v);
}

export function setSfxVolume(v) {
  localStorage.setItem(LS_SFX, String(clamp01(v)));
}

export function setBgmVolume(v) {
  const nv = clamp01(v);
  localStorage.setItem(LS_BGM, String(nv));
  try {
    ensureBgm().volume = nv;
  } catch {}
}

export function startBgm() {
  const bgm = ensureBgm();
  bgm.muted = false;
  bgm.volume = getBgmVolume();
  if (bgm.volume <= 0) {
    bgm.pause();
    return;
  }
  // Try to (re)start BGM. If browser blocks autoplay, we'll retry after unlockAudio().
  bgm.play().catch(() => {
    _pendingBgmStart = true;
  });
}

export function stopBgm() {
  try {
    const bgm = ensureBgm();
    bgm.pause();
    bgm.currentTime = 0;
  } catch {}
}

export function playClickSfx() {
  playSfx('click');
}

export function playHoverSfx() {
  const now = Date.now();
  if (now - _lastHoverAt < 60) return;
  _lastHoverAt = now;
  playSfx('hover');
}

// Distinct hover sound for pin type selection UI.
export function playPinHoverSfx() {
  const now = Date.now();
  if (now - _lastHoverAt < 60) return;
  _lastHoverAt = now;
  playSfx('pinHover');
}

export function playSlideSfx() {
  playSfx('slide');
}

// Pin placement SFX (WebAudio blip)
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

  if (ctx.state === 'suspended') {
    try { await ctx.resume(); } catch { /* ignore */ }
  }

  const vol = getSfxVolume();
  if (vol <= 0) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(740, now);
  osc.frequency.exponentialRampToValueAtTime(420, now + 0.08);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.22 * vol, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.14);
}
