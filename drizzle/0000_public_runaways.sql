CREATE TABLE "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"individual_id" integer NOT NULL,
	"event_type" varchar(100) NOT NULL,
	"event_date" timestamp,
	"event_place" varchar(255),
	"description" text,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "individual_media" (
	"individual_id" integer NOT NULL,
	"media_id" integer NOT NULL,
	"relationship" varchar(100) DEFAULT 'subject' NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "individual_media_individual_id_media_id_pk" PRIMARY KEY("individual_id","media_id")
);
--> statement-breakpoint
CREATE TABLE "individual_sources" (
	"individual_id" integer NOT NULL,
	"source_id" integer NOT NULL,
	"citation" text,
	"page_number" varchar(50),
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "individual_sources_individual_id_source_id_pk" PRIMARY KEY("individual_id","source_id")
);
--> statement-breakpoint
CREATE TABLE "individuals" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"middle_name" varchar(100),
	"photo_url" text,
	"birth_date" timestamp,
	"death_date" timestamp,
	"birth_place" varchar(255),
	"death_place" varchar(255),
	"is_living" boolean DEFAULT true NOT NULL,
	"gender" varchar(20),
	"email" varchar(255),
	"phone" varchar(50),
	"address" text,
	"notes" text,
	"privacy_level" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "marriages" (
	"id" serial PRIMARY KEY NOT NULL,
	"spouse1_id" integer NOT NULL,
	"spouse2_id" integer NOT NULL,
	"marriage_date" timestamp,
	"marriage_place" varchar(255),
	"divorce_date" timestamp,
	"divorce_place" varchar(255),
	"is_active" boolean DEFAULT true NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media" (
	"id" serial PRIMARY KEY NOT NULL,
	"individual_id" integer,
	"title" varchar(255) NOT NULL,
	"description" text,
	"file_url" text NOT NULL,
	"file_type" varchar(50) NOT NULL,
	"file_size" integer,
	"upload_date" timestamp DEFAULT now() NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "relationships" (
	"id" serial PRIMARY KEY NOT NULL,
	"parent_id" integer NOT NULL,
	"child_id" integer NOT NULL,
	"relationship_type" varchar(50) DEFAULT 'biological' NOT NULL,
	"is_primary" boolean DEFAULT true NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sources" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"author" varchar(255),
	"publication" varchar(255),
	"publication_date" timestamp,
	"url" text,
	"notes" text,
	"source_type" varchar(100) DEFAULT 'document' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "individual_event_idx" ON "events" USING btree ("individual_id","event_type");--> statement-breakpoint
CREATE INDEX "event_date_idx" ON "events" USING btree ("event_date");--> statement-breakpoint
CREATE INDEX "individual_media_link_idx" ON "individual_media" USING btree ("individual_id");--> statement-breakpoint
CREATE INDEX "media_individual_idx" ON "individual_media" USING btree ("media_id");--> statement-breakpoint
CREATE INDEX "individual_source_idx" ON "individual_sources" USING btree ("individual_id");--> statement-breakpoint
CREATE INDEX "source_individual_idx" ON "individual_sources" USING btree ("source_id");--> statement-breakpoint
CREATE INDEX "name_idx" ON "individuals" USING btree ("first_name","last_name");--> statement-breakpoint
CREATE INDEX "birth_date_idx" ON "individuals" USING btree ("birth_date");--> statement-breakpoint
CREATE INDEX "is_living_idx" ON "individuals" USING btree ("is_living");--> statement-breakpoint
CREATE INDEX "spouse_idx" ON "marriages" USING btree ("spouse1_id","spouse2_id");--> statement-breakpoint
CREATE INDEX "marriage_date_idx" ON "marriages" USING btree ("marriage_date");--> statement-breakpoint
CREATE INDEX "individual_media_idx" ON "media" USING btree ("individual_id");--> statement-breakpoint
CREATE INDEX "file_type_idx" ON "media" USING btree ("file_type");--> statement-breakpoint
CREATE INDEX "parent_child_idx" ON "relationships" USING btree ("parent_id","child_id");--> statement-breakpoint
CREATE INDEX "child_parent_idx" ON "relationships" USING btree ("child_id","parent_id");--> statement-breakpoint
CREATE INDEX "title_idx" ON "sources" USING btree ("title");--> statement-breakpoint
CREATE INDEX "source_type_idx" ON "sources" USING btree ("source_type");