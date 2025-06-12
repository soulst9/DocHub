import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ApiClient from '../utils/api';

export default function CategoryManager({ isOpen, onClose, onUpdate }) {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 카테고리 로드
  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await ApiClient.getCategories();
      setCategories(data || []);
      setError(null);
    } catch (err) {
      console.error('카테고리 로드 실패:', err);
      setError('카테고리를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 카테고리 추가
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    
    try {
      setLoading(true);
      const newCategory = await ApiClient.createCategory({ name: newCategoryName.trim() });
      setCategories([...categories, newCategory]);
      setNewCategoryName('');
      onUpdate?.(); // 부모 컴포넌트에 업데이트 알림
      setError(null);
    } catch (err) {
      console.error('카테고리 추가 실패:', err);
      setError('카테고리 추가에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 카테고리 수정
  const handleUpdateCategory = async (id, newName) => {
    if (!newName.trim()) return;
    
    try {
      setLoading(true);
      const updatedCategory = await ApiClient.updateCategory(id, { name: newName.trim() });
      setCategories(categories.map(cat => 
        cat.id === id ? updatedCategory : cat
      ));
      setEditingCategory(null);
      onUpdate?.(); // 부모 컴포넌트에 업데이트 알림
      setError(null);
    } catch (err) {
      console.error('카테고리 수정 실패:', err);
      setError('카테고리 수정에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 카테고리 삭제
  const handleDeleteCategory = async (id, name) => {
    if (!confirm(`"${name}" 카테고리를 삭제하시겠습니까?`)) return;
    
    try {
      setLoading(true);
      await ApiClient.deleteCategory(id);
      setCategories(categories.filter(cat => cat.id !== id));
      onUpdate?.(); // 부모 컴포넌트에 업데이트 알림
      setError(null);
    } catch (err) {
      console.error('카테고리 삭제 실패:', err);
      setError('카테고리 삭제에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadCategories();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">카테고리 관리</h2>
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

        {/* 새 카테고리 추가 */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">새 카테고리 추가</h3>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="카테고리 이름"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
              disabled={loading}
              className="flex-1"
            />
            <Button 
              onClick={handleAddCategory}
              disabled={loading || !newCategoryName.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              추가
            </Button>
          </div>
        </div>

        {/* 기존 카테고리 목록 */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">기존 카테고리</h3>
          
          {loading && categories.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
              로딩 중...
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              아직 카테고리가 없습니다.
            </div>
          ) : (
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center gap-2 p-2 border border-gray-200 rounded-md">
                  {editingCategory === category.id ? (
                    <>
                      <Input
                        type="text"
                        defaultValue={category.name}
                        onBlur={(e) => handleUpdateCategory(category.id, e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleUpdateCategory(category.id, e.target.value);
                          } else if (e.key === 'Escape') {
                            setEditingCategory(null);
                          }
                        }}
                        autoFocus
                        disabled={loading}
                        className="flex-1 h-8"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingCategory(null)}
                        disabled={loading}
                        className="h-8 px-2"
                      >
                        취소
                      </Button>
                    </>
                  ) : (
                    <>
                      <Badge variant="outline" className="flex-1 justify-start">
                        {category.name}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingCategory(category.id)}
                        disabled={loading}
                        className="h-8 px-2 text-blue-600 hover:text-blue-700"
                      >
                        수정
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteCategory(category.id, category.name)}
                        disabled={loading}
                        className="h-8 px-2 text-red-600 hover:text-red-700"
                      >
                        삭제
                      </Button>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <Button 
            onClick={onClose}
            variant="outline"
            disabled={loading}
          >
            닫기
          </Button>
        </div>
      </div>
    </div>
  );
} 