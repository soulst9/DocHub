import React from 'react';
import { Button } from '@/components/ui/button';

export default function Pagination({ page, totalPages, onChange }) {
  return (
    <div className="flex items-center justify-center space-x-4">
      <Button
        variant="outline"
        size="lg"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="h-14 w-14 border-2 border-white/20 bg-white/10 backdrop-blur-xl text-white shadow-xl hover:shadow-2xl hover:border-cyan-400/50 transition-all duration-300 disabled:opacity-50"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </Button>
      
      {[...Array(totalPages)].map((_, idx) => (
        <Button
          key={idx + 1}
          variant={page === idx + 1 ? "default" : "outline"}
          size="lg"
          onClick={() => onChange(idx + 1)}
          className={`h-14 w-14 text-lg font-bold transition-all duration-300 shadow-xl hover:shadow-2xl ${
            page === idx + 1 
              ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0 shadow-cyan-500/25' 
              : 'border-2 border-white/20 bg-white/10 backdrop-blur-xl text-white hover:border-cyan-400/50 hover:bg-white/20'
          }`}
        >
          {idx + 1}
        </Button>
      ))}
      
      <Button
        variant="outline"
        size="lg"
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="h-14 w-14 border-2 border-white/20 bg-white/10 backdrop-blur-xl text-white shadow-xl hover:shadow-2xl hover:border-cyan-400/50 transition-all duration-300 disabled:opacity-50"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Button>
    </div>
  );
} 