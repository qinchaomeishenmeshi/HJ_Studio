
import React, { useState, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import { GenerationParams, GeneratedImage } from './types';
import Sidebar from './components/Sidebar';
import ImageCanvas from './components/ImageCanvas';
import History from './components/History';
import { Sparkles, Image as ImageIcon, History as HistoryIcon, Layout } from 'lucide-react';

const App: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null);
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (params: GenerationParams) => {
    setIsGenerating(true);
    setError(null);

    try {
      // Create a new instance right before the call as per guidelines
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // We combine prompt and negative prompt instructions for the best result
      const fullPrompt = params.negativePrompt 
        ? `${params.prompt}\n\n[Avoid: ${params.negativePrompt}]`
        : params.prompt;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: fullPrompt }]
        },
        config: {
          imageConfig: {
            aspectRatio: params.aspectRatio,
          }
        }
      });

      let imageData = '';
      // Correctly iterate through parts to find the image part
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            imageData = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            break;
          }
        }
      }

      if (!imageData) {
        throw new Error("模型未生成任何图片。");
      }

      const newImage: GeneratedImage = {
        id: Math.random().toString(36).substr(2, 9),
        url: imageData,
        prompt: params.prompt,
        timestamp: Date.now(),
      };

      setCurrentImage(newImage);
      setHistory(prev => [newImage, ...prev]);
    } catch (err: any) {
      console.error("Generation failed:", err);
      setError(err.message || "生成图片时发生意外错误。");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar for Controls */}
      <aside className="w-full md:w-[400px] flex-shrink-0 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-900 flex flex-col h-screen overflow-y-auto">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
            <Sparkles className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">HJ Studio</h1>
        </div>
        
        <div className="flex-1 p-6">
          <Sidebar onGenerate={handleGenerate} isGenerating={isGenerating} />
        </div>
        
        {error && (
          <div className="mx-6 mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative h-screen overflow-hidden bg-slate-950">
        {/* Top Navbar for desktop */}
        <nav className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-900/50">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-slate-300">
              <ImageIcon size={18} />
              <span className="text-sm font-medium">画布</span>
            </div>
            <div className="w-[1px] h-4 bg-slate-700"></div>
            <div className="flex items-center gap-2 text-slate-500 hover:text-slate-300 cursor-pointer transition-colors">
              <HistoryIcon size={18} />
              <span className="text-sm font-medium">历史记录</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-sm text-slate-400 hover:text-white transition-colors">使用文档</button>
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">HJ</div>
          </div>
        </nav>

        {/* Content */}
        <div className="flex-1 p-4 md:p-12 overflow-y-auto scrollbar-hide">
          <div className="max-w-5xl mx-auto space-y-12">
            <ImageCanvas image={currentImage} isGenerating={isGenerating} />
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white">
                  <Layout size={20} className="text-indigo-400" />
                  <h2 className="text-lg font-semibold">您的作品</h2>
                </div>
                <span className="text-xs text-slate-500">{history.length} 个项目</span>
              </div>
              <History items={history} onSelect={setCurrentImage} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
