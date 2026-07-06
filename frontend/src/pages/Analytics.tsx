import { useState, useEffect } from 'react';
import { type AnalyticsReport, getAnalyticsReport } from '../api/analytics';
import { Card } from '../components/Card';
import './Analytics.css';

export function Analytics() {
  const [report, setReport] = useState<AnalyticsReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadReport();
  }, []);

  async function loadReport() {
    setLoading(true);
    try {
      const data = await getAnalyticsReport();
      setReport(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Rapor yüklenemedi.');
    } finally {
      setLoading(false);
    }
  }

  function handlePrint() {
    window.print();
  }

  if (loading) {
    return <div className="analytics-loading">Rapor yükleniyor...</div>;
  }

  if (error || !report) {
    return (
      <div className="analytics-page">
        <Card>
          <h1>Analiz Raporu</h1>
          <p className="error">{error || 'Veri bulunamadı'}</p>
        </Card>
      </div>
    );
  }

  const masterPercentage = report.totalWordsStudied > 0
    ? Math.round((report.totalMasteredWords / report.totalWordsStudied) * 100)
    : 0;

  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <h1>Analiz Raporu</h1>
        <button className="print-btn" onClick={handlePrint}>
          🖨️ Yazdır
        </button>
      </div>

      <div className="stats-grid">
        <Card className="stat-card">
          <p className="stat-label">Toplam Kelime</p>
          <p className="stat-value">{report.totalWordsStudied}</p>
        </Card>
        <Card className="stat-card">
          <p className="stat-label">Öğrenilen Kelime</p>
          <p className="stat-value">{report.totalMasteredWords}</p>
        </Card>
        <Card className="stat-card">
          <p className="stat-label">Başarı Oranı</p>
          <p className="stat-value">{masterPercentage}%</p>
        </Card>
      </div>

      <Card className="topics-card">
        <h2>Konu Bazlı Başarı</h2>
        {report.topicBreakdown.length === 0 ? (
          <p className="empty">Henüz veri yok.</p>
        ) : (
          <div className="topics-table">
            <div className="table-header">
              <div className="col-topic">Konu</div>
              <div className="col-number">Deneme</div>
              <div className="col-number">Doğru</div>
              <div className="col-bar">Başarı</div>
            </div>
            {report.topicBreakdown.map((topic) => (
              <div key={topic.topic} className="table-row">
                <div className="col-topic">{topic.topic}</div>
                <div className="col-number">{topic.totalAttempts}</div>
                <div className="col-number">{topic.totalCorrect}</div>
                <div className="col-bar">
                  <div className="progress-bar-container">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${topic.successPercentage}%` }}
                    ></div>
                  </div>
                  <span className="percentage">{Math.round(topic.successPercentage)}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
