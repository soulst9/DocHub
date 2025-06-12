import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ArticleList from '../components/ArticleList';
import CategoryManager from '../components/CategoryManager';
import ArticleEditor from '../components/ArticleEditor';
import ArticleViewer from '../components/ArticleViewer';
import Pagination from '../components/Pagination';
import ApiClient from '../utils/api';

export default function MainPage() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, title, category
  const [searchType, setSearchType] = useState('all'); // all, title, content, tags
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  
  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  
  // 모달 상태
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [showArticleEditor, setShowArticleEditor] = useState(false);
  const [showArticleViewer, setShowArticleViewer] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [viewingArticle, setViewingArticle] = useState(null);

  // 더미 데이터 (API 실패 시 폴백)
  const dummyArticles = [
    {
      id: 1,
      title: "React 시작하기",
      content: "React는 사용자 인터페이스를 구축하기 위한 JavaScript 라이브러리입니다...",
      category: { id: 1, name: "개발" },
      tags: ["React", "JavaScript", "Frontend"],
      author: { name: "개발자" },
      createdAt: "2024-01-15T10:30:00Z"
    },
    {
      id: 2,
      title: "Node.js 백엔드 개발",
      content: "Node.js를 사용한 서버 개발에 대해 알아보겠습니다...",
      category: { id: 1, name: "개발" },
      tags: ["Node.js", "Backend", "JavaScript"],
      author: { name: "백엔드 개발자" },
      createdAt: "2024-01-14T14:20:00Z"
    }
  ];

  const dummyCategories = [
    { id: 1, name: "개발", description: "프로그래밍 관련 문서" },
    { id: 2, name: "디자인", description: "UI/UX 디자인 관련" }
  ];

  // 데이터 로드
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [articlesData, categoriesData] = await Promise.all([
        ApiClient.getArticles(),
        ApiClient.getCategories()
      ]);

      setArticles(articlesData || dummyArticles);
      setCategories(categoriesData || dummyCategories);
    } catch (err) {
      console.error('데이터 로드 실패:', err);
      setError('API 연결 실패 - 더미 데이터를 표시합니다.');
      setArticles(dummyArticles);
      setCategories(dummyCategories);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 모든 태그 추출
  const allTags = [...new Set(articles.flatMap(article => article.tags || []))];

  // 고급 검색 및 필터링
  const filteredAndSortedArticles = (() => {
    let filtered = articles.filter(article => {
      // 즐겨찾기 필터링
      if (showFavoritesOnly && !article.isFavorite) {
        return false;
      }

      // 검색어 필터링
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const titleMatch = article.title.toLowerCase().includes(searchLower);
        const contentMatch = article.content.toLowerCase().includes(searchLower);
        const tagMatch = article.tags?.some(tag => tag.toLowerCase().includes(searchLower));
        
        switch (searchType) {
          case 'title':
            if (!titleMatch) return false;
            break;
          case 'content':
            if (!contentMatch) return false;
            break;
          case 'tags':
            if (!tagMatch) return false;
            break;
          default: // 'all'
            if (!titleMatch && !contentMatch && !tagMatch) return false;
        }
      }

      // 카테고리 필터링
      if (selectedCategory) {
        const categoryMatch = article.Category && article.Category.id.toString() === selectedCategory;
        if (!categoryMatch) return false;
      }

      // 태그 필터링
      if (selectedTags.length > 0) {
        const hasSelectedTags = selectedTags.every(selectedTag => 
          article.tags?.includes(selectedTag)
        );
        if (!hasSelectedTags) return false;
      }

      return true;
    });

    // 정렬 (즐겨찾기 우선 정렬 추가)
    filtered.sort((a, b) => {
      // 즐겨찾기 우선 정렬
      if (a.isFavorite !== b.isFavorite) {
        return b.isFavorite - a.isFavorite;
      }
      
      switch (sortBy) {
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'category':
          const aCat = a.Category?.name || '';
          const bCat = b.Category?.name || '';
          return aCat.localeCompare(bCat);
        default: // 'newest'
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    return filtered;
  })();

  // 태그 토글 핸들러
  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // 검색 초기화
  const clearSearch = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedTags([]);
    setSearchType('all');
    setShowFavoritesOnly(false);
    setCurrentPage(1); // 검색 초기화 시 첫 페이지로
  };

  // 페이지네이션 계산
  const totalFilteredItems = filteredAndSortedArticles.length;
  const totalPages = Math.ceil(totalFilteredItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageArticles = filteredAndSortedArticles.slice(startIndex, endIndex);

  // 페이지 변경 핸들러
  const handlePageChange = (page, newItemsPerPage = itemsPerPage) => {
    if (newItemsPerPage !== itemsPerPage) {
      setItemsPerPage(newItemsPerPage);
      setCurrentPage(1); // 페이지 크기 변경 시 첫 페이지로
    } else {
      setCurrentPage(page);
    }
    // 페이지 변경 시 스크롤을 상단으로
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 검색/필터 변경 시 첫 페이지로 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedTags, sortBy, searchType]);

  // 문서 관련 핸들러
  const handleNewArticle = () => {
    setEditingArticle(null);
    setShowArticleEditor(true);
  };

  const handleEditArticle = (article) => {
    setEditingArticle(article);
    setShowArticleEditor(true);
    setShowArticleViewer(false);
  };

  const handleViewArticle = (article) => {
    setViewingArticle(article);
    setShowArticleViewer(true);
  };

  const handleArticleUpdate = () => {
    loadData(); // 데이터 새로고침
  };

  const handleToggleFavorite = async (article) => {
    try {
      await ApiClient.toggleFavorite(article.id);
      // 로컬 상태 업데이트
      setArticles(prev => prev.map(a => 
        a.id === article.id 
          ? { ...a, isFavorite: !a.isFavorite }
          : a
      ));
    } catch (err) {
      console.error('즐겨찾기 토글 실패:', err);
      alert('즐겨찾기 설정에 실패했습니다.');
    }
  };

  const handleCategoryUpdate = () => {
    loadData(); // 데이터 새로고침
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">📚 DocHub</h1>
              <p className="ml-4 text-gray-600">지식 공유 플랫폼</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleNewArticle}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2 transition-colors"
              >
                ✏️ 새 문서 작성
              </button>
              <button
                onClick={() => setShowCategoryManager(true)}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 h-10 px-4 py-2 transition-colors"
              >
                ⚙️ 카테고리 관리
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-yellow-100 border border-yellow-300 rounded-md text-yellow-800">
            {error}
          </div>
        )}

        {/* 검색 및 필터 */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  🔍 고급 검색 및 필터
                </CardTitle>
                {(searchTerm || selectedCategory || selectedTags.length > 0) && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={clearSearch}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    초기화
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 첫 번째 행: 검색어와 검색 타입 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    검색어
                  </label>
                  <Input
                    type="text"
                    placeholder="검색어를 입력하세요..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    검색 범위
                  </label>
                  <select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">전체</option>
                    <option value="title">제목만</option>
                    <option value="content">내용만</option>
                    <option value="tags">태그만</option>
                  </select>
                </div>
              </div>

              {/* 두 번째 행: 카테고리와 정렬 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    카테고리
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">모든 카테고리</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    정렬
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="newest">최신순</option>
                    <option value="oldest">오래된순</option>
                    <option value="title">제목순</option>
                    <option value="category">카테고리순</option>
                  </select>
                </div>
              </div>

              {/* 즐겨찾기 필터 */}
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showFavoritesOnly}
                    onChange={(e) => setShowFavoritesOnly(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    ⭐ 즐겨찾기만 보기
                  </span>
                </label>
              </div>

              {/* 세 번째 행: 태그 필터링 */}
              {allTags.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    태그 필터링
                  </label>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                    {allTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={selectedTags.includes(tag) ? "default" : "outline"}
                        className={`cursor-pointer transition-colors ${
                          selectedTags.includes(tag) 
                            ? 'bg-blue-600 text-white hover:bg-blue-700' 
                            : 'hover:bg-gray-100'
                        }`}
                        onClick={() => toggleTag(tag)}
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* 선택된 필터 표시 */}
              {(searchTerm || selectedCategory || selectedTags.length > 0 || showFavoritesOnly) && (
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-gray-600">활성 필터:</span>
                    {searchTerm && (
                      <Badge variant="secondary" className="text-xs">
                        검색: "{searchTerm}"
                      </Badge>
                    )}
                    {selectedCategory && (
                      <Badge variant="secondary" className="text-xs">
                        카테고리: {categories.find(c => c.id.toString() === selectedCategory)?.name}
                      </Badge>
                    )}
                    {showFavoritesOnly && (
                      <Badge variant="secondary" className="text-xs">
                        ⭐ 즐겨찾기만
                      </Badge>
                    )}
                    {selectedTags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        태그: #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 통계 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <span className="text-2xl">📄</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">전체 문서</p>
                  <p className="text-2xl font-bold text-gray-900">{articles.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <span className="text-2xl">⭐</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">즐겨찾기</p>
                  <p className="text-2xl font-bold text-gray-900">{articles.filter(a => a.isFavorite).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <span className="text-2xl">📁</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">카테고리</p>
                  <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <span className="text-2xl">🔍</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">검색 결과</p>
                  <p className="text-2xl font-bold text-gray-900">{totalFilteredItems}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 문서 목록 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              📋 문서 목록
              {searchTerm && (
                <span className="text-sm font-normal text-gray-600 ml-2">
                  "{searchTerm}" 검색 결과
                </span>
              )}
            </h2>
            <div className="flex items-center gap-4">
              {totalFilteredItems > 0 && (
                <p className="text-sm text-gray-600">
                  페이지 {currentPage} / {totalPages} (전체 {totalFilteredItems}개)
                </p>
              )}
            </div>
          </div>
          
          <ArticleList 
            articles={currentPageArticles}
            onEdit={handleEditArticle}
            onView={handleViewArticle}
            onToggleFavorite={handleToggleFavorite}
            searchTerm={searchTerm}
            searchType={searchType}
          />

          {/* 페이지네이션 */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalFilteredItems}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        </div>
      </main>

      {/* 모달들 */}
      <CategoryManager
        isOpen={showCategoryManager}
        onClose={() => setShowCategoryManager(false)}
        onUpdate={handleCategoryUpdate}
      />

      <ArticleEditor
        editingArticle={editingArticle}
        isOpen={showArticleEditor}
        onClose={() => setShowArticleEditor(false)}
        onUpdate={handleArticleUpdate}
      />

      <ArticleViewer
        article={viewingArticle}
        isOpen={showArticleViewer}
        onClose={() => setShowArticleViewer(false)}
        onEdit={handleEditArticle}
        onUpdate={handleArticleUpdate}
      />
    </div>
  );
} 