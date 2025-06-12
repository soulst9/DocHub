import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';

export default function SearchAutocomplete({ 
  value, 
  onChange, 
  placeholder = "검색어를 입력하세요...", 
  articles = [],
  className = ""
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // 자동완성 데이터 생성
  const generateSuggestions = (searchTerm) => {
    if (!searchTerm || searchTerm.length < 2) {
      return [];
    }

    const searchLower = searchTerm.toLowerCase();
    const suggestions = new Set();

    // 제목에서 매칭되는 것들 추가
    articles.forEach(article => {
      if (article.title.toLowerCase().includes(searchLower)) {
        suggestions.add({
          type: 'title',
          text: article.title,
          icon: '📄'
        });
      }
    });

    // 태그에서 매칭되는 것들 추가
    const allTags = [...new Set(articles.flatMap(article => article.tags || []))];
    allTags.forEach(tag => {
      if (tag.toLowerCase().includes(searchLower)) {
        suggestions.add({
          type: 'tag',
          text: tag,
          icon: '🏷️'
        });
      }
    });

    // 카테고리에서 매칭되는 것들 추가
    const allCategories = [...new Set(articles.map(article => article.Category?.name).filter(Boolean))];
    allCategories.forEach(category => {
      if (category.toLowerCase().includes(searchLower)) {
        suggestions.add({
          type: 'category',
          text: category,
          icon: '📁'
        });
      }
    });

    return Array.from(suggestions).slice(0, 8); // 최대 8개까지만
  };

  useEffect(() => {
    const newSuggestions = generateSuggestions(value);
    setSuggestions(newSuggestions);
    setSelectedIndex(-1);
    setIsOpen(newSuggestions.length > 0 && value.length >= 2);
  }, [value, articles]);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (!isOpen || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSuggestionClick = (suggestion) => {
    onChange(suggestion.text);
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const highlightMatch = (text, searchTerm) => {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-blue-200 text-blue-900 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (suggestions.length > 0 && value.length >= 2) {
            setIsOpen(true);
          }
        }}
        className={className}
        autoComplete="off"
      />
      
      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-64 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={`${suggestion.type}-${suggestion.text}`}
              className={`px-4 py-3 cursor-pointer flex items-center gap-3 hover:bg-gray-50 ${
                index === selectedIndex ? 'bg-blue-50 border-l-4 border-blue-500' : ''
              }`}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <span className="text-lg">{suggestion.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900">
                  {highlightMatch(suggestion.text, value)}
                </div>
                <div className="text-xs text-gray-500 capitalize">
                  {suggestion.type === 'title' && '문서 제목'}
                  {suggestion.type === 'tag' && '태그'}
                  {suggestion.type === 'category' && '카테고리'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 