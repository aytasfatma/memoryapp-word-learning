import { useState, useEffect } from 'react';
import { type WordSearchGame, getWordSearchGame } from '../../api/puzzle';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import './WordSearchGame.css';

interface GridPosition {
  row: number;
  col: number;
}

export function WordSearchGame({ onBack }: { onBack: () => void }) {
  const [game, setGame] = useState<WordSearchGame | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());
  const [selecting, setSelecting] = useState(false);
  const [startPos, setStartPos] = useState<GridPosition | null>(null);
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [feedback, setFeedback] = useState<string>('');
  const [wordPositions, setWordPositions] = useState<Map<string, GridPosition[]>>(new Map());

  useEffect(() => {
    loadGame();
  }, []);

  async function loadGame() {
    setLoading(true);
    try {
      const data = await getWordSearchGame(5);
      setGame(data);
      findWordPositions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Oyun yüklenemedi.');
    } finally {
      setLoading(false);
    }
  }

  function findWordPositions(data: WordSearchGame) {
    const positions = new Map<string, GridPosition[]>();

    for (const word of data.wordsToFind) {
      const wordLower = word.toLowerCase();
      const foundPos = searchWord(data.grid, wordLower);
      if (foundPos) {
        positions.set(word, foundPos);
      }
    }

    setWordPositions(positions);
  }

  function searchWord(grid: string[][], word: string): GridPosition[] | null {
    const rows = grid.length;
    const cols = grid[0]?.length || 0;
    const directions = [
      { row: 0, col: 1 },   // sağ
      { row: 1, col: 0 },   // aşağı
      { row: 1, col: 1 },   // çapraz sağ-aşağı
      { row: 0, col: -1 },  // sol
      { row: -1, col: 0 },  // yukarı
      { row: -1, col: -1 }, // çapraz sol-yukarı
      { row: 1, col: -1 },  // çapraz sağ-yukarı
      { row: -1, col: 1 },  // çapraz sol-aşağı
    ];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        for (const dir of directions) {
          const positions: GridPosition[] = [];
          let match = true;

          for (let i = 0; i < word.length; i++) {
            const nr = r + dir.row * i;
            const nc = c + dir.col * i;

            if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) {
              match = false;
              break;
            }

            if (grid[nr][nc].toLowerCase() !== word[i]) {
              match = false;
              break;
            }

            positions.push({ row: nr, col: nc });
          }

          if (match) {
            return positions;
          }
        }
      }
    }

    return null;
  }

  function getCellKey(row: number, col: number) {
    return `${row},${col}`;
  }

  function handleMouseDown(row: number, col: number) {
    setSelecting(true);
    setStartPos({ row, col });
    setSelectedCells(new Set([getCellKey(row, col)]));
  }

  function handleMouseEnter(row: number, col: number) {
    if (!selecting || !startPos) return;

    const newSelected = new Set<string>();
    const rowDiff = Math.sign(row - startPos.row);
    const colDiff = Math.sign(col - startPos.col);

    let r = startPos.row;
    let c = startPos.col;

    while (true) {
      newSelected.add(getCellKey(r, c));
      if (r === row && c === col) break;
      r += rowDiff;
      c += colDiff;
    }

    setSelectedCells(newSelected);
  }

  function handleMouseUp() {
    setSelecting(false);
    checkSelection();
  }

  function checkSelection() {
    const selectedPositions = Array.from(selectedCells).map((key) => {
      const [row, col] = key.split(',').map(Number);
      return { row, col };
    });

    for (const word of wordPositions.keys()) {
      if (foundWords.has(word)) continue;

      const positions = wordPositions.get(word);
      if (!positions) continue;

      const matches = positions.every((pos) =>
        selectedPositions.some((cell) => cell.row === pos.row && cell.col === pos.col)
      ) && selectedPositions.length === positions.length;

      if (matches) {
        setFoundWords((prev) => new Set([...prev, word]));
        setFeedback(`✓ ${word} bulundu!`);
        setTimeout(() => {
          setFeedback('');
          setSelectedCells(new Set());
        }, 1500);
        return;
      }
    }

    setSelectedCells(new Set());
  }

  if (loading) {
    return <div className="game-loading">Oyun yükleniyor...</div>;
  }

  if (error || !game) {
    return (
      <div className="game-page">
        <Card>
          <p className="error">{error || 'Veri yok'}</p>
          <Button onClick={onBack} variant="primary">
            Geri Dön
          </Button>
        </Card>
      </div>
    );
  }

  const isComplete = foundWords.size === game.wordsToFind.length;

  return (
    <div className="game-page">
      <div className="game-header">
        <h1>🔍 Kelime Avı</h1>
        <div className="game-stats">
          <span>Bulundu: {foundWords.size}/{game.wordsToFind.length}</span>
        </div>
      </div>

      {feedback && <div className="feedback-banner correct">{feedback}</div>}

      {isComplete ? (
        <Card>
          <h2>🎉 Harika!</h2>
          <p>Tüm kelimeyi buldun!</p>
          <Button onClick={onBack} variant="accent" style={{ width: '100%' }}>
            Oyunlara Geri Dön
          </Button>
        </Card>
      ) : (
        <>
          <Card className="word-search-grid">
            <div className="grid-container">
              {game.grid.map((row, rowIdx) => (
                <div key={rowIdx} className="grid-row">
                  {row.map((letter, colIdx) => {
                    const cellKey = getCellKey(rowIdx, colIdx);
                    const isSelected = selectedCells.has(cellKey);

                    return (
                      <button
                        key={cellKey}
                        className={`grid-cell ${isSelected ? 'selected' : ''}`}
                        onMouseDown={() => handleMouseDown(rowIdx, colIdx)}
                        onMouseEnter={() => handleMouseEnter(rowIdx, colIdx)}
                        onMouseUp={handleMouseUp}
                      >
                        {letter.toUpperCase()}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </Card>

          <Card className="word-list">
            <h3>Bulunacak Kelimeler:</h3>
            <div className="words">
              {game.wordsToFind.map((word) => (
                <span
                  key={word}
                  className={`word-tag ${foundWords.has(word) ? 'found' : ''}`}
                >
                  {word}
                </span>
              ))}
            </div>
          </Card>
        </>
      )}

      <Button onClick={onBack} variant="ghost" style={{ marginTop: 'var(--spacing-lg)', width: '100%' }}>
        Geri Dön
      </Button>
    </div>
  );
}
