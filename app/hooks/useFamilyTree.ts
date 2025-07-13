import { useState, useEffect } from 'react';

interface FamilyMember {
  id: number;
  firstName: string;
  lastName: string;
  photoUrl?: string;
  birthDate?: string;
  deathDate?: string;
  birthPlace?: string;
  isLiving: boolean;
  children?: FamilyMember[];
  parents?: FamilyMember[];
  marriages?: any[];
}

interface UseFamilyTreeReturn {
  data: FamilyMember[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useFamilyTree = (): UseFamilyTreeReturn => {
  const [data, setData] = useState<FamilyMember[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/family-tree?action=tree');
      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
      } else {
        setError(result.error || 'Failed to fetch family tree data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
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