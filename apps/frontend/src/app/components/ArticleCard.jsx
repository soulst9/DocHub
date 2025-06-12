import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ArticleCard({ article }) {
  return (
    <Card className="group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/20 hover:-translate-y-2 border border-white/20 bg-white/10 backdrop-blur-xl">
      <CardContent className="p-10">
        <div className="space-y-8">
          {/* 헤더 */}
          <div className="space-y-4">
            <h3 className="text-3xl font-bold leading-tight text-white group-hover:text-cyan-300 transition-colors duration-300">
              {article.title}
            </h3>
            <div className="flex items-center space-x-6 text-base text-white/60">
              <span className="px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 rounded-full font-semibold border border-cyan-400/30">
                {article.category}
              </span>
              <span>•</span>
              <span className="font-medium text-white/80">{article.author}</span>
              <span>•</span>
              <span>{article.date}</span>
            </div>
          </div>

          {/* 태그 */}
          <div className="flex flex-wrap gap-3">
            {article.tags.map(tag => (
              <span 
                key={tag} 
                className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-400/30 hover:scale-105 transition-transform duration-300"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* 미리보기 */}
          <p className="text-white/70 leading-relaxed text-lg line-clamp-3">
            {article.preview}
          </p>

          {/* 액션 */}
          <div className="flex items-center justify-between pt-6">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-xl hover:shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 text-lg px-8 py-4"
            >
              자세히 보기 →
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-2 border-white/30 text-white/80 hover:text-white hover:bg-white/10 text-lg px-6 py-4"
            >
              수정
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 