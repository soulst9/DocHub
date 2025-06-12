import React, { useState, useEffect, useRef } from 'react';
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
    tags: [],
    links: []
  });
  const [categories, setCategories] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [linkInput, setLinkInput] = useState({ title: '', url: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

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
          tags: editingArticle.tags || [],
          links: editingArticle.links || []
        });
      } else {
        // 새 문서 모드
        console.log('새 문서 모드로 초기화');
        setFormData({
          title: '',
          content: '',
          categoryId: '',
          tags: [],
          links: []
        });
      }
      setTagInput('');
      setLinkInput({ title: '', url: '' });
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

  // 링크 추가
  const handleAddLink = () => {
    const { title, url } = linkInput;
    if (title.trim() && url.trim()) {
      setFormData(prev => ({
        ...prev,
        links: [...prev.links, { title: title.trim(), url: url.trim() }]
      }));
      setLinkInput({ title: '', url: '' });
    }
  };

  // 링크 제거
  const handleRemoveLink = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      links: prev.links.filter((_, index) => index !== indexToRemove)
    }));
  };

  // 이미지 업로드
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // 파일 크기 체크 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('이미지 파일 크기는 5MB 이하여야 합니다.');
      return;
    }

    try {
      setUploadingImage(true);
      setError(null);

      const response = await ApiClient.uploadImage(file);
      const imageUrl = `${ApiClient.baseURL}${response.url}`;
      
      // 텍스트 영역의 현재 커서 위치에 이미지 마크다운 삽입
      const textarea = textareaRef.current;
      const cursorPosition = textarea.selectionStart;
      const textBefore = formData.content.substring(0, cursorPosition);
      const textAfter = formData.content.substring(cursorPosition);
      const imageMarkdown = `![${response.originalName}](${imageUrl})`;
      
      const newContent = textBefore + imageMarkdown + textAfter;
      handleInputChange('content', newContent);

      // 커서를 이미지 마크다운 뒤로 이동
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(
          cursorPosition + imageMarkdown.length,
          cursorPosition + imageMarkdown.length
        );
      }, 0);

    } catch (err) {
      console.error('이미지 업로드 실패:', err);
      setError('이미지 업로드에 실패했습니다.');
    } finally {
      setUploadingImage(false);
      // 파일 입력 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
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
        links: formData.links,
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
      <div className="bg-white rounded-lg p-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto">
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

            {/* 태그 입력 */}
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
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  disabled={loading}
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={handleAddTag}
                  disabled={loading || !tagInput.trim()}
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
                선택된 태그
              </label>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-red-100"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    #{tag} ✕
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* 링크 추가 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              관련 링크
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
              <Input
                type="text"
                placeholder="링크 제목"
                value={linkInput.title}
                onChange={(e) => setLinkInput(prev => ({ ...prev, title: e.target.value }))}
                disabled={loading}
              />
              <Input
                type="url"
                placeholder="https://example.com"
                value={linkInput.url}
                onChange={(e) => setLinkInput(prev => ({ ...prev, url: e.target.value }))}
                disabled={loading}
              />
              <Button
                type="button"
                onClick={handleAddLink}
                disabled={loading || !linkInput.title.trim() || !linkInput.url.trim()}
                size="sm"
              >
                링크 추가
              </Button>
            </div>

            {/* 링크 목록 */}
            {formData.links.length > 0 && (
              <div className="space-y-2">
                {formData.links.map((link, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <a 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        {link.title}
                      </a>
                      <p className="text-sm text-gray-500 truncate">{link.url}</p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveLink(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      삭제
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 내용 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-gray-700">
                내용 * (마크다운 지원)
              </label>
              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading || uploadingImage}
                >
                  {uploadingImage ? '업로드 중...' : '📷 이미지 추가'}
                </Button>
              </div>
            </div>
            <textarea
              ref={textareaRef}
              placeholder="문서 내용을 마크다운으로 작성하세요..."
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              disabled={loading}
              className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
            />
            <p className="text-xs text-gray-500 mt-1">
              마크다운 문법을 사용할 수 있습니다. 이미지는 드래그 앤 드롭하거나 위의 버튼을 클릭하여 업로드하세요.
            </p>
          </div>

          {/* 버튼 */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div>
              {editingArticle && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDelete}
                  disabled={loading}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  🗑️ 삭제
                </Button>
              )}
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                취소
              </Button>
              <Button
                type="button"
                onClick={handleSave}
                disabled={loading || !formData.title.trim() || !formData.content.trim()}
              >
                {loading ? '저장 중...' : (editingArticle ? '수정' : '저장')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 