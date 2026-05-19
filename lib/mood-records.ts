import { healthySources } from '@/lib/mood-options';
import type { MoodRecord } from '@/types/mood';

export const storageKey = 'dopabara:mood-records';

export function isToday(dateText: string) {
  const date = new Date(dateText);
  const today = new Date();

  return date.toDateString() === today.toDateString();
}

export function getMostFrequentValue(records: MoodRecord[], key: 'mood' | 'source') {
  const counts = records.reduce<Record<string, number>>((result, record) => {
    result[record[key]] = (result[record[key]] ?? 0) + 1;
    return result;
  }, {});

  return Object.entries(counts).sort((first, second) => second[1] - first[1])[0]?.[0] ?? '暂无';
}

export function getTodayRecords(records: MoodRecord[]) {
  return records.filter((record) => isToday(record.createdAt));
}

export function getAverageIntensity(records: MoodRecord[]) {
  if (records.length === 0) {
    return 0;
  }

  return records.reduce((total, record) => total + record.intensity, 0) / records.length;
}

export function getHealthyDopamineRatio(records: MoodRecord[]) {
  if (records.length === 0) {
    return 0;
  }

  return records.filter((record) => healthySources.has(record.source)).length / records.length;
}

export function getChargedRatio(records: MoodRecord[]) {
  if (records.length === 0) {
    return 0;
  }

  return records.filter((record) => record.effect === 'charged').length / records.length;
}

export function getRecentRecords(records: MoodRecord[], days: number) {
  const now = new Date();
  const startDate = new Date(now);
  startDate.setDate(now.getDate() - days + 1);
  startDate.setHours(0, 0, 0, 0);

  return records.filter((record) => new Date(record.createdAt) >= startDate);
}

export function getDailyTrend(records: MoodRecord[], days: number) {
  const now = new Date();

  return Array.from({ length: days }, (_, index) => {
    const date = new Date(now);
    date.setDate(now.getDate() - (days - index - 1));
    date.setHours(0, 0, 0, 0);

    const nextDate = new Date(date);
    nextDate.setDate(date.getDate() + 1);

    const dayRecords = records.filter((record) => {
      const recordDate = new Date(record.createdAt);
      return recordDate >= date && recordDate < nextDate;
    });

    return {
      dateKey: date.toISOString(),
      label: `${date.getMonth() + 1}/${date.getDate()}`,
      recordCount: dayRecords.length,
      averageIntensity: getAverageIntensity(dayRecords),
      chargedRatio: getChargedRatio(dayRecords),
    };
  });
}

export function getTopSourcesByEffect(records: MoodRecord[], effects: string[], limit = 3) {
  const effectSet = new Set(effects);
  const counts = records.reduce<Record<string, number>>((result, record) => {
    if (!effectSet.has(record.effect)) {
      return result;
    }

    result[record.source] = (result[record.source] ?? 0) + 1;
    return result;
  }, {});

  return Object.entries(counts)
    .sort((first, second) => second[1] - first[1])
    .slice(0, limit)
    .map(([source, count]) => ({ source, count }));
}

export function createLocalInsight(records: MoodRecord[]) {
  if (records.length === 0) {
    return '先记录几次真实状态，豚豚就能帮你看见哪些事情更充电、哪些事情更容易让你空下来。';
  }

  const chargedSources = getTopSourcesByEffect(records, ['charged'], 1);
  const drainedSources = getTopSourcesByEffect(records, ['drained', 'empty'], 1);

  if (chargedSources.length > 0) {
    return `最近「${chargedSources[0].source}」比较能给你充电，明天可以优先安排一个低门槛版本。`;
  }

  if (drainedSources.length > 0) {
    return `最近「${drainedSources[0].source}」比较容易让你被消耗或有点空，可以先给它设置一个温柔边界。`;
  }

  return '最近的记录还比较平均。可以继续观察：哪些活动结束后，你的身体会更轻一点。';
}

export function groupRecordsByDate(records: MoodRecord[]) {
  return records.reduce<Record<string, MoodRecord[]>>((groups, record) => {
    const key = new Date(record.createdAt).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    groups[key] = groups[key] ? [...groups[key], record] : [record];
    return groups;
  }, {});
}
