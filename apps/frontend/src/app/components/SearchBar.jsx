import React from 'react';
import { Input } from '@/components/ui/input';

export default function SearchBar({ value, onChange }) {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative">
        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none text-2xl">
          🔍
        </div>
        <Input
          type="text"
          placeholder="어떤 문서를 찾고 계신가요?"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="h-20 pl-20 pr-8 text-xl rounded-3xl border-2 border-white/20 bg-white/10 backdrop-blur-xl text-white placeholder:text-white/50 shadow-2xl focus:shadow-cyan-500/25 focus:border-cyan-400/50 transition-all duration-500"
        />
      </div>
    </div>
  );
} 