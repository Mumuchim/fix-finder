import React, { useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Slider,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {
  getSfxVolume,
  getBgmVolume,
  setSfxVolume,
  setBgmVolume,
  playClickSfx,
  unlockAudio,
  startBgm,
} from '../helper/sfx';

const pct = (v) => `${Math.round((Number(v) || 0) * 100)}%`;

export default function SettingsModal({ open, onClose }) {
  const initial = useMemo(() => ({
    sfx: getSfxVolume(),
    bgm: getBgmVolume(),
  }), []);

  const [sfx, setSfx] = useState(initial.sfx);
  const [bgm, setBgm] = useState(initial.bgm);

  useEffect(() => {
    if (!open) return;
    setSfx(getSfxVolume());
    setBgm(getBgmVolume());
  }, [open]);

  const commit = () => {
    unlockAudio();
    setSfxVolume(sfx);
    setBgmVolume(bgm);
    startBgm();
    playClickSfx();
    onClose?.();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span>Settings</span>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              SFX Volume: {pct(sfx)}
            </Typography>
            <Slider
              value={sfx}
              min={0}
              max={1}
              step={0.01}
              onChange={(_, v) => setSfx(Number(v))}
              onChangeCommitted={() => {
                unlockAudio();
                setSfxVolume(sfx);
                playClickSfx();
              }}
            />
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              BGM Volume: {pct(bgm)}
            </Typography>
            <Slider
              value={bgm}
              min={0}
              max={1}
              step={0.01}
              onChange={(_, v) => setBgm(Number(v))}
              onChangeCommitted={() => {
                unlockAudio();
                setBgmVolume(bgm);
                startBgm();
              }}
            />
          </Box>
          <Typography variant="caption" sx={{ opacity: 0.75 }}>
            Tip: audio starts after your first click/tap (browser policy).
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>Close</Button>
        <Button variant="contained" onClick={commit}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
