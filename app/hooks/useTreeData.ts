'use client';

import { useState, useEffect } from 'react';

interface TreeData {
  id: number;
  firstName: string;
  lastName: string;
  photoUrl?: string;
  birthDate?: string;
  deathDate?: string;
  birthPlace?: string;
  deathPlace?: string;
  isLiving: boolean;
  children?: TreeData[];
  parents?: TreeData[];
  marriages?: any[];
}

interface UseTreeDataReturn {
  data: TreeData[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useTreeData = (): UseTreeDataReturn => {
  const [data, setData] = useState<TreeData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/family-tree?action=tree');
      const result = await response.json();
      
      if (result.success) {
        // Transform the flat data into a hierarchical structure
        const hierarchicalData = buildHierarchicalTree(result.data);
        setData(hierarchicalData);
      } else {
        setError(result.error || 'Failed to fetch tree data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const buildHierarchicalTree = (flatData: any[]): TreeData[] => {
    // Create a map for quick lookup
    const nodeMap = new Map<number, TreeData>();
    
    // Initialize all nodes
    flatData.forEach(item => {
      nodeMap.set(item.id, {
        ...item,
        children: [],
        parents: [],
        marriages: []
      });
    });
    
    // Build parent-child relationships
    // Note: This is a simplified version. In a real implementation,
    // you'd fetch the parent-child relationships from the database
    // For now, we'll just return the flat data as root nodes
    
    return Array.from(nodeMap.values());
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
}; 