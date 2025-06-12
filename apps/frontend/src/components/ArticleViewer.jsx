import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ApiClient from '../utils/api';
import CommentSection from './CommentSection';

export default function ArticleViewer({ article, isOpen, onClose, onEdit, onUpdate }) {
  const [loading, setLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);

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

  // 문서 삭제
  const handleDelete = async () => {
    if (!confirm(`"${article.title}" 문서를 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.`)) {
      return;
    }

    try {
      setLoading(true);
      await ApiClient.deleteArticle(article.id);
      onUpdate?.(); // 부모 컴포넌트에 업데이트 알림
      onClose(); // 모달 닫기
    } catch (err) {
      console.error('문서 삭제 실패:', err);
      alert('문서 삭제에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // PDF 다운로드
  const handleDownloadPDF = async () => {
    try {
      setLoading(true);
      
      // PDF 다운로드 요청
      const response = await fetch(`${ApiClient.baseURL}/api/v1/articles/${article.id}/pdf`);
      
      if (!response.ok) {
        throw new Error('PDF 다운로드에 실패했습니다.');
      }
      
      // Blob으로 변환
      const blob = await response.blob();
      
      // 다운로드 링크 생성
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // 파일명 설정
      const safeTitle = article.title.replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '_');
      const filename = `${safeTitle}_${new Date().toISOString().split('T')[0]}.pdf`;
      link.download = filename;
      
      // 다운로드 실행
      document.body.appendChild(link);
      link.click();
      
      // 정리
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (err) {
      console.error('PDF 다운로드 실패:', err);
      alert('PDF 다운로드에 실패했습니다.');
    } finally {
      setLoading(false);
    }
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
              <span>작성자: {article.User?.username || '작성자 미상'}</span>
              <span>작성일: {formatDate(article.createdAt)}</span>
              {article.updatedAt && article.updatedAt !== article.createdAt && (
                <span>수정일: {formatDate(article.updatedAt)}</span>
              )}
            </div>
          </div>
          <div className="flex gap-2 ml-4">
            <Button
              onClick={() => setShowComments(!showComments)}
              variant="outline"
              size="sm"
              className={`${showComments ? 'bg-blue-50 text-blue-700' : 'text-gray-600'} hover:text-blue-700 hover:bg-blue-50`}
              disabled={loading}
            >
              💬 댓글
            </Button>
            <Button
              onClick={() => onEdit?.(article)}
              variant="outline"
              size="sm"
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              disabled={loading}
            >
              ✏️ 수정
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDelete}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              disabled={loading}
            >
              🗑️ 삭제
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDownloadPDF}
              className="text-gray-500 hover:text-gray-700"
              disabled={loading}
            >
              📄 PDF 다운로드
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              disabled={loading}
            >
              ✕
            </Button>
          </div>
        </div>

        {/* 메타 정보 */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex flex-wrap items-center gap-4">
            {article.Category && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">카테고리:</span>
                <Badge variant="secondary">
                  {article.Category.name}
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

          {/* 관련 링크 */}
          {article.links && article.links.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-start gap-2">
                <span className="text-sm text-gray-600 mt-1">관련 링크:</span>
                <div className="flex flex-col gap-2">
                  {article.links.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm hover:underline"
                    >
                      🔗 {link.title}
                      <span className="text-xs text-gray-500">↗</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 내용 */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="prose prose-sm max-w-none text-gray-800 leading-relaxed">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                // 이미지 스타일링 - 개선된 디자인
                img: ({ src, alt, ...props }) => (
                  <div className="my-6 group">
                    <div className="relative overflow-hidden rounded-xl bg-gray-50 border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300">
                      <img 
                        src={src} 
                        alt={alt} 
                        className="w-full h-auto object-cover cursor-pointer transform group-hover:scale-105 transition-transform duration-300"
                        onClick={() => window.open(src, '_blank')}
                        {...props}
                      />
                      {/* 이미지 오버레이 */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="bg-white bg-opacity-90 rounded-full p-2 shadow-lg">
                            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* 이미지 캡션 */}
                    {alt && (
                      <div className="mt-2 text-center">
                        <span className="text-sm text-gray-500 italic bg-gray-50 px-3 py-1 rounded-full">
                          {alt}
                        </span>
                      </div>
                    )}
                  </div>
                ),
                // 코드 블록 스타일링
                code: ({ node, inline, className, children, ...props }) => {
                  return inline ? (
                    <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono" {...props}>
                      {children}
                    </code>
                  ) : (
                    <code className="block bg-gray-100 p-3 rounded text-sm font-mono overflow-x-auto" {...props}>
                      {children}
                    </code>
                  );
                },
                // 링크 스타일링
                a: ({ children, href, ...props }) => (
                  <a 
                    href={href} 
                    className="text-blue-600 hover:text-blue-800 underline" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    {...props}
                  >
                    {children}
                  </a>
                ),
                // 테이블 스타일링
                table: ({ children, ...props }) => (
                  <table className="min-w-full border-collapse border border-gray-300" {...props}>
                    {children}
                  </table>
                ),
                th: ({ children, ...props }) => (
                  <th className="border border-gray-300 px-4 py-2 bg-gray-100 font-semibold" {...props}>
                    {children}
                  </th>
                ),
                td: ({ children, ...props }) => (
                  <td className="border border-gray-300 px-4 py-2" {...props}>
                    {children}
                  </td>
                ),
              }}
            >
              {article.content || '내용이 없습니다.'}
            </ReactMarkdown>
          </div>

          {/* 댓글 섹션 */}
          <CommentSection 
            articleId={article.id} 
            isOpen={showComments}
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