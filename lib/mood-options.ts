import type { MoodOption } from '@/types/mood';

export const moodOptions = ['开心', '平静', '兴奋', '焦虑', '疲惫', '低落'];

export const sourceOptions = ['音乐', '散步', '运动', '短视频', '美食', '学习', '睡眠', '阳光'];

export const intensityOptions = [1, 2, 3, 4, 5];

export const effectOptions: MoodOption[] = [
  { label: '被充电', value: 'charged' },
  { label: '没变化', value: 'neutral' },
  { label: '被消耗', value: 'drained' },
  { label: '有点空', value: 'empty' },
];

export const healthySources = new Set(['运动', '音乐', '散步', '阅读', '学习', '睡眠', '阳光', '创作', '社交']);
