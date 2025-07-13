'use client';

import { motion } from 'framer-motion';
import { AvatarNode } from './AvatarNode';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Edit, MapPin, Calendar, Users, Heart } from 'lucide-react';

interface NodeTooltipProps {
  node: {
    id: number;
    firstName: string;
    lastName: string;
    photoUrl?: string;
    birthDate?: string;
    deathDate?: string;
    birthPlace?: string;
    deathPlace?: string;
    isLiving: boolean;
    children?: any[];
    parents?: any[];
    marriages?: any[];
  };
  position: { x: number; y: number };
  onEdit?: () => void;
  onViewProfile?: () => void;
}

export const NodeTooltip = ({ node, position, onEdit, onViewProfile }: NodeTooltipProps) => {
  const childrenCount = node.children?.length || 0;
  const parentsCount = node.parents?.length || 0;
  const marriagesCount = node.marriages?.length || 0;
  
  return (
    <motion.div
      className="node-tooltip absolute z-50 pointer-events-none"
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 10 }}
      transition={{ duration: 0.2 }}
      style={{
        left: position.x,
        top: position.y,
        transform: 'translateX(-50%) translateY(-100%)'
      }}
    >
      <Card className="p-4 bg-white border-gray-200 shadow-lg max-w-xs pointer-events-auto">
        {/* Header */}
        <div className="flex items-start space-x-3 mb-3">
          <AvatarNode
            firstName={node.firstName}
            lastName={node.lastName}
            photoUrl={node.photoUrl}
            size="large"
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 text-lg">
              {node.firstName} {node.lastName}
            </h4>
            <p className="text-sm text-gray-600">
              {node.birthDate && (
                <>
                  {node.birthDate}
                  {node.deathDate && ` - ${node.deathDate}`}
                  {!node.deathDate && node.isLiving && ' - Present'}
                </>
              )}
            </p>
            {!node.isLiving && (
              <p className="text-xs text-gray-500 mt-1">Deceased</p>
            )}
          </div>
        </div>
        
        {/* Details */}
        <div className="space-y-2 mb-3">
          {node.birthPlace && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>Born in {node.birthPlace}</span>
            </div>
          )}
          
          {node.deathPlace && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>Died in {node.deathPlace}</span>
            </div>
          )}
          
          {childrenCount > 0 && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              <span>{childrenCount} children</span>
            </div>
          )}
          
          {parentsCount > 0 && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              <span>{parentsCount} parents</span>
            </div>
          )}
          
          {marriagesCount > 0 && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Heart className="w-4 h-4" />
              <span>{marriagesCount} marriage{marriagesCount > 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
        
        {/* Actions */}
        <div className="flex space-x-2 pt-2 border-t border-gray-100">
          <Button
            variant="outline"
            size="sm"
            onClick={onViewProfile}
            className="flex-1"
          >
            View Profile
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="px-3"
          >
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}; 