'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TreeNode } from './TreeNode';
import { TreeNavigation } from './TreeNavigation';
import { Search, Loader2, Users, Heart, TreePine, Plus, RefreshCw } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Card } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { useFamilyTree } from '../../hooks/useFamilyTree';

export const TreeVisualization = () => {
  const { data: familyData, loading, error, refetch } = useFamilyTree();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set());
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'tree' | 'list' | 'timeline'>('tree');

  // Auto-expand first level nodes
  useEffect(() => {
    if (familyData && familyData.length > 0) {
      const firstLevelIds = familyData.map(node => node.id);
      setExpandedNodes(new Set(firstLevelIds));
    }
  }, [familyData]);

  const handleToggleNode = (nodeId: number) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const handleNodeClick = (node: any) => {
    setSelectedNode(node);
  };

  const handleAddChild = (parentId: number) => {
    // TODO: Implement add child functionality
    console.log('Add child to:', parentId);
  };

  const handleEditNode = (nodeId: number) => {
    // TODO: Implement edit node functionality
    console.log('Edit node:', nodeId);
  };

  const filteredData = familyData?.filter(node => 
    node.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    node.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const totalMembers = familyData?.length || 0;
  const livingMembers = familyData?.filter(node => node.isLiving).length || 0;
  const deceasedMembers = totalMembers - livingMembers;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Loader2 className="loading-spinner w-12 h-12 mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading family tree...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <TreePine className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Family Tree</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={refetch} className="nav-button">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="tree-container h-full flex flex-col">
      {/* Header with Stats and Search */}
      <div className="nav-controls p-4 border-b border-gray-200/50">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Stats */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium text-gray-700">Total: {totalMembers}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium text-gray-700">Living: {livingMembers}</span>
            </div>
            <div className="flex items-center space-x-2">
              <TreePine className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium text-gray-700">Deceased: {deceasedMembers}</span>
            </div>
          </div>

          {/* Search and Actions */}
          <div className="flex items-center space-x-4">
            <div className="search-container relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search family members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input pl-10 pr-4 py-2 w-64"
              />
            </div>
            
            <Button className="nav-button">
              <Plus className="w-4 h-4 mr-2" />
              Add Member
            </Button>
          </div>
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="nav-controls px-4 py-2 border-b border-gray-200/50">
        <div className="flex space-x-1">
          {[
            { id: 'tree', label: 'Tree View', icon: TreePine },
            { id: 'list', label: 'List View', icon: Users },
            { id: 'timeline', label: 'Timeline', icon: Heart }
          ].map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              variant={viewMode === id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode(id as any)}
              className={`nav-button ${viewMode === id ? 'bg-gradient-to-r from-blue-500 to-purple-600' : ''}`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex">
          {/* Tree View */}
          <div className="flex-1 overflow-auto p-6">
            <AnimatePresence mode="wait">
              {viewMode === 'tree' && (
                <motion.div
                  key="tree"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {filteredData.length === 0 ? (
                    <div className="text-center py-12">
                      <TreePine className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Family Members Found</h3>
                      <p className="text-gray-600">
                        {searchTerm ? 'Try adjusting your search terms.' : 'Start by adding your first family member.'}
                      </p>
                    </div>
                  ) : (
                    filteredData.map((node, index) => (
                      <motion.div
                        key={node.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <TreeNode
                          node={node}
                          isExpanded={expandedNodes.has(node.id)}
                          onToggle={handleToggleNode}
                          onNodeClick={handleNodeClick}
                          onAddChild={handleAddChild}
                          onEditNode={handleEditNode}
                        />
                      </motion.div>
                    ))
                  )}
                </motion.div>
              )}

              {viewMode === 'list' && (
                <motion.div
                  key="list"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  {filteredData.map((node) => (
                    <Card key={node.id} className="node-card p-4 hover:glow">
                      <div className="flex items-center space-x-3">
                        <div className="avatar-container">
                          <TreeNode
                            node={node}
                            onNodeClick={handleNodeClick}
                            onAddChild={handleAddChild}
                            onEditNode={handleEditNode}
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </motion.div>
              )}

              {viewMode === 'timeline' && (
                <motion.div
                  key="timeline"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="text-center py-12"
                >
                  <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Timeline View</h3>
                  <p className="text-gray-600">Timeline view coming soon...</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar - Selected Node Details */}
          <AnimatePresence>
            {selectedNode && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 320, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="nav-controls border-l border-gray-200/50 overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold gradient-text">Details</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedNode(null)}
                      className="p-2 h-8 w-8 rounded-full"
                    >
                      ×
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="text-center">
                      <TreeNode
                        node={selectedNode}
                        onNodeClick={() => {}}
                        onAddChild={handleAddChild}
                        onEditNode={handleEditNode}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Full Name</label>
                        <p className="text-gray-900">{selectedNode.firstName} {selectedNode.lastName}</p>
                      </div>
                      
                      {selectedNode.birthDate && (
                        <div>
                          <label className="text-sm font-medium text-gray-700">Birth Date</label>
                          <p className="text-gray-900">{selectedNode.birthDate}</p>
                        </div>
                      )}
                      
                      {selectedNode.birthPlace && (
                        <div>
                          <label className="text-sm font-medium text-gray-700">Birth Place</label>
                          <p className="text-gray-900">{selectedNode.birthPlace}</p>
                        </div>
                      )}
                      
                      <div>
                        <label className="text-sm font-medium text-gray-700">Status</label>
                        <Badge variant={selectedNode.isLiving ? 'default' : 'destructive'}>
                          {selectedNode.isLiving ? 'Living' : 'Deceased'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Controls */}
      <TreeNavigation />
    </div>
  );
}; 