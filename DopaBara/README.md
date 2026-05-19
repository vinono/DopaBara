# 多巴豚 DopaBara MVP Demo

这是一个最小 Next.js 示例，用本地规则根据情绪记录生成结构化的今日多巴胺情绪总结。

## 功能

- `app/api/mood-summary/route.ts`：情绪总结接口
- `app/page.tsx`：测试页面
- `zod`：校验请求结构
- 本地规则：统计主要情绪、主要来源、健康多巴胺占比

## 运行

```bash
npm install
npm run dev
```

打开：

```bash
http://localhost:3000
```

## API 请求示例

```bash
curl -X POST http://localhost:3000/api/mood-summary \
  -H "Content-Type: application/json" \
  -d '{
    "records": [
      {
        "mood": "开心",
        "source": "音乐",
        "intensity": 4,
        "note": "听了喜欢的歌"
      }
    ]
  }'
```

