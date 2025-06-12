import React from 'react';
import { Button } from '@/components/ui/button';

export default function HeaderNav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/20 backdrop-blur-xl">
      <div className="container flex h-20 items-center justify-between">
        {/* 로고 */}
        <div className="flex items-center space-x-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 shadow-xl">
            <span className="text-xl font-black text-white">D</span>
          </div>
          <span className="text-3xl font-black tracking-tight text-white">
            DocHub
          </span>
        </div>
        
        {/* 네비게이션 */}
        <nav className="flex items-center space-x-6">
          <Button 
            variant="ghost" 
            size="lg"
            className="text-lg font-medium text-white/80 hover:text-white hover:bg-white/10"
          >
            새 문서
          </Button>
          <Button 
            size="lg"
            className="text-lg font-medium bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            로그인
          </Button>
        </nav>
      </div>
    </header>
  );
} 