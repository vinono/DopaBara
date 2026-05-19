import { getAverageIntensity, getChargedRatio, getHealthyDopamineRatio } from '@/lib/mood-records';
import type { MoodRecord } from '@/types/mood';

type TodayStatsProps = {
  records: MoodRecord[];
};

export function TodayStats({ records }: TodayStatsProps) {
  const averageIntensity = getAverageIntensity(records);
  const healthyDopamineRatio = getHealthyDopamineRatio(records);
  const chargedRatio = getChargedRatio(records);

  return (
    <section className="statsGrid">
      <div className="statCard">
        <span>今日记录</span>
        <strong>{records.length}</strong>
        <p>次情绪 check-in</p>
      </div>
      <div className="statCard">
        <span>平均强度</span>
        <strong>{averageIntensity.toFixed(1)}</strong>
        <p>满分 5 分</p>
      </div>
      <div className="statCard">
        <span>健康占比</span>
        <strong>{Math.round(healthyDopamineRatio * 100)}%</strong>
        <p>高质量多巴胺</p>
      </div>
      <div className="statCard">
        <span>充电比例</span>
        <strong>{Math.round(chargedRatio * 100)}%</strong>
        <p>记录后感觉变好</p>
      </div>
    </section>
  );
}
