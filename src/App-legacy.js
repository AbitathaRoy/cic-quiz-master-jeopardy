import React, { useState, useCallback } from 'react';

/* ─────────────────────────────────────────────
   STYLES (injected via <style> tag — no Tailwind needed)
   ───────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=Inter:wght@400;500;600&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: 'Inter', sans-serif;
    background: #0f1117;
    color: #e2e4e9;
    min-height: 100vh;
  }

  /* ── HOME ── */
  #home-screen {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
    position: relative;
    overflow: hidden;
  }
  #home-screen::before {
    content: '';
    position: absolute;
    width: 500px; height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%);
    top: -100px; left: -100px;
  }
  #home-screen::after {
    content: '';
    position: absolute;
    width: 400px; height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%);
    bottom: -80px; right: -80px;
  }
  #home-title {
    font-family: 'Sora', sans-serif;
    font-size: 3.5rem;
    font-weight: 700;
    color: #fff;
    margin-bottom: 0.5rem;
    position: relative; z-index: 1;
    letter-spacing: -1px;
  }
  #home-subtitle {
    font-size: 1.1rem;
    color: rgba(255,255,255,0.45);
    margin-bottom: 3rem;
    position: relative; z-index: 1;
  }
  .home-btn {
    display: flex; align-items: center; justify-content: center;
    width: 260px; padding: 1rem 2rem;
    border: none; border-radius: 12px;
    font-family: 'Inter', sans-serif;
    font-size: 1.1rem; font-weight: 600;
    cursor: pointer;
    position: relative; z-index: 1;
    transition: transform 0.2s, box-shadow 0.2s;
    margin-bottom: 0.75rem;
  }
  .home-btn:hover { transform: translateY(-2px); }
  #btn-goto-main {
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: #fff;
    box-shadow: 0 4px 24px rgba(99,102,241,0.35);
  }
  #btn-goto-main:hover { box-shadow: 0 6px 32px rgba(99,102,241,0.5); }
  #btn-goto-admin {
    background: rgba(255,255,255,0.07);
    color: rgba(255,255,255,0.75);
    border: 1px solid rgba(255,255,255,0.12);
  }
  #btn-goto-admin:hover { background: rgba(255,255,255,0.12); }
  .home-btn .btn-icon { margin-right: 0.5rem; width: 20px; height: 20px; }

  /* ── QUIZ GRID SCREEN ── */
  .grid-screen {
    height: 100vh;
    background: #0f1117;
    padding: 1.5vh 2vw;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .screen-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 1.5vh;
    flex-shrink: 0;
  }
  .screen-header h1 {
    font-family: 'Sora', sans-serif;
    font-size: clamp(1.2rem, 2.5vh, 1.8rem); font-weight: 700; color: #fff;
    letter-spacing: -0.5px;
  }
  .screen-header .badge {
    font-size: clamp(0.6rem, 1vh, 0.75rem); font-weight: 600; text-transform: uppercase;
    letter-spacing: 1px; padding: 0.3rem 0.7rem; border-radius: 20px;
    background: rgba(99,102,241,0.15); color: #818cf8;
  }

  /* ── GRID CONTAINER ── */
  .grid-wrapper {
    flex: 1;
    display: flex;
    gap: 1vw;
    min-height: 0;
  }

  /* ── SIDE LABELS ── */
  .side-labels {
    display: flex;
    flex-direction: column;
    gap: clamp(4px, 0.8vh, 10px);
    width: 4vw;
    min-width: 45px;
    flex-shrink: 0;
  }
  .side-label-spacer {
    min-height: 3.5vh;
    flex-shrink: 0;
  }
  .level-label {
    flex: 1;
    min-height: 0;
    background: rgba(99,102,241,0.1);
    border: 1px solid rgba(99,102,241,0.2);
    color: #818cf8;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Sora', sans-serif;
    font-weight: 600;
    font-size: clamp(0.7rem, 1.8vh, 1rem);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    writing-mode: vertical-rl;
    text-orientation: mixed;
  }
  .level-label.left {
    transform: rotate(180deg);
  }

  /* ── GRID ── */
  #quiz-grid {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(var(--grid-cols, 6), 1fr);
    gap: clamp(6px, 1vw, 12px);
    min-height: 0;
  }
  .grid-column { 
    display: flex; 
    flex-direction: column; 
    gap: clamp(4px, 0.8vh, 10px);
    min-height: 0;
  }

  /* Column Header */
  .col-header-static {
    background: rgba(99,102,241,0.12);
    border: 1px solid rgba(99,102,241,0.25);
    color: #818cf8;
    text-align: center;
    padding: 0.5vh 0.4vw;
    border-radius: 8px;
    font-weight: 600; font-size: clamp(0.65rem, 1.2vh, 0.85rem);
    text-transform: uppercase; letter-spacing: 0.5px;
    min-height: 3.5vh;
    display: flex; align-items: center; justify-content: center;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    flex-shrink: 0;
  }
  .col-header-input {
    background: rgba(99,102,241,0.12);
    border: 1px solid rgba(99,102,241,0.25);
    color: #818cf8;
    text-align: center;
    padding: 0.5vh 0.4vw;
    border-radius: 8px;
    font-family: 'Inter', sans-serif;
    font-weight: 600; font-size: clamp(0.65rem, 1.2vh, 0.85rem);
    text-transform: uppercase; letter-spacing: 0.5px;
    min-height: 3.5vh;
    outline: none;
    transition: border-color 0.2s, background 0.2s;
    width: 100%;
    flex-shrink: 0;
  }
  .col-header-input::placeholder { color: rgba(129,140,248,0.4); text-transform: none; }
  .col-header-input:focus {
    border-color: #6366f1;
    background: rgba(99,102,241,0.2);
  }

  /* Block Tile */
  .block-tile {
    flex: 1;
    min-height: 0;
    border-radius: clamp(8px, 1.2vh, 14px);
    border: none;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Sora', sans-serif;
    font-size: clamp(1rem, 2.5vh, 1.8rem); font-weight: 700;
    color: #fff;
    transition: transform 0.18s, box-shadow 0.18s, opacity 0.3s, filter 0.3s;
    position: relative;
    overflow: hidden;
    background-size: 50%;
    background-position: center;
    background-repeat: no-repeat;
  }
  .block-tile::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(145deg, rgba(255,255,255,0.12) 0%, transparent 60%);
    pointer-events: none;
  }
  .block-tile:hover { transform: translateY(-2px) scale(1.02); }

  .block-tile.empty {
    background-color: #1e293b;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    color: rgba(255,255,255,0.35);
  }
  .block-tile.has-content {
    background-color: #334155;
    box-shadow: 0 3px 16px rgba(99,102,241,0.25);
  }
  .block-tile.has-content:hover { box-shadow: 0 4px 20px rgba(99,102,241,0.4); }
  .block-tile.read {
    opacity: 0.32;
    filter: blur(0.5px) saturate(0.4);
  }
  .block-tile.read:hover { opacity: 0.5; }
  
  .block-number {
    position: absolute;
    bottom: clamp(4px, 1vh, 8px);
    right: clamp(4px, 1vh, 8px);
    font-size: clamp(0.7rem, 1.5vh, 1rem);
    opacity: 0.6;
  }

  /* ── BOTTOM CONTROLS ── */
  .bottom-controls {
    display: flex; justify-content: flex-end; gap: clamp(6px, 1vw, 12px);
    margin-top: 1vh; padding-top: 1vh;
    flex-shrink: 0;
  }
  .ctrl-btn {
    display: flex; align-items: center; gap: 6px;
    padding: clamp(0.4rem, 1vh, 0.7rem) clamp(0.8rem, 1.5vw, 1.3rem); 
    border-radius: 10px;
    border: none; font-family: 'Inter', sans-serif;
    font-size: clamp(0.7rem, 1.2vh, 0.9rem); font-weight: 600;
    cursor: pointer; transition: background 0.2s, transform 0.15s;
  }
  .ctrl-btn:hover { transform: translateY(-1px); }
  .ctrl-btn svg { width: clamp(12px, 2vh, 18px); height: clamp(12px, 2vh, 18px); }
  #btn-reset-blocks, #btn-reset-questions {
    background: rgba(239,68,68,0.12);
    color: #f87171;
    border: 1px solid rgba(239,68,68,0.2);
  }
  #btn-reset-blocks:hover, #btn-reset-questions:hover { background: rgba(239,68,68,0.22); }
  #btn-block-logos {
    background: rgba(168,85,247,0.12);
    color: #c084fc;
    border: 1px solid rgba(168,85,247,0.2);
  }
  #btn-block-logos:hover { background: rgba(168,85,247,0.22); }
  #btn-home {
    background: rgba(255,255,255,0.07);
    color: rgba(255,255,255,0.7);
    border: 1px solid rgba(255,255,255,0.1);
  }
  #btn-home:hover { background: rgba(255,255,255,0.12); }

  /* ── GRID SETTINGS ── */
  .grid-settings {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    padding: 1rem 1.5rem;
    margin-bottom: 1.5vh;
    display: flex;
    align-items: center;
    gap: 2rem;
    flex-shrink: 0;
  }
  .grid-settings-label {
    font-family: 'Sora', sans-serif;
    font-weight: 600;
    font-size: 0.85rem;
    color: rgba(255,255,255,0.7);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .grid-settings-control {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  .grid-settings-control label {
    font-size: 0.8rem;
    color: rgba(255,255,255,0.5);
    min-width: 60px;
  }
  .grid-settings-control input[type="number"] {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 6px;
    color: #fff;
    font-family: 'Inter', sans-serif;
    font-size: 0.85rem;
    padding: 0.4rem 0.6rem;
    width: 70px;
    outline: none;
    transition: border-color 0.2s;
  }
  .grid-settings-control input[type="number"]:focus {
    border-color: #6366f1;
  }
  .grid-settings-apply {
    padding: 0.45rem 1rem;
    background: rgba(99,102,241,0.15);
    color: #818cf8;
    border: 1px solid rgba(99,102,241,0.25);
    border-radius: 8px;
    font-family: 'Inter', sans-serif;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
  }
  .grid-settings-apply:hover {
    background: rgba(99,102,241,0.25);
  }

  /* ── BLOCK LOGO SCREEN ── */
  #block-logo-screen {
    height: 100vh;
    background: #0f1117;
    padding: 1.5vh 2vw;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .logo-grid-wrapper {
    flex: 1;
    display: flex;
    gap: 1vw;
    min-height: 0;
    margin-bottom: 1vh;
  }
  .logo-block-tile {
    flex: 1;
    min-height: 0;
    border-radius: clamp(8px, 1.2vh, 14px);
    border: 2px solid rgba(99,102,241,0.3);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    background-color: #1e293b;
    background-size: 60%;
    background-position: center;
    background-repeat: no-repeat;
    transition: all 0.2s;
  }
  .logo-block-tile:hover {
    border-color: #6366f1;
    background-color: #334155;
    transform: scale(1.02);
  }
  .logo-block-tile.selected {
    border-color: #8b5cf6;
    box-shadow: 0 0 20px rgba(139,92,246,0.4);
  }
  .logo-upload-prompt {
    color: rgba(255,255,255,0.3);
    font-size: clamp(0.7rem, 1.5vh, 0.9rem);
    text-align: center;
    padding: 1rem;
  }
  .logo-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
  }
  .logo-actions-left {
    display: flex;
    gap: 8px;
  }
  .logo-actions-right {
    display: flex;
    gap: 8px;
  }
  #btn-apply-to-all {
    background: rgba(34,197,94,0.12);
    color: #4ade80;
    border: 1px solid rgba(34,197,94,0.2);
  }
  #btn-apply-to-all:hover { background: rgba(34,197,94,0.22); }
  #btn-apply-to-all:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
  #btn-reset-logos {
    background: rgba(239,68,68,0.12);
    color: #f87171;
    border: 1px solid rgba(239,68,68,0.2);
  }
  #btn-reset-logos:hover { background: rgba(239,68,68,0.22); }
  #btn-back-to-admin {
    background: rgba(255,255,255,0.07);
    color: rgba(255,255,255,0.7);
    border: 1px solid rgba(255,255,255,0.1);
  }
  #btn-back-to-admin:hover { background: rgba(255,255,255,0.12); }
  
  .file-input-hidden {
    display: none;
  }

  /* ── OVERLAY / MODAL ── */
  .modal-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.7);
    backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center;
    z-index: 100;
    animation: fadeIn 0.2s ease;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

  #block-modal {
    background: #1a1d27;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 18px;
    width: 90%; max-width: 780px;
    max-height: 85vh;
    display: flex; flex-direction: column;
    box-shadow: 0 24px 64px rgba(0,0,0,0.5);
    animation: slideUp 0.25s cubic-bezier(0.16,1,0.3,1);
  }
  @keyframes slideUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }

  /* Modal Header */
  .modal-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 1.2rem 1.5rem;
    border-bottom: 1px solid rgba(255,255,255,0.07);
  }
  .modal-header-left { display: flex; align-items: center; gap: 0.75rem; }
  .modal-label {
    font-family: 'Sora', sans-serif;
    font-size: 0.95rem; font-weight: 700; color: #fff;
  }
  .modal-sublabel {
    font-size: 0.72rem; color: rgba(255,255,255,0.3); margin-top: 1px;
  }
  .flip-badge {
    font-size: 0.65rem; font-weight: 600; text-transform: uppercase;
    letter-spacing: 1px; padding: 0.3rem 0.65rem; border-radius: 20px;
    white-space: nowrap;
  }
  .flip-badge.question { background: rgba(99,102,241,0.15); color: #818cf8; }
  .flip-badge.answer { background: rgba(34,197,94,0.15); color: #4ade80; }

  .modal-actions { display: flex; gap: 6px; }
  .modal-btn {
    display: flex; align-items: center; gap: 5px;
    padding: 0.45rem 0.85rem; border-radius: 8px; border: none;
    font-family: 'Inter', sans-serif; font-size: 0.78rem; font-weight: 600;
    cursor: pointer; transition: background 0.18s, transform 0.1s;
    white-space: nowrap;
  }
  .modal-btn:active { transform: scale(0.95); }
  .modal-btn svg { width: 14px; height: 14px; }

  #btn-toggle-read {
    background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.6);
    border: 1px solid rgba(255,255,255,0.1);
  }
  #btn-toggle-read:hover { background: rgba(255,255,255,0.12); }
  #btn-toggle-read.read { background: rgba(34,197,94,0.12); color: #4ade80; border-color: rgba(34,197,94,0.25); }
  #btn-flip {
    background: rgba(99,102,241,0.15); color: #818cf8;
    border: 1px solid rgba(99,102,241,0.25);
  }
  #btn-flip:hover { background: rgba(99,102,241,0.25); }
  #btn-close {
    background: rgba(239,68,68,0.1); color: #f87171;
    border: 1px solid rgba(239,68,68,0.2);
    padding: 0.45rem 0.6rem;
  }
  #btn-close:hover { background: rgba(239,68,68,0.2); }

  /* Modal Body */
  .modal-body {
    flex: 1; overflow-y: auto; padding: 1.5rem;
  }
  .modal-body::-webkit-scrollbar { width: 6px; }
  .modal-body::-webkit-scrollbar-track { background: transparent; }
  .modal-body::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }

  /* ── CONTENT DISPLAY (Main screen read view) ── */
  .content-display .text-block {
    line-height: 1.7; color: #e2e4e9;
    margin-bottom: 0.75rem;
  }
  .content-display img { max-width: 100%; border-radius: 10px; margin-bottom: 0.75rem; }
  .content-display video { max-width: 100%; border-radius: 10px; margin-bottom: 0.75rem; }
  .content-display audio { width: 100%; margin-bottom: 0.75rem; }
  .content-empty {
    color: rgba(255,255,255,0.2); text-align: center;
    padding: 3rem 0; font-size: 0.9rem;
  }

  /* ── ADMIN EDITOR ── */
  .editor-add-bar {
    display: flex; gap: 8px; flex-wrap: wrap;
    padding: 0.75rem; background: rgba(255,255,255,0.04);
    border-radius: 10px; margin-bottom: 1rem;
    border: 1px solid rgba(255,255,255,0.06);
  }
  .add-btn {
    padding: 0.4rem 0.85rem; border-radius: 7px; border: none;
    font-family: 'Inter', sans-serif; font-size: 0.78rem; font-weight: 600;
    cursor: pointer; transition: background 0.18s;
  }
  .add-btn.text { background: rgba(99,102,241,0.15); color: #818cf8; }
  .add-btn.text:hover { background: rgba(99,102,241,0.25); }
  .add-btn.image { background: rgba(34,197,94,0.12); color: #4ade80; }
  .add-btn.image:hover { background: rgba(34,197,94,0.22); }
  .add-btn.video { background: rgba(168,85,247,0.12); color: #c084fc; }
  .add-btn.video:hover { background: rgba(168,85,247,0.22); }
  .add-btn.audio { background: rgba(251,146,60,0.12); color: #fb923c; }
  .add-btn.audio:hover { background: rgba(251,146,60,0.22); }

  .editor-item {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 10px; padding: 0.85rem;
    margin-bottom: 0.6rem;
  }
  .editor-item-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 0.6rem;
  }
  .editor-item-type {
    font-size: 0.7rem; font-weight: 600; text-transform: uppercase;
    letter-spacing: 0.8px; color: rgba(255,255,255,0.35);
  }
  .editor-item-actions { display: flex; gap: 4px; }
  .item-action-btn {
    background: rgba(255,255,255,0.06); border: none; color: rgba(255,255,255,0.5);
    width: 26px; height: 26px; border-radius: 6px;
    cursor: pointer; font-size: 0.8rem; display: flex; align-items: center; justify-content: center;
    transition: background 0.15s;
  }
  .item-action-btn:hover { background: rgba(255,255,255,0.12); }
  .item-action-btn:disabled { opacity: 0.25; cursor: default; }
  .item-action-btn.del { color: #f87171; }
  .item-action-btn.del:hover { background: rgba(239,68,68,0.15); }

  /* Text formatting toolbar */
  .fmt-toolbar {
    display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 0.5rem;
  }
  .fmt-btn {
    background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08);
    color: rgba(255,255,255,0.5); width: 30px; height: 28px;
    border-radius: 6px; cursor: pointer; font-size: 0.8rem;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.15s;
    font-family: 'Inter', sans-serif;
  }
  .fmt-btn:hover { background: rgba(255,255,255,0.12); }
  .fmt-btn.active { background: rgba(99,102,241,0.2); color: #818cf8; border-color: rgba(99,102,241,0.3); }
  .fmt-size-select {
    background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08);
    color: rgba(255,255,255,0.5); padding: 0 0.4rem; border-radius: 6px;
    font-family: 'Inter', sans-serif; font-size: 0.75rem;
    height: 28px; outline: none; cursor: pointer;
  }
  .fmt-size-select option { background: #1a1d27; color: #e2e4e9; }

  .editor-textarea {
    width: 100%; min-height: 90px; padding: 0.6rem 0.7rem;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
    border-radius: 8px; color: #e2e4e9; font-family: 'Inter', sans-serif;
    line-height: 1.6; resize: vertical; outline: none;
    transition: border-color 0.2s;
  }
  .editor-textarea:focus { border-color: rgba(99,102,241,0.4); }
  .editor-textarea::placeholder { color: rgba(255,255,255,0.2); }

  .file-upload-input {
    width: 100%; padding: 0.5rem; font-size: 0.8rem;
    color: rgba(255,255,255,0.5); font-family: 'Inter', sans-serif;
  }
  .size-row {
    display: flex; align-items: center; gap: 8px; margin-top: 0.5rem;
  }
  .size-row label { font-size: 0.75rem; color: rgba(255,255,255,0.35); }
  .size-row input[type=range] { flex: 1; accent-color: #6366f1; }
  .size-row span { font-size: 0.75rem; color: rgba(255,255,255,0.4); min-width: 36px; }
  .editor-media-preview img, .editor-media-preview video { border-radius: 8px; margin-top: 0.5rem; }
  .editor-media-preview audio { width: 100%; margin-top: 0.5rem; }

  /* ── RESET WARNING MODAL ── */
  #reset-warning-modal {
    background: #1a1d27;
    border: 1px solid rgba(239,68,68,0.25);
    border-radius: 16px; padding: 2rem;
    width: 90%; max-width: 440px;
    box-shadow: 0 24px 64px rgba(0,0,0,0.6);
    animation: slideUp 0.2s cubic-bezier(0.16,1,0.3,1);
  }
  .warning-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; }
  .warning-header svg { width: 28px; height: 28px; color: #f87171; }
  .warning-header h2 { font-family: 'Sora', sans-serif; font-size: 1.2rem; font-weight: 700; color: #f87171; }
  .warning-body { color: rgba(255,255,255,0.5); font-size: 0.88rem; line-height: 1.6; margin-bottom: 1.5rem; }
  .warning-actions { display: flex; justify-content: flex-end; gap: 8px; }
  .warn-btn {
    padding: 0.5rem 1.1rem; border-radius: 8px; border: none;
    font-family: 'Inter', sans-serif; font-size: 0.82rem; font-weight: 600;
    cursor: pointer; transition: background 0.18s;
  }
  #btn-cancel-reset { background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.6); }
  #btn-cancel-reset:hover { background: rgba(255,255,255,0.12); }
  #btn-confirm-reset { background: rgba(239,68,68,0.18); color: #f87171; }
  #btn-confirm-reset:hover { background: rgba(239,68,68,0.3); }
`;

/* ─────────────────────────────────────────────
   DATA HELPERS
   ───────────────────────────────────────────── */
const createEmptyQuiz = (rows = 5, cols = 6) => {
  const quiz = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      quiz.push({
        id: `block-${col}-${row}`,
        col, row,
        question: { content: [] },
        answer: { content: [] },
        isRead: false,
        logoUrl: '',
      });
    }
  }
  return quiz;
};

/* ─────────────────────────────────────────────
   SVG ICONS (inline — avoids any lucide import issues)
   ───────────────────────────────────────────── */
const IconX = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const IconFlip = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
  </svg>
);
const IconHome = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const IconSettings = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);
const IconWarning = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);
const IconReset = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
  </svg>
);
const IconImage = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
    <circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21 15 16 10 5 21"/>
  </svg>
);

/* ─────────────────────────────────────────────
   SUB-COMPONENTS — all defined at module level
   (prevents remount-on-state-change and fixes the typing/focus bug)
   ───────────────────────────────────────────── */

const HomeScreen = ({ onGoMain, onGoAdmin }) => (
  <div id="home-screen">
    <h1 id="home-title">Quiz Master</h1>
    <p id="home-subtitle">Finals · Offline Mode</p>
    <button id="btn-goto-main" className="home-btn" onClick={onGoMain}>Start Quiz</button>
    <button id="btn-goto-admin" className="home-btn" onClick={onGoAdmin}>
      <span className="btn-icon"><IconSettings /></span>
      Admin Panel
    </button>
  </div>
);

const BlockTile = ({ block, isAdmin, onClick }) => {
  const hasContent = block.question?.content?.length > 0;
  let cls = 'block-tile';
  cls += hasContent ? ' has-content' : ' empty';
  if (block.isRead && !isAdmin) cls += ' read';
  
  const style = block.logoUrl ? { backgroundImage: `url(${block.logoUrl})` } : {};
  
  return (
    <button id={block.id} className={cls} onClick={() => onClick(block.id)} style={style}>
      <span className="block-number">{block.row + 1}</span>
    </button>
  );
};

const BlockModal = ({ openBlock, showAnswer, isAdmin, columnName, onClose, onToggleRead, onFlip, onContentChange }) => {
  const contentType = showAnswer ? 'answer' : 'question';
  const content = openBlock[contentType]?.content || [];

  const addItem = (type) => {
    const newItem = type === 'text'
      ? { type: 'text', value: '', style: {} }
      : { type, url: '', size: 100 };
    onContentChange(contentType, [...content, newItem]);
  };

  const updateItem = (index, updates) => {
    onContentChange(contentType, content.map((item, i) => i === index ? { ...item, ...updates } : item));
  };

  const deleteItem = (index) => {
    onContentChange(contentType, content.filter((_, i) => i !== index));
  };

  const moveItem = (index, dir) => {
    const newIdx = dir === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= content.length) return;
    const updated = [...content];
    [updated[index], updated[newIdx]] = [updated[newIdx], updated[index]];
    onContentChange(contentType, updated);
  };

  const handleFileUpload = (e, index) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const type = file.type.startsWith('image/') ? 'image'
                 : file.type.startsWith('video/') ? 'video'
                 : file.type.startsWith('audio/') ? 'audio'
                 : null;
      if (type) updateItem(index, { url: ev.target.result, type });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div id="block-modal">
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-left">
            <span className={`flip-badge ${showAnswer ? 'answer' : 'question'}`}>
              {showAnswer ? 'Answer' : 'Question'}
            </span>
            <div>
              <div className="modal-label">{columnName} · Difficulty {openBlock.row + 1}</div>
              <div className="modal-sublabel">{openBlock.id}</div>
            </div>
          </div>
          <div className="modal-actions">
            {!isAdmin && (
              <button id="btn-toggle-read" className={`modal-btn ${openBlock.isRead ? 'read' : ''}`} onClick={onToggleRead}>
                {openBlock.isRead ? '✓ Unread' : '○ Read'}
              </button>
            )}
            <button id="btn-flip" className="modal-btn" onClick={onFlip}>
              <IconFlip /> Flip
            </button>
            <button id="btn-close" className="modal-btn" onClick={onClose}>
              <IconX />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="modal-body">
          {isAdmin ? (
            <div id="admin-editor">
              <div className="editor-add-bar">
                <button className="add-btn text" onClick={() => addItem('text')}>+ Text</button>
                <button className="add-btn image" onClick={() => addItem('image')}>+ Image</button>
                <button className="add-btn video" onClick={() => addItem('video')}>+ Video</button>
                <button className="add-btn audio" onClick={() => addItem('audio')}>+ Audio</button>
              </div>

              {content.map((item, index) => (
                <div key={index} id={`content-item-${contentType}-${index}`} className="editor-item">
                  <div className="editor-item-header">
                    <span className="editor-item-type">{item.type}</span>
                    <div className="editor-item-actions">
                      <button className="item-action-btn" disabled={index === 0} onClick={() => moveItem(index, 'up')}>↑</button>
                      <button className="item-action-btn" disabled={index === content.length - 1} onClick={() => moveItem(index, 'down')}>↓</button>
                      <button className="item-action-btn del" onClick={() => deleteItem(index)}>✕</button>
                    </div>
                  </div>

                  {item.type === 'text' ? (
                    <div>
                      <div className="fmt-toolbar">
                        <button className={`fmt-btn ${item.style?.fontWeight === 'bold' ? 'active' : ''}`}
                          onClick={() => updateItem(index, { style: { ...item.style, fontWeight: item.style?.fontWeight === 'bold' ? 'normal' : 'bold' } })}
                        ><b>B</b></button>
                        <button className={`fmt-btn ${item.style?.fontStyle === 'italic' ? 'active' : ''}`}
                          onClick={() => updateItem(index, { style: { ...item.style, fontStyle: item.style?.fontStyle === 'italic' ? 'normal' : 'italic' } })}
                        ><i>I</i></button>
                        <button className={`fmt-btn ${item.style?.textDecoration === 'underline' ? 'active' : ''}`}
                          onClick={() => updateItem(index, { style: { ...item.style, textDecoration: item.style?.textDecoration === 'underline' ? 'none' : 'underline' } })}
                        ><u>U</u></button>
                        <button className={`fmt-btn ${item.style?.textDecoration === 'line-through' ? 'active' : ''}`}
                          onClick={() => updateItem(index, { style: { ...item.style, textDecoration: item.style?.textDecoration === 'line-through' ? 'none' : 'line-through' } })}
                        ><s>S</s></button>
                        <select className="fmt-size-select" value={item.style?.fontSize || '16'}
                          onChange={(e) => updateItem(index, { style: { ...item.style, fontSize: e.target.value } })}>
                          <option value="12">12px</option>
                          <option value="16">16px</option>
                          <option value="20">20px</option>
                          <option value="24">24px</option>
                          <option value="32">32px</option>
                        </select>
                      </div>
                      <textarea
                        className="editor-textarea"
                        value={item.value}
                        onChange={(e) => updateItem(index, { value: e.target.value })}
                        placeholder="Enter text..."
                        style={{
                          fontWeight: item.style?.fontWeight,
                          fontStyle: item.style?.fontStyle,
                          textDecoration: item.style?.textDecoration,
                          fontSize: (item.style?.fontSize || '16') + 'px',
                        }}
                      />
                    </div>
                  ) : (
                    <div>
                      <input type="file" className="file-upload-input"
                        accept={item.type === 'image' ? 'image/*' : item.type === 'video' ? 'video/*' : 'audio/*'}
                        onChange={(e) => handleFileUpload(e, index)}
                      />
                      {item.url && (
                        <div className="editor-media-preview">
                          <div className="size-row">
                            <label>Size:</label>
                            <input type="range" min="20" max="100" value={item.size || 100}
                              onChange={(e) => updateItem(index, { size: parseInt(e.target.value) })} />
                            <span>{item.size || 100}%</span>
                          </div>
                          {item.type === 'image' && <img src={item.url} alt="" style={{ width: `${item.size || 100}%` }} />}
                          {item.type === 'video' && <video src={item.url} controls style={{ width: `${item.size || 100}%` }} />}
                          {item.type === 'audio' && <audio src={item.url} controls />}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {content.length === 0 && <div className="content-empty">No content yet. Use the buttons above to add text or media.</div>}
            </div>
          ) : (
            <div id="content-display" className="content-display">
              {content.map((item, index) => (
                <div key={index}>
                  {item.type === 'text' && (
                    <p className="text-block" style={{
                      fontWeight: item.style?.fontWeight,
                      fontStyle: item.style?.fontStyle,
                      textDecoration: item.style?.textDecoration,
                      fontSize: (item.style?.fontSize || '16') + 'px',
                    }}>{item.value}</p>
                  )}
                  {item.type === 'image' && item.url && <img src={item.url} alt="" style={{ width: `${item.size || 100}%` }} />}
                  {item.type === 'video' && item.url && <video src={item.url} controls style={{ width: `${item.size || 100}%` }} />}
                  {item.type === 'audio' && item.url && <audio src={item.url} controls />}
                </div>
              ))}
              {content.length === 0 && <div className="content-empty">No content available.</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ResetWarningModal = ({ onCancel, onConfirm }) => (
  <div className="modal-overlay">
    <div id="reset-warning-modal">
      <div className="warning-header"><IconWarning /><h2>Warning</h2></div>
      <p className="warning-body">This will permanently delete all questions, answers, and column names. This action cannot be undone. Are you sure?</p>
      <div className="warning-actions">
        <button id="btn-cancel-reset" className="warn-btn" onClick={onCancel}>Cancel</button>
        <button id="btn-confirm-reset" className="warn-btn" onClick={onConfirm}>Reset All</button>
      </div>
    </div>
  </div>
);

const BlockLogoScreen = ({ quizData, columnNames, gridRows, gridCols, onLogoChange, onApplyToAll, onResetLogos, onBackToAdmin, onGoHome }) => {
  const [selectedBlock, setSelectedBlock] = React.useState(null);
  const [lastUploadedLogo, setLastUploadedLogo] = React.useState(null);
  const fileInputRef = React.useRef(null);

  const handleBlockClick = (blockId) => {
    setSelectedBlock(blockId);
    fileInputRef.current.value = ''; // Clear the input so same file can be re-uploaded
    fileInputRef.current?.click();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file || !selectedBlock) return;
    
    const reader = new FileReader();
    reader.onload = (ev) => {
      const logoUrl = ev.target.result;
      onLogoChange(selectedBlock, logoUrl);
      setLastUploadedLogo(logoUrl);
      // Don't clear selectedBlock - keep it selected
    };
    reader.readAsDataURL(file);
  };

  const handleApplyToAll = () => {
    if (lastUploadedLogo) {
      onApplyToAll(lastUploadedLogo);
    }
  };

  return (
    <div id="block-logo-screen">
      <div className="screen-header">
        <h1>Block Logo Customization</h1>
        <span className="badge">Design Mode</span>
      </div>

      <div className="logo-grid-wrapper">
        {/* Left labels */}
        <div className="side-labels">
          <div className="side-label-spacer"></div>
          {Array.from({ length: gridRows }).map((_, row) => (
            <div key={row} className="level-label left">Level {row + 1}</div>
          ))}
        </div>

        {/* Grid */}
        <div id="quiz-grid" style={{ '--grid-cols': gridCols }}>
          {Array.from({ length: gridCols }).map((_, col) => (
            <div key={col} className="grid-column">
              <div className="col-header-static">{columnNames[col] || `Column ${col + 1}`}</div>
              {Array.from({ length: gridRows }).map((_, row) => {
                const block = quizData.find(b => b.col === col && b.row === row);
                if (!block) return null;
                const style = block.logoUrl ? { backgroundImage: `url(${block.logoUrl})` } : {};
                return (
                  <button
                    key={block.id}
                    id={`logo-${block.id}`}
                    className={`logo-block-tile ${selectedBlock === block.id ? 'selected' : ''}`}
                    onClick={() => handleBlockClick(block.id)}
                    style={style}
                  >
                    {!block.logoUrl && <div className="logo-upload-prompt">Click to upload</div>}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Right labels */}
        <div className="side-labels">
          <div className="side-label-spacer"></div>
          {Array.from({ length: gridRows }).map((_, row) => (
            <div key={row} className="level-label">Level {row + 1}</div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="logo-actions">
        <div className="logo-actions-left">
          <button
            id="btn-apply-to-all"
            className="ctrl-btn"
            onClick={handleApplyToAll}
            disabled={!lastUploadedLogo}
          >
            <IconImage /> Apply to All
          </button>
          <button id="btn-reset-logos" className="ctrl-btn" onClick={onResetLogos}>
            <IconReset /> Reset Logos
          </button>
        </div>
        <div className="logo-actions-right">
          <button id="btn-back-to-admin" className="ctrl-btn" onClick={onBackToAdmin}>
            <IconSettings /> Admin
          </button>
          <button id="btn-home" className="ctrl-btn" onClick={onGoHome}>
            <IconHome /> Home
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="file-input-hidden"
        onChange={handleFileUpload}
      />
    </div>
  );
};

/* ─────────────────────────────────────────────
   ROOT APP
   ───────────────────────────────────────────── */
const QuizApp = () => {
  const [screen, setScreen] = useState('home'); // 'home', 'main', 'admin', 'logos'
  const [gridRows, setGridRows] = useState(5);
  const [gridCols, setGridCols] = useState(6);
  const [tempRows, setTempRows] = useState(5);
  const [tempCols, setTempCols] = useState(6);
  const [quizData, setQuizData] = useState(createEmptyQuiz(5, 6));
  const [columnNames, setColumnNames] = useState(['', '', '', '', '', '']);
  const [openBlock, setOpenBlock] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showResetWarning, setShowResetWarning] = useState(false);

  const isAdmin = screen === 'admin';

  const handleApplyGridSettings = useCallback(() => {
    const newRows = Math.max(1, Math.min(10, tempRows)); // Limit 1-10
    const newCols = Math.max(1, Math.min(10, tempCols)); // Limit 1-10
    setGridRows(newRows);
    setGridCols(newCols);
    setQuizData(createEmptyQuiz(newRows, newCols));
    setColumnNames(new Array(newCols).fill(''));
  }, [tempRows, tempCols]);

  const handleBlockClick = useCallback((blockId) => {
    setQuizData(prev => {
      const block = prev.find(b => b.id === blockId);
      setOpenBlock(block);
      return prev;
    });
    setShowAnswer(false);
  }, []);

  const handleClose = useCallback(() => { setOpenBlock(null); setShowAnswer(false); }, []);
  const handleFlip = useCallback(() => setShowAnswer(p => !p), []);

  const handleToggleRead = useCallback(() => {
    setQuizData(prev => prev.map(b => b.id === openBlock.id ? { ...b, isRead: !b.isRead } : b));
    setOpenBlock(prev => ({ ...prev, isRead: !prev.isRead }));
  }, [openBlock?.id]);

  const handleContentChange = useCallback((contentType, newContent) => {
    setQuizData(prev => prev.map(b =>
      b.id === openBlock.id ? { ...b, [contentType]: { content: newContent } } : b
    ));
    setOpenBlock(prev => ({ ...prev, [contentType]: { content: newContent } }));
  }, [openBlock?.id]);

  const handleResetBlocks = useCallback(() => {
    setQuizData(prev => prev.map(b => ({ ...b, isRead: false })));
  }, []);

  const handleResetQuestions = useCallback(() => {
    setQuizData(createEmptyQuiz(gridRows, gridCols));
    setColumnNames(new Array(gridCols).fill(''));
    setShowResetWarning(false);
    setOpenBlock(null);
  }, [gridRows, gridCols]);

  const handleColNameChange = useCallback((i, val) => {
    setColumnNames(prev => { const n = [...prev]; n[i] = val; return n; });
  }, []);

  const handleLogoChange = useCallback((blockId, logoUrl) => {
    setQuizData(prev => prev.map(b => b.id === blockId ? { ...b, logoUrl } : b));
  }, []);

  const handleApplyToAll = useCallback((logoUrl) => {
    setQuizData(prev => prev.map(b => ({ ...b, logoUrl })));
  }, []);

  const handleResetLogos = useCallback(() => {
    setQuizData(prev => prev.map(b => ({ ...b, logoUrl: '' })));
  }, []);

  return (
    <div id="quiz-app">
      <style>{CSS}</style>

      {screen === 'home' && (
        <HomeScreen onGoMain={() => setScreen('main')} onGoAdmin={() => setScreen('admin')} />
      )}

      {(screen === 'main' || screen === 'admin') && (
        <div id={isAdmin ? 'admin-screen' : 'main-screen'} className="grid-screen">
          <div className="screen-header">
            <h1>{isAdmin ? 'Admin Panel' : 'Quiz Board'}</h1>
            <span className="badge">{isAdmin ? 'Edit Mode' : 'Live Quiz'}</span>
          </div>

          {/* Grid Settings - Admin Only */}
          {isAdmin && (
            <div className="grid-settings">
              <span className="grid-settings-label">Grid Size</span>
              <div className="grid-settings-control">
                <label>Rows:</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={tempRows}
                  onChange={(e) => setTempRows(parseInt(e.target.value) || 1)}
                />
              </div>
              <div className="grid-settings-control">
                <label>Columns:</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={tempCols}
                  onChange={(e) => setTempCols(parseInt(e.target.value) || 1)}
                />
              </div>
              <button className="grid-settings-apply" onClick={handleApplyGridSettings}>
                Apply
              </button>
            </div>
          )}

          <div className="grid-wrapper">
            {/* Left side labels */}
            <div className="side-labels">
              <div className="side-label-spacer"></div>
              {Array.from({ length: gridRows }).map((_, row) => (
                <div key={`left-${row}`} className="level-label left">Level {row + 1}</div>
              ))}
            </div>

            {/* Grid */}
            <div id="quiz-grid" style={{ '--grid-cols': gridCols }}>
              {Array.from({ length: gridCols }).map((_, col) => (
                <div key={col} className="grid-column">
                  {isAdmin ? (
                    <input id={`column-header-${col}`} className="col-header-input" type="text"
                      value={columnNames[col] || ''} onChange={(e) => handleColNameChange(col, e.target.value)}
                      placeholder={`Column ${col + 1}`}
                    />
                  ) : (
                    <div id={`column-header-${col}`} className="col-header-static">
                      {columnNames[col] || `Column ${col + 1}`}
                    </div>
                  )}
                  {Array.from({ length: gridRows }).map((_, row) => {
                    const block = quizData.find(b => b.col === col && b.row === row);
                    return block ? <BlockTile key={block.id} block={block} isAdmin={isAdmin} onClick={handleBlockClick} /> : null;
                  })}
                </div>
              ))}
            </div>

            {/* Right side labels */}
            <div className="side-labels">
              <div className="side-label-spacer"></div>
              {Array.from({ length: gridRows }).map((_, row) => (
                <div key={`right-${row}`} className="level-label">Level {row + 1}</div>
              ))}
            </div>
          </div>

          <div className="bottom-controls">
            {isAdmin && (
              <button id="btn-block-logos" className="ctrl-btn" onClick={() => setScreen('logos')}>
                <IconImage /> Block Logos
              </button>
            )}
            <button
              id={isAdmin ? 'btn-reset-questions' : 'btn-reset-blocks'}
              className="ctrl-btn"
              onClick={() => isAdmin ? setShowResetWarning(true) : handleResetBlocks()}
            >
              <IconReset /> {isAdmin ? 'Reset Questions' : 'Reset Blocks'}
            </button>
            <button id="btn-home" className="ctrl-btn" onClick={() => setScreen('home')}>
              <IconHome /> Home
            </button>
          </div>
        </div>
      )}

      {screen === 'logos' && (
        <BlockLogoScreen
          quizData={quizData}
          columnNames={columnNames}
          gridRows={gridRows}
          gridCols={gridCols}
          onLogoChange={handleLogoChange}
          onApplyToAll={handleApplyToAll}
          onResetLogos={handleResetLogos}
          onBackToAdmin={() => setScreen('admin')}
          onGoHome={() => setScreen('home')}
        />
      )}

      {openBlock && (
        <BlockModal
          openBlock={openBlock}
          showAnswer={showAnswer}
          isAdmin={isAdmin}
          columnName={columnNames[openBlock.col] || `Column ${openBlock.col + 1}`}
          onClose={handleClose}
          onToggleRead={handleToggleRead}
          onFlip={handleFlip}
          onContentChange={handleContentChange}
        />
      )}

      {showResetWarning && (
        <ResetWarningModal onCancel={() => setShowResetWarning(false)} onConfirm={handleResetQuestions} />
      )}
    </div>
  );
};

export default QuizApp;