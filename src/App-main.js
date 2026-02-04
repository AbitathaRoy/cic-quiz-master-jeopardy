import React, { useState, useCallback } from 'react';
import './styles.css';
import { createEmptyQuiz } from './utils/quizData';
import HomeScreen from './components/HomeScreen';
import QuizGrid from './components/QuizGrid';
import BlockLogoScreen from './components/BlockLogoScreen';
import BlockModal from './components/BlockModal';
import ResetWarningModal from './components/ResetWarningModal';

const QuizApp = () => {
  // ─────────────────────────────────────────────
  // STATE MANAGEMENT
  // ─────────────────────────────────────────────
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

  // ─────────────────────────────────────────────
  // GRID CONFIGURATION HANDLERS
  // ─────────────────────────────────────────────
  const handleApplyGridSettings = useCallback(() => {
    const newRows = Math.max(1, Math.min(10, tempRows)); // Limit 1-10
    const newCols = Math.max(1, Math.min(10, tempCols)); // Limit 1-10
    setGridRows(newRows);
    setGridCols(newCols);
    setQuizData(createEmptyQuiz(newRows, newCols));
    setColumnNames(new Array(newCols).fill(''));
  }, [tempRows, tempCols]);

  // ─────────────────────────────────────────────
  // BLOCK INTERACTION HANDLERS
  // ─────────────────────────────────────────────
  const handleBlockClick = useCallback((blockId) => {
    setQuizData(prev => {
      const block = prev.find(b => b.id === blockId);
      setOpenBlock(block);
      return prev;
    });
    setShowAnswer(false);
  }, []);

  const handleClose = useCallback(() => { 
    setOpenBlock(null); 
    setShowAnswer(false); 
  }, []);

  const handleFlip = useCallback(() => setShowAnswer(p => !p), []);

  const handleToggleRead = useCallback(() => {
    setQuizData(prev => prev.map(b => b.id === openBlock.id ? { ...b, isRead: !b.isRead } : b));
    setOpenBlock(prev => ({ ...prev, isRead: !prev.isRead }));
  }, [openBlock?.id]);

  // ─────────────────────────────────────────────
  // CONTENT MANAGEMENT HANDLERS
  // ─────────────────────────────────────────────
  const handleContentChange = useCallback((contentType, newContent) => {
    setQuizData(prev => prev.map(b =>
      b.id === openBlock.id ? { ...b, [contentType]: { content: newContent } } : b
    ));
    setOpenBlock(prev => ({ ...prev, [contentType]: { content: newContent } }));
  }, [openBlock?.id]);

  // ─────────────────────────────────────────────
  // RESET HANDLERS
  // ─────────────────────────────────────────────
  const handleResetBlocks = useCallback(() => {
    setQuizData(prev => prev.map(b => ({ ...b, isRead: false })));
  }, []);

  const handleResetQuestions = useCallback(() => {
    setQuizData(createEmptyQuiz(gridRows, gridCols));
    setColumnNames(new Array(gridCols).fill(''));
    setShowResetWarning(false);
    setOpenBlock(null);
  }, [gridRows, gridCols]);

  // ─────────────────────────────────────────────
  // COLUMN NAME HANDLERS
  // ─────────────────────────────────────────────
  const handleColNameChange = useCallback((i, val) => {
    setColumnNames(prev => { const n = [...prev]; n[i] = val; return n; });
  }, []);

  // ─────────────────────────────────────────────
  // LOGO MANAGEMENT HANDLERS
  // ─────────────────────────────────────────────
  const handleLogoChange = useCallback((blockId, logoUrl) => {
    setQuizData(prev => prev.map(b => b.id === blockId ? { ...b, logoUrl } : b));
  }, []);

  const handleApplyToAll = useCallback((logoUrl) => {
    setQuizData(prev => prev.map(b => ({ ...b, logoUrl })));
  }, []);

  const handleResetLogos = useCallback(() => {
    setQuizData(prev => prev.map(b => ({ ...b, logoUrl: '' })));
  }, []);

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────
  return (
    <div id="quiz-app">
      {/* HOME SCREEN */}
      {screen === 'home' && (
        <HomeScreen 
          onGoMain={() => setScreen('main')} 
          onGoAdmin={() => setScreen('admin')} 
        />
      )}

      {/* MAIN/ADMIN QUIZ GRID SCREEN */}
      {(screen === 'main' || screen === 'admin') && (
        <QuizGrid
          isAdmin={isAdmin}
          gridRows={gridRows}
          gridCols={gridCols}
          tempRows={tempRows}
          tempCols={tempCols}
          quizData={quizData}
          columnNames={columnNames}
          onTempRowsChange={setTempRows}
          onTempColsChange={setTempCols}
          onApplyGridSettings={handleApplyGridSettings}
          onBlockClick={handleBlockClick}
          onColNameChange={handleColNameChange}
          onResetBlocks={handleResetBlocks}
          onResetQuestions={() => setShowResetWarning(true)}
          onGoToLogos={() => setScreen('logos')}
          onGoHome={() => setScreen('home')}
        />
      )}

      {/* BLOCK LOGO CUSTOMIZATION SCREEN */}
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

      {/* BLOCK MODAL (Question/Answer Editor/Viewer) */}
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

      {/* RESET WARNING MODAL */}
      {showResetWarning && (
        <ResetWarningModal 
          onCancel={() => setShowResetWarning(false)} 
          onConfirm={handleResetQuestions} 
        />
      )}
    </div>
  );
};

export default QuizApp;