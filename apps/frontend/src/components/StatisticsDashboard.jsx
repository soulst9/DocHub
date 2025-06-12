import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import ApiClient from '../utils/api';

export default function StatisticsDashboard() {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const data = await ApiClient.getStatistics();
      setStatistics(data);
    } catch (err) {
      console.error('통계 조회 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!statistics) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        📊 문서 통계
      </h2>
      
      {/* 통계 카드들 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">총 문서</p>
              <p className="text-2xl font-bold text-blue-900">{statistics.totalArticles}</p>
            </div>
            <div className="text-blue-500 text-2xl">📄</div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">즐겨찾기</p>
              <p className="text-2xl font-bold text-yellow-900">{statistics.favoriteArticles}</p>
            </div>
            <div className="text-yellow-500 text-2xl">⭐</div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">최근 7일</p>
              <p className="text-2xl font-bold text-green-900">{statistics.recentArticles}</p>
            </div>
            <div className="text-green-500 text-2xl">📈</div>
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">카테고리</p>
              <p className="text-2xl font-bold text-purple-900">{statistics.articlesByCategory.length}</p>
            </div>
            <div className="text-purple-500 text-2xl">🏷️</div>
          </div>
        </div>
      </div>

      {/* 카테고리별 분포와 최근 문서 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 카테고리별 문서 수 */}
        <div>
          <h3 className="text-md font-medium text-gray-900 mb-3">카테고리별 분포</h3>
          <div className="space-y-2">
            {statistics.articlesByCategory.length > 0 ? (
              statistics.articlesByCategory.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-700">{category.categoryName}</span>
                  <Badge variant="outline" className="text-xs">
                    {category.count}개
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">카테고리가 없습니다.</p>
            )}
          </div>
        </div>

        {/* 최근 작성된 문서 */}
        <div>
          <h3 className="text-md font-medium text-gray-900 mb-3">최근 작성된 문서</h3>
          <div className="space-y-2">
            {statistics.latestArticles.length > 0 ? (
              statistics.latestArticles.map((article) => (
                <div key={article.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {article.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {article.Category?.name || '미분류'} • {formatDate(article.createdAt)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">문서가 없습니다.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 