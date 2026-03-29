# Users API Integration Guide

Tài liệu hướng dẫn Frontend kết nối các API quản lý user của WearWhere.

**Base URL:** `http://localhost:3001/api/v1`
**Authentication:** Tất cả endpoints yêu cầu JWT cookie (`ww_token`). Xem [api-integration-auth.md](./api-integration-auth.md).

---

## Tổng quan

Sau khi login thành công, FE cần xử lý theo flow:

```
Login → Check onboardingDone
  ├── false → PUT /users/me/preferences (onboarding screen)
  └── true  → GET /users/me (load profile, vào app)
```

---

## Endpoints

### 1. GET /users/me

Lấy thông tin profile user hiện tại.

**Request:**

```http
GET /api/v1/users/me
Cookie: ww_token=<jwt>
```

**Response `200 OK`:**

```jsonc
{
  "data": {
    "id": "uuid",
    "firebaseUid": "abc123",
    "email": "user@email.com",
    "fullName": "Nguyen Van A",       // null nếu chưa cập nhật
    "phone": "0901234567",            // null nếu chưa cập nhật
    "avatarUrl": null,                // URL avatar
    "bio": null,
    "role": "CUSTOMER",               // CUSTOMER | ADMIN | BRAND
    "brandId": null,                  // UUID nếu role = BRAND
    "language": "vi",                 // "vi" | "en"
    "isVerified": true,
    "stylePrefs": ["casual"],         // mảng string
    "budgetMin": 200000,              // VND, null nếu chưa set
    "budgetMax": 1500000,
    "preferredSizes": ["M", "L"],
    "gender": "MALE",                 // MALE | FEMALE | UNISEX | OTHER | null
    "onboardingDone": true,
    "lastLoginAt": "2026-03-29T...",
    "notificationPreferences": {
      "orders": true,
      "promotions": true,
      "social": true,
      "push": true
    },
    "bannedAt": null,
    "banReason": null,
    "deletedAt": null,
    "createdAt": "2026-03-29T...",
    "updatedAt": "2026-03-29T..."
  }
}
```

**Errors:**

| Status | Message | Nguyên nhân |
|--------|---------|-------------|
| 401 | `Unauthorized` | Không có token |
| 401 | `Token has been revoked` | Token đã bị logout |

**Ví dụ FE:**

```typescript
const { data } = await api.get('/users/me');
const user = data.data;

if (!user.onboardingDone) {
  router.push('/onboarding');
} else {
  setUser(user);
}
```

---

### 2. PATCH /users/me

Cập nhật thông tin profile. Chỉ gửi các field cần thay đổi.

**Request:**

```http
PATCH /api/v1/users/me
Content-Type: application/json
Cookie: ww_token=<jwt>

{
  "fullName": "Nguyen Van B",
  "phone": "0907654321",
  "bio": "Yêu thời trang Việt",
  "language": "en"
}
```

**Các field được phép:**

| Field | Type | Validation |
|-------|------|------------|
| `fullName` | string | max 255 ký tự |
| `phone` | string | max 20 ký tự |
| `bio` | string | không giới hạn |
| `language` | string | chỉ `"vi"` hoặc `"en"` |

Gửi field ngoài danh sách trên (ví dụ `role`, `email`) sẽ bị reject 422.

**Response `200 OK`:** Trả về full user object đã cập nhật (cùng format với GET /users/me).

**Errors:**

| Status | Message | Nguyên nhân |
|--------|---------|-------------|
| 422 | `property role should not exist` | Gửi field không được phép |
| 422 | `phone must be a string` | Sai kiểu dữ liệu |

**Ví dụ FE:**

```typescript
async function updateProfile(updates: {
  fullName?: string;
  phone?: string;
  bio?: string;
  language?: 'vi' | 'en';
}) {
  const { data } = await api.patch('/users/me', updates);
  return data.data;
}
```

---

### 3. PUT /users/me/preferences

Cập nhật sở thích thời trang. Tự động đánh dấu `onboardingDone = true`. Dùng cho màn hình onboarding.

**Request:**

```http
PUT /api/v1/users/me/preferences
Content-Type: application/json
Cookie: ww_token=<jwt>

{
  "stylePrefs": ["casual", "streetwear", "minimalist"],
  "budgetMin": 200000,
  "budgetMax": 1500000,
  "preferredSizes": ["M", "L"],
  "gender": "MALE"
}
```

**Các field:**

| Field | Type | Validation |
|-------|------|------------|
| `stylePrefs` | string[] | mảng chuỗi |
| `budgetMin` | number | >= 0 (VND) |
| `budgetMax` | number | >= 0 (VND) |
| `preferredSizes` | string[] | mảng chuỗi, ví dụ: `["S","M","L","XL"]` |
| `gender` | string | `MALE` \| `FEMALE` \| `UNISEX` \| `OTHER` |

Tất cả field đều optional. Gọi endpoint này sẽ **luôn** set `onboardingDone = true`.

**Response `200 OK`:** Full user object đã cập nhật.

**Errors:**

| Status | Message | Nguyên nhân |
|--------|---------|-------------|
| 422 | `gender must be one of...` | Giá trị gender không hợp lệ |
| 422 | `budgetMin must not be less than 0` | Số âm |

**Ví dụ FE (màn hình onboarding):**

```typescript
async function completeOnboarding(prefs: {
  stylePrefs: string[];
  budgetMin: number;
  budgetMax: number;
  preferredSizes: string[];
  gender: 'MALE' | 'FEMALE' | 'UNISEX' | 'OTHER';
}) {
  const { data } = await api.put('/users/me/preferences', prefs);
  // data.data.onboardingDone === true
  router.push('/');
  return data.data;
}
```

---

### 4. GET /users/me/notification-preferences

Lấy cài đặt thông báo.

**Request:**

```http
GET /api/v1/users/me/notification-preferences
Cookie: ww_token=<jwt>
```

**Response `200 OK`:**

```json
{
  "data": {
    "orders": true,
    "promotions": true,
    "social": true,
    "push": true
  }
}
```

---

### 5. PATCH /users/me/notification-preferences

Cập nhật cài đặt thông báo. Chỉ gửi các field cần thay đổi.

**Request:**

```http
PATCH /api/v1/users/me/notification-preferences
Content-Type: application/json
Cookie: ww_token=<jwt>

{
  "promotions": false,
  "push": false
}
```

**Các field:**

| Field | Type | Mô tả |
|-------|------|-------|
| `orders` | boolean | Thông báo đơn hàng |
| `promotions` | boolean | Thông báo khuyến mãi |
| `social` | boolean | Thông báo tương tác (review reply...) |
| `push` | boolean | Push notification tổng |

**Response `200 OK`:** Object notification preferences đã cập nhật.

> **Lưu ý (known bug):** Hiện tại endpoint này có thể ghi đè toàn bộ preferences thay vì merge. FE nên gửi đầy đủ cả 4 field để đảm bảo dữ liệu chính xác cho đến khi bug được fix.

**Ví dụ FE (workaround):**

```typescript
async function updateNotificationPrefs(changes: Partial<NotificationPreferences>) {
  // Workaround: lấy current prefs rồi merge ở FE trước khi gửi
  const { data: current } = await api.get('/users/me/notification-preferences');
  const merged = { ...current.data, ...changes };
  const { data } = await api.patch('/users/me/notification-preferences', merged);
  return data.data;
}
```

---

## Địa chỉ giao hàng (Addresses)

### 6. GET /users/me/addresses

Lấy danh sách địa chỉ. Sắp xếp: địa chỉ mặc định lên đầu, sau đó theo thời gian tạo mới nhất.

**Request:**

```http
GET /api/v1/users/me/addresses
Cookie: ww_token=<jwt>
```

**Response `200 OK`:**

```jsonc
{
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "fullName": "Nguyen Van A",
      "phone": "0901234567",
      "addressLine1": "123 Le Loi",
      "addressLine2": null,           // optional
      "district": "Quan 1",           // optional
      "city": "Ho Chi Minh",
      "province": "Ho Chi Minh",
      "postalCode": "70000",          // optional
      "isDefault": true,
      "createdAt": "2026-03-29T...",
      "updatedAt": "2026-03-29T..."
    }
  ]
}
```

Trả mảng rỗng `[]` nếu chưa có địa chỉ.

---

### 7. POST /users/me/addresses

Tạo địa chỉ mới.

**Request:**

```http
POST /api/v1/users/me/addresses
Content-Type: application/json
Cookie: ww_token=<jwt>

{
  "fullName": "Nguyen Van A",
  "phone": "0901234567",
  "addressLine1": "123 Le Loi, Phuong Ben Nghe",
  "addressLine2": "Tầng 3",
  "district": "Quan 1",
  "city": "Ho Chi Minh",
  "province": "Ho Chi Minh",
  "postalCode": "70000",
  "isDefault": true
}
```

**Các field:**

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `fullName` | string | **yes** | max 255 |
| `phone` | string | **yes** | max 20 |
| `addressLine1` | string | **yes** | max 255 |
| `addressLine2` | string | no | max 255 |
| `district` | string | no | max 100 |
| `city` | string | **yes** | max 100 |
| `province` | string | **yes** | max 100 |
| `postalCode` | string | no | max 10 |
| `isDefault` | boolean | no | default false |

Nếu `isDefault: true`, các địa chỉ khác sẽ tự động chuyển thành `isDefault: false`.

**Response `201 Created`:** Address object vừa tạo.

**Errors:**

| Status | Message | Nguyên nhân |
|--------|---------|-------------|
| 422 | `phone should not be empty` | Thiếu field bắt buộc |
| 422 | `city must be a string` | Sai kiểu dữ liệu |

**Ví dụ FE:**

```typescript
interface CreateAddressPayload {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  district?: string;
  city: string;
  province: string;
  postalCode?: string;
  isDefault?: boolean;
}

async function createAddress(address: CreateAddressPayload) {
  const { data } = await api.post('/users/me/addresses', address);
  return data.data;
}
```

---

### 8. PATCH /users/me/addresses/:id

Cập nhật địa chỉ. Chỉ gửi field cần thay đổi. Chỉ có thể sửa địa chỉ của chính mình.

**Request:**

```http
PATCH /api/v1/users/me/addresses/:id
Content-Type: application/json
Cookie: ww_token=<jwt>

{
  "district": "Cau Giay",
  "postalCode": "10000"
}
```

Các field giống POST, tất cả đều optional.

Nếu gửi `"isDefault": true`, các địa chỉ khác tự động chuyển thành false.

**Response `200 OK`:** Address object đã cập nhật.

**Errors:**

| Status | Message | Nguyên nhân |
|--------|---------|-------------|
| 404 | `Resource not found` | Address không tồn tại hoặc không thuộc user |

---

### 9. DELETE /users/me/addresses/:id

Xóa địa chỉ. Chỉ có thể xóa địa chỉ của chính mình.

**Request:**

```http
DELETE /api/v1/users/me/addresses/:id
Cookie: ww_token=<jwt>
```

**Response `204 No Content`:** Không có body.

**Errors:**

| Status | Message | Nguyên nhân |
|--------|---------|-------------|
| 404 | `Resource not found` | Address không tồn tại hoặc không thuộc user |

> **Lưu ý:** Nếu xóa địa chỉ mặc định, không có địa chỉ nào được tự động promote thành default. FE nên nhắc user chọn default mới.

---

### 10. PATCH /users/me/addresses/:id/default

Đặt địa chỉ làm mặc định. Địa chỉ default cũ sẽ tự động bỏ.

**Request:**

```http
PATCH /api/v1/users/me/addresses/:id/default
Cookie: ww_token=<jwt>
```

Không cần body.

**Response `200 OK`:** Address object đã set default.

**Errors:**

| Status | Message | Nguyên nhân |
|--------|---------|-------------|
| 404 | `Resource not found` | Address không tồn tại hoặc không thuộc user |

**Ví dụ FE:**

```typescript
async function setDefaultAddress(addressId: string) {
  const { data } = await api.patch(`/users/me/addresses/${addressId}/default`);
  return data.data;
}
```

---

## Tài khoản

### 11. PUT /users/me/password

Invalidate tất cả sessions khác (dùng khi đổi mật khẩu trên Firebase).

**Request:**

```http
PUT /api/v1/users/me/password
Cookie: ww_token=<jwt>
```

Không cần body.

**Response `200 OK`:**

```json
{
  "data": {
    "message": "All other sessions invalidated"
  }
}
```

**Flow đổi mật khẩu hoàn chỉnh:**

```typescript
import { getAuth, updatePassword } from 'firebase/auth';

async function changePassword(newPassword: string) {
  // Bước 1: Đổi password trên Firebase
  const auth = getAuth();
  await updatePassword(auth.currentUser!, newPassword);

  // Bước 2: Invalidate sessions cũ trên backend
  await api.put('/users/me/password');
}
```

---

### 12. DELETE /users/me

Xóa tài khoản (soft delete). User bị đánh dấu `deletedAt`, tất cả sessions bị invalidate.

**Request:**

```http
DELETE /api/v1/users/me
Cookie: ww_token=<jwt>
```

**Response `204 No Content`:** Không có body.

**Ví dụ FE:**

```typescript
async function deleteAccount() {
  if (!confirm('Bạn chắc chắn muốn xóa tài khoản?')) return;
  await api.delete('/users/me');
  // Xóa local state, redirect login
  clearUserState();
  window.location.href = '/login';
}
```

---

## TypeScript Interfaces

```typescript
// types/user.ts

type UserRole = 'CUSTOMER' | 'ADMIN' | 'BRAND';
type Gender = 'MALE' | 'FEMALE' | 'UNISEX' | 'OTHER';

interface User {
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

interface NotificationPreferences {
  orders: boolean;
  promotions: boolean;
  social: boolean;
  push: boolean;
}

interface UserAddress {
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
```

---

## API Service (tham khảo)

```typescript
// services/userService.ts
import api from './api';
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

  createAddress: (address: Omit<UserAddress, 'id' | 'createdAt' | 'updatedAt'>) =>
    api.post<{ data: UserAddress }>('/users/me/addresses', address).then(r => r.data.data),

  updateAddress: (id: string, updates: Partial<UserAddress>) =>
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
```

---

## Checklist tích hợp

- [ ] Sau login, check `onboardingDone` → redirect onboarding nếu `false`
- [ ] Implement màn hình onboarding (PUT /users/me/preferences)
- [ ] Implement trang profile (GET + PATCH /users/me)
- [ ] Implement quản lý địa chỉ (CRUD + set default)
- [ ] Implement trang cài đặt thông báo (GET + PATCH notification-preferences)
- [ ] Workaround notification prefs: gửi đầy đủ 4 fields khi update
- [ ] Implement flow xóa tài khoản với confirm dialog
- [ ] Xử lý user bị ban (`bannedAt !== null` → hiển thị thông báo, chặn truy cập)