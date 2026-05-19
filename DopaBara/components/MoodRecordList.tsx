'use client';

import { effectOptions } from '@/lib/mood-options';
import type { MoodRecord } from '@/types/mood';

type MoodRecordListProps = {
  records: MoodRecord[];
  emptyText: string;
  onDelete?: (id: string) => void;
};

export function MoodRecordList({ records, emptyText, onDelete }: MoodRecordListProps) {
  if (records.length === 0) {
    return <p className="empty">{emptyText}</p>;
  }

  return (
    <div className="records">
      {records.map((record) => (
        <div className="record" key={record.id}>
          <div className="recordHeader">
            <strong>{record.mood}</strong>
            {onDelete ? <button onClick={() => onDelete(record.id)} type="button">删除</button> : null}
          </div>
          <span>
            {record.source} · {record.intensity} 分 · {effectOptions.find((option) => option.value === record.effect)?.label ?? '未记录感受'} ·{' '}
            {new Date(record.createdAt).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
          </span>
          {record.note ? <p>{record.note}</p> : null}
        </div>
      ))}
    </div>
  );
}
