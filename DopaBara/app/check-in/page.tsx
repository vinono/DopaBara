'use client';

import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/AppShell';
import { MoodForm } from '@/components/MoodForm';
import { useMoodRecords } from '@/hooks/useMoodRecords';
import type { MoodRecord } from '@/types/mood';

export default function CheckInPage() {
  const router = useRouter();
  const { addRecord } = useMoodRecords();

  function handleSave(record: MoodRecord) {
    addRecord(record);
    router.push('/');
  }

  return (
    <AppShell>
      <section className="card pageHeader">
        <p className="eyebrow">Quick Check-in</p>
        <h1>记录现在</h1>
        <p className="subtitle compactSubtitle">用 10 秒记录此刻的情绪、多巴胺来源和之后感觉。</p>
      </section>

      <section className="card">
        <MoodForm onSave={handleSave} />
      </section>
    </AppShell>
  );
}
