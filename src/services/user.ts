import api from '@/lib/api';
import type { User, UserAddress, NotificationPreferences } from '@/types/user';

export const userService = {
  // Profile
  getProfile: () =>
    api.get<{ data: User }>('/users/me').then(r => r.data.data),

  updateProfile: (updates: {
    fullName?: string;
    phone?: string;
    bio?: string;
    language?: 'vi' | 'en';
  }) =>
    api.patch<{ data: User }>('/users/me', updates).then(r => r.data.data),

  // Onboarding
  updatePreferences: (prefs: {
    stylePrefs?: string[];
    budgetMin?: number;
    budgetMax?: number;
    preferredSizes?: string[];
    gender?: 'MALE' | 'FEMALE' | 'UNISEX' | 'OTHER';
  }) =>
    api.put<{ data: User }>('/users/me/preferences', prefs).then(r => r.data.data),

  // Notifications
  getNotificationPrefs: () =>
    api.get<{ data: NotificationPreferences }>('/users/me/notification-preferences')
      .then(r => r.data.data),

  updateNotificationPrefs: async (changes: Partial<NotificationPreferences>) => {
    // Workaround: merge ở FE để tránh bug ghi đè
    const current = await userService.getNotificationPrefs();
    const merged = { ...current, ...changes };
    return api.patch<{ data: NotificationPreferences }>(
      '/users/me/notification-preferences', merged
    ).then(r => r.data.data);
  },

  // Addresses
  getAddresses: () =>
    api.get<{ data: UserAddress[] }>('/users/me/addresses').then(r => r.data.data),

  createAddress: (address: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    district?: string;
    city: string;
    province: string;
    postalCode?: string;
    isDefault?: boolean;
  }) =>
    api.post<{ data: UserAddress }>('/users/me/addresses', address).then(r => r.data.data),

  updateAddress: (id: string, updates: Partial<Omit<UserAddress, 'id' | 'createdAt' | 'updatedAt'>>) =>
    api.patch<{ data: UserAddress }>(`/users/me/addresses/${id}`, updates).then(r => r.data.data),

  deleteAddress: (id: string) =>
    api.delete(`/users/me/addresses/${id}`),

  setDefaultAddress: (id: string) =>
    api.patch<{ data: UserAddress }>(`/users/me/addresses/${id}/default`).then(r => r.data.data),

  // Account
  invalidateSessions: () =>
    api.put('/users/me/password'),

  deleteAccount: () =>
    api.delete('/users/me'),
};
