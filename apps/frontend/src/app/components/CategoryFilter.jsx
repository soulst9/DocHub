import React from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

export default function CategoryFilter({ categories, selected, onChange }) {
  // value가 빈 문자열이면 'all'로 강제 변환
  const value = !selected ? 'all' : selected;
  const handleChange = (value) => {
    onChange(value);
  };
  
  return (
    <Select value={value} onValueChange={handleChange}>
      <SelectTrigger className="w-[240px] h-14 text-lg border-2 border-white/20 bg-white/10 backdrop-blur-xl text-white shadow-xl hover:shadow-2xl hover:border-cyan-400/50 transition-all duration-300">
        <SelectValue placeholder="📁 카테고리" />
      </SelectTrigger>
      <SelectContent className="border-2 border-white/20 bg-black/80 backdrop-blur-xl shadow-2xl">
        <SelectItem value="all" className="text-lg py-4 text-white hover:bg-white/10">📁 모든 카테고리</SelectItem>
        {categories.map(cat => (
          <SelectItem key={cat.id} value={String(cat.id)} className="text-lg py-4 text-white hover:bg-white/10">
            📁 {cat.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
} 