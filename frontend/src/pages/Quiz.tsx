import { useState, useEffect } from 'react';
import { type QuizQuestion, type QuizAnswer, getTodayQuiz, submitAnswer } from '../api/quiz';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import './Quiz.css';

export function Quiz() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [answering, setAnswering] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [lastAnswer, setLastAnswer] = useState<QuizAnswer | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    loadQuiz();
  }, []);

  async function loadQuiz() {
    setLoading(true);
    try {
      const data = await getTodayQuiz();
      setQuestions(data);
      if (data.length === 0) {
        setError('Bugün için soru yok. Daha sonra gel!');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sorular yüklenemedi.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitAnswer() {
    if (!selectedAnswer.trim()) return;

    setAnswering(true);
    try {
      const result = await submitAnswer(questions[currentIndex].wordId, selectedAnswer);
      setLastAnswer(result);
      setShowFeedback(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Cevap gönderilemedi.');
    } finally {
      setAnswering(false);
    }
  }

  function handleNextQuestion() {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer('');
      setLastAnswer(null);
      setShowFeedback(false);
    } else {
      setError('Tüm soruları tamamladın! Harika! 🎉');
      setCurrentIndex(0);
      setSelectedAnswer('');
      setLastAnswer(null);
      setShowFeedback(false);
    }
  }

  if (loading) {
    return <div className="quiz-loading">Sorular yükleniyor...</div>;
  }

  if (error && questions.length === 0) {
    return (
      <div className="quiz-page">
        <Card>
          <h1>Sınav</h1>
          <p className="error">{error}</p>
          <Button onClick={loadQuiz} variant="accent">
            Tekrar Dene
          </Button>
        </Card>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="quiz-page">
        <Card>
          <h1>Sınav</h1>
          <p>Henüz hiç soru yok.</p>
        </Card>
      </div>
    );
  }

  const question = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="quiz-page">
      <div className="quiz-header">
        <h1>Günlük Sınav</h1>
        <p className="progress">
          {currentIndex + 1} / {questions.length}
        </p>
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>

      <Card className="quiz-card">
        <div className="question-section">
          <h2 className="question-text">
            {question.prompt}
            {question.questionType === 'MultipleChoice' ? ' — İngilizce karşılığı nedir?' : ''}
          </h2>

          {question.questionType === 'MultipleChoice' && question.choices ? (
            <div className="choices">
              {question.choices.map((choice, idx) => (
                <button
                  key={idx}
                  className={`choice-btn ${selectedAnswer === choice ? 'selected' : ''} ${
                    false ? 'correct' : ''
                  } ${false ? 'incorrect' : ''}`}
                  onClick={() => !showFeedback && setSelectedAnswer(choice)}
                  disabled={showFeedback}
                >
                  {choice}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-input-group">
              <input
                type="text"
                className="text-input"
                value={selectedAnswer}
                onChange={(e) => setSelectedAnswer(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !showFeedback && handleSubmitAnswer()}
                disabled={showFeedback}
                placeholder="Cevabını yazın..."
              />
            </div>
          )}
        </div>

        {showFeedback && lastAnswer && (
          <div className={`feedback ${lastAnswer.isCorrect ? 'correct' : 'incorrect'}`}>
            <p className="feedback-title">{lastAnswer.isCorrect ? '✓ Doğru!' : '✗ Yanlış'}</p>
            <p className="feedback-text">
              {lastAnswer.isCorrect ? 'Harika!' : `Doğru cevap: ${lastAnswer.correctAnswer}`}
            </p>
            <div className="progress-info">
              {!lastAnswer.isMastered && (
                <p>Sonraki tekrar: {new Date(lastAnswer.nextReviewDate).toLocaleDateString('tr-TR')}</p>
              )}
              {lastAnswer.isMastered && <p className="mastered">🌟 Bu kelimeyi öğrendin!</p>}
            </div>
          </div>
        )}

        {!showFeedback ? (
          <Button
            onClick={handleSubmitAnswer}
            disabled={!selectedAnswer.trim() || answering}
            variant="accent"
            style={{ width: '100%', marginTop: 'var(--spacing-lg)' }}
          >
            {answering ? 'Kontrol ediliyor...' : 'Cevabı Gönder'}
          </Button>
        ) : (
          <Button
            onClick={handleNextQuestion}
            variant="primary"
            style={{ width: '100%', marginTop: 'var(--spacing-lg)' }}
          >
            {currentIndex < questions.length - 1 ? 'Sonraki Soru' : 'Bitir'}
          </Button>
        )}

        {error && <p className="error" style={{ marginTop: 'var(--spacing-md)' }}>{error}</p>}
      </Card>
    </div>
  );
}
