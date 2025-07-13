'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../../components/ui/button';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Search,
  Grid3X3,
  List,
  TreePine,
  Settings
} from 'lucide-react';

export const TreeNavigation = () => {
  const [scale, setScale] = useState(1);
  const [viewMode, setViewMode] = useState<'tree' | 'grid' | 'list'>('tree');

  const zoomIn = () => {
    setScale(prev => Math.min(3, prev * 1.2));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(0.1, prev / 1.2));
  };

  const resetView = () => {
    setScale(1);
  };

  return (
    <div className="nav-controls p-3 border-t border-gray-200/50">
      <div className="flex items-center justify-between">
        {/* View Mode Controls */}
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'tree' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('tree')}
            className="nav-button"
          >
            <TreePine className="w-4 h-4 mr-2" />
            Tree
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="nav-button"
          >
            <Grid3X3 className="w-4 h-4 mr-2" />
            Grid
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="nav-button"
          >
            <List className="w-4 h-4 mr-2" />
            List
          </Button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={zoomOut}
            disabled={scale <= 0.1}
            className="nav-button"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          
          <div className="text-sm font-medium text-gray-700 min-w-[60px] text-center">
            {Math.round(scale * 100)}%
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={zoomIn}
            disabled={scale >= 3}
            className="nav-button"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={resetView}
            className="nav-button"
            title="Reset View"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        {/* Settings */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="nav-button"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}; 