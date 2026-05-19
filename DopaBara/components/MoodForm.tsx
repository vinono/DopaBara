'use client';

import { FormEvent, useState } from 'react';
import { effectOptions, intensityOptions, moodOptions, sourceOptions } from '@/lib/mood-options';
import type { MoodRecord } from '@/types/mood';

type MoodFormProps = {
  onSave: (record: MoodRecord) => void;
};

export function MoodForm({ onSave }: MoodFormProps) {
  const [mood, setMood] = useState(moodOptions[0]);
  const [source, setSource] = useState(sourceOptions[0]);
  const [intensity, setIntensity] = useState(3);
  const [effect, setEffect] = useState(effectOptions[0].value);
  const [note, setNote] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    onSave({
      id: crypto.randomUUID(),
      mood,
      source,
      intensity,
      effect,
      note: note.trim(),
      createdAt: new Date().toISOString(),
    });

    setNote('');
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="field">
        <span>现在的心情？</span>
        <div className="optionGroup">
          {moodOptions.map((option) => (
            <button className={option === mood ? 'chip activeChip' : 'chip'} key={option} onClick={() => setMood(option)} type="button">
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <span>多巴胺来源？</span>
        <div className="optionGroup">
          {sourceOptions.map((option) => (
            <button className={option === source ? 'chip activeChip' : 'chip'} key={option} onClick={() => setSource(option)} type="button">
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <span>强度：{intensity} 分</span>
        <div className="optionGroup">
          {intensityOptions.map((option) => (
            <button className={option === intensity ? 'score activeScore' : 'score'} key={option} onClick={() => setIntensity(option)} type="button">
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <span>之后感觉？</span>
        <div className="optionGroup">
          {effectOptions.map((option) => (
            <button className={option.value === effect ? 'chip activeChip' : 'chip'} key={option.value} onClick={() => setEffect(option.value)} type="button">
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <label className="field">
        <span>备注</span>
        <textarea onChange={(event) => setNote(event.target.value)} placeholder="比如：午休听了喜欢的歌，感觉被充电了。" value={note} />
      </label>

      <button className="button formButton" type="submit">保存记录</button>
    </form>
  );
}
