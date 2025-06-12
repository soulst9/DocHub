import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function ArticleList({ articles, onEdit, onView, onToggleFavorite, onTagClick, searchTerm = '', searchType = 'all' }) {
  if (!articles || articles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">등록된 문서가 없습니다.</p>
        <p className="text-gray-400 text-sm mt-2">새 문서를 작성해보세요!</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // 검색어 하이라이팅 함수
  const highlightText = (text, highlight) => {
    if (!highlight || !text) return text;
    
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === highlight.toLowerCase() ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  // 마크다운 문법 제거 함수
  const cleanMarkdown = (content) => {
    if (!content) return '';
    
    return content
      // 이미지 마크다운 제거: ![alt](url) -> [이미지]
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, '[이미지]')
      // 링크 마크다운 제거: [text](url) -> text
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      // 볼드 제거: **text** -> text
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      // 이탤릭 제거: *text* -> text
      .replace(/\*([^*]+)\*/g, '$1')
      // 코드 블록 제거: ```code``` -> [코드]
      .replace(/```[\s\S]*?```/g, '[코드 블록]')
      // 인라인 코드 제거: `code` -> code
      .replace(/`([^`]+)`/g, '$1')
      // 헤딩 제거: # text -> text
      .replace(/^#{1,6}\s+/gm, '')
      // 리스트 마커 제거: - text -> text
      .replace(/^[\s]*[-*+]\s+/gm, '')
      // 번호 리스트 제거: 1. text -> text
      .replace(/^[\s]*\d+\.\s+/gm, '')
      // 인용 제거: > text -> text
      .replace(/^>\s+/gm, '')
      // 여러 줄바꿈을 하나로
      .replace(/\n\s*\n/g, ' ')
      // 앞뒤 공백 제거
      .trim();
  };

  // 내용 미리보기 생성 (검색어 주변 텍스트 표시)
  const getContentPreview = (content, searchTerm) => {
    if (!content) return '내용이 없습니다.';
    
    // 마크다운 문법 제거
    const cleanContent = cleanMarkdown(content);
    
    if (!searchTerm) {
      return cleanContent.substring(0, 150) + (cleanContent.length > 150 ? '...' : '');
    }

    const searchIndex = cleanContent.toLowerCase().indexOf(searchTerm.toLowerCase());
    if (searchIndex === -1) {
      return cleanContent.substring(0, 150) + (cleanContent.length > 150 ? '...' : '');
    }

    // 검색어 주변 텍스트 추출
    const start = Math.max(0, searchIndex - 75);
    const end = Math.min(cleanContent.length, searchIndex + searchTerm.length + 75);
    const preview = (start > 0 ? '...' : '') + 
                   cleanContent.substring(start, end) + 
                   (end < cleanContent.length ? '...' : '');
    
    return preview;
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <Card key={article.id} className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg font-semibold text-gray-900">
                {searchTerm && (searchType === 'all' || searchType === 'title') ? 
                  highlightText(article.title, searchTerm) : 
                  article.title
                }
              </CardTitle>
              <div className="flex gap-1 ml-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onToggleFavorite?.(article)}
                  className={`px-2 py-1 h-auto transition-colors ${
                    article.isFavorite 
                      ? 'text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 bg-yellow-50' 
                      : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50'
                  }`}
                  title={article.isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}
                >
                  {article.isFavorite ? '⭐' : '☆'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onView?.(article)}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2 py-1 h-auto"
                  title="상세보기"
                >
                  📖
                </Button>
              </div>
            </div>
            
            {article.Category && (
              <Badge variant="secondary" className="w-fit text-xs">
                {article.Category.name}
              </Badge>
            )}
          </CardHeader>
          
          <CardContent className="pt-0">
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {searchTerm && (searchType === 'all' || searchType === 'content') ? 
                highlightText(getContentPreview(article.content, searchTerm), searchTerm) :
                getContentPreview(article.content, '')
              }
            </p>
            
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {article.tags.slice(0, 3).map((tag, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className={`text-xs cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors ${
                      searchTerm && (searchType === 'all' || searchType === 'tags') && 
                      tag.toLowerCase().includes(searchTerm.toLowerCase()) 
                        ? 'bg-yellow-100 border-yellow-300' 
                        : ''
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onTagClick?.(tag);
                    }}
                    title={`"${tag}" 태그로 필터링`}
                  >
                    #{searchTerm && (searchType === 'all' || searchType === 'tags') ? 
                      highlightText(tag, searchTerm) : 
                      tag
                    }
                  </Badge>
                ))}
                {article.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs text-gray-500">
                    +{article.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>
                {article.User?.username || '작성자 미상'}
              </span>
              <span>
                {formatDate(article.createdAt)}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 