
import React, { useState } from 'react';
import { GenerationParams } from '../types';
import { Send, AlertCircle, Info } from 'lucide-react';

interface SidebarProps {
  onGenerate: (params: GenerationParams) => void;
  isGenerating: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ onGenerate, isGenerating }) => {
  const [prompt, setPrompt] = useState('冬日的阳光');
  const [negativePrompt, setNegativePrompt] = useState('worst quality, low quality:1.4), lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, jpeg artifacts, signature, watermark, username, blurry, artist name');
  const [aspectRatio, setAspectRatio] = useState<GenerationParams['aspectRatio']>('1:1');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    onGenerate({ prompt, negativePrompt, aspectRatio });
  };

  const aspectRatios: { label: string; value: GenerationParams['aspectRatio'] }[] = [
    { label: '正方形 (1:1)', value: '1:1' },
    { label: '标准 (4:3)', value: '4:3' },
    { label: '人像 (3:4)', value: '3:4' },
    { label: '宽屏 (16:9)', value: '16:9' },
    { label: '竖屏 (9:16)', value: '9:16' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Positive Prompt Input */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
          <span>正向提示词</span>
          <Info size={14} className="text-slate-500" />
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="输入你想要生成的内容..."
          className="w-full h-28 bg-slate-800/80 border border-slate-700 rounded-xl p-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none shadow-inner"
        />
      </div>

      {/* Negative Prompt Input */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
          <span>反向提示词</span>
          <AlertCircle size={14} className="text-slate-500" />
        </label>
        <textarea
          value={negativePrompt}
          onChange={(e) => setNegativePrompt(e.target.value)}
          placeholder="输入你不想要出现的内容..."
          className="w-full h-28 bg-slate-800/80 border border-slate-700 rounded-xl p-4 text-white text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all resize-none shadow-inner"
        />
      </div>

      {/* Aspect Ratio Picker */}
      <div className="space-y-3 pt-2">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">画面比例</label>
        <div className="grid grid-cols-2 gap-2">
          {aspectRatios.map((ar) => (
            <button
              key={ar.value}
              type="button"
              onClick={() => setAspectRatio(ar.value)}
              className={`p-3 text-xs font-medium rounded-lg border transition-all flex flex-col items-center gap-2 ${
                aspectRatio === ar.value
                  ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400'
                  : 'bg-slate-800/30 border-slate-700 text-slate-400 hover:border-slate-600'
              }`}
            >
              <div className={`border-2 border-current opacity-40 rounded-sm pointer-events-none ${
                ar.value === '1:1' ? 'w-4 h-4' :
                ar.value === '16:9' ? 'w-6 h-3' :
                ar.value === '9:16' ? 'w-3 h-6' :
                ar.value === '4:3' ? 'w-5 h-4' : 'w-4 h-5'
              }`} />
              {ar.label}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={isGenerating || !prompt.trim()}
          className="w-full py-4 rounded-xl text-white font-bold gradient-button flex items-center justify-center gap-3 shadow-lg shadow-indigo-500/20 active:scale-95 transition-transform"
        >
          {isGenerating ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>正在生成中...</span>
            </>
          ) : (
            <>
              <Send size={18} />
              <span>开始生成图片</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default Sidebar;
