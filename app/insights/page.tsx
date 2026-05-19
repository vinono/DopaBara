'use client';

import { AppShell } from '@/components/AppShell';
import { useMoodRecords } from '@/hooks/useMoodRecords';
import {
  createLocalInsight,
  getAverageIntensity,
  getChargedRatio,
  getDailyTrend,
  getHealthyDopamineRatio,
  getMostFrequentValue,
  getRecentRecords,
  getTopSourcesByEffect,
} from '@/lib/mood-records';

export default function InsightsPage() {
  const { records } = useMoodRecords();
  const weeklyRecords = getRecentRecords(records, 7);
  const trend = getDailyTrend(records, 7);
  const weeklyAverageIntensity = getAverageIntensity(weeklyRecords);
  const weeklyHealthyRatio = getHealthyDopamineRatio(weeklyRecords);
  const weeklyChargedRatio = getChargedRatio(weeklyRecords);
  const weeklyMainMood = getMostFrequentValue(weeklyRecords, 'mood');
  const chargedSources = getTopSourcesByEffect(weeklyRecords, ['charged']);
  const drainedSources = getTopSourcesByEffect(weeklyRecords, ['drained', 'empty']);
  const localInsight = createLocalInsight(weeklyRecords);

  return (
    <AppShell>
      <section className="card pageHeader">
        <p className="eyebrow">Dopamine Insights</p>
        <h1>洞察</h1>
        <p className="subtitle compactSubtitle">先用本地规则看见你的快乐来源和消耗来源。</p>
      </section>

      <section className="statsGrid">
        <div className="statCard">
          <span>本周记录</span>
          <strong>{weeklyRecords.length}</strong>
          <p>最近 7 天 check-in</p>
        </div>
        <div className="statCard">
          <span>平均强度</span>
          <strong>{weeklyAverageIntensity.toFixed(1)}</strong>
          <p>满分 5 分</p>
        </div>
        <div className="statCard">
          <span>健康占比</span>
          <strong>{Math.round(weeklyHealthyRatio * 100)}%</strong>
          <p>高质量多巴胺</p>
        </div>
        <div className="statCard">
          <span>充电比例</span>
          <strong>{Math.round(weeklyChargedRatio * 100)}%</strong>
          <p>记录后感觉变好</p>
        </div>
      </section>

      <section className="insightGrid">
        <div className="statCard">
          <span>本周常见情绪</span>
          <strong>{weeklyMainMood}</strong>
          <p>最近最常出现</p>
        </div>

        <div className="card insightCard">
          <h2>最能充电的来源</h2>
          {chargedSources.length > 0 ? (
            <ol className="sourceList">
              {chargedSources.map((item) => (
                <li key={item.source}>
                  <strong>{item.source}</strong>
                  <span>{item.count} 次</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="empty">本周还没有明显的充电来源记录。</p>
          )}
        </div>

        <div className="card insightCard">
          <h2>容易消耗的来源</h2>
          {drainedSources.length > 0 ? (
            <ol className="sourceList">
              {drainedSources.map((item) => (
                <li key={item.source}>
                  <strong>{item.source}</strong>
                  <span>{item.count} 次</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="empty">本周还没有明显的消耗来源记录。</p>
          )}
        </div>
      </section>

      <section className="card trendCard">
        <div className="sectionTitle">
          <h2>最近 7 天趋势</h2>
          <span>强度 / 充电</span>
        </div>

        <div className="trendGrid">
          {trend.map((item) => (
            <div className="trendDay" key={item.dateKey}>
              <p>{item.label}</p>
              <div className="trendBars">
                <div className="trendTrack">
                  <div className="trendFill intensityFill" style={{ height: `${Math.max(item.averageIntensity * 20, item.recordCount > 0 ? 12 : 0)}%` }} />
                </div>
                <div className="trendTrack">
                  <div className="trendFill chargedFill" style={{ height: `${Math.max(item.chargedRatio * 100, item.recordCount > 0 ? 12 : 0)}%` }} />
                </div>
              </div>
              <span>{item.recordCount > 0 ? `${item.averageIntensity.toFixed(1)} / ${Math.round(item.chargedRatio * 100)}%` : '暂无'}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="card suggestionCard">
        <p className="eyebrow">豚豚建议</p>
        <h2>明天可以这样试试</h2>
        <p>{localInsight}</p>
      </section>
    </AppShell>
  );
}
