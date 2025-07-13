'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AvatarNode } from './AvatarNode';
import { NodeTooltip } from './NodeTooltip';
import { ChevronDown, ChevronRight, User, Users, Heart, Calendar, MapPin } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';

interface TreeNodeProps {
  node: {
    id: number;
    firstName: string;
    lastName: string;
    photoUrl?: string;
    birthDate?: string;
    deathDate?: string;
    birthPlace?: string;
    isLiving: boolean;
    children?: TreeNodeProps['node'][];
    parents?: TreeNodeProps['node'][];
    marriages?: any[];
  };
  level?: number;
  isExpanded?: boolean;
  onToggle?: (nodeId: number) => void;
  onNodeClick?: (node: TreeNodeProps['node']) => void;
  onAddChild?: (parentId: number) => void;
  onEditNode?: (nodeId: number) => void;
  className?: string;
}

export const TreeNode = ({ 
  node, 
  level = 0, 
  isExpanded = false, 
  onToggle, 
  onNodeClick,
  onAddChild,
  onEditNode,
  className = ''
}: TreeNodeProps) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  
  const hasChildren = node.children && node.children.length > 0;
  const childrenCount = node.children?.length || 0;
  
  const handleNodeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNodeClick?.(node);
  };
  
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle?.(node.id);
  };
  
  const handleMouseEnter = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });
    setShowTooltip(true);
  };
  
  const handleMouseLeave = () => {
    setShowTooltip(false);
  };
  
  return (
    <motion.div
      className={`tree-node fade-in ${className}`}
      layout
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -20 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        duration: 0.5
      }}
      data-node-id={node.id}
    >
      <motion.div
        className="node-container relative"
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Card className="node-card p-4 glow hover:glow">
          <div className="flex items-center space-x-4">
            {/* Avatar */}
            <div onClick={handleNodeClick} className="avatar-container cursor-pointer">
              <AvatarNode
                firstName={node.firstName}
                lastName={node.lastName}
                photoUrl={node.photoUrl}
                size="medium"
              />
            </div>
            
            {/* Node Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <h4 className="font-bold text-lg gradient-text">
                  {node.firstName} {node.lastName}
                </h4>
                {!node.isLiving && (
                  <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">†</span>
                )}
                {node.isLiving && (
                  <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">Living</span>
                )}
              </div>
              
              <div className="space-y-1">
                {node.birthDate && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span>{node.birthDate}</span>
                    {node.deathDate && <span>- {node.deathDate}</span>}
                  </div>
                )}
                {node.birthPlace && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-purple-500" />
                    <span className="truncate">{node.birthPlace}</span>
                  </div>
                )}
                {childrenCount > 0 && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Users className="w-4 h-4 text-green-500" />
                    <span>{childrenCount} children</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center space-x-2">
              {hasChildren && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleToggle}
                  className="nav-button p-2 h-8 w-8 rounded-full"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onAddChild?.(node.id)}
                className="nav-button p-2 h-8 w-8 rounded-full"
                title="Add child"
              >
                <User className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
        
        {/* Tooltip */}
        <AnimatePresence>
          {showTooltip && (
            <NodeTooltip
              node={node}
              position={tooltipPosition}
              onEdit={() => onEditNode?.(node.id)}
            />
          )}
        </AnimatePresence>
      </motion.div>
      
      {/* Children */}
      {hasChildren && (
        <motion.div
          className="children-container ml-8 mt-6 space-y-6"
          initial={false}
          animate={{ 
            height: isExpanded ? "auto" : 0,
            opacity: isExpanded ? 1 : 0
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <div className="relative">
            {/* Connection line */}
            <div className="connection-line" />
            
            {/* Children nodes */}
            <div className="space-y-6">
              {node.children!.map((child, index) => (
                <motion.div
                  key={child.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <TreeNode
                    node={child}
                    level={level + 1}
                    isExpanded={isExpanded}
                    onToggle={onToggle}
                    onNodeClick={onNodeClick}
                    onAddChild={onAddChild}
                    onEditNode={onEditNode}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}; 