import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ApiClient from '../utils/api';

export default function ArticleEditor({ isOpen, onClose, onUpdate, editingArticle = null }) {
  console.log('ArticleEditor 렌더링됨:', { isOpen, editingArticle });

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    categoryId: '',
    tags: []
  });
  const [categories, setCategories] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 카테고리 로드
  const loadCategories = async () => {
    try {
      console.log('카테고리 로드 시작');
      const data = await ApiClient.getCategories();
      setCategories(data || []);
      console.log('카테고리 로드 완료:', data);
    } catch (err) {
      console.error('카테고리 로드 실패:', err);
    }
  };

  // 폼 데이터 초기화
  useEffect(() => {
    console.log('ArticleEditor useEffect 실행됨:', { isOpen, editingArticle });
    if (isOpen) {
      loadCategories();
      
      if (editingArticle) {
        // 수정 모드
        console.log('수정 모드로 초기화');
        setFormData({
          title: editingArticle.title || '',
          content: editingArticle.content || '',
          categoryId: editingArticle.Category?.id || editingArticle.categoryId || '',
          tags: editingArticle.tags || []
        });
      } else {
        // 새 문서 모드
        console.log('새 문서 모드로 초기화');
        setFormData({
          title: '',
          content: '',
          categoryId: '',
          tags: []
        });
      }
      setTagInput('');
      setError(null);
    }
  }, [isOpen, editingArticle]);

  // 입력 핸들러
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 태그 추가
  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setTagInput('');
    }
  };

  // 태그 제거
  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // 문서 저장
  const handleSave = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      setError('제목과 내용을 모두 입력해주세요.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const articleData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : null,
        tags: formData.tags,
        authorId: 1 // 임시로 고정 (나중에 사용자 인증 구현 시 변경)
      };

      if (editingArticle) {
        // 수정
        await ApiClient.updateArticle(editingArticle.id, articleData);
      } else {
        // 새 문서 생성
        await ApiClient.createArticle(articleData);
      }

      onUpdate?.(); // 부모 컴포넌트에 업데이트 알림
      onClose();
    } catch (err) {
      console.error('문서 저장 실패:', err);
      setError('문서 저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 문서 삭제
  const handleDelete = async () => {
    if (!editingArticle) return;
    
    if (!confirm(`"${editingArticle.title}" 문서를 삭제하시겠습니까?`)) return;

    try {
      setLoading(true);
      await ApiClient.deleteArticle(editingArticle.id);
      onUpdate?.(); // 부모 컴포넌트에 업데이트 알림
      onClose();
    } catch (err) {
      console.error('문서 삭제 실패:', err);
      setError('문서 삭제에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {editingArticle ? '문서 수정' : '새 문서 작성'}
          </h2>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </Button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-md text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* 제목 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              제목 *
            </label>
            <Input
              type="text"
              placeholder="문서 제목을 입력하세요"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              disabled={loading}
              className="text-lg"
            />
          </div>

          {/* 카테고리 및 태그 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 카테고리 선택 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                카테고리
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => handleInputChange('categoryId', e.target.value)}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">카테고리 선택</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 태그 추가 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                태그
              </label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="태그 입력"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  disabled={loading}
                  className="flex-1"
                />
                <Button 
                  onClick={handleAddTag}
                  disabled={loading || !tagInput.trim()}
                  variant="outline"
                  size="sm"
                >
                  추가
                </Button>
              </div>
            </div>
          </div>

          {/* 태그 목록 */}
          {formData.tags.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                추가된 태그
              </label>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {tag}
                    <button 
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 hover:text-red-600"
                      disabled={loading}
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* 내용 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              내용 *
            </label>
            <textarea
              placeholder="문서 내용을 입력하세요..."
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              disabled={loading}
              rows={15}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
            />
            <p className="text-xs text-gray-500 mt-1">
              마크다운 문법을 사용할 수 있습니다.
            </p>
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
          <div>
            {editingArticle && (
              <Button
                onClick={handleDelete}
                disabled={loading}
                variant="outline"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                🗑️ 삭제
              </Button>
            )}
          </div>
          
          <div className="flex gap-3">
            <Button 
              onClick={onClose}
              variant="outline"
              disabled={loading}
            >
              취소
            </Button>
            <Button 
              onClick={handleSave}
              disabled={loading || !formData.title.trim() || !formData.content.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? '저장 중...' : (editingArticle ? '수정' : '저장')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 