
import { GoogleGenAI } from "@google/genai";
import { Symptom } from "../types";

export async function generateClinicalReport(
  initialSymptoms: Symptom[], 
  secondarySymptoms: Symptom[], 
  resultTitle: string
) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const initialList = initialSymptoms.map(s => s.label).join(", ");
  const secondaryList = secondarySymptoms.map(s => `${s.category}: ${s.label}`).join(", ");

  const prompt = `
    作为儿科急诊专家，请针对以下患儿评估情况撰写一份简明的临床深度报告。
    
    1. 初步评估结论 (PAT): ${resultTitle}
    2. PAT 异常体征: ${initialList || '无明显异常'}
    3. 二次评估 (ABCDE/SAMPLE) 发现: ${secondaryList || '无明显异常'}
    
    报告应包含：
    1. 核心病理生理分析 (150字以内) - 结合 PAT 和 ABCDE 的发现。
    2. 紧急处理优先级建议 - 根据现有信息给出明确步骤。
    3. 建议的实验室检查/影像学检查 (如血气分析、胸片等)。
    4. 观察要点 (Red Flags) - 哪些指标变化提示病情恶化。
    
    请使用专业且鼓励性的语气，并采用Markdown格式。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.95,
      }
    });
    return response.text;
  } catch (error) {
    console.error("AI Report generation failed", error);
    return "暂时无法生成AI报告，请根据临床经验先行处理。";
  }
}
