import { db } from './index';
import { 
  individuals, 
  marriages, 
  relationships, 
  events, 
  sources, 
  media,
  individualMedia,
  individualSources
} from './schema';

// ============================================================================
// EXPORT UTILITIES
// ============================================================================

/**
 * Export family tree data to JSON format
 */
export const exportToJSON = async (): Promise<string> => {
  try {
    // Fetch all data from database
    const allIndividuals = await db.select().from(individuals);
    const allMarriages = await db.select().from(marriages);
    const allRelationships = await db.select().from(relationships);
    const allEvents = await db.select().from(events);
    const allSources = await db.select().from(sources);
    const allMedia = await db.select().from(media);
    const allMediaLinks = await db.select().from(individualMedia);
    const allSourceCitations = await db.select().from(individualSources);

    const exportData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      data: {
        individuals: allIndividuals,
        marriages: allMarriages,
        relationships: allRelationships,
        events: allEvents,
        sources: allSources,
        media: allMedia,
        mediaLinks: allMediaLinks,
        sourceCitations: allSourceCitations,
      },
    };

    return JSON.stringify(exportData, null, 2);
  } catch (error) {
    throw new Error(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Export family tree data to GEDCOM format
 */
export const exportToGEDCOM = async (): Promise<string> => {
  try {
    const allIndividuals = await db.select().from(individuals);
    const allMarriages = await db.select().from(marriages);
    const allRelationships = await db.select().from(relationships);
    const allEvents = await db.select().from(events);

    let gedcom = '0 HEAD\n1 GEDC\n2 VERS 5.5.1\n2 FORM LINEAGE-LINKED\n1 CHAR UTF-8\n1 SOUR Family Tree App\n\n';

    // Export individuals
    for (const individual of allIndividuals) {
      gedcom += `0 @I${individual.id}@ INDI\n`;
      gedcom += `1 NAME ${individual.firstName} /${individual.lastName}/\n`;
      
      if (individual.middleName) {
        gedcom += `2 GIVN ${individual.firstName} ${individual.middleName}\n`;
      }

      if (individual.gender) {
        gedcom += `1 SEX ${individual.gender.toUpperCase()}\n`;
      }

      if (individual.birthDate) {
        gedcom += `1 BIRT\n2 DATE ${formatDateForGEDCOM(individual.birthDate)}\n`;
        if (individual.birthPlace) {
          gedcom += `2 PLAC ${individual.birthPlace}\n`;
        }
      }

      if (individual.deathDate) {
        gedcom += `1 DEAT\n2 DATE ${formatDateForGEDCOM(individual.deathDate)}\n`;
        if (individual.deathPlace) {
          gedcom += `2 PLAC ${individual.deathPlace}\n`;
        }
      }

      if (individual.notes) {
        gedcom += `1 NOTE ${individual.notes}\n`;
      }

      gedcom += '\n';
    }

    // Export marriages
    for (const marriage of allMarriages) {
      gedcom += `0 @F${marriage.id}@ FAM\n`;
      gedcom += `1 HUSB @I${marriage.spouse1Id}@\n`;
      gedcom += `1 WIFE @I${marriage.spouse2Id}@\n`;

      if (marriage.marriageDate) {
        gedcom += `1 MARR\n2 DATE ${formatDateForGEDCOM(marriage.marriageDate)}\n`;
        if (marriage.marriagePlace) {
          gedcom += `2 PLAC ${marriage.marriagePlace}\n`;
        }
      }

      if (marriage.divorceDate) {
        gedcom += `1 DIV\n2 DATE ${formatDateForGEDCOM(marriage.divorceDate)}\n`;
        if (marriage.divorcePlace) {
          gedcom += `2 PLAC ${marriage.divorcePlace}\n`;
        }
      }

      // Add children
      const children = allRelationships.filter(rel => rel.parentId === marriage.spouse1Id || rel.parentId === marriage.spouse2Id);
      for (const child of children) {
        gedcom += `1 CHIL @I${child.childId}@\n`;
      }

      if (marriage.notes) {
        gedcom += `1 NOTE ${marriage.notes}\n`;
      }

      gedcom += '\n';
    }

    gedcom += '0 TRLR\n';
    return gedcom;
  } catch (error) {
    throw new Error(`GEDCOM export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Format date for GEDCOM (DD MMM YYYY format)
 */
const formatDateForGEDCOM = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = months[dateObj.getMonth()];
  const year = dateObj.getFullYear();
  return `${day} ${month} ${year}`;
};

// ============================================================================
// IMPORT UTILITIES
// ============================================================================

/**
 * Import family tree data from JSON format
 */
export const importFromJSON = async (jsonData: string): Promise<{ success: boolean; errors: string[]; imported: { individuals: number; marriages: number; relations: number } }> => {
  const errors: string[] = [];
  let importedIndividuals = 0;
  let importedMarriages = 0;
  let importedRelations = 0;

  try {
    const data = JSON.parse(jsonData);
    
    if (!data.data || !data.version) {
      throw new Error('Invalid JSON format: missing data or version');
    }

    // Import individuals first
    if (data.data.individuals) {
      for (const individual of data.data.individuals) {
        try {
          // Add individual using operations
          await db.insert(individuals).values({
            firstName: individual.firstName,
            lastName: individual.lastName,
            middleName: individual.middleName,
            gender: individual.gender,
            birthDate: individual.birthDate ? new Date(individual.birthDate) : null,
            birthPlace: individual.birthPlace,
            deathDate: individual.deathDate ? new Date(individual.deathDate) : null,
            deathPlace: individual.deathPlace,
            isLiving: individual.isLiving,
            photoUrl: individual.photoUrl,
            notes: individual.notes,
          });
          importedIndividuals++;
        } catch (error) {
          errors.push(`Individual ${individual.firstName} ${individual.lastName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    }

    // Import marriages
    if (data.data.marriages) {
      for (const marriage of data.data.marriages) {
        try {
          await db.insert(marriages).values({
            spouse1Id: marriage.spouse1Id,
            spouse2Id: marriage.spouse2Id,
            marriageDate: marriage.marriageDate ? new Date(marriage.marriageDate) : null,
            marriagePlace: marriage.marriagePlace,
            divorceDate: marriage.divorceDate ? new Date(marriage.divorceDate) : null,
            divorcePlace: marriage.divorcePlace,
            isActive: marriage.isActive,
            notes: marriage.notes,
          });
          importedMarriages++;
        } catch (error) {
          errors.push(`Marriage ${marriage.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    }

    // Import relationships
    if (data.data.relationships) {
      for (const relation of data.data.relationships) {
        try {
          await db.insert(relationships).values({
            childId: relation.childId,
            parentId: relation.parentId,
            relationshipType: relation.relationshipType,
            isPrimary: relation.isPrimary,
            notes: relation.notes,
          });
          importedRelations++;
        } catch (error) {
          errors.push(`Relationship ${relation.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    }

    return {
      success: errors.length === 0,
      errors,
      imported: {
        individuals: importedIndividuals,
        marriages: importedMarriages,
        relations: importedRelations,
      },
    };
  } catch (error) {
    return {
      success: false,
      errors: [error instanceof Error ? error.message : 'Unknown error'],
      imported: {
        individuals: importedIndividuals,
        marriages: importedMarriages,
        relations: importedRelations,
      },
    };
  }
};

/**
 * Import family tree data from GEDCOM format
 */
export const importFromGEDCOM = async (gedcomData: string): Promise<{ success: boolean; errors: string[]; imported: { individuals: number; marriages: number; relations: number } }> => {
  const errors: string[] = [];
  let importedIndividuals = 0;
  let importedMarriages = 0;
  let importedRelations = 0;

  try {
    const lines = gedcomData.split('\n');
    const gedcomIndividuals: any[] = [];
    const families: any[] = [];
    let currentRecord: any = null;
    let currentLevel = 0;

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine || trimmedLine === '0 TRLR') continue;

      const parts = trimmedLine.split(' ');
      const level = parseInt(parts[0]);
      const tag = parts[1];
      const value = parts.slice(2).join(' ');

      if (level === 0) {
        // New record
        if (tag.startsWith('@I')) {
          // Individual record
          currentRecord = { id: tag.slice(2, -1), type: 'individual', name: '', gender: 'unknown' };
          gedcomIndividuals.push(currentRecord);
        } else if (tag.startsWith('@F')) {
          // Family record
          currentRecord = { id: tag.slice(2, -1), type: 'family', husband: '', wife: '', children: [] };
          families.push(currentRecord);
        }
      } else if (currentRecord) {
        // Process record data
        if (currentRecord.type === 'individual') {
          if (tag === 'NAME') {
            currentRecord.name = value;
          } else if (tag === 'SEX') {
            currentRecord.gender = value.toLowerCase();
          } else if (tag === 'BIRT') {
            currentRecord.birthDate = '';
            currentRecord.birthPlace = '';
          } else if (tag === 'DEAT') {
            currentRecord.deathDate = '';
            currentRecord.deathPlace = '';
          } else if (tag === 'DATE' && level === 2) {
            if (currentRecord.birthDate === '') {
              currentRecord.birthDate = parseGEDCOMDate(value);
            } else if (currentRecord.deathDate === '') {
              currentRecord.deathDate = parseGEDCOMDate(value);
            }
          } else if (tag === 'PLAC' && level === 2) {
            if (currentRecord.birthPlace === '') {
              currentRecord.birthPlace = value;
            } else if (currentRecord.deathPlace === '') {
              currentRecord.deathPlace = value;
            }
          }
        } else if (currentRecord.type === 'family') {
          if (tag === 'HUSB') {
            currentRecord.husband = value.slice(2, -1);
          } else if (tag === 'WIFE') {
            currentRecord.wife = value.slice(2, -1);
          } else if (tag === 'CHIL') {
            currentRecord.children.push(value.slice(2, -1));
          } else if (tag === 'MARR') {
            currentRecord.marriageDate = '';
            currentRecord.marriagePlace = '';
          } else if (tag === 'DATE' && level === 2) {
            currentRecord.marriageDate = parseGEDCOMDate(value);
          } else if (tag === 'PLAC' && level === 2) {
            currentRecord.marriagePlace = value;
          }
        }
      }
    }

    // Import individuals
    for (const individual of gedcomIndividuals) {
      try {
        const nameParts = individual.name.split('/');
        const firstName = nameParts[0]?.trim() || '';
        const lastName = nameParts[1]?.trim() || '';

        if (firstName && lastName) {
          // Add individual using operations
          await db.insert(individuals).values({
            firstName,
            lastName,
            gender: individual.gender,
            birthDate: individual.birthDate ? new Date(individual.birthDate) : null,
            birthPlace: individual.birthPlace,
            deathDate: individual.deathDate ? new Date(individual.deathDate) : null,
            deathPlace: individual.deathPlace,
            isLiving: !individual.deathDate,
          });
          importedIndividuals++;
        }
      } catch (error) {
        errors.push(`Individual ${individual.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // Import families (marriages and parent-child relations)
    for (const family of families) {
      try {
        if (family.husband && family.wife) {
          // Add marriage
          await db.insert(marriages).values({
            spouse1Id: parseInt(family.husband),
            spouse2Id: parseInt(family.wife),
            marriageDate: family.marriageDate ? new Date(family.marriageDate) : null,
            marriagePlace: family.marriagePlace,
          });
          importedMarriages++;
        }

        // Add parent-child relations
        for (const childId of family.children) {
          try {
            if (family.husband) {
              await db.insert(relationships).values({
                childId: parseInt(childId),
                parentId: parseInt(family.husband),
                relationshipType: 'biological',
                isPrimary: true,
              });
              importedRelations++;
            }

            if (family.wife) {
              await db.insert(relationships).values({
                childId: parseInt(childId),
                parentId: parseInt(family.wife),
                relationshipType: 'biological',
                isPrimary: true,
              });
              importedRelations++;
            }
          } catch (error) {
            errors.push(`Parent-child relation for child ${childId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        }
      } catch (error) {
        errors.push(`Family ${family.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return {
      success: errors.length === 0,
      errors,
      imported: {
        individuals: importedIndividuals,
        marriages: importedMarriages,
        relations: importedRelations,
      },
    };
  } catch (error) {
    return {
      success: false,
      errors: [error instanceof Error ? error.message : 'Unknown error'],
      imported: {
        individuals: importedIndividuals,
        marriages: importedMarriages,
        relations: importedRelations,
      },
    };
  }
};

/**
 * Parse GEDCOM date format (DD MMM YYYY) to ISO format
 */
const parseGEDCOMDate = (dateString: string): string => {
  const months: { [key: string]: string } = {
    'JAN': '01', 'FEB': '02', 'MAR': '03', 'APR': '04', 'MAY': '05', 'JUN': '06',
    'JUL': '07', 'AUG': '08', 'SEP': '09', 'OCT': '10', 'NOV': '11', 'DEC': '12'
  };

  const parts = dateString.split(' ');
  if (parts.length >= 3) {
    const day = parts[0].padStart(2, '0');
    const month = months[parts[1]] || '01';
    const year = parts[2];
    return `${year}-${month}-${day}`;
  }

  return dateString; // Return as-is if can't parse
};

// ============================================================================
// BACKUP & RESTORE
// ============================================================================

/**
 * Create a backup of the database
 */
export const createBackup = async (): Promise<string> => {
  try {
    const jsonData = await exportToJSON();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupData = {
      backupDate: timestamp,
      version: '1.0',
      data: JSON.parse(jsonData),
    };

    return JSON.stringify(backupData, null, 2);
  } catch (error) {
    throw new Error(`Backup failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Restore from backup
 */
export const restoreFromBackup = async (backupData: string): Promise<{ success: boolean; errors: string[] }> => {
  try {
    const backup = JSON.parse(backupData);
    
    if (!backup.data || !backup.backupDate) {
      throw new Error('Invalid backup format');
    }

    // Clear existing data (this would need to be implemented carefully)
    // await clearAllData();

    // Import the backup data
    const result = await importFromJSON(JSON.stringify(backup.data));
    
    return {
      success: result.success,
      errors: result.errors,
    };
  } catch (error) {
    return {
      success: false,
      errors: [error instanceof Error ? error.message : 'Unknown error'],
    };
  }
}; 