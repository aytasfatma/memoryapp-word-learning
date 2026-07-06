import { useState, useEffect } from 'react';
import { type UserSettings, getSettings, updateSettings } from '../api/settings';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import './Settings.css';

export function Settings() {
  const [, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dailyCount, setDailyCount] = useState(10);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    setLoading(true);
    try {
      const data = await getSettings();
      setSettings(data);
      setDailyCount(data.dailyNewWordCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ayarlar yüklenemedi.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      const updated = await updateSettings(dailyCount);
      setSettings(updated);
      setSuccess('Ayarlar kaydedildi!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ayarlar kaydedilemedi.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="settings-loading">Ayarlar yükleniyor...</div>;
  }

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>Ayarlar</h1>
        <p>Kelime öğrenme tercihlerini özelleştir</p>
      </div>

      <Card className="settings-card">
        <form onSubmit={handleSave}>
          <div className="setting-item">
            <label htmlFor="dailyCount">Günlük Yeni Kelime Sayısı</label>
            <p className="setting-description">
              Her gün kaç yeni kelime öğrenmek istersin?
            </p>
            <div className="setting-input-group">
              <Input
                id="dailyCount"
                type="number"
                min="1"
                max="100"
                value={dailyCount.toString()}
                onChange={(e) => setDailyCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
              />
              <p className="setting-hint">Min: 1, Max: 100</p>
            </div>
          </div>

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          <Button
            type="submit"
            variant="accent"
            disabled={saving}
            style={{ width: '100%', marginTop: 'var(--spacing-lg)' }}
          >
            {saving ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
          </Button>
        </form>
      </Card>

      <Card className="settings-info">
        <h3>Bilgi</h3>
        <p>
          Günlük yeni kelime sayısı, sınav modülünde her gün kaç yeni kelime ile karşılaşacağını belirler.
          Daha yüksek sayılar daha hızlı öğrenme anlamına gelir, ancak daha zorlu olabilir.
        </p>
      </Card>
    </div>
  );
}
