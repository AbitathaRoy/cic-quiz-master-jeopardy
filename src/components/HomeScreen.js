import React from 'react';
import { IconSettings } from '../icons/Icons';

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