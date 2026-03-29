export type UserRole = 'CUSTOMER' | 'ADMIN' | 'BRAND';
export type Gender = 'MALE' | 'FEMALE' | 'UNISEX' | 'OTHER';

export interface User {
  id: string;
  email: string;
  fullName: string | null;
  phone: string | null;
  avatarUrl: string | null;
  bio: string | null;
  role: UserRole;
  brandId: string | null;
  language: 'vi' | 'en';
  isVerified: boolean;
  stylePrefs: string[];
  budgetMin: number | null;
  budgetMax: number | null;
  preferredSizes: string[];
  gender: Gender | null;
  onboardingDone: boolean;
  lastLoginAt: string | null;
  notificationPreferences: NotificationPreferences;
  bannedAt: string | null;
  banReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationPreferences {
  orders: boolean;
  promotions: boolean;
  social: boolean;
  push: boolean;
}

export interface UserAddress {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string | null;
  district: string | null;
  city: string;
  province: string;
  postalCode: string | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}
