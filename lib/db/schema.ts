import { pgTable, varchar, text, timestamp, boolean, integer, index, primaryKey, serial } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Individuals table
export const individuals = pgTable('individuals', {
  id: serial('id').primaryKey(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  middleName: varchar('middle_name', { length: 100 }),
  photoUrl: text('photo_url'),
  birthDate: timestamp('birth_date'),
  deathDate: timestamp('death_date'),
  birthPlace: varchar('birth_place', { length: 255 }),
  deathPlace: varchar('death_place', { length: 255 }),
  isLiving: boolean('is_living').notNull().default(true),
  gender: varchar('gender', { length: 20 }),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  address: text('address'),
  notes: text('notes'),
  privacyLevel: integer('privacy_level').notNull().default(1), // 1=public, 2=family, 3=private
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  nameIdx: index('name_idx').on(table.firstName, table.lastName),
  birthDateIdx: index('birth_date_idx').on(table.birthDate),
  isLivingIdx: index('is_living_idx').on(table.isLiving),
}));

// Marriages table
export const marriages = pgTable('marriages', {
  id: serial('id').primaryKey(),
  spouse1Id: integer('spouse1_id').notNull(),
  spouse2Id: integer('spouse2_id').notNull(),
  marriageDate: timestamp('marriage_date'),
  marriagePlace: varchar('marriage_place', { length: 255 }),
  divorceDate: timestamp('divorce_date'),
  divorcePlace: varchar('divorce_place', { length: 255 }),
  isActive: boolean('is_active').notNull().default(true),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  spouseIdx: index('spouse_idx').on(table.spouse1Id, table.spouse2Id),
  marriageDateIdx: index('marriage_date_idx').on(table.marriageDate),
}));

// Parent-child relationships table
export const relationships = pgTable('relationships', {
  id: serial('id').primaryKey(),
  parentId: integer('parent_id').notNull(),
  childId: integer('child_id').notNull(),
  relationshipType: varchar('relationship_type', { length: 50 }).notNull().default('biological'), // biological, adopted, step, foster
  isPrimary: boolean('is_primary').notNull().default(true), // for multiple parents
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  parentChildIdx: index('parent_child_idx').on(table.parentId, table.childId),
  childParentIdx: index('child_parent_idx').on(table.childId, table.parentId),
}));

// Events table
export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  individualId: integer('individual_id').notNull(),
  eventType: varchar('event_type', { length: 100 }).notNull(), // birth, death, marriage, graduation, etc.
  eventDate: timestamp('event_date'),
  eventPlace: varchar('event_place', { length: 255 }),
  description: text('description'),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  individualEventIdx: index('individual_event_idx').on(table.individualId, table.eventType),
  eventDateIdx: index('event_date_idx').on(table.eventDate),
}));

// Sources table
export const sources = pgTable('sources', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  author: varchar('author', { length: 255 }),
  publication: varchar('publication', { length: 255 }),
  publicationDate: timestamp('publication_date'),
  url: text('url'),
  notes: text('notes'),
  sourceType: varchar('source_type', { length: 100 }).notNull().default('document'), // document, photo, video, audio, website
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  titleIdx: index('title_idx').on(table.title),
  sourceTypeIdx: index('source_type_idx').on(table.sourceType),
}));

// Media table
export const media = pgTable('media', {
  id: serial('id').primaryKey(),
  individualId: integer('individual_id'),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  fileUrl: text('file_url').notNull(),
  fileType: varchar('file_type', { length: 50 }).notNull(), // image, video, audio, document
  fileSize: integer('file_size'),
  uploadDate: timestamp('upload_date').notNull().defaultNow(),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  individualMediaIdx: index('individual_media_idx').on(table.individualId),
  fileTypeIdx: index('file_type_idx').on(table.fileType),
}));

// Individual-Source linking table
export const individualSources = pgTable('individual_sources', {
  individualId: integer('individual_id').notNull(),
  sourceId: integer('source_id').notNull(),
  citation: text('citation'),
  pageNumber: varchar('page_number', { length: 50 }),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  pk: primaryKey(table.individualId, table.sourceId),
  individualIdx: index('individual_source_idx').on(table.individualId),
  sourceIdx: index('source_individual_idx').on(table.sourceId),
}));

// Individual-Media linking table
export const individualMedia = pgTable('individual_media', {
  individualId: integer('individual_id').notNull(),
  mediaId: integer('media_id').notNull(),
  relationship: varchar('relationship', { length: 100 }).notNull().default('subject'), // subject, related, mentioned
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  pk: primaryKey(table.individualId, table.mediaId),
  individualIdx: index('individual_media_link_idx').on(table.individualId),
  mediaIdx: index('media_individual_idx').on(table.mediaId),
}));

// Relations
export const individualsRelations = relations(individuals, ({ many }) => ({
  marriagesAsSpouse1: many(marriages, { relationName: 'spouse1' }),
  marriagesAsSpouse2: many(marriages, { relationName: 'spouse2' }),
  relationshipsAsParent: many(relationships, { relationName: 'parent' }),
  relationshipsAsChild: many(relationships, { relationName: 'child' }),
  events: many(events),
  media: many(media),
  individualSources: many(individualSources),
  individualMedia: many(individualMedia),
}));

export const marriagesRelations = relations(marriages, ({ one }) => ({
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
}));

export const relationshipsRelations = relations(relationships, ({ one }) => ({
  parent: one(individuals, {
    fields: [relationships.parentId],
    references: [individuals.id],
    relationName: 'parent',
  }),
  child: one(individuals, {
    fields: [relationships.childId],
    references: [individuals.id],
    relationName: 'child',
  }),
}));

export const eventsRelations = relations(events, ({ one }) => ({
  individual: one(individuals, {
    fields: [events.individualId],
    references: [individuals.id],
  }),
}));

export const mediaRelations = relations(media, ({ one, many }) => ({
  individual: one(individuals, {
    fields: [media.individualId],
    references: [individuals.id],
  }),
  individualMedia: many(individualMedia),
}));

export const sourcesRelations = relations(sources, ({ many }) => ({
  individualSources: many(individualSources),
}));

export const individualSourcesRelations = relations(individualSources, ({ one }) => ({
  individual: one(individuals, {
    fields: [individualSources.individualId],
    references: [individuals.id],
  }),
  source: one(sources, {
    fields: [individualSources.sourceId],
    references: [sources.id],
  }),
}));

export const individualMediaRelations = relations(individualMedia, ({ one }) => ({
  individual: one(individuals, {
    fields: [individualMedia.individualId],
    references: [individuals.id],
  }),
  media: one(media, {
    fields: [individualMedia.mediaId],
    references: [media.id],
  }),
})); 