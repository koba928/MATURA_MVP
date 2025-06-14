'use client';

import React, { useState } from 'react';
import { SparklesIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const analyzeProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
      });
      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setAnalysis(data.analysis);
      }
    } catch (error) {
      setError('分析中にエラーが発生しました。');
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4">
          自己分析アプリ
        </h1>
        <p className="text-center text-gray-400 mb-8">
          AIによるあなたの性格分析とアドバイス
        </p>
        <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
          <button
            onClick={analyzeProfile}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg flex items-center justify-center space-x-2 transition-colors disabled:opacity-50"
          >
            <SparklesIcon className="h-6 w-6" />
            <span>{loading ? '分析中...' : 'プロフィールを分析する'}</span>
          </button>
          {error && (
            <div className="mt-4 p-4 bg-red-900/50 rounded-lg text-red-200">
              {error}
            </div>
          )}
          {analysis && (
            <div className="mt-8 p-6 bg-gray-700 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">分析結果</h2>
              <div className="prose prose-invert max-w-none">
                <p className="whitespace-pre-wrap">{analysis}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 