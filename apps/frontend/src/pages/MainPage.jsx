import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ArticleList from '../components/ArticleList';
import CategoryManager from '../components/CategoryManager';
import ArticleEditor from '../components/ArticleEditor';
import ArticleViewer from '../components/ArticleViewer';
import ApiClient from '../utils/api';

export default function MainPage() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
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

  // 검색 및 필터링
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || 
                           (article.category && article.category.id.toString() === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  // 문서 관련 핸들러
  const handleNewArticle = () => {
    console.log('새 문서 버튼 클릭됨');
    try {
      setEditingArticle(null);
      setShowArticleEditor(true);
      console.log('새 문서 모달 상태 변경 완료');
    } catch (error) {
      console.error('새 문서 버튼 에러:', error);
    }
  };

  const handleEditArticle = (article) => {
    console.log('문서 수정 버튼 클릭됨:', article);
    try {
      setEditingArticle(article);
      setShowArticleEditor(true);
      setShowArticleViewer(false);
      console.log('수정 모달 상태 변경 완료');
    } catch (error) {
      console.error('문서 수정 에러:', error);
    }
  };

  const handleViewArticle = (article) => {
    console.log('문서 보기 클릭됨:', article);
    try {
      setViewingArticle(article);
      setShowArticleViewer(true);
      console.log('보기 모달 상태 변경 완료');
    } catch (error) {
      console.error('문서 보기 에러:', error);
    }
  };

  const handleArticleUpdate = () => {
    loadData(); // 데이터 새로고침
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
                onClick={() => {
                  alert('새 문서 버튼 클릭됨!'); // 긴급 테스트
                  handleNewArticle();
                }}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2 transition-colors"
              >
                ✏️ 새 문서 작성
              </button>
              <button
                onClick={() => {
                  alert('카테고리 버튼 클릭됨!'); // 비교 테스트
                  setShowCategoryManager(true);
                }}
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
              <CardTitle className="text-lg font-semibold text-gray-900">
                문서 검색 및 필터
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    검색어
                  </label>
                  <Input
                    type="text"
                    placeholder="제목이나 내용으로 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
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
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 통계 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                  <p className="text-2xl font-bold text-gray-900">{filteredArticles.length}</p>
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
            {filteredArticles.length > 0 && (
              <p className="text-sm text-gray-600">
                {filteredArticles.length}개의 문서
              </p>
            )}
          </div>
          
          <ArticleList 
            articles={filteredArticles}
            onEdit={handleEditArticle}
            onView={handleViewArticle}
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
        isOpen={showArticleEditor}
        onClose={() => setShowArticleEditor(false)}
        onUpdate={handleArticleUpdate}
        editingArticle={editingArticle}
      />

      <ArticleViewer
        article={viewingArticle}
        isOpen={showArticleViewer}
        onClose={() => setShowArticleViewer(false)}
        onEdit={handleEditArticle}
      />
    </div>
  );
} 