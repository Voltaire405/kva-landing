import { asc, desc, eq } from 'drizzle-orm';

import { db } from '@/db';
import {
  clients,
  contactInfo,
  contactMessages,
  portfolioItems,
  services,
  testimonials,
  type Client,
  type ContactInfo,
  type NewContactMessage,
  type NewClient,
  type NewPortfolioItem,
  type NewService,
  type NewTestimonial,
  type PortfolioItem,
  type Service,
  type Testimonial,
} from '@/db/schema';
import {
  defaultClients,
  defaultContactInfo,
  defaultPortfolioItems,
  defaultServices,
  defaultTestimonials,
} from '@/lib/content-defaults';

export type LandingContent = {
  services: Service[];
  portfolioItems: PortfolioItem[];
  clients: Client[];
  testimonials: Testimonial[];
  contactInfo: ContactInfo;
};

async function fetchLandingContent(): Promise<LandingContent> {
  const [servicesData, portfolioData, clientsData, testimonialsData, contactData] =
    await Promise.all([
      db.select().from(services).orderBy(asc(services.sortOrder)),
      db.select().from(portfolioItems).orderBy(asc(portfolioItems.sortOrder)),
      db.select().from(clients).orderBy(asc(clients.sortOrder)),
      db.select().from(testimonials).orderBy(asc(testimonials.sortOrder)),
      db.select().from(contactInfo).where(eq(contactInfo.id, 1)).limit(1),
    ]);

  return {
    services: servicesData,
    portfolioItems: portfolioData,
    clients: clientsData,
    testimonials: testimonialsData,
    contactInfo: contactData[0] ?? defaultContactInfo,
  };
}

export async function getLandingContent(): Promise<LandingContent> {
  try {
    const content = await fetchLandingContent();

    return {
      services: content.services.length > 0 ? content.services : defaultServices.map((item, index) => ({
        id: index + 1,
        ...item,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })),
      portfolioItems:
        content.portfolioItems.length > 0
          ? content.portfolioItems
          : defaultPortfolioItems.map((item, index) => ({
              id: index + 1,
              ...item,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            })),
      clients:
        content.clients.length > 0
          ? content.clients
          : defaultClients.map((item, index) => ({
              id: index + 1,
              ...item,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            })),
      testimonials:
        content.testimonials.length > 0
          ? content.testimonials
          : defaultTestimonials.map((item, index) => ({
              id: index + 1,
              ...item,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            })),
      contactInfo: content.contactInfo,
    };
  } catch {
    return {
      services: defaultServices.map((item, index) => ({
        id: index + 1,
        ...item,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })),
      portfolioItems: defaultPortfolioItems.map((item, index) => ({
        id: index + 1,
        ...item,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })),
      clients: defaultClients.map((item, index) => ({
        id: index + 1,
        ...item,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })),
      testimonials: defaultTestimonials.map((item, index) => ({
        id: index + 1,
        ...item,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })),
      contactInfo: defaultContactInfo,
    };
  }
}

export async function listServices() {
  return db.select().from(services).orderBy(asc(services.sortOrder));
}

export async function createService(data: Omit<NewService, 'id' | 'createdAt' | 'updatedAt'>) {
  const [created] = await db.insert(services).values(data).returning();
  return created;
}

export async function updateService(
  id: number,
  data: Partial<Omit<NewService, 'id' | 'createdAt'>>
) {
  const [updated] = await db
    .update(services)
    .set({ ...data, updatedAt: new Date().toISOString() })
    .where(eq(services.id, id))
    .returning();
  return updated;
}

export async function deleteService(id: number) {
  await db.delete(services).where(eq(services.id, id));
}

export async function listPortfolioItems() {
  return db.select().from(portfolioItems).orderBy(asc(portfolioItems.sortOrder));
}

export async function createPortfolioItem(
  data: Omit<NewPortfolioItem, 'id' | 'createdAt' | 'updatedAt'>
) {
  const [created] = await db.insert(portfolioItems).values(data).returning();
  return created;
}

export async function updatePortfolioItem(
  id: number,
  data: Partial<Omit<NewPortfolioItem, 'id' | 'createdAt'>>
) {
  const [updated] = await db
    .update(portfolioItems)
    .set({ ...data, updatedAt: new Date().toISOString() })
    .where(eq(portfolioItems.id, id))
    .returning();
  return updated;
}

export async function deletePortfolioItem(id: number) {
  await db.delete(portfolioItems).where(eq(portfolioItems.id, id));
}

export async function listClients() {
  return db.select().from(clients).orderBy(asc(clients.sortOrder));
}

export async function createClient(data: Omit<NewClient, 'id' | 'createdAt' | 'updatedAt'>) {
  const [created] = await db.insert(clients).values(data).returning();
  return created;
}

export async function updateClient(id: number, data: Partial<Omit<NewClient, 'id' | 'createdAt'>>) {
  const [updated] = await db
    .update(clients)
    .set({ ...data, updatedAt: new Date().toISOString() })
    .where(eq(clients.id, id))
    .returning();
  return updated;
}

export async function deleteClient(id: number) {
  await db.delete(clients).where(eq(clients.id, id));
}

export async function listTestimonials() {
  return db.select().from(testimonials).orderBy(asc(testimonials.sortOrder));
}

export async function createTestimonial(
  data: Omit<NewTestimonial, 'id' | 'createdAt' | 'updatedAt'>
) {
  const [created] = await db.insert(testimonials).values(data).returning();
  return created;
}

export async function updateTestimonial(
  id: number,
  data: Partial<Omit<NewTestimonial, 'id' | 'createdAt'>>
) {
  const [updated] = await db
    .update(testimonials)
    .set({ ...data, updatedAt: new Date().toISOString() })
    .where(eq(testimonials.id, id))
    .returning();
  return updated;
}

export async function deleteTestimonial(id: number) {
  await db.delete(testimonials).where(eq(testimonials.id, id));
}

export async function getContactInfo() {
  const [info] = await db.select().from(contactInfo).where(eq(contactInfo.id, 1)).limit(1);
  return info ?? defaultContactInfo;
}

export async function updateContactInfo(data: {
  phone: string;
  email: string;
  address: string;
}) {
  const existing = await getContactInfo();

  if (existing.id) {
    const [updated] = await db
      .update(contactInfo)
      .set({ ...data, updatedAt: new Date().toISOString() })
      .where(eq(contactInfo.id, 1))
      .returning();
    return updated;
  }

  const [created] = await db
    .insert(contactInfo)
    .values({ id: 1, ...data })
    .returning();
  return created;
}

export async function getNextSortOrder(table: 'services' | 'portfolio' | 'clients' | 'testimonials') {
  const tableMap = {
    services,
    portfolio: portfolioItems,
    clients,
    testimonials,
  } as const;

  const rows = await db
    .select()
    .from(tableMap[table])
    .orderBy(asc(tableMap[table].sortOrder));

  return rows.length;
}

export async function createContactMessage(
  data: Omit<NewContactMessage, 'id' | 'createdAt'>
) {
  const [created] = await db.insert(contactMessages).values(data).returning();
  return created;
}

export async function listContactMessages() {
  return db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
}

export async function deleteContactMessage(id: number) {
  await db.delete(contactMessages).where(eq(contactMessages.id, id));
}
