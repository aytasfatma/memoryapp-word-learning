import { useState, useEffect } from 'react';
import { type Word, getWords, createWord, deleteWord } from '../api/words';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import './Words.css';

export function Words() {
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    engWordName: '',
    turWordName: '',
    topic: '',
    mnemonicHint: '',
    samples: [''],
    picture: null as File | null,
  });

  useEffect(() => {
    loadWords();
  }, []);

  async function loadWords() {
    setLoading(true);
    try {
      const data = await getWords();
      setWords(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kelimeler yüklenemedi.');
    } finally {
      setLoading(false);
    }
  }

  async function handleAddWord(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await createWord({
        ...formData,
        samples: formData.samples.filter((s) => s.trim()),
        picture: formData.picture ?? undefined,
      });
      setWords([]);
      loadWords();
      setFormData({
        engWordName: '',
        turWordName: '',
        topic: '',
        mnemonicHint: '',
        samples: [''],
        picture: null,
      });
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kelime eklenemedi.');
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Kelimeyi silmek istediğine emin misin?')) return;
    try {
      await deleteWord(id);
      setWords(words.filter((w) => w.wordId !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kelime silinemedi.');
    }
  }

  return (
    <div className="words-page">
      <div className="words-header">
        <h1>Kelimelerimi Yönet</h1>
        <Button variant="accent" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'İptal' : '+ Yeni Kelime Ekle'}
        </Button>
      </div>

      {showForm && (
        <Card className="add-word-form">
          <h2>Yeni Kelime Ekle</h2>
          <form onSubmit={handleAddWord}>
            <Input
              id="engWordName"
              label="İngilizce Kelime"
              value={formData.engWordName}
              onChange={(e) => setFormData({ ...formData, engWordName: e.target.value })}
              required
            />
            <Input
              id="turWordName"
              label="Türkçe Karşılığı"
              value={formData.turWordName}
              onChange={(e) => setFormData({ ...formData, turWordName: e.target.value })}
              required
            />
            <Input
              id="topic"
              label="Konu (İsteğe bağlı)"
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
            />
            <Input
              id="mnemonicHint"
              label="Hatırlatma İpucu (İsteğe bağlı)"
              value={formData.mnemonicHint}
              onChange={(e) => setFormData({ ...formData, mnemonicHint: e.target.value })}
            />
            <div className="form-group">
              <label htmlFor="picture">Resim (İsteğe bağlı)</label>
              <input
                id="picture"
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({ ...formData, picture: e.target.files?.[0] || null })}
              />
            </div>
            <div className="form-group">
              <label>Örnek Cümleler</label>
              {formData.samples.map((sample, idx) => (
                <Input
                  key={idx}
                  value={sample}
                  placeholder="Örnek cümle..."
                  onChange={(e) => {
                    const newSamples = [...formData.samples];
                    newSamples[idx] = e.target.value;
                    setFormData({ ...formData, samples: newSamples });
                  }}
                />
              ))}
              <Button
                type="button"
                variant="ghost"
                onClick={() => setFormData({ ...formData, samples: [...formData.samples, ''] })}
              >
                + Örnek Ekle
              </Button>
            </div>
            {error && <p className="error">{error}</p>}
            <Button type="submit" variant="accent" style={{ width: '100%' }}>
              Kelimeyi Ekle
            </Button>
          </form>
        </Card>
      )}

      {loading ? (
        <p className="loading">Kelimeler yükleniyor...</p>
      ) : words.length === 0 ? (
        <p className="empty">Henüz hiç kelime eklemedin. Yukarıdan başla!</p>
      ) : (
        <div className="words-grid">
          {words.map((word) => (
            <Card key={word.wordId} className="word-card">
              <div className="word-header">
                <h3>{word.engWordName}</h3>
                <Button
                  variant="ghost"
                  onClick={() => handleDelete(word.wordId)}
                  style={{ padding: '4px 8px', fontSize: '12px' }}
                >
                  Sil
                </Button>
              </div>
              <p className="word-translation">{word.turWordName}</p>
              {word.topic && <p className="word-topic">Konu: {word.topic}</p>}
              {word.mnemonicHint && <p className="word-hint">💡 {word.mnemonicHint}</p>}
              {word.samples.length > 0 && (
                <div className="word-samples">
                  <p className="label">Örnekler:</p>
                  {word.samples.map((sample, idx) => (
                    <p key={idx} className="sample">
                      • {sample}
                    </p>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
