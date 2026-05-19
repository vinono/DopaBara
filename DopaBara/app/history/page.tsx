'use client';

import { useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { MoodRecordList } from '@/components/MoodRecordList';
import { SummaryCard } from '@/components/SummaryCard';
import { useMoodRecords } from '@/hooks/useMoodRecords';
import {
  getAverageIntensity,
  getChargedRatio,
  getRecentRecords,
  getTodayRecords,
  groupRecordsByDate,
} from '@/lib/mood-records';
import type { MoodRecord, MoodSummary } from '@/types/mood';

type HistoryRange = 'all' | 'today' | '7d' | '30d';

const historyRanges: { label: string; value: HistoryRange }[] = [
  { label: '全部', value: 'all' },
  { label: '今天', value: 'today' },
  { label: '最近 7 天', value: '7d' },
  { label: '最近 30 天', value: '30d' },
];

function getFilteredRecords(records: MoodRecord[], range: HistoryRange) {
  if (range === 'today') {
    return getTodayRecords(records);
  }

  if (range === '7d') {
    return getRecentRecords(records, 7);
  }

  if (range === '30d') {
    return getRecentRecords(records, 30);
  }

  return records;
}

export default function HistoryPage() {
  const { records, deleteRecord } = useMoodRecords();
  const [range, setRange] = useState<HistoryRange>('all');
  const [summaries, setSummaries] = useState<Record<string, MoodSummary>>({});
  const [loadingDate, setLoadingDate] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const filteredRecords = getFilteredRecords(records, range);
  const groupedRecords = groupRecordsByDate(filteredRecords);
  const dates = Object.keys(groupedRecords);

  async function handleGenerateDaySummary(date: string, dayRecords: MoodRecord[]) {
    setLoadingDate(date);
    setErrors((currentErrors) => ({ ...currentErrors, [date]: '' }));

    try {
      const response = await fetch('/api/mood-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ records: dayRecords }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? '生成失败');
      }

      setSummaries((currentSummaries) => ({ ...currentSummaries, [date]: data }));
    } catch (caughtError) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        [date]: caughtError instanceof Error ? caughtError.message : '生成失败',
      }));
    } finally {
      setLoadingDate('');
    }
  }

  return (
    <AppShell>
      <section className="card pageHeader">
        <p className="eyebrow">Mood Timeline</p>
        <h1>历史记录</h1>
        <p className="subtitle compactSubtitle">回看每一天的情绪、多巴胺来源和能量变化。</p>
      </section>

      <section className="filterBar" aria-label="历史范围筛选">
        {historyRanges.map((item) => (
          <button
            className={item.value === range ? 'filterChip activeFilterChip' : 'filterChip'}
            key={item.value}
            onClick={() => setRange(item.value)}
            type="button"
          >
            {item.label}
          </button>
        ))}
      </section>

      {dates.length > 0 ? (
        dates.map((date) => {
          const dayRecords = groupedRecords[date];
          const averageIntensity = getAverageIntensity(dayRecords);
          const chargedRatio = getChargedRatio(dayRecords);

          return (
            <section className="card dayCard" key={date}>
              <div className="sectionTitle">
                <h2>{date}</h2>
                <span>{dayRecords.length} 条</span>
              </div>

              <div className="dayMeta">
                <span>{dayRecords.length} 条记录</span>
                <span>平均强度 {averageIntensity.toFixed(1)}</span>
                <span>充电 {Math.round(chargedRatio * 100)}%</span>
              </div>

              <button
                className="button smallButton"
                disabled={loadingDate === date}
                onClick={() => handleGenerateDaySummary(date, dayRecords)}
                type="button"
              >
                {loadingDate === date ? '豚豚正在分析...' : '生成这一天小结'}
              </button>

              {errors[date] ? <p className="inlineError">{errors[date]}</p> : null}
              {summaries[date] ? <SummaryCard summary={summaries[date]} /> : null}

              <MoodRecordList records={dayRecords} emptyText="这一天还没有记录。" onDelete={deleteRecord} />
            </section>
          );
        })
      ) : (
        <section className="card">
          <p className="empty">还没有历史记录。先去记录一次，让豚豚帮你留住今天的小变化。</p>
        </section>
      )}
    </AppShell>
  );
}
