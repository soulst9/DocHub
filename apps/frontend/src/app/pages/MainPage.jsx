import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ApiClient from '../../utils/api';

export default function MainPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedTags, setSelectedTags] = useState([]);
  
  // API 데이터 상태
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 더미 태그 (나중에 API로 변경 가능)
  const dummyTags = [
    { id: 1, name: 'React', color: 'bg-cyan-100 text-cyan-800' },
    { id: 2, name: 'Next.js', color: 'bg-gray-100 text-gray-800' },
    { id: 3, name: 'TypeScript', color: 'bg-blue-100 text-blue-800' },
    { id: 4, name: 'UI/UX', color: 'bg-orange-100 text-orange-800' },
    { id: 5, name: 'API', color: 'bg-green-100 text-green-800' },
    { id: 6, name: '데이터베이스', color: 'bg-purple-100 text-purple-800' },
  ];

  // API 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // 병렬로 데이터 로드
        const [articlesResponse, categoriesResponse] = await Promise.all([
          ApiClient.getArticles(),
          ApiClient.getCategories()
        ]);
        
        setArticles(articlesResponse || []);
        setCategories(categoriesResponse || []);
        setError(null);
      } catch (err) {
        console.error('데이터 로드 실패:', err);
        setError('데이터를 불러오는데 실패했습니다.');
        // 에러 시 더미 데이터 사용
        setArticles([
          {
            id: 1,
            title: 'React 컴포넌트 최적화 가이드',
            author: '개발팀',
            createdAt: '2024-01-15T00:00:00Z',
            category: { name: '개발' },
            tags: ['React', 'TypeScript'],
            isStarred: true,
            content: 'React 컴포넌트 최적화를 위한 핵심 기법들을 정리했습니다.'
          }
        ]);
        setCategories([
          { id: 1, name: '개발' },
          { id: 2, name: '디자인' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // 통계 계산
  const stats = [
    { title: '전체 문서', value: articles.length.toString(), icon: '📄' },
    { title: '즐겨찾기', value: articles.filter(a => a.isStarred).length.toString(), icon: '⭐' },
    { title: '최근 문서', value: '0', icon: '🕒' },
    { title: '카테고리', value: categories.length.toString(), icon: '📊' },
  ];

  const sidebarItems = [
    { icon: '🏠', label: '홈', active: true },
    { icon: '📄', label: '모든 문서' },
    { icon: '➕', label: '새 문서' },
    { icon: '⭐', label: '즐겨찾기' },
    { icon: '🕒', label: '최근 문서' },
    { icon: '📊', label: '통계' },
  ];

  // 필터링된 문서
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(search.toLowerCase()) || 
                         (article.content && article.content.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = selectedCategory === '전체' || 
                           (article.category && article.category.name === selectedCategory);
    const matchesTags = selectedTags.length === 0 || 
                       (article.tags && selectedTags.some(tag => article.tags.includes(tag)));
    return matchesSearch && matchesCategory && matchesTags;
  });

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

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
            {categories.map((category) => (
              <li key={category.id}>
                <button 
                  onClick={() => setSelectedCategory(category.name)}
                  className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${
                    selectedCategory === category.name 
                      ? 'bg-blue-50 text-blue-700'
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
            {error && (
              <div className="text-sm text-yellow-700 bg-yellow-100 px-3 py-2 rounded-md">
                ⚠️ API 연결 실패 (더미 데이터 표시 중)
              </div>
            )}
          </div>
        </header>

        {/* 메인 콘텐츠 */}
        <main className="flex-1 p-8">
          {/* 통계 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="flex items-center p-6">
                  <div className="text-2xl mr-4">{stat.icon}</div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 검색 및 필터 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">문서 검색</h2>
              <Button className="bg-blue-600 hover:bg-blue-700">
                ➕ 새 문서
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="제목 또는 내용으로 검색..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  🔍
                </div>
              </div>
              
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="전체">모든 카테고리</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">태그:</span>
                <div className="flex flex-wrap gap-1">
                  {selectedTags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                      <button 
                        onClick={() => setSelectedTags(selectedTags.filter(t => t !== tag))}
                        className="ml-1 hover:text-red-600"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 문서 목록 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.length > 0 ? (
              filteredArticles.map((article) => (
                <Card key={article.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {article.title}
                      </CardTitle>
                      {article.isStarred && (
                        <span className="text-yellow-500 text-lg">⭐</span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {article.content || article.preview || '내용이 없습니다.'}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <span>{article.author || '알 수 없음'}</span>
                      <span>{new Date(article.createdAt || article.date).toLocaleDateString('ko-KR')}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {article.category && (
                        <Badge variant="outline" className="text-xs">
                          {article.category.name || article.category}
                        </Badge>
                      )}
                    </div>
                    
                    {article.tags && article.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {article.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {article.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{article.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-6xl mb-4">📭</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">검색 결과가 없습니다</h3>
                <p className="text-gray-600">다른 키워드로 검색해보세요.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}