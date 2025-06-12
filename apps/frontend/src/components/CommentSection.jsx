import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import ApiClient from '../utils/api';

export default function CommentSection({ articleId, isOpen }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newComment, setNewComment] = useState({
    content: '',
    authorName: '',
    authorEmail: ''
  });
  const [editContent, setEditContent] = useState('');

  // 댓글 목록 조회
  const fetchComments = async () => {
    if (!articleId || !isOpen) return;
    
    setLoading(true);
    try {
      const response = await ApiClient.request(`/api/v1/comments/article/${articleId}`);
      setComments(response);
    } catch (error) {
      console.error('댓글 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 댓글 작성
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.content.trim() || !newComment.authorName.trim()) {
      alert('댓글 내용과 작성자 이름을 입력해주세요.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await ApiClient.request(`/api/v1/comments/article/${articleId}`, {
        method: 'POST',
        body: JSON.stringify(newComment),
      });
      setComments([...comments, response]);
      setNewComment({ content: '', authorName: '', authorEmail: '' });
    } catch (error) {
      console.error('댓글 작성 실패:', error);
      alert('댓글 작성에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  // 댓글 수정
  const handleEdit = async (commentId) => {
    if (!editContent.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    try {
      const response = await ApiClient.request(`/api/v1/comments/${commentId}`, {
        method: 'PUT',
        body: JSON.stringify({ content: editContent }),
      });
      setComments(comments.map(comment => 
        comment.id === commentId ? response : comment
      ));
      setEditingId(null);
      setEditContent('');
    } catch (error) {
      console.error('댓글 수정 실패:', error);
      alert('댓글 수정에 실패했습니다.');
    }
  };

  // 댓글 삭제
  const handleDelete = async (commentId) => {
    if (!confirm('댓글을 삭제하시겠습니까?')) return;

    try {
      await ApiClient.request(`/api/v1/comments/${commentId}`, {
        method: 'DELETE',
      });
      setComments(comments.filter(comment => comment.id !== commentId));
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
      alert('댓글 삭제에 실패했습니다.');
    }
  };

  // 수정 시작
  const startEdit = (comment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  // 수정 취소
  const cancelEdit = () => {
    setEditingId(null);
    setEditContent('');
  };

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    fetchComments();
  }, [articleId, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="mt-8">
      <Separator className="mb-6" />
      
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">
          댓글 ({comments.length})
        </h3>

        {/* 댓글 작성 폼 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">댓글 작성</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="authorName">작성자 이름 *</Label>
                  <Input
                    id="authorName"
                    value={newComment.authorName}
                    onChange={(e) => setNewComment({
                      ...newComment,
                      authorName: e.target.value
                    })}
                    placeholder="이름을 입력하세요"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="authorEmail">이메일 (선택)</Label>
                  <Input
                    id="authorEmail"
                    type="email"
                    value={newComment.authorEmail}
                    onChange={(e) => setNewComment({
                      ...newComment,
                      authorEmail: e.target.value
                    })}
                    placeholder="이메일을 입력하세요"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="content">댓글 내용 *</Label>
                <Textarea
                  id="content"
                  value={newComment.content}
                  onChange={(e) => setNewComment({
                    ...newComment,
                    content: e.target.value
                  })}
                  placeholder="댓글을 입력하세요"
                  rows={3}
                  required
                />
              </div>
              <Button type="submit" disabled={submitting}>
                {submitting ? '작성 중...' : '댓글 작성'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* 댓글 목록 */}
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">댓글을 불러오는 중...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">첫 번째 댓글을 작성해보세요!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <Card key={comment.id}>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {comment.authorName}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {formatDate(comment.createdAt)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEdit(comment)}
                        className="text-xs"
                      >
                        수정
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(comment.id)}
                        className="text-xs text-red-600 hover:text-red-700"
                      >
                        삭제
                      </Button>
                    </div>
                  </div>
                  
                  {editingId === comment.id ? (
                    <div className="space-y-3">
                      <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleEdit(comment.id)}
                        >
                          저장
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={cancelEdit}
                        >
                          취소
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 