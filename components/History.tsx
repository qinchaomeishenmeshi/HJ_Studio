
import React from 'react';
import { GeneratedImage } from '../types';

interface HistoryProps {
  items: GeneratedImage[];
  onSelect: (image: GeneratedImage) => void;
}

const History: React.FC<HistoryProps> = ({ items, onSelect }) => {
  if (items.length === 0) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 opacity-30">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="aspect-square bg-slate-800 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item)}
          className="group relative aspect-square bg-slate-900 rounded-xl overflow-hidden border border-slate-800 hover:border-indigo-500/50 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        >
          <img
            src={item.url}
            alt={item.prompt}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex items-end">
            <p className="text-[10px] text-white line-clamp-2 font-medium">{item.prompt}</p>
          </div>
        </button>
      ))}
    </div>
  );
};

export default History;
