// storage.postgres.ts will be generated here. Replace MemStorage with PostgreSQL storage.

import { db } from "./db";
import {
  users,
  serviceCategories,
  providers,
  providerCategories,
  bookings,
  reviews,
} from "@shared/schema";
import { eq, and } from "drizzle-orm";
import type {
  User,
  InsertUser,
  ServiceCategory,
  InsertServiceCategory,
  Provider,
  InsertProvider,
  ProviderCategory,
  InsertProviderCategory,
  Booking,
  InsertBooking,
  Review,
  InsertReview,
} from "@shared/schema";
import { IStorage } from "./storage";

export class PostgresStorage implements IStorage {
  // USER METHODS
  async getUser(id: string) {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByEmail(email: string) {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async createUser(data: InsertUser) {
    const result = await db.insert(users).values(data).returning();
    return result[0];
  }

  async updateUser(id: string, updates: Partial<User>) {
    const result = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return result[0];
  }

  // SERVICE CATEGORIES
  async getServiceCategories() {
    return await db.select().from(serviceCategories);
  }

  async createServiceCategory(data: InsertServiceCategory) {
    const result = await db.insert(serviceCategories).values(data).returning();
    return result[0];
  }

  // PROVIDER
  async getProvider(id: string) {
    const result = await db.select().from(providers).where(eq(providers.id, id));
    return result[0];
  }

  async getProviderByUserId(userId: string) {
    const result = await db.select().from(providers).where(eq(providers.userId, userId));
    return result[0];
  }

  async getProviders(filters?: { categoryId?: string; location?: string; isApproved?: boolean }) {
    let results = await db.select().from(providers);

    return results.filter(p => {
      if (filters?.isApproved !== undefined && p.isApproved !== filters.isApproved) return false;
      if (filters?.location && !p.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
      if (filters?.categoryId && !p.categories?.includes(filters.categoryId)) return false;
      return true;
    });
  }

  async createProvider(data: InsertProvider) {
    const result = await db.insert(providers).values(data).returning();
    return result[0];
  }

  async updateProvider(id: string, updates: Partial<Provider>) {
    const result = await db.update(providers).set(updates).where(eq(providers.id, id)).returning();
    return result[0];
  }

  // PROVIDER CATEGORY
  async getProviderCategories(providerId: string) {
    return await db.select().from(providerCategories).where(eq(providerCategories.providerId, providerId));
  }

  async createProviderCategory(data: InsertProviderCategory) {
    const result = await db.insert(providerCategories).values(data).returning();
    return result[0];
  }

  // BOOKINGS
  async getBooking(id: string) {
    const result = await db.select().from(bookings).where(eq(bookings.id, id));
    return result[0];
  }

  async getBookings(filters?: { customerId?: string; providerId?: string; status?: string }) {
    let results = await db.select().from(bookings);

    if (filters?.customerId) results = results.filter(b => b.customerId === filters.customerId);
    if (filters?.providerId) results = results.filter(b => b.providerId === filters.providerId);
    if (filters?.status) results = results.filter(b => b.status === filters.status);

    return results;
  }

  async createBooking(data: InsertBooking) {
    const result = await db.insert(bookings).values(data).returning();
    return result[0];
  }

  async updateBooking(id: string, updates: Partial<Booking>) {
    const result = await db.update(bookings).set(updates).where(eq(bookings.id, id)).returning();
    return result[0];
  }

  // REVIEWS
  async getReviews(providerId: string) {
    return await db
      .select()
      .from(reviews)
      .where(and(eq(reviews.providerId, providerId), eq(reviews.isVisible, true)));
  }

  async createReview(data: InsertReview) {
    const result = await db.insert(reviews).values(data).returning();
    return result[0];
  }

  async updateReview(id: string, updates: Partial<Review>) {
    const result = await db.update(reviews).set(updates).where(eq(reviews.id, id)).returning();
    return result[0];
  }

  async deleteReview(id: string) {
    const result = await db.delete(reviews).where(eq(reviews.id, id));
    return result.rowCount > 0;
  }
}

export const storage = new PostgresStorage();