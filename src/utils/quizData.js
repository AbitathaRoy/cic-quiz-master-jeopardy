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