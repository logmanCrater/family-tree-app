import { z } from 'zod';
import { addIndividual, addMarriage, addParentChildRelation, validateBirthDate } from './operations';
import type { NewIndividual, NewMarriage, NewParentChildRelation } from './schema';

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

// Individual validation schema
export const individualSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100, 'First name too long'),
  lastName: z.string().min(1, 'Last name is required').max(100, 'Last name too long'),
  middleName: z.string().max(100, 'Middle name too long').optional(),
  maidenName: z.string().max(100, 'Maiden name too long').optional(),
  gender: z.enum(['male', 'female', 'other', 'unknown']),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)').optional(),
  birthPlace: z.string().max(200, 'Birth place too long').optional(),
  deathDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)').optional(),
  deathPlace: z.string().max(200, 'Death place too long').optional(),
  isLiving: z.boolean().default(true),
  isPrivate: z.boolean().default(false),
  photoUrl: z.string().url('Invalid photo URL').optional(),
  notes: z.string().max(1000, 'Notes too long').optional(),
});

// Marriage validation schema
export const marriageSchema = z.object({
  spouse1Id: z.number().positive('Invalid spouse 1 ID'),
  spouse2Id: z.number().positive('Invalid spouse 2 ID'),
  marriageDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)').optional(),
  marriagePlace: z.string().max(200, 'Marriage place too long').optional(),
  divorceDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)').optional(),
  divorcePlace: z.string().max(200, 'Divorce place too long').optional(),
  isActive: z.boolean().default(true),
  marriageType: z.enum(['civil', 'religious', 'traditional', 'other']).default('civil'),
  notes: z.string().max(1000, 'Notes too long').optional(),
});

// Parent-child relationship validation schema
export const parentChildSchema = z.object({
  childId: z.number().positive('Invalid child ID'),
  parentId: z.number().positive('Invalid parent ID'),
  marriageId: z.number().positive('Invalid marriage ID').optional(),
  relationshipType: z.enum(['biological', 'adopted', 'step', 'foster', 'guardian']).default('biological'),
  isPrimaryParent: z.boolean().default(true),
  notes: z.string().max(1000, 'Notes too long').optional(),
});

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validate individual data with business logic
 */
export const validateIndividual = async (data: NewIndividual): Promise<{ valid: boolean; errors: string[] }> => {
  const errors: string[] = [];

  try {
    // Validate against schema
    individualSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      errors.push(...error.errors.map(e => e.message));
    }
  }

  // Business logic validations
  if (data.birthDate && data.deathDate) {
    const birthDate = new Date(data.birthDate);
    const deathDate = new Date(data.deathDate);
    
    if (deathDate <= birthDate) {
      errors.push('Death date must be after birth date');
    }
  }

  if (data.birthDate) {
    const birthDate = new Date(data.birthDate);
    const today = new Date();
    
    if (birthDate > today) {
      errors.push('Birth date cannot be in the future');
    }
  }

  if (data.deathDate) {
    const deathDate = new Date(data.deathDate);
    const today = new Date();
    
    if (deathDate > today) {
      errors.push('Death date cannot be in the future');
    }
  }

  // If person is marked as deceased, they shouldn't be marked as living
  if (data.deathDate && data.isLiving) {
    errors.push('Deceased person cannot be marked as living');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Validate marriage data with business logic
 */
export const validateMarriage = async (data: NewMarriage): Promise<{ valid: boolean; errors: string[] }> => {
  const errors: string[] = [];

  try {
    // Validate against schema
    marriageSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      errors.push(...error.errors.map(e => e.message));
    }
  }

  // Business logic validations
  if (data.spouse1Id === data.spouse2Id) {
    errors.push('A person cannot marry themselves');
  }

  if (data.marriageDate && data.divorceDate) {
    const marriageDate = new Date(data.marriageDate);
    const divorceDate = new Date(data.divorceDate);
    
    if (divorceDate <= marriageDate) {
      errors.push('Divorce date must be after marriage date');
    }
  }

  if (data.marriageDate) {
    const marriageDate = new Date(data.marriageDate);
    const today = new Date();
    
    if (marriageDate > today) {
      errors.push('Marriage date cannot be in the future');
    }
  }

  if (data.divorceDate) {
    const divorceDate = new Date(data.divorceDate);
    const today = new Date();
    
    if (divorceDate > today) {
      errors.push('Divorce date cannot be in the future');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Validate parent-child relationship with business logic
 */
export const validateParentChildRelation = async (data: NewParentChildRelation): Promise<{ valid: boolean; errors: string[] }> => {
  const errors: string[] = [];

  try {
    // Validate against schema
    parentChildSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      errors.push(...error.errors.map(e => e.message));
    }
  }

  // Business logic validations
  if (data.childId === data.parentId) {
    errors.push('A person cannot be their own parent');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

// ============================================================================
// DATA CONSISTENCY VALIDATIONS
// ============================================================================

/**
 * Validate family tree consistency
 */
export const validateFamilyTreeConsistency = async (): Promise<{ valid: boolean; errors: string[] }> => {
  const errors: string[] = [];

  // This would implement complex validations like:
  // - No circular relationships
  // - Birth dates are logical (children born after parents)
  // - Marriage dates are logical
  // - No duplicate relationships

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Check for circular relationships in the family tree
 */
export const checkCircularRelationships = async (): Promise<{ hasCircular: boolean; cycles: string[] }> => {
  const cycles: string[] = [];
  
  // Implementation would traverse the family tree to detect cycles
  // This is a complex algorithm that would need to be implemented carefully

  return {
    hasCircular: cycles.length > 0,
    cycles,
  };
};

// ============================================================================
// VALIDATED OPERATIONS
// ============================================================================

/**
 * Add individual with validation
 */
export const addIndividualWithValidation = async (data: Omit<NewIndividual, 'id' | 'uuid' | 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; individual?: any; errors: string[] }> => {
  const validation = await validateIndividual(data);
  
  if (!validation.valid) {
    return {
      success: false,
      errors: validation.errors,
    };
  }

  try {
    const individual = await addIndividual(data);
    return {
      success: true,
      individual,
      errors: [],
    };
  } catch (error) {
    return {
      success: false,
      errors: [error instanceof Error ? error.message : 'Unknown error occurred'],
    };
  }
};

/**
 * Add marriage with validation
 */
export const addMarriageWithValidation = async (data: Omit<NewMarriage, 'id' | 'uuid' | 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; marriage?: any; errors: string[] }> => {
  const validation = await validateMarriage(data);
  
  if (!validation.valid) {
    return {
      success: false,
      errors: validation.errors,
    };
  }

  try {
    const marriage = await addMarriage(data);
    return {
      success: true,
      marriage,
      errors: [],
    };
  } catch (error) {
    return {
      success: false,
      errors: [error instanceof Error ? error.message : 'Unknown error occurred'],
    };
  }
};

/**
 * Add parent-child relationship with validation
 */
export const addParentChildRelationWithValidation = async (data: Omit<NewParentChildRelation, 'id' | 'createdAt'>): Promise<{ success: boolean; relation?: any; errors: string[] }> => {
  const validation = await validateParentChildRelation(data);
  
  if (!validation.valid) {
    return {
      success: false,
      errors: validation.errors,
    };
  }

  try {
    const relation = await addParentChildRelation(data);
    return {
      success: true,
      relation,
      errors: [],
    };
  } catch (error) {
    return {
      success: false,
      errors: [error instanceof Error ? error.message : 'Unknown error occurred'],
    };
  }
}; 