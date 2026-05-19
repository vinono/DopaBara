export type MoodRecord = {
  id: string;
  mood: string;
  source: string;
  intensity: number;
  effect: string;
  note: string;
  createdAt: string;
};

export type MoodSummary = {
  summary: string;
  mainMood: string;
  mainDopamineSource: string;
  healthyDopamineRatio: number;
  suggestion: string;
  companionMessage: string;
};

export type MoodOption = {
  label: string;
  value: string;
};
