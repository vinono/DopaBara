'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { DopaBaraLogo } from '@/components/DopaBaraLogo';
import { MoodRecordList } from '@/components/MoodRecordList';
import { SummaryCard } from '@/components/SummaryCard';
import { TodayStats } from '@/components/TodayStats';
import { useMoodRecords } from '@/hooks/useMoodRecords';
import { getTodayRecords } from '@/lib/mood-records';
import type { MoodSummary } from '@/types/mood';

export default function Home() {
  const { records, deleteRecord } = useMoodRecords();
  const [summary, setSummary] = useState<MoodSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const todayRecords = getTodayRecords(records);

  async function handleGenerateSummary() {
    if (todayRecords.length === 0) {
      setError('先记录一条情绪，再生成今日小结。');
      return;
    }

    setIsLoading(true);
    setError('');
    setSummary(null);

    try {
      const response = await fetch('/api/mood-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ records: todayRecords }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? '生成失败');
      }

      setSummary(data);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : '生成失败');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AppShell>
      <section className="hero">
        <DopaBaraLogo />
        <p className="eyebrow">DopaBara MVP Demo</p>
        <h1>多巴豚情绪记录</h1>
        <p className="subtitle">记录今天的情绪、多巴胺来源和强度，生成一份温柔的今日小结。</p>
        <div className="heroActions">
          <Link className="button" href="/check-in">记录现在</Link>
          <button className="button secondaryButton" onClick={handleGenerateSummary} disabled={isLoading} type="button">
            {isLoading ? '豚豚正在分析...' : '生成今日小结'}
          </button>
        </div>
      </section>

      <TodayStats records={todayRecords} />

      <section className="card">
        <div className="sectionTitle">
          <h2>今日记录</h2>
          <span>{todayRecords.length} 条</span>
        </div>
        <MoodRecordList records={todayRecords} emptyText="还没有记录。先保存一条，让豚豚帮你看见今天的小变化。" onDelete={deleteRecord} />
      </section>

      {error ? <section className="error">{error}</section> : null}
      {summary ? <SummaryCard summary={summary} /> : null}
    </AppShell>
  );
}
