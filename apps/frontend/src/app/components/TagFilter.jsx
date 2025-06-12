import React from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

export default function TagFilter({ tags, selected, onChange }) {
  // value가 빈 문자열이면 'all'로 강제 변환
  const value = !selected ? 'all' : selected;
  const handleChange = (value) => {
    onChange(value);
  };
  
  return (
    <Select value={value} onValueChange={handleChange}>
      <SelectTrigger className="w-[240px] h-14 text-lg border-2 border-white/20 bg-white/10 backdrop-blur-xl text-white shadow-xl hover:shadow-2xl hover:border-purple-400/50 transition-all duration-300">
        <SelectValue placeholder="🏷️ 태그" />
      </SelectTrigger>
      <SelectContent className="border-2 border-white/20 bg-black/80 backdrop-blur-xl shadow-2xl">
        <SelectItem value="all" className="text-lg py-4 text-white hover:bg-white/10">🏷️ 모든 태그</SelectItem>
        {tags.map(tag => (
          <SelectItem key={tag.id} value={String(tag.id)} className="text-lg py-4 text-white hover:bg-white/10">
            🏷️ {tag.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
} 