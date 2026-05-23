import { config } from 'dotenv';

config({ path: '.env.local' });
config();

import { count } from 'drizzle-orm';

import { db } from './index';
import {
  clients,
  contactInfo,
  portfolioItems,
  services,
  testimonials,
} from './schema';
import {
  defaultClients,
  defaultContactInfo,
  defaultPortfolioItems,
  defaultServices,
  defaultTestimonials,
} from '../lib/content-defaults';

async function seed() {
  const [servicesCount] = await db.select({ value: count() }).from(services);

  if (servicesCount.value > 0) {
    console.log('Database already seeded, skipping.');
    return;
  }

  await db.insert(services).values(defaultServices);
  await db.insert(portfolioItems).values(defaultPortfolioItems);
  await db.insert(clients).values(defaultClients);
  await db.insert(testimonials).values(defaultTestimonials);
  await db.insert(contactInfo).values(defaultContactInfo);

  console.log('Database seeded successfully.');
}

seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
