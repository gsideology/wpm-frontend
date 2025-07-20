CREATE TABLE "organizations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"stripe_customer_id" text
);
--> statement-breakpoint
CREATE TABLE "sales_forecasts" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"forecasted_sales" integer NOT NULL,
	"forecast_date" timestamp DEFAULT now(),
	"organization_id" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sales_forecasts" ADD CONSTRAINT "sales_forecasts_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;