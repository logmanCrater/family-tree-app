import { db } from './index';
import { 
  individuals, 
  marriages, 
  relationships, 
  events, 
  sources, 
  media,
  individualSources,
  individualMedia
} from './schema';
import { eq, and, or, like, desc, asc, count, sql } from 'drizzle-orm';
import { z } from 'zod';

// Validation schemas
const IndividualSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  middleName: z.string().max(100).optional(),
  photoUrl: z.string().url().optional(),
  birthDate: z.string().optional(),
  deathDate: z.string().optional(),
  birthPlace: z.string().max(255).optional(),
  deathPlace: z.string().max(255).optional(),
  isLiving: z.boolean().default(true),
  gender: z.string().max(20).optional(),
  email: z.string().email().optional(),
  phone: z.string().max(50).optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
  privacyLevel: z.number().min(1).max(3).default(1),
});

const MarriageSchema = z.object({
  spouse1Id: z.number().positive(),
  spouse2Id: z.number().positive(),
  marriageDate: z.string().optional(),
  marriagePlace: z.string().max(255).optional(),
  divorceDate: z.string().optional(),
  divorcePlace: z.string().max(255).optional(),
  isActive: z.boolean().default(true),
  notes: z.string().optional(),
});

const RelationshipSchema = z.object({
  parentId: z.number().positive(),
  childId: z.number().positive(),
  relationshipType: z.enum(['biological', 'adopted', 'step', 'foster']).default('biological'),
  isPrimary: z.boolean().default(true),
  notes: z.string().optional(),
});

// Core operations
export const addIndividual = async (data: z.infer<typeof IndividualSchema>) => {
  const validatedData = IndividualSchema.parse(data);
  
  // Convert date strings to Date objects
  const insertData = {
    ...validatedData,
    birthDate: validatedData.birthDate ? new Date(validatedData.birthDate) : null,
    deathDate: validatedData.deathDate ? new Date(validatedData.deathDate) : null,
  };

  const result = await db.insert(individuals).values(insertData);
  return result;
};

export const updateIndividual = async (id: number, data: Partial<z.infer<typeof IndividualSchema>>) => {
  const validatedData = IndividualSchema.partial().parse(data);
  
  // Convert date strings to Date objects
  const updateData = {
    ...validatedData,
    birthDate: validatedData.birthDate ? new Date(validatedData.birthDate) : undefined,
    deathDate: validatedData.deathDate ? new Date(validatedData.deathDate) : undefined,
    updatedAt: new Date(),
  };

  const result = await db.update(individuals)
    .set(updateData)
    .where(eq(individuals.id, id));
  
  return result;
};

export const deleteIndividual = async (id: number) => {
  // Delete related records first
  await db.delete(relationships).where(
    or(eq(relationships.parentId, id), eq(relationships.childId, id))
  );
  
  await db.delete(marriages).where(
    or(eq(marriages.spouse1Id, id), eq(marriages.spouse2Id, id))
  );
  
  await db.delete(events).where(eq(events.individualId, id));
  await db.delete(media).where(eq(media.individualId, id));
  await db.delete(individualSources).where(eq(individualSources.individualId, id));
  await db.delete(individualMedia).where(eq(individualMedia.individualId, id));
  
  // Delete the individual
  const result = await db.delete(individuals).where(eq(individuals.id, id));
  return result;
};

export const getIndividualProfile = async (id: number) => {
  const individual = await db.select().from(individuals).where(eq(individuals.id, id)).limit(1);
  
  if (individual.length === 0) {
    throw new Error('Individual not found');
  }

  // Get relationships
  const parentRelations = await db.select().from(relationships)
    .where(eq(relationships.childId, id));
  
  const childRelations = await db.select().from(relationships)
    .where(eq(relationships.parentId, id));

  // Get marriages
  const individualMarriages = await db.select().from(marriages)
    .where(or(eq(marriages.spouse1Id, id), eq(marriages.spouse2Id, id)));

  // Get events
  const individualEvents = await db.select().from(events)
    .where(eq(events.individualId, id))
    .orderBy(desc(events.eventDate));

  return {
    ...individual[0],
    parents: parentRelations,
    children: childRelations,
    marriages: individualMarriages,
    events: individualEvents,
  };
};

export const getFamilyTree = async () => {
  // Get all individuals with their relationships
  const allIndividuals = await db.select().from(individuals).orderBy(asc(individuals.lastName), asc(individuals.firstName));
  
  // Get all relationships
  const allRelationships = await db.select().from(relationships);
  
  // Build the tree structure
  const buildTree = (individuals: any[], relationships: any[]) => {
    const individualMap = new Map();
    const childrenMap = new Map();

    // Initialize maps
    individuals.forEach(ind => {
      individualMap.set(ind.id, { ...ind, children: [] });
      childrenMap.set(ind.id, []);
    });

    // Build parent-child relationships
    relationships.forEach(rel => {
      const parent = individualMap.get(rel.parentId);
      const child = individualMap.get(rel.childId);
      
      if (parent && child) {
        parent.children.push(child);
        childrenMap.get(rel.parentId).push(rel.childId);
      }
    });

    // Return root individuals (those without parents)
    const rootIds = new Set(individuals.map(ind => ind.id));
    relationships.forEach(rel => {
      rootIds.delete(rel.childId);
    });

    return Array.from(rootIds).map(id => individualMap.get(id));
  };

  return buildTree(allIndividuals, allRelationships);
};

export const searchIndividuals = async (searchTerm: string) => {
  const searchPattern = `%${searchTerm}%`;
  
  const results = await db.select().from(individuals)
    .where(
      or(
        like(individuals.firstName, searchPattern),
        like(individuals.lastName, searchPattern),
        like(individuals.middleName, searchPattern)
      )
    )
    .orderBy(asc(individuals.lastName), asc(individuals.firstName))
    .limit(50);

  return results;
};

export const getFamilyStats = async () => {
  const totalCount = await db.select({ count: count() }).from(individuals);
  const livingCount = await db.select({ count: count() }).from(individuals).where(eq(individuals.isLiving, true));
  const deceasedCount = await db.select({ count: count() }).from(individuals).where(eq(individuals.isLiving, false));
  
  return {
    total: totalCount[0].count,
    living: livingCount[0].count,
    deceased: deceasedCount[0].count,
  };
};

export const getAncestors = async (individualId: number, generations: number = 3) => {
  const ancestors = new Map();
  
  const getAncestorsRecursive = async (id: number, currentGen: number) => {
    if (currentGen >= generations) return;
    
    const parentRelations = await db.select().from(relationships)
      .where(eq(relationships.childId, id));
    
    for (const relation of parentRelations) {
      const parent = await db.select().from(individuals)
        .where(eq(individuals.id, relation.parentId))
        .limit(1);
      
      if (parent.length > 0) {
        ancestors.set(parent[0].id, { ...parent[0], generation: currentGen });
        await getAncestorsRecursive(parent[0].id, currentGen + 1);
      }
    }
  };
  
  await getAncestorsRecursive(individualId, 0);
  return Array.from(ancestors.values());
};

export const getDescendants = async (individualId: number, generations: number = 3) => {
  const descendants = new Map();
  
  const getDescendantsRecursive = async (id: number, currentGen: number) => {
    if (currentGen >= generations) return;
    
    const childRelations = await db.select().from(relationships)
      .where(eq(relationships.parentId, id));
    
    for (const relation of childRelations) {
      const child = await db.select().from(individuals)
        .where(eq(individuals.id, relation.childId))
        .limit(1);
      
      if (child.length > 0) {
        descendants.set(child[0].id, { ...child[0], generation: currentGen });
        await getDescendantsRecursive(child[0].id, currentGen + 1);
      }
    }
  };
  
  await getDescendantsRecursive(individualId, 0);
  return Array.from(descendants.values());
};

// Marriage operations
export const addMarriage = async (data: z.infer<typeof MarriageSchema>) => {
  const validatedData = MarriageSchema.parse(data);
  
  const insertData = {
    ...validatedData,
    marriageDate: validatedData.marriageDate ? new Date(validatedData.marriageDate) : null,
    divorceDate: validatedData.divorceDate ? new Date(validatedData.divorceDate) : null,
  };

  const result = await db.insert(marriages).values(insertData);
  return result;
};

export const updateMarriage = async (id: number, data: Partial<z.infer<typeof MarriageSchema>>) => {
  const validatedData = MarriageSchema.partial().parse(data);
  
  const updateData = {
    ...validatedData,
    marriageDate: validatedData.marriageDate ? new Date(validatedData.marriageDate) : undefined,
    divorceDate: validatedData.divorceDate ? new Date(validatedData.divorceDate) : undefined,
    updatedAt: new Date(),
  };

  const result = await db.update(marriages)
    .set(updateData)
    .where(eq(marriages.id, id));
  
  return result;
};

export const deleteMarriage = async (id: number) => {
  const result = await db.delete(marriages).where(eq(marriages.id, id));
  return result;
};

// Relationship operations
export const addRelationship = async (data: z.infer<typeof RelationshipSchema>) => {
  const validatedData = RelationshipSchema.parse(data);
  const result = await db.insert(relationships).values(validatedData);
  return result;
};

export const updateRelationship = async (id: number, data: Partial<z.infer<typeof RelationshipSchema>>) => {
  const validatedData = RelationshipSchema.partial().parse(data);
  const result = await db.update(relationships)
    .set(validatedData)
    .where(eq(relationships.id, id));
  return result;
};

export const deleteRelationship = async (id: number) => {
  const result = await db.delete(relationships).where(eq(relationships.id, id));
  return result;
};

// Event operations
export const addEvent = async (individualId: number, eventData: any) => {
  const result = await db.insert(events).values({
    individualId,
    eventType: eventData.eventType,
    eventDate: eventData.eventDate ? new Date(eventData.eventDate) : null,
    eventPlace: eventData.eventPlace,
    description: eventData.description,
    notes: eventData.notes,
  });
  return result;
};

export const updateEvent = async (id: number, eventData: any) => {
  const result = await db.update(events)
    .set({
      ...eventData,
      eventDate: eventData.eventDate ? new Date(eventData.eventDate) : undefined,
      updatedAt: new Date(),
    })
    .where(eq(events.id, id));
  return result;
};

export const deleteEvent = async (id: number) => {
  const result = await db.delete(events).where(eq(events.id, id));
  return result;
};

// Media operations
export const addMedia = async (mediaData: any) => {
  const result = await db.insert(media).values({
    ...mediaData,
    uploadDate: new Date(),
  });
  return result;
};

export const updateMedia = async (id: number, mediaData: any) => {
  const result = await db.update(media)
    .set({
      ...mediaData,
      updatedAt: new Date(),
    })
    .where(eq(media.id, id));
  return result;
};

export const deleteMedia = async (id: number) => {
  const result = await db.delete(media).where(eq(media.id, id));
  return result;
};

// Source operations
export const addSource = async (sourceData: any) => {
  const result = await db.insert(sources).values({
    ...sourceData,
    publicationDate: sourceData.publicationDate ? new Date(sourceData.publicationDate) : null,
  });
  return result;
};

export const updateSource = async (id: number, sourceData: any) => {
  const result = await db.update(sources)
    .set({
      ...sourceData,
      publicationDate: sourceData.publicationDate ? new Date(sourceData.publicationDate) : undefined,
      updatedAt: new Date(),
    })
    .where(eq(sources.id, id));
  return result;
};

export const deleteSource = async (id: number) => {
  const result = await db.delete(sources).where(eq(sources.id, id));
  return result;
}; 

export { addRelationship as addParentChildRelation }; 