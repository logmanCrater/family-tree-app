import { eq, and, or, desc, asc, isNull, isNotNull, sql, notInArray, inArray, like } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { db } from './index';
import { 
  individuals, 
  marriages, 
  parentChildRelations, 
  events, 
  sources, 
  media,
  mediaLinks,
  sourceCitations,
  type Individual,
  type NewIndividual,
  type Marriage,
  type NewMarriage,
  type ParentChildRelation,
  type NewParentChildRelation,
  type Event,
  type NewEvent
} from './schema';

// Utility function to generate UUIDs (using uuid package)
const generateUuid = () => uuidv4();

// ============================================================================
// INDIVIDUAL OPERATIONS
// ============================================================================

/**
 * Add a new individual to the family tree
 */
export const addIndividual = async (data: Omit<NewIndividual, 'id' | 'uuid' | 'createdAt' | 'updatedAt'>): Promise<Individual> => {
  const newIndividual: NewIndividual = {
    ...data,
    uuid: generateUuid(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const result = await db.insert(individuals).values(newIndividual).returning();
  return result[0];
};

/**
 * Get an individual by ID with all related data
 */
export const getIndividualWithRelations = async (id: number): Promise<Individual | null> => {
  const result = await db.select().from(individuals).where(eq(individuals.id, id)).limit(1);
  return result[0] || null;
};

/**
 * Get an individual's full profile including parents, spouses, and children
 */
export const getIndividualProfile = async (id: number) => {
  // Get the individual
  const individual = await getIndividualWithRelations(id);
  if (!individual) return null;

  // Get parents
  const parents = await db
    .select({
      id: individuals.id,
      firstName: individuals.firstName,
      lastName: individuals.lastName,
      gender: individuals.gender,
      relationshipType: parentChildRelations.relationshipType,
    })
    .from(parentChildRelations)
    .innerJoin(individuals, eq(parentChildRelations.parentId, individuals.id))
    .where(eq(parentChildRelations.childId, id));

  // Get children
  const children = await db
    .select({
      id: individuals.id,
      firstName: individuals.firstName,
      lastName: individuals.lastName,
      gender: individuals.gender,
      relationshipType: parentChildRelations.relationshipType,
    })
    .from(parentChildRelations)
    .innerJoin(individuals, eq(parentChildRelations.childId, individuals.id))
    .where(eq(parentChildRelations.parentId, id));

  // Get marriages (as spouse1)
  const marriagesAsSpouse1 = await db
    .select({
      id: marriages.id,
      spouse: individuals,
      marriageDate: marriages.marriageDate,
      marriagePlace: marriages.marriagePlace,
      isActive: marriages.isActive,
    })
    .from(marriages)
    .innerJoin(individuals, eq(marriages.spouse2Id, individuals.id))
    .where(eq(marriages.spouse1Id, id));

  // Get marriages (as spouse2)
  const marriagesAsSpouse2 = await db
    .select({
      id: marriages.id,
      spouse: individuals,
      marriageDate: marriages.marriageDate,
      marriagePlace: marriages.marriagePlace,
      isActive: marriages.isActive,
    })
    .from(marriages)
    .innerJoin(individuals, eq(marriages.spouse1Id, individuals.id))
    .where(eq(marriages.spouse2Id, id));

  // Get individual events
  const individualEvents = await db
    .select()
    .from(events)
    .where(eq(events.individualId, id))
    .orderBy(asc(events.eventDate));

  return {
    individual,
    parents,
    children,
    marriages: [...marriagesAsSpouse1, ...marriagesAsSpouse2],
    events: individualEvents,
  };
};

/**
 * Update an individual's information
 */
export const updateIndividual = async (id: number, data: Partial<Omit<NewIndividual, 'id' | 'uuid' | 'createdAt'>>): Promise<Individual | null> => {
  const updateData = {
    ...data,
    updatedAt: new Date().toISOString(),
  };

  const result = await db
    .update(individuals)
    .set(updateData)
    .where(eq(individuals.id, id))
    .returning();

  return result[0] || null;
};

/**
 * Delete an individual (with cascading deletes handled by foreign keys)
 */
export const deleteIndividual = async (id: number): Promise<boolean> => {
  try {
    await db.delete(individuals).where(eq(individuals.id, id));
    return true;
  } catch (error) {
    console.error('Error deleting individual:', error);
    return false;
  }
};

/**
 * Search individuals by name
 */
export const searchIndividuals = async (searchTerm: string, limit: number = 20): Promise<Individual[]> => {
  const searchPattern = `%${searchTerm.toLowerCase()}%`;
  
  return await db
    .select()
    .from(individuals)
    .where(
      or(
        like(sql`lower(${individuals.firstName})`, searchPattern),
        like(sql`lower(${individuals.lastName})`, searchPattern),
        like(sql`lower(${individuals.middleName})`, searchPattern)
      )
    )
    .limit(limit)
    .orderBy(asc(individuals.lastName), asc(individuals.firstName));
};

// ============================================================================
// MARRIAGE OPERATIONS
// ============================================================================

/**
 * Add a new marriage between two individuals
 */
export const addMarriage = async (data: Omit<NewMarriage, 'id' | 'uuid' | 'createdAt' | 'updatedAt'>): Promise<Marriage> => {
  const newMarriage: NewMarriage = {
    ...data,
    uuid: generateUuid(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const result = await db.insert(marriages).values(newMarriage).returning();
  return result[0];
};

/**
 * Get all marriages for an individual
 */
export const getIndividualMarriages = async (individualId: number): Promise<Marriage[]> => {
  return await db
    .select()
    .from(marriages)
    .where(
      or(
        eq(marriages.spouse1Id, individualId),
        eq(marriages.spouse2Id, individualId)
      )
    )
    .orderBy(desc(marriages.marriageDate));
};

/**
 * Update marriage information
 */
export const updateMarriage = async (id: number, data: Partial<Omit<NewMarriage, 'id' | 'uuid' | 'createdAt'>>): Promise<Marriage | null> => {
  const updateData = {
    ...data,
    updatedAt: new Date().toISOString(),
  };

  const result = await db
    .update(marriages)
    .set(updateData)
    .where(eq(marriages.id, id))
    .returning();

  return result[0] || null;
};

// ============================================================================
// PARENT-CHILD RELATIONSHIP OPERATIONS
// ============================================================================

/**
 * Connect a child to their parent(s)
 */
export const addParentChildRelation = async (data: Omit<NewParentChildRelation, 'id' | 'createdAt'>): Promise<ParentChildRelation> => {
  const newRelation: NewParentChildRelation = {
    ...data,
    createdAt: new Date().toISOString(),
  };

  const result = await db.insert(parentChildRelations).values(newRelation).returning();
  return result[0];
};

/**
 * Get all children of a parent
 */
export const getChildren = async (parentId: number): Promise<Partial<Individual>[]> => {
  return await db
    .select({
      id: individuals.id,
      firstName: individuals.firstName,
      lastName: individuals.lastName,
      gender: individuals.gender,
      birthDate: individuals.birthDate,
      isLiving: individuals.isLiving,
    })
    .from(parentChildRelations)
    .innerJoin(individuals, eq(parentChildRelations.childId, individuals.id))
    .where(eq(parentChildRelations.parentId, parentId))
    .orderBy(asc(individuals.birthDate));
};

/**
 * Get all parents of a child
 */
export const getParents = async (childId: number): Promise<Partial<Individual>[]> => {
  return await db
    .select({
      id: individuals.id,
      firstName: individuals.firstName,
      lastName: individuals.lastName,
      gender: individuals.gender,
      birthDate: individuals.birthDate,
      isLiving: individuals.isLiving,
    })
    .from(parentChildRelations)
    .innerJoin(individuals, eq(parentChildRelations.parentId, individuals.id))
    .where(eq(parentChildRelations.childId, childId))
    .orderBy(asc(individuals.birthDate));
};

// ============================================================================
// EVENT OPERATIONS
// ============================================================================

/**
 * Add a new event for an individual
 */
export const addEvent = async (data: Omit<NewEvent, 'id' | 'uuid' | 'createdAt'>): Promise<Event> => {
  const newEvent: NewEvent = {
    ...data,
    uuid: generateUuid(),
    createdAt: new Date().toISOString(),
  };

  const result = await db.insert(events).values(newEvent).returning();
  return result[0];
};

/**
 * Get all events for an individual
 */
export const getIndividualEvents = async (individualId: number): Promise<Event[]> => {
  return await db
    .select()
    .from(events)
    .where(eq(events.individualId, individualId))
    .orderBy(asc(events.eventDate));
};

// ============================================================================
// FAMILY TREE QUERIES
// ============================================================================

/**
 * Get the complete family tree starting from root individuals
 */
export const getFamilyTree = async () => {
  // Get all root individuals (those without parents)
  const rootIndividuals = await db
    .select()
    .from(individuals)
    .where(
      notInArray(
        individuals.id,
        db.select({ id: parentChildRelations.childId }).from(parentChildRelations)
      )
    )
    .orderBy(asc(individuals.lastName), asc(individuals.firstName));

  return rootIndividuals;
};

/**
 * Get ancestors of an individual (parents, grandparents, etc.)
 */
export const getAncestors = async (individualId: number, maxGenerations: number = 3): Promise<Individual[]> => {
  const ancestors: Individual[] = [];
  let currentIds = [individualId];

  for (let generation = 0; generation < maxGenerations && currentIds.length > 0; generation++) {
    const parentIds = await db
      .select({ parentId: parentChildRelations.parentId })
      .from(parentChildRelations)
      .where(inArray(parentChildRelations.childId, currentIds));

    if (parentIds.length === 0) break;

    const parents = await db
      .select()
      .from(individuals)
      .where(inArray(individuals.id, parentIds.map(p => p.parentId)));

    ancestors.push(...parents);
    currentIds = parents.map(p => p.id);
  }

  return ancestors;
};

/**
 * Get descendants of an individual (children, grandchildren, etc.)
 */
export const getDescendants = async (individualId: number, maxGenerations: number = 3): Promise<Individual[]> => {
  const descendants: Individual[] = [];
  let currentIds = [individualId];

  for (let generation = 0; generation < maxGenerations && currentIds.length > 0; generation++) {
    const childIds = await db
      .select({ childId: parentChildRelations.childId })
      .from(parentChildRelations)
      .where(inArray(parentChildRelations.parentId, currentIds));

    if (childIds.length === 0) break;

    const children = await db
      .select()
      .from(individuals)
      .where(inArray(individuals.id, childIds.map(c => c.childId)));

    descendants.push(...children);
    currentIds = children.map(c => c.id);
  }

  return descendants;
};

// ============================================================================
// DATA VALIDATION & UTILITIES
// ============================================================================

/**
 * Validate that a child's birth date is after their parent's birth date
 */
export const validateBirthDate = async (childId: number, birthDate: string): Promise<boolean> => {
  const parents = await getParents(childId);
  
  for (const parent of parents) {
    if (parent.birthDate && new Date(birthDate) <= new Date(parent.birthDate)) {
      return false;
    }
  }
  
  return true;
};

/**
 * Get family statistics
 */
export const getFamilyStats = async () => {
  const totalIndividuals = await db.select({ count: sql`count(*)` }).from(individuals);
  const livingIndividuals = await db.select({ count: sql`count(*)` }).from(individuals).where(eq(individuals.isLiving, true));
  const totalMarriages = await db.select({ count: sql`count(*)` }).from(marriages);
  const totalEvents = await db.select({ count: sql`count(*)` }).from(events);

  return {
    totalIndividuals: totalIndividuals[0].count,
    livingIndividuals: livingIndividuals[0].count,
    totalMarriages: totalMarriages[0].count,
    totalEvents: totalEvents[0].count,
  };
};

// ============================================================================
// PRIVACY & SECURITY
// ============================================================================

/**
 * Get public individuals (non-private and deceased)
 */
export const getPublicIndividuals = async (): Promise<Individual[]> => {
  return await db
    .select()
    .from(individuals)
    .where(
      and(
        eq(individuals.isPrivate, false),
        or(
          eq(individuals.isLiving, false),
          isNull(individuals.isLiving)
        )
      )
    )
    .orderBy(asc(individuals.lastName), asc(individuals.firstName));
};

/**
 * Get private individuals (for admin access)
 */
export const getPrivateIndividuals = async (): Promise<Individual[]> => {
  return await db
    .select()
    .from(individuals)
    .where(eq(individuals.isPrivate, true))
    .orderBy(asc(individuals.lastName), asc(individuals.firstName));
}; 