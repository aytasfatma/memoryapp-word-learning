import { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { MatchingGame } from './puzzle/MatchingGame';
import { AnagramGame } from './puzzle/AnagramGame';
import { WordSearchGame } from './puzzle/WordSearchGame';
import './Puzzle.css';

export function Puzzle() {
  const [currentGame, setCurrentGame] = useState<'menu' | 'matching' | 'anagram' | 'wordSearch'>('menu');

  return (
    <div className="puzzle-page">
      {currentGame === 'menu' && (
        <div className="puzzle-menu">
          <div className="puzzle-header">
            <h1>🎮 Bulmacalar</h1>
            <p>Eğlenerek kelime öğren</p>
          </div>

          <div className="puzzle-grid">
            <Card className="puzzle-option">
              <div className="puzzle-icon">🎴</div>
              <h2>Eşleştirme</h2>
              <p>İngilizce ve Türkçe kartları eşleştir</p>
              <Button
                onClick={() => setCurrentGame('matching')}
                variant="accent"
                style={{ width: '100%', marginTop: 'var(--spacing-lg)' }}
              >
                Oyna
              </Button>
            </Card>

            <Card className="puzzle-option">
              <div className="puzzle-icon">🔤</div>
              <h2>Anagram</h2>
              <p>Karışık harflerden kelimeyi bul</p>
              <Button
                onClick={() => setCurrentGame('anagram')}
                variant="accent"
                style={{ width: '100%', marginTop: 'var(--spacing-lg)' }}
              >
                Oyna
              </Button>
            </Card>

            <Card className="puzzle-option">
              <div className="puzzle-icon">🔍</div>
              <h2>Kelime Avı</h2>
              <p>Izgarada kelimeyi bul (yatay, dikey, çapraz)</p>
              <Button
                onClick={() => setCurrentGame('wordSearch')}
                variant="accent"
                style={{ width: '100%', marginTop: 'var(--spacing-lg)' }}
              >
                Oyna
              </Button>
            </Card>
          </div>
        </div>
      )}

      {currentGame === 'matching' && (
        <MatchingGame onBack={() => setCurrentGame('menu')} />
      )}

      {currentGame === 'anagram' && (
        <AnagramGame onBack={() => setCurrentGame('menu')} />
      )}

      {currentGame === 'wordSearch' && (
        <WordSearchGame onBack={() => setCurrentGame('menu')} />
      )}
    </div>
  );
}
