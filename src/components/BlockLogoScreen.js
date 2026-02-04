import React from 'react';
import { IconSettings, IconImage, IconReset, IconHome } from '../icons/Icons';

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

export default BlockLogoScreen;
