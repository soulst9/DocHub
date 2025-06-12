import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const dummyCategories = [
  { id: 1, name: '개발', color: 'bg-blue-50 text-blue-700' },
  { id: 2, name: '디자인', color: 'bg-purple-50 text-purple-700' },
  { id: 3, name: '마케팅', color: 'bg-green-50 text-green-700' },
  { id: 4, name: '기타', color: 'bg-gray-50 text-gray-700' },
];

const dummyTags = [
  { id: 1, name: 'React', color: 'bg-cyan-100 text-cyan-800' },
  { id: 2, name: 'Next.js', color: 'bg-gray-100 text-gray-800' },
  { id: 3, name: 'TypeScript', color: 'bg-blue-100 text-blue-800' },
  { id: 4, name: 'UI/UX', color: 'bg-orange-100 text-orange-800' },
  { id: 5, name: 'API', color: 'bg-green-100 text-green-800' },
  { id: 6, name: '데이터베이스', color: 'bg-purple-100 text-purple-800' },
];

const dummyArticles = [
  {
    id: 1,
    title: 'React 컴포넌트 최적화 가이드',
    author: '개발팀',
    date: '2024. 1. 15.',
    category: '개발',
    tags: ['React', 'TypeScript'],
    isStarred: true,
    preview: 'React 컴포넌트 최적화를 위한 핵심 기법들을 정리했습니다. React.memo, useMemo, useCallback 등의 활용법과 성능 측정 방법을 다룹니다.'
  },
  {
    id: 2,
    title: 'Next.js App Router 마이그레이션 가이드',
    author: '개발팀',
    date: '2024. 1. 12.',
    category: '개발',
    tags: ['Next.js', 'TypeScript'],
    isStarred: false,
    preview: 'Pages Router에서 App Router로 마이그레이션하는 단계별 가이드입니다. 파일 구조 변경부터 데이터 페칭 패턴까지 상세히 설명합니다.'
  },
  {
    id: 3,
    title: 'UI/UX 디자인 원칙',
    author: '디자인팀',
    date: '2024. 1. 8.',
    category: '디자인',
    tags: ['UI/UX'],
    isStarred: true,
    preview: '사용자 중심의 디자인 원칙과 일관성 있는 인터페이스 구축 방법을 다룹니다. 컬러 시스템, 타이포그래피, 레이아웃 가이드라인을 포함합니다.'
  }
];

export default function MainPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedTags, setSelectedTags] = useState([]);

  const stats = [
    { title: '전체 문서', value: '3', icon: '📄' },
    { title: '즐겨찾기', value: '2', icon: '⭐' },
    { title: '최근 문서', value: '0', icon: '🕒' },
    { title: '카테고리', value: '4', icon: '📊' },
  ];

  const sidebarItems = [
    { icon: '🏠', label: '홈', active: true },
    { icon: '📄', label: '모든 문서' },
    { icon: '➕', label: '새 문서' },
    { icon: '⭐', label: '즐겨찾기' },
    { icon: '🕒', label: '최근 문서' },
    { icon: '📊', label: '통계' },
  ];

  const filteredArticles = dummyArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(search.toLowerCase()) || 
                         article.preview.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === '전체' || article.category === selectedCategory;
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.some(tag => article.tags.includes(tag));
    return matchesSearch && matchesCategory && matchesTags;
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* 좌측 사이드바 - 고정폭 */}
      <div className="w-64 min-w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
        {/* 로고 */}
        <div className="p-6 border-b border-gray-100 bg-white">
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            📚 지식 위키
          </h1>
        </div>

        {/* 사이드바 검색 */}
        <div className="p-4 bg-white">
          <div className="relative">
            <Input
              type="text"
              placeholder="문서 검색..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-9 text-sm"
            />
            <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </div>
          </div>
        </div>

        {/* 네비게이션 메뉴 */}
        <nav className="flex-1 px-4 bg-white">
          <ul className="space-y-1">
            {sidebarItems.map((item, index) => (
              <li key={index}>
                <button className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm transition-colors ${
                  item.active 
                    ? 'bg-blue-50 text-blue-700 font-medium' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}>
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* 카테고리 */}
        <div className="p-4 border-t border-gray-100 bg-white">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            📁 카테고리
          </h3>
          <ul className="space-y-1">
            <li>
              <button 
                onClick={() => setSelectedCategory('전체')}
                className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${
                  selectedCategory === '전체' 
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}>
                전체
              </button>
            </li>
            {dummyCategories.map((category) => (
              <li key={category.id}>
                <button 
                  onClick={() => setSelectedCategory(category.name)}
                  className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${
                    selectedCategory === category.name 
                      ? category.color
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}>
                  {category.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* 태그 */}
        <div className="p-4 border-t border-gray-100 bg-white">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            🏷️ 태그
          </h3>
          <div className="flex flex-wrap gap-1">
            {dummyTags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => {
                  if (selectedTags.includes(tag.name)) {
                    setSelectedTags(selectedTags.filter(t => t !== tag.name));
                  } else {
                    setSelectedTags([...selectedTags, tag.name]);
                  }
                }}
                className={`px-2 py-1 rounded text-xs transition-colors ${
                  selectedTags.includes(tag.name) 
                    ? tag.color + ' ring-1 ring-blue-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                {tag.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 우측 메인 콘텐츠 - 나머지 공간 차지 */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 상단 헤더 */}
        <header className="bg-white border-b border-gray-200 px-8 py-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">지식 공유 위키</h1>
              <p className="text-gray-600 mt-1">사내 노하우와 지식을 체계적으로 관리하세요</p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2">
              ➕ 새 문서 작성
            </Button>
          </div>
        </header>

        {/* 메인 콘텐츠 영역 */}
        <main className="flex-1 overflow-auto p-8 bg-gray-50">
          {/* 통계 대시보드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    </div>
                    <div className="text-3xl opacity-80">{stat.icon}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 검색 및 필터 카드 */}
          <Card className="mb-8">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">문서 검색 및 필터</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 메인 검색 */}
              <div className="relative">
                <Input
                  type="text"
                  placeholder="문서 제목이나 내용으로 검색..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 h-12 text-base"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  🔍
                </div>
              </div>

              {/* 카테고리 필터 */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">카테고리</p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedCategory === '전체' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory('전체')}
                    className="h-8"
                  >
                    전체
                  </Button>
                  {dummyCategories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.name ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(category.name)}
                      className="h-8"
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* 태그 필터 */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">태그</p>
                <div className="flex flex-wrap gap-2">
                  {dummyTags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant={selectedTags.includes(tag.name) ? 'default' : 'outline'}
                      className={`cursor-pointer transition-all hover:scale-105 ${
                        selectedTags.includes(tag.name) ? tag.color : 'hover:bg-gray-100'
                      }`}
                      onClick={() => {
                        if (selectedTags.includes(tag.name)) {
                          setSelectedTags(selectedTags.filter(t => t !== tag.name));
                        } else {
                          setSelectedTags([...selectedTags, tag.name]);
                        }
                      }}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 문서 리스트 */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              최근 문서 ({filteredArticles.length}개)
            </h2>
            <div className="space-y-4">
              {filteredArticles.map((article) => (
                <Card key={article.id} className="hover:shadow-lg transition-all cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                            {article.title}
                          </h3>
                          {article.isStarred && (
                            <span className="text-yellow-500 text-lg">⭐</span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                          <span className="flex items-center gap-1">
                            👤 {article.author}
                          </span>
                          <span className="flex items-center gap-1">
                            📅 {article.date}
                          </span>
                          <span className="flex items-center gap-1">
                            👁️ 조회
                          </span>
                          <span className="flex items-center gap-1">
                            ✏️ 편집
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {article.preview}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {article.tags.map((tagName) => {
                        const tag = dummyTags.find(t => t.name === tagName);
                        return (
                          <Badge key={tagName} className={tag?.color || 'bg-gray-100 text-gray-800'}>
                            {tagName}
                          </Badge>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}