import { sqliteTable, text, integer, real, blob } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm';

// Individuals table - core person data
export const individuals = sqliteTable('individuals', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  uuid: text('uuid').notNull().unique(), // For privacy and external references
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  middleName: text('middle_name'),
  maidenName: text('maiden_name'), // For women who changed their name after marriage
  gender: text('gender', { enum: ['male', 'female', 'other', 'unknown'] }).notNull(),
  birthDate: text('birth_date'), // ISO date string
  birthPlace: text('birth_place'),
  deathDate: text('death_date'), // ISO date string
  deathPlace: text('death_place'),
  isLiving: integer('is_living', { mode: 'boolean' }).notNull().default(true),
  isPrivate: integer('is_private', { mode: 'boolean' }).notNull().default(false),
  photoUrl: text('photo_url'),
  notes: text('notes'),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Marriages table - relationship between two individuals
export const marriages = sqliteTable('marriages', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  uuid: text('uuid').notNull().unique(),
  spouse1Id: integer('spouse1_id').notNull().references(() => individuals.id, { onDelete: 'cascade' }),
  spouse2Id: integer('spouse2_id').notNull().references(() => individuals.id, { onDelete: 'cascade' }),
  marriageDate: text('marriage_date'), // ISO date string
  marriagePlace: text('marriage_place'),
  divorceDate: text('divorce_date'), // ISO date string
  divorcePlace: text('divorce_place'),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  marriageType: text('marriage_type', { enum: ['civil', 'religious', 'traditional', 'other'] }).notNull().default('civil'),
  notes: text('notes'),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Parent-child relationships table
export const parentChildRelations = sqliteTable('parent_child_relations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  childId: integer('child_id').notNull().references(() => individuals.id, { onDelete: 'cascade' }),
  parentId: integer('parent_id').notNull().references(() => individuals.id, { onDelete: 'cascade' }),
  marriageId: integer('marriage_id').references(() => marriages.id, { onDelete: 'set null' }), // Optional, for children born outside marriage
  relationshipType: text('relationship_type', { enum: ['biological', 'adopted', 'step', 'foster', 'guardian'] }).notNull().default('biological'),
  isPrimaryParent: integer('is_primary_parent', { mode: 'boolean' }).notNull().default(true), // For cases with multiple parents
  notes: text('notes'),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Events table - for significant life events
export const events = sqliteTable('events', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  uuid: text('uuid').notNull().unique(),
  individualId: integer('individual_id').notNull().references(() => individuals.id, { onDelete: 'cascade' }),
  eventType: text('event_type', { 
    enum: ['birth', 'death', 'marriage', 'divorce', 'graduation', 'military_service', 'immigration', 'emigration', 'occupation_change', 'residence_change', 'other'] 
  }).notNull(),
  eventDate: text('event_date'), // ISO date string
  eventPlace: text('event_place'),
  description: text('description'),
  isPrivate: integer('is_private', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Sources table - for genealogical research sources
export const sources = sqliteTable('sources', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  uuid: text('uuid').notNull().unique(),
  title: text('title').notNull(),
  author: text('author'),
  publicationDate: text('publication_date'),
  sourceType: text('source_type', { 
    enum: ['birth_certificate', 'death_certificate', 'marriage_certificate', 'census', 'newspaper', 'book', 'website', 'oral_history', 'other'] 
  }).notNull(),
  url: text('url'),
  notes: text('notes'),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Source citations - linking sources to individuals/events
export const sourceCitations = sqliteTable('source_citations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  sourceId: integer('source_id').notNull().references(() => sources.id, { onDelete: 'cascade' }),
  individualId: integer('individual_id').references(() => individuals.id, { onDelete: 'cascade' }),
  eventId: integer('event_id').references(() => events.id, { onDelete: 'cascade' }),
  marriageId: integer('marriage_id').references(() => marriages.id, { onDelete: 'cascade' }),
  citationText: text('citation_text'),
  pageNumber: text('page_number'),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Media files table
export const media = sqliteTable('media', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  uuid: text('uuid').notNull().unique(),
  fileName: text('file_name').notNull(),
  filePath: text('file_path').notNull(),
  fileType: text('file_type').notNull(), // 'image', 'document', 'audio', 'video'
  fileSize: integer('file_size'),
  mimeType: text('mime_type'),
  description: text('description'),
  isPrivate: integer('is_private', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Media links - connecting media to individuals/events
export const mediaLinks = sqliteTable('media_links', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  mediaId: integer('media_id').notNull().references(() => media.id, { onDelete: 'cascade' }),
  individualId: integer('individual_id').references(() => individuals.id, { onDelete: 'cascade' }),
  eventId: integer('event_id').references(() => events.id, { onDelete: 'cascade' }),
  marriageId: integer('marriage_id').references(() => marriages.id, { onDelete: 'cascade' }),
  linkType: text('link_type', { enum: ['primary', 'secondary', 'documentation'] }).notNull().default('secondary'),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Define relationships
export const individualsRelations = relations(individuals, ({ many, one }) => ({
  // As a child
  parentRelations: many(parentChildRelations, { relationName: 'child' }),
  // As a parent
  childRelations: many(parentChildRelations, { relationName: 'parent' }),
  // As spouse1
  marriagesAsSpouse1: many(marriages, { relationName: 'spouse1' }),
  // As spouse2
  marriagesAsSpouse2: many(marriages, { relationName: 'spouse2' }),
  // Events
  events: many(events),
  // Source citations
  sourceCitations: many(sourceCitations),
  // Media links
  mediaLinks: many(mediaLinks),
}));

export const marriagesRelations = relations(marriages, ({ one, many }) => ({
  spouse1: one(individuals, {
    fields: [marriages.spouse1Id],
    references: [individuals.id],
    relationName: 'spouse1',
  }),
  spouse2: one(individuals, {
    fields: [marriages.spouse2Id],
    references: [individuals.id],
    relationName: 'spouse2',
  }),
  parentRelations: many(parentChildRelations),
  sourceCitations: many(sourceCitations),
  mediaLinks: many(mediaLinks),
}));

export const parentChildRelationsRelations = relations(parentChildRelations, ({ one }) => ({
  child: one(individuals, {
    fields: [parentChildRelations.childId],
    references: [individuals.id],
    relationName: 'child',
  }),
  parent: one(individuals, {
    fields: [parentChildRelations.parentId],
    references: [individuals.id],
    relationName: 'parent',
  }),
  marriage: one(marriages, {
    fields: [parentChildRelations.marriageId],
    references: [marriages.id],
  }),
}));

export const eventsRelations = relations(events, ({ one, many }) => ({
  individual: one(individuals, {
    fields: [events.individualId],
    references: [individuals.id],
  }),
  sourceCitations: many(sourceCitations),
  mediaLinks: many(mediaLinks),
}));

export const sourcesRelations = relations(sources, ({ many }) => ({
  citations: many(sourceCitations),
}));

export const mediaRelations = relations(media, ({ many }) => ({
  links: many(mediaLinks),
}));

// Type definitions for TypeScript
export type Individual = typeof individuals.$inferSelect;
export type NewIndividual = typeof individuals.$inferInsert;
export type Marriage = typeof marriages.$inferSelect;
export type NewMarriage = typeof marriages.$inferInsert;
export type ParentChildRelation = typeof parentChildRelations.$inferSelect;
export type NewParentChildRelation = typeof parentChildRelations.$inferInsert;
export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
export type Source = typeof sources.$inferSelect;
export type NewSource = typeof sources.$inferInsert;
export type Media = typeof media.$inferSelect;
export type NewMedia = typeof media.$inferInsert; 