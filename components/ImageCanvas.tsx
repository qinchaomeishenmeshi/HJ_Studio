
import React from 'react';
import { GeneratedImage } from '../types';
import { Download, Share2, Expand } from 'lucide-react';

interface ImageCanvasProps {
  image: GeneratedImage | null;
  isGenerating: boolean;
}

const ImageCanvas: React.FC<ImageCanvasProps> = ({ image, isGenerating }) => {
  if (!image && !isGenerating) {
    return (
      <div className="w-full aspect-square md:aspect-video rounded-2xl bg-slate-900/50 border-2 border-dashed border-slate-800 flex flex-col items-center justify-center text-slate-500 p-8 text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center">
          <Expand size={32} className="opacity-20" />
        </div>
        <div>
          <h3 className="text-white text-lg font-medium">准备好开始创作了吗？</h3>
          <p className="text-sm max-w-xs">在左侧输入提示词来生成您的第一件作品。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group">
      <div className={`w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl transition-all duration-700 ${isGenerating ? 'opacity-50 blur-sm scale-95' : 'opacity-100 blur-0 scale-100'}`}>
        {image ? (
          <img
            src={image.url}
            alt={image.prompt}
            className="w-full h-auto object-contain mx-auto max-h-[70vh]"
          />
        ) : (
          <div className="w-full aspect-square bg-slate-900" />
        )}
      </div>

      {isGenerating && (
        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-purple-500/20 border-b-purple-500 rounded-full animate-spin-slow" />
            </div>
          </div>
          <p className="text-indigo-400 font-medium animate-pulse">正在构思您的图片...</p>
        </div>
      )}

      {image && !isGenerating && (
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => {
              const link = document.createElement('a');
              link.href = image.url;
              link.download = `hj-${image.id}.png`;
              link.click();
            }}
            className="p-2 rounded-lg bg-black/50 backdrop-blur text-white hover:bg-black/70 transition-colors"
          >
            <Download size={20} />
          </button>
          <button className="p-2 rounded-lg bg-black/50 backdrop-blur text-white hover:bg-black/70 transition-colors">
            <Share2 size={20} />
          </button>
        </div>
      )}

      {image && !isGenerating && (
        <div className="mt-4 flex flex-col space-y-1">
          <p className="text-sm text-slate-400 italic">"{image.prompt}"</p>
          <p className="text-[10px] text-slate-600 uppercase tracking-widest">{new Date(image.timestamp).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
};

export default ImageCanvas;
