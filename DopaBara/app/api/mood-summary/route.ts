import { z } from 'zod';

const moodRecordSchema = z.object({
  mood: z.string().min(1),
  source: z.string().min(1),
  intensity: z.number().min(1).max(5),
  effect: z.string().optional(),
  note: z.string().optional(),
});

const requestSchema = z.object({
  records: z.array(moodRecordSchema).min(1),
});

type MoodRecord = z.infer<typeof moodRecordSchema>;

const healthySources = new Set(['运动', '音乐', '散步', '阅读', '学习', '睡眠', '阳光', '创作', '社交']);

function getMostFrequentValue(records: MoodRecord[], key: 'mood' | 'source') {
  const counts = records.reduce<Record<string, number>>((result, record) => {
    result[record[key]] = (result[record[key]] ?? 0) + 1;
    return result;
  }, {});

  return Object.entries(counts).sort((first, second) => second[1] - first[1])[0]?.[0] ?? '未知';
}

function createSuggestion(mainMood: string, healthyDopamineRatio: number) {
  if (healthyDopamineRatio >= 0.7) {
    return `今天的高质量多巴胺占比不错，可以继续保留让你感到${mainMood}的活动。`;
  }

  if (healthyDopamineRatio >= 0.4) {
    return '今天既有充电来源，也有一些即时刺激。可以尝试把一个短刺激换成 10 分钟散步或音乐放松。';
  }

  return '今天即时刺激偏多，可以先不责备自己，明天只加一个低门槛的健康多巴胺活动，比如晒太阳、散步或早点睡。';
}

function createEffectText(records: MoodRecord[]) {
  const chargedCount = records.filter((record) => record.effect === 'charged').length;
  const drainedCount = records.filter((record) => record.effect === 'drained' || record.effect === 'empty').length;

  if (chargedCount === 0 && drainedCount === 0) {
    return '你今天还没有明显标记充电或消耗感受。';
  }

  return `其中 ${chargedCount} 次让你感觉被充电，${drainedCount} 次让你感觉被消耗或有点空。`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsedBody = requestSchema.safeParse(body);

    if (!parsedBody.success) {
      return Response.json(
        { error: 'Invalid request body', details: parsedBody.error.flatten() },
        { status: 400 }
      );
    }

    const { records } = parsedBody.data;
    const mainMood = getMostFrequentValue(records, 'mood');
    const mainDopamineSource = getMostFrequentValue(records, 'source');
    const healthyCount = records.filter((record) => healthySources.has(record.source)).length;
    const healthyDopamineRatio = Number((healthyCount / records.length).toFixed(2));
    const averageIntensity = records.reduce((total, record) => total + record.intensity, 0) / records.length;
    const effectText = createEffectText(records);

    return Response.json({
      summary: `今天一共记录了 ${records.length} 次情绪，主要感受是${mainMood}，最常出现的多巴胺来源是${mainDopamineSource}，平均强度约为 ${averageIntensity.toFixed(1)} 分。${effectText}`,
      mainMood,
      mainDopamineSource,
      healthyDopamineRatio,
      suggestion: createSuggestion(mainMood, healthyDopamineRatio),
      companionMessage: '豚豚已经帮你记下今天的小变化啦，能看见自己的状态就是很好的开始。',
    });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
