CREATE TABLE `events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uuid` text NOT NULL,
	`individual_id` integer NOT NULL,
	`event_type` text NOT NULL,
	`event_date` text,
	`event_place` text,
	`description` text,
	`is_private` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`individual_id`) REFERENCES `individuals`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `events_uuid_unique` ON `events` (`uuid`);--> statement-breakpoint
CREATE TABLE `individuals` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uuid` text NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`middle_name` text,
	`maiden_name` text,
	`gender` text NOT NULL,
	`birth_date` text,
	`birth_place` text,
	`death_date` text,
	`death_place` text,
	`is_living` integer DEFAULT true NOT NULL,
	`is_private` integer DEFAULT false NOT NULL,
	`photo_url` text,
	`notes` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `individuals_uuid_unique` ON `individuals` (`uuid`);--> statement-breakpoint
CREATE TABLE `marriages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uuid` text NOT NULL,
	`spouse1_id` integer NOT NULL,
	`spouse2_id` integer NOT NULL,
	`marriage_date` text,
	`marriage_place` text,
	`divorce_date` text,
	`divorce_place` text,
	`is_active` integer DEFAULT true NOT NULL,
	`marriage_type` text DEFAULT 'civil' NOT NULL,
	`notes` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`spouse1_id`) REFERENCES `individuals`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`spouse2_id`) REFERENCES `individuals`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `marriages_uuid_unique` ON `marriages` (`uuid`);--> statement-breakpoint
CREATE TABLE `media` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uuid` text NOT NULL,
	`file_name` text NOT NULL,
	`file_path` text NOT NULL,
	`file_type` text NOT NULL,
	`file_size` integer,
	`mime_type` text,
	`description` text,
	`is_private` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `media_uuid_unique` ON `media` (`uuid`);--> statement-breakpoint
CREATE TABLE `media_links` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`media_id` integer NOT NULL,
	`individual_id` integer,
	`event_id` integer,
	`marriage_id` integer,
	`link_type` text DEFAULT 'secondary' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`media_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`individual_id`) REFERENCES `individuals`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`marriage_id`) REFERENCES `marriages`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `parent_child_relations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`child_id` integer NOT NULL,
	`parent_id` integer NOT NULL,
	`marriage_id` integer,
	`relationship_type` text DEFAULT 'biological' NOT NULL,
	`is_primary_parent` integer DEFAULT true NOT NULL,
	`notes` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`child_id`) REFERENCES `individuals`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`parent_id`) REFERENCES `individuals`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`marriage_id`) REFERENCES `marriages`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `source_citations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`source_id` integer NOT NULL,
	`individual_id` integer,
	`event_id` integer,
	`marriage_id` integer,
	`citation_text` text,
	`page_number` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`source_id`) REFERENCES `sources`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`individual_id`) REFERENCES `individuals`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`marriage_id`) REFERENCES `marriages`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `sources` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uuid` text NOT NULL,
	`title` text NOT NULL,
	`author` text,
	`publication_date` text,
	`source_type` text NOT NULL,
	`url` text,
	`notes` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sources_uuid_unique` ON `sources` (`uuid`);