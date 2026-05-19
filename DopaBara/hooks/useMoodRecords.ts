'use client';

import { useEffect, useState } from 'react';
import { storageKey } from '@/lib/mood-records';
import type { MoodRecord } from '@/types/mood';

export function useMoodRecords() {
  const [records, setRecords] = useState<MoodRecord[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const savedRecords = window.localStorage.getItem(storageKey);

    if (savedRecords) {
      try {
        setRecords(JSON.parse(savedRecords));
      } catch {
        window.localStorage.removeItem(storageKey);
      }
    }

    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    window.localStorage.setItem(storageKey, JSON.stringify(records));
  }, [isReady, records]);

  function addRecord(record: MoodRecord) {
    setRecords((currentRecords) => [record, ...currentRecords]);
  }

  function deleteRecord(id: string) {
    setRecords((currentRecords) => currentRecords.filter((record) => record.id !== id));
  }

  return {
    records,
    addRecord,
    deleteRecord,
    isReady,
  };
}
