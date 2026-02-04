import React from 'react';
import BlockTile from './BlockTile';
import { IconReset, IconHome, IconImage } from '../icons/Icons';

const QuizGrid = ({
  isAdmin,
  gridRows,
  gridCols,
  tempRows,
  tempCols,
  quizData,
  columnNames,
  onTempRowsChange,
  onTempColsChange,
  onApplyGridSettings,
  onBlockClick,
  onColNameChange,
  onResetBlocks,
  onResetQuestions,
  onGoToLogos,
  onGoHome
}) => {
  return (
    <div id={isAdmin ? 'admin-screen' : 'main-screen'} className="grid-screen">
      {/* HEADER */}
      <div className="screen-header">
        <h1>{isAdmin ? 'Admin Panel' : 'Quiz Board'}</h1>
        <span className="badge">{isAdmin ? 'Edit Mode' : 'Live Quiz'}</span>
      </div>

      {/* GRID SETTINGS - Admin Only */}
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
              onChange={(e) => onTempRowsChange(parseInt(e.target.value) || 1)}
            />
          </div>
          <div className="grid-settings-control">
            <label>Columns:</label>
            <input
              type="number"
              min="1"
              max="10"
              value={tempCols}
              onChange={(e) => onTempColsChange(parseInt(e.target.value) || 1)}
            />
          </div>
          <button className="grid-settings-apply" onClick={onApplyGridSettings}>
            Apply
          </button>
        </div>
      )}

      {/* GRID WRAPPER */}
      <div className="grid-wrapper">
        {/* Left side labels */}
        <div className="side-labels">
          <div className="side-label-spacer"></div>
          {Array.from({ length: gridRows }).map((_, row) => (
            <div key={`left-${row}`} className="level-label left">
              Level {row + 1}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div id="quiz-grid" style={{ '--grid-cols': gridCols }}>
          {Array.from({ length: gridCols }).map((_, col) => (
            <div key={col} className="grid-column">
              {/* Column Header */}
              {isAdmin ? (
                <input
                  id={`column-header-${col}`}
                  className="col-header-input"
                  type="text"
                  value={columnNames[col] || ''}
                  onChange={(e) => onColNameChange(col, e.target.value)}
                  placeholder={`Column ${col + 1}`}
                />
              ) : (
                <div id={`column-header-${col}`} className="col-header-static">
                  {columnNames[col] || `Column ${col + 1}`}
                </div>
              )}

              {/* Question Blocks */}
              {Array.from({ length: gridRows }).map((_, row) => {
                const block = quizData.find(b => b.col === col && b.row === row);
                return block ? (
                  <BlockTile
                    key={block.id}
                    block={block}
                    isAdmin={isAdmin}
                    onClick={onBlockClick}
                  />
                ) : null;
              })}
            </div>
          ))}
        </div>

        {/* Right side labels */}
        <div className="side-labels">
          <div className="side-label-spacer"></div>
          {Array.from({ length: gridRows }).map((_, row) => (
            <div key={`right-${row}`} className="level-label">
              Level {row + 1}
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM CONTROLS */}
      <div className="bottom-controls">
        {isAdmin && (
          <button id="btn-block-logos" className="ctrl-btn" onClick={onGoToLogos}>
            <IconImage /> Block Logos
          </button>
        )}
        <button
          id={isAdmin ? 'btn-reset-questions' : 'btn-reset-blocks'}
          className="ctrl-btn"
          onClick={isAdmin ? onResetQuestions : onResetBlocks}
        >
          <IconReset /> {isAdmin ? 'Reset Questions' : 'Reset Blocks'}
        </button>
        <button id="btn-home" className="ctrl-btn" onClick={onGoHome}>
          <IconHome /> Home
        </button>
      </div>
    </div>
  );
};

export default QuizGrid;