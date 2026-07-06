import { useState, useEffect } from 'react';
import { type MatchCard, getMatchGame } from '../../api/puzzle';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import './MatchingGame.css';

export function MatchingGame({ onBack }: { onBack: () => void }) {
  const [cards, setCards] = useState<MatchCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCards, setSelectedCards] = useState<MatchCard[]>([]);
  const [matchedWordIds, setMatchedWordIds] = useState<Set<number>>(new Set());
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'incorrect'; message: string } | null>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    loadCards();
  }, []);

  async function loadCards() {
    setLoading(true);
    try {
      const data = await getMatchGame(5);
      setCards(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Oyun yüklenemedi.');
    } finally {
      setLoading(false);
    }
  }

  function handleCardClick(card: MatchCard) {
    if (matchedWordIds.has(card.wordId)) return;
    if (selectedCards.find((c) => c.cardId === card.cardId)) return;

    const newSelected = [...selectedCards, card];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      const [first, second] = newSelected;

      if (first.wordId === second.wordId && first.language !== second.language) {
        setMatchedWordIds((prev) => new Set([...prev, first.wordId]));
        setFeedback({ type: 'correct', message: '✓ Doğru!' });
        setScore((prev) => prev + 1);
        setTimeout(() => {
          setSelectedCards([]);
          setFeedback(null);
        }, 1500);
      } else {
        setFeedback({ type: 'incorrect', message: '✗ Yanlış' });
        setTimeout(() => {
          setSelectedCards([]);
          setFeedback(null);
        }, 1500);
      }
    }
  }

  if (loading) {
    return <div className="game-loading">Oyun yükleniyor...</div>;
  }

  if (error || cards.length === 0) {
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

  const totalWords = new Set(cards.map((c) => c.wordId)).size;
  const isComplete = matchedWordIds.size === totalWords;
  const unmatched = cards.filter((c) => !matchedWordIds.has(c.wordId));

  return (
    <div className="game-page">
      <div className="game-header">
        <h1>🎴 Eşleştirme</h1>
        <div className="game-stats">
          <span>Skor: {score}/{totalWords}</span>
        </div>
      </div>

      {feedback && (
        <div className={`feedback-banner ${feedback.type}`}>
          {feedback.message}
        </div>
      )}

      {isComplete ? (
        <Card>
          <h2>🎉 Tebrikler!</h2>
          <p>Tüm eşleştirmeleri başarıyla yaptın!</p>
          <Button onClick={onBack} variant="accent" style={{ width: '100%' }}>
            Oyunlara Geri Dön
          </Button>
        </Card>
      ) : (
        <Card className="matching-card">
          <div className="matching-grid">
            {unmatched.map((card) => (
              <button
                key={card.cardId}
                className={`card-btn ${selectedCards.find((c) => c.cardId === card.cardId) ? 'selected' : ''}`}
                onClick={() => handleCardClick(card)}
              >
                {card.text}
              </button>
            ))}
          </div>
        </Card>
      )}

      <Button onClick={onBack} variant="ghost" style={{ marginTop: 'var(--spacing-lg)', width: '100%' }}>
        Geri Dön
      </Button>
    </div>
  );
}
