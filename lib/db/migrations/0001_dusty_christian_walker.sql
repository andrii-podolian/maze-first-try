DROP TABLE "quotes";--> statement-breakpoint
ALTER TABLE "authors" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "authors" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN "cover_image" text;--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN "updated_at" timestamp DEFAULT now();