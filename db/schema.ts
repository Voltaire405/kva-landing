import { sql } from 'drizzle-orm';
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const services = sqliteTable(
  'services',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    icon: text('icon').notNull(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    sortOrder: integer('sort_order').notNull().default(0),
    createdAt: text('created_at')
      .default(sql`(datetime('now'))`)
      .notNull(),
    updatedAt: text('updated_at')
      .default(sql`(datetime('now'))`)
      .notNull(),
  },
  (table) => ({
    sortOrderIdx: index('idx_services_sort_order').on(table.sortOrder),
  })
);

export const portfolioItems = sqliteTable(
  'portfolio_items',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    imageUrl: text('image_url').notNull(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    sortOrder: integer('sort_order').notNull().default(0),
    createdAt: text('created_at')
      .default(sql`(datetime('now'))`)
      .notNull(),
    updatedAt: text('updated_at')
      .default(sql`(datetime('now'))`)
      .notNull(),
  },
  (table) => ({
    sortOrderIdx: index('idx_portfolio_items_sort_order').on(table.sortOrder),
  })
);

export const clients = sqliteTable(
  'clients',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    sortOrder: integer('sort_order').notNull().default(0),
    createdAt: text('created_at')
      .default(sql`(datetime('now'))`)
      .notNull(),
    updatedAt: text('updated_at')
      .default(sql`(datetime('now'))`)
      .notNull(),
  },
  (table) => ({
    sortOrderIdx: index('idx_clients_sort_order').on(table.sortOrder),
  })
);

export const testimonials = sqliteTable(
  'testimonials',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    quote: text('quote').notNull(),
    authorName: text('author_name').notNull(),
    authorRole: text('author_role').notNull(),
    sortOrder: integer('sort_order').notNull().default(0),
    createdAt: text('created_at')
      .default(sql`(datetime('now'))`)
      .notNull(),
    updatedAt: text('updated_at')
      .default(sql`(datetime('now'))`)
      .notNull(),
  },
  (table) => ({
    sortOrderIdx: index('idx_testimonials_sort_order').on(table.sortOrder),
  })
);

export const contactInfo = sqliteTable('contact_info', {
  id: integer('id').primaryKey(),
  phone: text('phone').notNull(),
  email: text('email').notNull(),
  address: text('address').notNull(),
  updatedAt: text('updated_at')
    .default(sql`(datetime('now'))`)
    .notNull(),
});

export const adminSettings = sqliteTable('admin_settings', {
  id: integer('id').primaryKey(),
  accessCodeHash: text('access_code_hash').notNull(),
  sessionSecret: text('session_secret').notNull(),
  updatedAt: text('updated_at')
    .default(sql`(datetime('now'))`)
    .notNull(),
});

export const contactMessages = sqliteTable(
  'contact_messages',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    email: text('email').notNull(),
    phone: text('phone'),
    message: text('message').notNull(),
    createdAt: text('created_at')
      .default(sql`(datetime('now'))`)
      .notNull(),
  },
  (table) => ({
    createdAtIdx: index('idx_contact_messages_created_at').on(table.createdAt),
  })
);

export type Service = typeof services.$inferSelect;
export type NewService = typeof services.$inferInsert;
export type PortfolioItem = typeof portfolioItems.$inferSelect;
export type NewPortfolioItem = typeof portfolioItems.$inferInsert;
export type Client = typeof clients.$inferSelect;
export type NewClient = typeof clients.$inferInsert;
export type Testimonial = typeof testimonials.$inferSelect;
export type NewTestimonial = typeof testimonials.$inferInsert;
export type ContactInfo = typeof contactInfo.$inferSelect;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type NewContactMessage = typeof contactMessages.$inferInsert;
export type AdminSettings = typeof adminSettings.$inferSelect;
