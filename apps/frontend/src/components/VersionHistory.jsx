import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ApiClient from '../utils/api';

export default function VersionHistory({ articleId, isOpen, onClose, onRestore }) {
  const [versions, setVersions] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && articleId) {
      fetchVersions();
    }
  }, [isOpen, articleId]);

  const fetchVersions = async () => {
    try {
      setLoading(true);
      const data = await ApiClient.getVersions(articleId);
      setVersions(data);
    } catch (err) {
      console.error('버전 목록 조회 실패:', err);
      alert('버전 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleVersionClick = async (versionNumber) => {
    try {
      setLoading(true);
      const version = await ApiClient.getVersion(articleId, versionNumber);
      setSelectedVersion(version);
    } catch (err) {
      console.error('버전 조회 실패:', err);
      alert('버전을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (versionNumber) => {
    if (!confirm(`버전 ${versionNumber}으로 복원하시겠습니까?\n\n현재 내용은 새로운 버전으로 저장됩니다.`)) {
      return;
    }

    try {
      setLoading(true);
      await ApiClient.restoreVersion(articleId, versionNumber);
      alert('버전이 성공적으로 복원되었습니다.');
      onRestore?.(); // 부모 컴포넌트에 복원 알림
      onClose();
    } catch (err) {
      console.error('버전 복원 실패:', err);
      alert('버전 복원에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden flex">
        {/* 버전 목록 */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">버전 히스토리</h2>
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
          
          <div className="flex-1 overflow-y-auto p-4">
            {loading && versions.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                로딩 중...
              </div>
            ) : versions.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                버전이 없습니다.
              </div>
            ) : (
              <div className="space-y-2">
                {versions.map((version) => (
                  <div
                    key={version.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedVersion?.id === version.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => handleVersionClick(version.version_number)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        버전 {version.version_number}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {formatDate(version.created_at)}
                      </span>
                    </div>
                    <h4 className="font-medium text-sm text-gray-900 truncate">
                      {version.title}
                    </h4>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                      {version.content?.substring(0, 100)}...
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500">
                        {version.User?.username || '작성자 미상'}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRestore(version.version_number);
                        }}
                        className="text-xs px-2 py-1 h-6"
                        disabled={loading}
                      >
                        복원
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 버전 미리보기 */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              {selectedVersion ? `버전 ${selectedVersion.version_number} 미리보기` : '버전을 선택하세요'}
            </h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            {selectedVersion ? (
              <div className="space-y-4">
                {/* 메타 정보 */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h1 className="text-xl font-bold text-gray-900 mb-2">
                    {selectedVersion.title}
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>작성자: {selectedVersion.User?.username || '작성자 미상'}</span>
                    <span>생성일: {formatDate(selectedVersion.created_at)}</span>
                  </div>
                  
                  {selectedVersion.Category && (
                    <div className="mt-2">
                      <Badge variant="secondary">
                        {selectedVersion.Category.name}
                      </Badge>
                    </div>
                  )}
                  
                  {selectedVersion.tags && selectedVersion.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {selectedVersion.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* 내용 */}
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-gray-800">
                    {selectedVersion.content || '내용이 없습니다.'}
                  </div>
                </div>

                {/* 복원 버튼 */}
                <div className="flex justify-end pt-4 border-t border-gray-200">
                  <Button
                    onClick={() => handleRestore(selectedVersion.version_number)}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    이 버전으로 복원
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                왼쪽에서 버전을 선택하면 미리보기가 표시됩니다.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 