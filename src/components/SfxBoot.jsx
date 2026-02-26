import { useEffect } from 'react';
import { unlockAudio, playClickSfx, playHoverSfx } from '../helper/sfx';

// Starts BGM after the first user interaction.
// Click SFX is NOT global anymore; we only play it for explicit clickable UI
// (buttons/links/role=button) or elements marked with data-sfx="click".
export default function SfxBoot() {
  useEffect(() => {
    const onAnyClick = (e) => {
      // Ignore some noisy interactions
      const t = e.target;
      const tag = (t?.tagName || '').toLowerCase();
      if (tag === 'input' && (t?.type === 'range' || t?.type === 'color')) return;

      unlockAudio();

      // If an element explicitly disables click SFX, do nothing.
      if (t?.closest?.('[data-sfx="noclick"]')) return;

      // Only play click SFX for "real" clickable UI.
      // This prevents map clicks/dragging from spamming audio.
      const el = t?.closest?.(
        '[data-sfx="click"], button, a, [role="button"], input[type="button"], input[type="submit"]'
      );
      if (el) playClickSfx();
    };

    // Hover SFX for clickable UI (buttons/nav/sidebar).
    const onAnyHover = (e) => {
      const t = e.target;
      if (!t?.closest) return;
      if (t.closest('[data-sfx="nohover"]')) return;

      const el = t.closest(
        '[data-sfx="hover"], button, a, [role="button"], .MuiListItemButton-root, .MuiIconButton-root'
      );
      if (!el) return;

      unlockAudio();
      playHoverSfx();
    };

    document.addEventListener('click', onAnyClick, true);
    document.addEventListener('pointerover', onAnyHover, true);
    return () => {
      document.removeEventListener('click', onAnyClick, true);
      document.removeEventListener('pointerover', onAnyHover, true);
    };
  }, []);

  return null;
}
