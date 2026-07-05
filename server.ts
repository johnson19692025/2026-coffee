import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini Client
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = new GoogleGenAI({
    apiKey: apiKey || "MOCK_KEY_IF_UNDEFINED",
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API Endpoint for AI Coffee Consultant recommendation
  app.post("/api/coffee-consultant", async (req, res) => {
    try {
      const { prompt, currentBeans } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "請輸入您的風味偏好描述。" });
      }

      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        // Fallback for mock/local development without real API Key
        console.warn("Using mock recommendation due to missing GEMINI_API_KEY");
        const fallbackResponse = {
          recommendations: [
            {
              beanId: currentBeans[0]?.id || "sumatra_mandheling",
              beanName: currentBeans[0]?.name || "蘇門答臘 亞齊 綠寶石曼特寧 G1",
              matchPercentage: 95,
              reason: "根據您的描述，您喜愛濃郁、低酸且帶有深沉藥草與雪松香氣的咖啡。這款印尼經典的濕剝處理曼特寧，擁有極高的醇厚度與焦糖甜感，幾乎無酸，正是為您的口味量身打造。",
              brewGuide: {
                ratio: "1:15 (15g 咖啡粉，注入 225g 水)",
                waterTemp: "88°C - 90°C (較低水溫能減低苦澀，提升焦糖甜感)",
                grindSize: "中等粗細 (類似二號砂糖)",
                pouringStep: "先以 30g 水悶蒸 30 秒。隨後穩定注水至 120g 暫停，待水位下降後，二次注水至 225g 結束沖煮。總時間控制在 2 分鐘至 2 分 15 秒。"
              }
            }
          ],
          overallAdvice: "這款中深焙的曼特寧非常適合手沖，在沖煮時建議使用較低的水溫（約 88°C），這樣能引導出更多的中藥草溫潤感與太妃糖甜度，並降低過度萃取的澀味。期待您享受這杯南洋經典！"
        };
        return res.json(fallbackResponse);
      }

      const systemPrompt = `你是一位專業的精品咖啡烘豆師與咖啡品嚐師，精通印尼各咖啡產區（如蘇門答臘、蘇拉威西、爪哇、巴里島、弗洛勒斯）的氣候、風土、生豆處理法及烘焙曲線。
請根據使用者的偏好描述（例如：喜歡的風味、酸度偏好、苦甜感、飲用習慣、手沖或義式等），從店內現有的印尼精品咖啡豆中，為他推薦最適合的 1 到 2 款咖啡豆，並提供詳細的品飲理由與專業的手沖建議。

店內現有精品豆清單：
${JSON.stringify(currentBeans, null, 2)}

請務必遵守以下規範：
1. 輸出語氣必須優雅、沉穩、充滿職人精神與品味（如同 老楊咖啡 品牌形象），使用繁體中文。
2. 回覆必須完全遵循指定的 JSON 格式。`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `使用者口味與偏好描述：${prompt}`,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              recommendations: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    beanId: { type: Type.STRING, description: "推薦咖啡豆的 ID" },
                    beanName: { type: Type.STRING, description: "推薦咖啡豆的完整名稱" },
                    matchPercentage: { type: Type.INTEGER, description: "契合度百分比 (0-100)" },
                    reason: { type: Type.STRING, description: "為何這款豆子適合使用者的詳細職人推薦語" },
                    brewGuide: {
                      type: Type.OBJECT,
                      properties: {
                        ratio: { type: Type.STRING, description: "建議粉水比，如 1:15" },
                        waterTemp: { type: Type.STRING, description: "建議水溫，如 90°C" },
                        grindSize: { type: Type.STRING, description: "建議研磨度" },
                        pouringStep: { type: Type.STRING, description: "推薦的分段注水沖煮步驟概述" }
                      },
                      required: ["ratio", "waterTemp", "grindSize", "pouringStep"]
                    }
                  },
                  required: ["beanId", "beanName", "matchPercentage", "reason", "brewGuide"]
                }
              },
              overallAdvice: { type: Type.STRING, description: "給使用者的整體品飲或沖煮職人私房建議" }
            },
            required: ["recommendations", "overallAdvice"]
          }
        }
      });

      const responseText = response.text?.trim() || "{}";
      const result = JSON.parse(responseText);
      res.json(result);
    } catch (error: any) {
      console.error("Gemini API Error in backend:", error);
      res.status(500).json({ error: error.message || "處理請求時出錯" });
    }
  });

  // Serve static or Vite in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
