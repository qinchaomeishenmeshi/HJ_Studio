
import React, { useState, useCallback, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";
import { Sparkles, Image as ImageIcon, History as HistoryIcon, Layout, Send, Download, Share2, Expand, Info, AlertCircle } from 'lucide-react';

// --- Types ---
interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
}

interface GenerationParams {
  prompt: string;
  negativePrompt: string;
  aspectRatio: '1:1' | '3:4' | '4:3' | '9:16' | '16:9';
}

// --- Components ---

const Sidebar = ({ onGenerate, isGenerating }: { onGenerate: (p: GenerationParams) => void, isGenerating: boolean }) => {
  const [prompt, setPrompt] = useState('冬日的阳光');
  const [negativePrompt, setNegativePrompt] = useState('worst quality, low quality:1.4), lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, jpeg artifacts, signature, watermark, username, blurry, artist name');
  const [aspectRatio, setAspectRatio] = useState<GenerationParams['aspectRatio']>('1:1');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    onGenerate({ prompt, negativePrompt, aspectRatio });
  };

  const ratios: { label: string, value: GenerationParams['aspectRatio'] }[] = [
    { label: '正方形 (1:1)', value: '1:1' },
    { label: '标准 (4:3)', value: '4:3' },
    { label: '人像 (3:4)', value: '3:4' },
    { label: '宽屏 (16:9)', value: '16:9' },
    { label: '竖屏 (9:16)', value: '9:16' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
          <Info size={14} /> <span>正向提示词</span>
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="描述您想要看到的画面..."
          className="w-full h-28 bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
          <AlertCircle size={14} /> <span>反向提示词</span>
        </label>
        <textarea
          value={negativePrompt}
          onChange={(e) => setNegativePrompt(e.target.value)}
          placeholder="不希望出现的元素..."
          className="w-full h-28 bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-white text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all resize-none"
        />
      </div>

      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">画面比例</label>
        <div className="grid grid-cols-2 gap-2">
          {ratios.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => setAspectRatio(r.value)}
              className={`p-3 text-xs rounded-lg border flex flex-col items-center gap-2 transition-all ${
                aspectRatio === r.value ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400' : 'bg-slate-900/30 border-slate-800 text-slate-500 hover:border-slate-700'
              }`}
            >
              <div className={`border-2 border-current opacity-30 rounded-sm ${r.value === '1:1' ? 'w-4 h-4' : r.value === '16:9' ? 'w-6 h-3' : r.value === '9:16' ? 'w-3 h-6' : 'w-5 h-4'}`} />
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isGenerating || !prompt.trim()}
        className="w-full py-4 rounded-xl text-white font-bold btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
      >
        {isGenerating ? <><div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> 正在生成</> : <><Send size={18} /> 开始生成</>}
      </button>
    </form>
  );
};

const ImageCanvas = ({ image, isGenerating }: { image: GeneratedImage | null, isGenerating: boolean }) => {
  if (!image && !isGenerating) {
    return (
      <div className="w-full h-[500px] rounded-2xl border-2 border-dashed border-slate-800 flex flex-col items-center justify-center text-slate-600 glass">
        <Expand size={48} className="mb-4 opacity-20" />
        <p>准备好开始创作了吗？</p>
        <p className="text-sm mt-1">在左侧输入提示词来生成您的第一件作品</p>
      </div>
    );
  }

  return (
    <div className="relative group glass rounded-2xl overflow-hidden shadow-2xl">
      <div className={`transition-all duration-700 min-h-[400px] flex items-center justify-center ${isGenerating ? 'blur-md opacity-50 scale-95' : 'blur-0 opacity-100 scale-100'}`}>
        {image && <img src={image.url} alt={image.prompt} className="max-w-full max-h-[70vh] object-contain" />}
      </div>

      {isGenerating && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-indigo-400 font-medium animate-pulse">正在构思您的图片...</p>
        </div>
      )}

      {image && !isGenerating && (
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => { const l = document.createElement('a'); l.href = image.url; l.download = `hj-${image.id}.png`; l.click(); }} className="p-2 rounded-lg bg-black/50 text-white hover:bg-black/70 transition-colors"><Download size={20} /></button>
          <button className="p-2 rounded-lg bg-black/50 text-white hover:bg-black/70 transition-colors"><Share2 size={20} /></button>
        </div>
      )}
    </div>
  );
};

const History = ({ items, onSelect }: { items: GeneratedImage[], onSelect: (img: GeneratedImage) => void }) => {
  if (items.length === 0) return null;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {items.map(item => (
        <button key={item.id} onClick={() => onSelect(item)} className="group relative aspect-square rounded-xl overflow-hidden border border-slate-800 hover:border-indigo-500 transition-all">
          <img src={item.url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2 text-left">
            <p className="text-[10px] text-white line-clamp-2">{item.prompt}</p>
          </div>
        </button>
      ))}
    </div>
  );
};

// --- Main App ---

const App = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null);
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (params: GenerationParams) => {
    setIsGenerating(true);
    setError(null);
    try {
      // Use process.env.API_KEY directly as per SDK requirements
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const fullPrompt = params.negativePrompt ? `${params.prompt}\n[排除元素: ${params.negativePrompt}]` : params.prompt;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: fullPrompt }] },
        config: { imageConfig: { aspectRatio: params.aspectRatio } }
      });

      let imageData = '';
      // Find the image part in the response
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            imageData = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            break;
          }
        }
      }

      if (!imageData) throw new Error("未能生成有效图片数据");

      const newImg: GeneratedImage = {
        id: Date.now().toString(36),
        url: imageData,
        prompt: params.prompt,
        timestamp: Date.now()
      };
      setCurrentImage(newImg);
      setHistory(h => [newImg, ...h]);
    } catch (err: any) {
      setError(err.message || "生成失败，请重试");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden flex-col md:flex-row bg-[#020617]">
      {/* Sidebar */}
      <aside className="w-full md:w-[380px] h-full flex-shrink-0 border-r border-slate-800 bg-slate-900/50 flex flex-col">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20"><Sparkles className="text-white w-6 h-6" /></div>
          <h1 className="text-xl font-bold tracking-tight text-white">HJ Studio</h1>
        </div>
        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          <Sidebar onGenerate={handleGenerate} isGenerating={isGenerating} />
          {error && <div className="mt-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">{error}</div>}
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-900/20">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-indigo-400"><ImageIcon size={18} /><span className="text-sm font-medium">创作画布</span></div>
          </div>
          <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400 border border-slate-700">HJ</div></div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-12">
          <div className="max-w-5xl mx-auto space-y-16">
            <ImageCanvas image={currentImage} isGenerating={isGenerating} />
            
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2 text-slate-300 font-semibold"><Layout size={20} /><span>历史作品</span></div>
                <span className="text-xs text-slate-500">{history.length} 个作品</span>
              </div>
              <History items={history} onSelect={setCurrentImage} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const rootEl = document.getElementById('root');
if (rootEl) {
  ReactDOM.createRoot(rootEl).render(<App />);
}
