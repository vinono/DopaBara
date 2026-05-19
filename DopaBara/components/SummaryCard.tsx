import type { MoodSummary } from '@/types/mood';

type SummaryCardProps = {
  summary: MoodSummary;
};

export function SummaryCard({ summary }: SummaryCardProps) {
  return (
    <section className="card result">
      <h2>今日小结</h2>
      <p>{summary.summary}</p>
      <div className="grid">
        <div><span>主要情绪</span><strong>{summary.mainMood}</strong></div>
        <div><span>主要来源</span><strong>{summary.mainDopamineSource}</strong></div>
        <div><span>健康占比</span><strong>{Math.round(summary.healthyDopamineRatio * 100)}%</strong></div>
      </div>
      <h3>小建议</h3>
      <p>{summary.suggestion}</p>
      <h3>豚豚想说</h3>
      <p>{summary.companionMessage}</p>
    </section>
  );
}
