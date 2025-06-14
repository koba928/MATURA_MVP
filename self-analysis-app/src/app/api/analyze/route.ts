import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

export async function POST() {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.0-pro' });

    const prompt = `
    あなたは優れた自己分析の専門家です。
    以下の観点から、ユーザーの性格や行動パターンを分析し、具体的なアドバイスを提供してください：

    1. 興味・関心の傾向
    2. 学習スタイル
    3. 問題解決アプローチ
    4. コミュニケーションスタイル
    5. 潜在的な強みと弱み
    6. 性格タイプ分析

    分析は具体的で実用的なアドバイスを含め、各項目について2-3行程度の説明を提供してください。
    また、全体を通して一貫性のある分析結果となるようにしてください。
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysis = response.text();

    return NextResponse.json({ analysis });
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
} 