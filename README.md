<div align="center">
  <h1>🦦 多巴豚 DopaBara</h1>
  <p><strong>一个基于情绪记录与多巴胺健康管理的结构化分析工具</strong></p>
  
  [![Next.js](https://img.shields.io/badge/Next.js-black?logo=next.js&logoColor=white)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Zod](https://img.shields.io/badge/Zod-3E67B1?logo=zod&logoColor=white)](https://zod.dev/)
</div>

<br />

## 📖 项目简介

这是一个最小化的 Next.js 示例应用（MVP Demo），旨在通过本地规则，将用户日常的情绪记录转化为结构化的 **今日多巴胺情绪总结**。无论是开心、疲惫还是焦虑，多巴豚都能帮你分析情绪的主要来源，并评估你的“健康多巴胺”占比。

## ✨ 核心功能

- **📊 情绪智能总结接口** (`app/api/mood-summary/route.ts`)：接收情绪日志，基于本地规则生成分析数据。
- **🧪 交互式测试页面** (`app/page.tsx`)：开箱即用的前端交互，即时查看情绪分析结果。
- **🛡️ 严格的数据校验** (`zod`集成)：保障数据输入结构的安全与一致性。
- **🧠 本地算法分析**：自动统计主要情绪、追踪情绪主要来源，并计算健康多巴胺占比。

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

### 3. 打开应用

在浏览器中访问：[http://localhost:3000](http://localhost:3000)

## 📡 API 请求示例

你可以通过 `POST` 请求直接调用后端的情绪分析接口，测试传入情绪记录进行分析：

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

> **💡 提示**：接口将返回结构化的 JSON 数据，包含今日的主要情绪类型、最核心的多巴胺来源，以及综合的健康多巴胺指数分析。
