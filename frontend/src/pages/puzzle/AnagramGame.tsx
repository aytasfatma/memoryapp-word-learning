import { useState, useEffect } from 'react';
import { type AnagramQuestion, getAnagramGame } from '../../api/puzzle';
import { type Word, getWords } from '../../api/words';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import './AnagramGame.css';

export function AnagramGame({ onBack }: { onBack: () => void }) {
  const [questions, setQuestions] = useState<AnagramQuestion[]>([]);
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'incorrect'; message: string } | null>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [questionsData, wordsData] = await Promise.all([
        getAnagramGame(5),
        getWords(),
      ]);
      setQuestions(questionsData);
      setWords(wordsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Oyun yüklenemedi.');
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!answer.trim()) return;

    const current = questions[currentIndex];
    const correctWord = words.find((w) => w.wordId === current.wordId);
    const isCorrect = correctWord && answer.toLowerCase().trim() === correctWord.engWordName.toLowerCase();

    if (isCorrect) {
      setCompleted((prev) => new Set([...prev, currentIndex]));
      setScore((prev) => prev + 1);
      setFeedback({ type: 'correct', message: '✓ Doğru!' });
    } else {
      setFeedback({
        type: 'incorrect',
        message: `✗ Yanlış. Doğru cevap: ${correctWord?.engWordName || '?'}`
      });
    }

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setAnswer('');
        setFeedback(null);
      } else {
        setAnswer('');
      }
    }, 2000);
  }

  if (loading) {
    return <div className="game-loading">Oyun yükleniyor...</div>;
  }

  if (error || questions.length === 0 || words.length === 0) {
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

  const current = questions[currentIndex];
  const isComplete = completed.size === questions.length;
  const isAnswered = completed.has(currentIndex);

  return (
    <div className="game-page">
      <div className="game-header">
        <h1>🔤 Anagram</h1>
        <div className="game-stats">
          <span>{currentIndex + 1}/{questions.length}</span>
          <span>Skor: {score}</span>
        </div>
      </div>

      {feedback && (
        <div className={`feedback-banner ${feedback.type}`}>
          {feedback.message}
        </div>
      )}

      {isComplete ? (
        <Card>
          <h2>🎉 Oyun Bitti!</h2>
          <p>Toplam Skor: {score}/{questions.length}</p>
          <Button onClick={onBack} variant="accent" style={{ width: '100%' }}>
            Oyunlara Geri Dön
          </Button>
        </Card>
      ) : (
        <Card className="anagram-card">
          <div className="anagram-hint">
            💡 {current.turkishHint}
          </div>
          <div className="anagram-scrambled">
            {current.scrambledWord}
          </div>
          <form onSubmit={handleSubmit}>
            <Input
              id="answer"
              placeholder="Cevabını yazarak Enter'a bas..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              disabled={isAnswered}
            />
          </form>
        </Card>
      )}

      <Button onClick={onBack} variant="ghost" style={{ marginTop: 'var(--spacing-lg)', width: '100%' }}>
        Geri Dön
      </Button>
    </div>
  );
}
