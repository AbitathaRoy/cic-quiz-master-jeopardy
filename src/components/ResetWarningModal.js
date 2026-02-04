import React from 'react';
import { IconSettings } from '../icons/Icons';

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