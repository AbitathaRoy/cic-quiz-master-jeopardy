import React from 'react';
import { IconSettings } from '../icons/Icons';

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