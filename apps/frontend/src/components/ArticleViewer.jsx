import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function ArticleViewer({ article, isOpen, onClose, onEdit }) {
  if (!isOpen || !article) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 마크다운 기본 렌더링 (간단한 변환)
  const renderContent = (content) => {
    if (!content) return '';
    
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>')
      .replace(/\n/g, '<br>');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {article.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>작성자: {article.author?.name || '작성자 미상'}</span>
              <span>작성일: {formatDate(article.createdAt)}</span>
              {article.updatedAt && article.updatedAt !== article.createdAt && (
                <span>수정일: {formatDate(article.updatedAt)}</span>
              )}
            </div>
          </div>
          <div className="flex gap-2 ml-4">
            <Button
              onClick={() => onEdit?.(article)}
              variant="outline"
              size="sm"
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              ✏️ 수정
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </Button>
          </div>
        </div>

        {/* 메타 정보 */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex flex-wrap items-center gap-4">
            {article.category && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">카테고리:</span>
                <Badge variant="secondary">
                  {article.category.name}
                </Badge>
              </div>
            )}
            
            {article.tags && article.tags.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">태그:</span>
                <div className="flex flex-wrap gap-1">
                  {article.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 내용 */}
        <div className="flex-1 overflow-y-auto p-6">
          <div 
            className="prose prose-sm max-w-none text-gray-800 leading-relaxed"
            dangerouslySetInnerHTML={{ 
              __html: renderContent(article.content) 
            }}
          />
        </div>

        {/* 푸터 */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>문서 ID: {article.id}</span>
            <span>
              {article.content ? `${article.content.length}자` : '0자'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 