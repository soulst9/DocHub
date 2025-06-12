import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function ArticleList({ articles, onEdit, onView }) {
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

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <Card key={article.id} className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <CardTitle 
                className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
                onClick={() => onView?.(article)}
              >
                {article.title}
              </CardTitle>
              <div className="flex gap-1 ml-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit?.(article)}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2 py-1 h-auto"
                >
                  ✏️
                </Button>
              </div>
            </div>
            
            {article.category && (
              <Badge variant="secondary" className="w-fit text-xs">
                {article.category.name}
              </Badge>
            )}
          </CardHeader>
          
          <CardContent className="pt-0">
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {article.content ? 
                article.content.substring(0, 150) + (article.content.length > 150 ? '...' : '') 
                : '내용이 없습니다.'
              }
            </p>
            
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {article.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    #{tag}
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
                {article.author?.name || '작성자 미상'}
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