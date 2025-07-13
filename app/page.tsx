"use client"

import { TreeVisualization } from './components/tree/TreeVisualization';
import Header from './components/Header';

export default function Home() {
  return (
    <div className="min-h-screen animated-bg relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob float" style={{ animationDelay: '4s' }}></div>
        <div className="absolute top-1/2 right-1/4 w-60 h-60 bg-yellow-300/20 rounded-full mix-blend-multiply filter blur-xl opacity-60 float" style={{ animationDelay: '1s' }}></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10">
            <Header />
        
        <main className="container mx-auto px-4 py-8">
          <div className="glass rounded-2xl shadow-2xl border border-white/30 overflow-hidden">
            <div className="h-[calc(100vh-200px)]">
              <TreeVisualization />
            </div>
          </div>
        </main>
          </div>
        </div>
  );
}
