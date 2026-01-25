# WearWhere API Documentation

**Version:** 1.0.0
**Base URL:** `https://api.wearwhere.com/v1`

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Users](#users)
4. [Products](#products)
5. [Categories](#categories)
6. [Cart](#cart)
7. [Vouchers](#vouchers)
8. [Orders](#orders)
9. [Payments](#payments)
10. [Delivery Tracking](#delivery-tracking)
11. [News (Seller Promotions)](#news-seller-promotions)
12. [Posts (Social Reviews)](#posts-social-reviews)
13. [Map & Nearby Shops](#map--nearby-shops)
14. [Chatbot (Fashion Assistant)](#chatbot-fashion-assistant)
15. [Smart Wardrobe (Tủ Đồ Thông Minh)](#smart-wardrobe-tủ-đồ-thông-minh)
16. [Error Handling](#error-handling)

---

## Overview

WearWhere is an e-commerce platform for clothing where users can browse, purchase, and share outfit posts. This API follows RESTful conventions and uses JSON for request/response bodies.

### Common Headers

| Header | Description | Required |
|--------|-------------|----------|
| `Authorization` | Bearer token for authenticated requests | Yes (for protected endpoints) |
| `Content-Type` | `application/json` | Yes (for POST/PUT/PATCH) |
| `Accept` | `application/json` | Recommended |

### Pagination

All list endpoints support pagination:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number |
| `limit` | integer | 20 | Items per page (max: 100) |

Response includes pagination metadata:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

---

## Authentication

### Register

Create a new user account.

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}
```

**Response:** `201 Created`
```json
{
  "message": "Registration successful",
  "user": {
    "id": "usr_abc123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

### Login

Authenticate user and get access token.

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:** `200 OK`
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "expiresIn": 3600,
  "user": {
    "id": "usr_abc123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

---

### Refresh Token

Get new access token using refresh token.

**Endpoint:** `POST /auth/refresh`

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response:** `200 OK`
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "expiresIn": 3600
}
```

---

### Logout

Invalidate user tokens.

**Endpoint:** `POST /auth/logout`

**Headers:** `Authorization: Bearer <accessToken>`

**Response:** `200 OK`
```json
{
  "message": "Logged out successfully"
}
```

---

## Users

### Get Current User Profile

**Endpoint:** `GET /users/me`

**Headers:** `Authorization: Bearer <accessToken>`

**Response:** `200 OK`
```json
{
  "id": "usr_abc123",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "username": "johndoe",
  "bio": "Fashion enthusiast 👗",
  "followersCount": 150,
  "followingCount": 89,
  "postsCount": 24,
  "addresses": [
    {
      "id": "addr_xyz789",
      "label": "Home",
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "US",
      "isDefault": true
    }
  ],
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-20T14:45:00Z"
}
```

---

### Update User Profile

**Endpoint:** `PATCH /users/me`

**Headers:** `Authorization: Bearer <accessToken>`

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "phone": "+1987654321",
  "username": "johnsmith",
  "bio": "Style is a way to say who you are ✨"
}
```

**Response:** `200 OK`
```json
{
  "id": "usr_abc123",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Smith",
  "phone": "+1987654321",
  "username": "johnsmith",
  "bio": "Style is a way to say who you are ✨",
  "updatedAt": "2024-01-25T09:15:00Z"
}
```

---

### Get User Profile

**Endpoint:** `GET /users/:userId`

**Response:** `200 OK`
```json
{
  "id": "usr_abc123",
  "firstName": "John",
  "lastName": "Doe",
  "username": "johndoe",
  "bio": "Fashion enthusiast 👗",
  "followersCount": 150,
  "followingCount": 89,
  "postsCount": 24,
  "isFollowing": false,
  "createdAt": "2024-01-15T10:30:00Z"
}
```

---

### Follow/Unfollow User

**Endpoint:** `POST /users/:userId/follow`

**Headers:** `Authorization: Bearer <accessToken>`

**Request Body:**
```json
{
  "follow": true
}
```

**Response:** `200 OK`
```json
{
  "isFollowing": true,
  "followersCount": 151
}
```

---

### Get User Followers

**Endpoint:** `GET /users/:userId/followers`

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "usr_xyz789",
      "firstName": "Jane",
      "lastName": "Smith",
      "username": "janesmith",
      "isFollowing": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

---

### Get User Following

**Endpoint:** `GET /users/:userId/following`

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "usr_def456",
      "firstName": "Mike",
      "lastName": "Johnson",
      "username": "mikej",
      "isFollowing": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 89,
    "totalPages": 5
  }
}
```

---

### Add Address

**Endpoint:** `POST /users/me/addresses`

**Headers:** `Authorization: Bearer <accessToken>`

**Request Body:**
```json
{
  "label": "Office",
  "street": "456 Business Ave",
  "city": "Los Angeles",
  "state": "CA",
  "zipCode": "90001",
  "country": "US",
  "isDefault": false
}
```

**Response:** `201 Created`
```json
{
  "id": "addr_def456",
  "label": "Office",
  "street": "456 Business Ave",
  "city": "Los Angeles",
  "state": "CA",
  "zipCode": "90001",
  "country": "US",
  "isDefault": false
}
```

---

### Get Purchased Products

Lấy danh sách sản phẩm đã mua (từ các đơn hàng đã delivered).

**Endpoint:** `GET /users/me/purchased-products`

**Headers:** `Authorization: Bearer <accessToken>`

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `category` | string | Lọc theo category ID |
| `sort` | string | Sort by: `newest`, `oldest` (default: `newest`) |

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "prod_abc123",
      "name": "Classic Denim Jacket",
      "slug": "classic-denim-jacket",
      "brand": "WearWhere Originals",
      "price": 89.99,
      "salePrice": 69.99,
      "currency": "USD",
      "image": "https://cdn.wearwhere.com/products/prod_abc123_1.jpg",
      "purchasedVariant": {
        "size": "M",
        "color": "Blue"
      },
      "orderId": "ord_abc123",
      "orderNumber": "WW-2024-00001",
      "purchasedAt": "2024-01-25T10:30:00Z",
      "deliveredAt": "2024-01-30T14:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 8,
    "totalPages": 1
  }
}
```

---

## Products

### List Products

Get paginated list of products with filtering options.

**Endpoint:** `GET /products`

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `category` | string | Filter by category ID |
| `minPrice` | number | Minimum price |
| `maxPrice` | number | Maximum price |
| `size` | string | Filter by size (XS, S, M, L, XL, XXL) |
| `color` | string | Filter by color |
| `brand` | string | Filter by brand |
| `gender` | string | Filter by gender (men, women, unisex) |
| `sort` | string | Sort by: `price_asc`, `price_desc`, `newest`, `popular`, `most_liked` |
| `search` | string | Search in name and description |

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "prod_abc123",
      "name": "Classic Denim Jacket",
      "slug": "classic-denim-jacket",
      "description": "A timeless denim jacket perfect for any casual occasion.",
      "brand": "WearWhere Originals",
      "category": {
        "id": "cat_001",
        "name": "Jackets"
      },
      "price": 89.99,
      "salePrice": 69.99,
      "currency": "USD",
      "images": [
        {
          "url": "https://cdn.wearwhere.com/products/prod_abc123_1.jpg",
          "alt": "Classic Denim Jacket - Front View",
          "isPrimary": true
        },
        {
          "url": "https://cdn.wearwhere.com/products/prod_abc123_2.jpg",
          "alt": "Classic Denim Jacket - Back View",
          "isPrimary": false
        }
      ],
      "variants": [
        {
          "id": "var_001",
          "size": "M",
          "color": "Blue",
          "colorCode": "#4169E1",
          "sku": "WW-DJ-BLU-M",
          "stock": 25,
          "inStock": true
        }
      ],
      "likesCount": 234,
      "isLiked": false,
      "postsCount": 45,
      "gender": "unisex",
      "tags": ["denim", "casual", "classic"],
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

---

### Get Product Details

**Endpoint:** `GET /products/:productId`

**Response:** `200 OK`
```json
{
  "id": "prod_abc123",
  "name": "Classic Denim Jacket",
  "slug": "classic-denim-jacket",
  "description": "A timeless denim jacket perfect for any casual occasion. Made from 100% premium cotton denim with a comfortable regular fit.",
  "brand": "WearWhere Originals",
  "category": {
    "id": "cat_001",
    "name": "Jackets",
    "path": ["Clothing", "Outerwear", "Jackets"]
  },
  "price": 89.99,
  "salePrice": 69.99,
  "currency": "USD",
  "images": [
    {
      "url": "https://cdn.wearwhere.com/products/prod_abc123_1.jpg",
      "alt": "Classic Denim Jacket - Front View",
      "isPrimary": true
    }
  ],
  "variants": [
    {
      "id": "var_001",
      "size": "S",
      "color": "Blue",
      "colorCode": "#4169E1",
      "sku": "WW-DJ-BLU-S",
      "stock": 10,
      "inStock": true
    },
    {
      "id": "var_002",
      "size": "M",
      "color": "Blue",
      "colorCode": "#4169E1",
      "sku": "WW-DJ-BLU-M",
      "stock": 25,
      "inStock": true
    },
    {
      "id": "var_003",
      "size": "L",
      "color": "Blue",
      "colorCode": "#4169E1",
      "sku": "WW-DJ-BLU-L",
      "stock": 0,
      "inStock": false
    }
  ],
  "specifications": {
    "material": "100% Cotton Denim",
    "fit": "Regular",
    "care": "Machine wash cold, tumble dry low"
  },
  "likesCount": 234,
  "isLiked": false,
  "postsCount": 45,
  "gender": "unisex",
  "tags": ["denim", "casual", "classic"],
  "relatedProducts": ["prod_def456", "prod_ghi789"],
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-20T12:00:00Z"
}
```

---

### Like/Unlike Product

Đánh giá nhanh sản phẩm bằng cách like.

**Endpoint:** `POST /products/:productId/like`

**Headers:** `Authorization: Bearer <accessToken>`

**Request Body:**
```json
{
  "like": true
}
```

**Response:** `200 OK`
```json
{
  "likesCount": 235,
  "isLiked": true
}
```

---

### Get Liked Products

Lấy danh sách sản phẩm đã like.

**Endpoint:** `GET /users/me/liked-products`

**Headers:** `Authorization: Bearer <accessToken>`

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "prod_abc123",
      "name": "Classic Denim Jacket",
      "slug": "classic-denim-jacket",
      "brand": "WearWhere Originals",
      "price": 89.99,
      "salePrice": 69.99,
      "currency": "USD",
      "image": "https://cdn.wearwhere.com/products/prod_abc123_1.jpg",
      "likesCount": 235,
      "isLiked": true,
      "likedAt": "2024-02-01T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 12,
    "totalPages": 1
  }
}
```

---

## Categories

### List Categories

**Endpoint:** `GET /categories`

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "cat_001",
      "name": "Men",
      "slug": "men",
      "image": "https://cdn.wearwhere.com/categories/men.jpg",
      "children": [
        {
          "id": "cat_002",
          "name": "Tops",
          "slug": "men-tops",
          "children": [
            {
              "id": "cat_003",
              "name": "T-Shirts",
              "slug": "men-t-shirts"
            },
            {
              "id": "cat_004",
              "name": "Shirts",
              "slug": "men-shirts"
            }
          ]
        },
        {
          "id": "cat_005",
          "name": "Bottoms",
          "slug": "men-bottoms"
        }
      ]
    },
    {
      "id": "cat_010",
      "name": "Women",
      "slug": "women",
      "image": "https://cdn.wearwhere.com/categories/women.jpg",
      "children": [...]
    }
  ]
}
```

---

## Cart

### Get Cart

Lấy giỏ hàng hiện tại của user.

**Endpoint:** `GET /cart`

**Headers:** `Authorization: Bearer <accessToken>`

**Response:** `200 OK`
```json
{
  "items": [
    {
      "id": "cart_item_001",
      "product": {
        "id": "prod_abc123",
        "name": "Classic Denim Jacket",
        "slug": "classic-denim-jacket",
        "brand": "WearWhere Originals",
        "image": "https://cdn.wearwhere.com/products/prod_abc123_1.jpg"
      },
      "variant": {
        "id": "var_002",
        "size": "M",
        "color": "Blue",
        "colorCode": "#4169E1"
      },
      "quantity": 2,
      "unitPrice": 69.99,
      "originalPrice": 89.99,
      "totalPrice": 139.98,
      "inStock": true,
      "availableStock": 25,
      "addedAt": "2024-01-20T10:00:00Z"
    }
  ],
  "summary": {
    "itemCount": 2,
    "subtotal": 139.98,
    "currency": "USD"
  }
}
```

---

### Add to Cart

**Endpoint:** `POST /cart/items`

**Headers:** `Authorization: Bearer <accessToken>`

**Request Body:**
```json
{
  "productId": "prod_abc123",
  "variantId": "var_002",
  "quantity": 1
}
```

**Response:** `201 Created`
```json
{
  "id": "cart_item_001",
  "product": {
    "id": "prod_abc123",
    "name": "Classic Denim Jacket",
    "image": "https://cdn.wearwhere.com/products/prod_abc123_1.jpg"
  },
  "variant": {
    "id": "var_002",
    "size": "M",
    "color": "Blue"
  },
  "quantity": 1,
  "unitPrice": 69.99,
  "totalPrice": 69.99
}
```

---

### Update Cart Item

Cập nhật số lượng sản phẩm trong giỏ hàng.

**Endpoint:** `PATCH /cart/items/:itemId`

**Headers:** `Authorization: Bearer <accessToken>`

**Request Body:**
```json
{
  "quantity": 3
}
```

**Response:** `200 OK`
```json
{
  "id": "cart_item_001",
  "quantity": 3,
  "unitPrice": 69.99,
  "totalPrice": 209.97
}
```

---

### Remove Cart Item

**Endpoint:** `DELETE /cart/items/:itemId`

**Headers:** `Authorization: Bearer <accessToken>`

**Response:** `204 No Content`

---

### Clear Cart

Xóa toàn bộ giỏ hàng.

**Endpoint:** `DELETE /cart`

**Headers:** `Authorization: Bearer <accessToken>`

**Response:** `204 No Content`

---

## Vouchers

### Get Available Vouchers

Lấy danh sách voucher có thể sử dụng.

**Endpoint:** `GET /vouchers`

**Headers:** `Authorization: Bearer <accessToken>`

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `type` | string | Filter by type: `discount`, `shipping`, `cashback` |

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "voucher_001",
      "code": "SAVE20",
      "type": "discount",
      "discountType": "percentage",
      "discountValue": 20,
      "maxDiscount": 50.00,
      "minOrderValue": 100.00,
      "description": "Giảm 20% tối đa $50 cho đơn từ $100",
      "validFrom": "2024-01-01T00:00:00Z",
      "validUntil": "2024-02-28T23:59:59Z",
      "usageLimit": 1,
      "usedCount": 0,
      "isApplicable": true
    },
    {
      "id": "voucher_002",
      "code": "FREESHIP",
      "type": "shipping",
      "discountType": "fixed",
      "discountValue": 5.99,
      "minOrderValue": 50.00,
      "description": "Miễn phí vận chuyển cho đơn từ $50",
      "validFrom": "2024-01-01T00:00:00Z",
      "validUntil": "2024-12-31T23:59:59Z",
      "usageLimit": null,
      "usedCount": 2,
      "isApplicable": true
    }
  ]
}
```

---

### Validate Voucher

Kiểm tra voucher có áp dụng được không.

**Endpoint:** `POST /vouchers/validate`

**Headers:** `Authorization: Bearer <accessToken>`

**Request Body:**
```json
{
  "code": "SAVE20",
  "orderValue": 150.00
}
```

**Response:** `200 OK`
```json
{
  "valid": true,
  "voucher": {
    "id": "voucher_001",
    "code": "SAVE20",
    "type": "discount",
    "discountType": "percentage",
    "discountValue": 20,
    "maxDiscount": 50.00
  },
  "discount": 30.00,
  "message": "Voucher applied successfully"
}
```

**Error Response:** `400 Bad Request`
```json
{
  "valid": false,
  "message": "Minimum order value is $100"
}
```

---

## Orders

### Get Shipping Options

Lấy các phương thức vận chuyển có sẵn.

**Endpoint:** `POST /orders/shipping-options`

**Headers:** `Authorization: Bearer <accessToken>`

**Request Body:**
```json
{
  "addressId": "addr_xyz789",
  "items": [
    {
      "productId": "prod_abc123",
      "variantId": "var_002",
      "quantity": 2
    }
  ]
}
```

**Response:** `200 OK`
```json
{
  "options": [
    {
      "id": "shipping_standard",
      "name": "Standard Shipping",
      "description": "Giao hàng trong 5-7 ngày",
      "cost": 5.99,
      "currency": "USD",
      "estimatedDays": {
        "min": 5,
        "max": 7
      },
      "estimatedDelivery": "2024-02-01T18:00:00Z"
    },
    {
      "id": "shipping_express",
      "name": "Express Shipping",
      "description": "Giao hàng trong 2-3 ngày",
      "cost": 12.99,
      "currency": "USD",
      "estimatedDays": {
        "min": 2,
        "max": 3
      },
      "estimatedDelivery": "2024-01-28T18:00:00Z"
    },
    {
      "id": "shipping_same_day",
      "name": "Same Day Delivery",
      "description": "Giao trong ngày (đặt trước 2PM)",
      "cost": 19.99,
      "currency": "USD",
      "estimatedDays": {
        "min": 0,
        "max": 1
      },
      "estimatedDelivery": "2024-01-25T20:00:00Z",
      "available": false,
      "unavailableReason": "Order placed after 2PM cutoff"
    }
  ]
}
```

---

### Create Order

**Endpoint:** `POST /orders`

**Headers:** `Authorization: Bearer <accessToken>`

**Request Body:**
```json
{
  "items": [
    {
      "productId": "prod_abc123",
      "variantId": "var_002",
      "quantity": 2
    }
  ],
  "shippingAddressId": "addr_xyz789",
  "billingAddressId": "addr_xyz789",
  "shippingOptionId": "shipping_standard",
  "paymentMethod": "card",
  "voucherCodes": ["SAVE20", "FREESHIP"],
  "note": "Giao giờ hành chính"
}
```

**Response:** `201 Created`
```json
{
  "id": "ord_abc123",
  "orderNumber": "WW-2024-00001",
  "status": "pending_payment",
  "items": [
    {
      "productId": "prod_abc123",
      "variantId": "var_002",
      "name": "Classic Denim Jacket",
      "size": "M",
      "color": "Blue",
      "quantity": 2,
      "unitPrice": 69.99,
      "totalPrice": 139.98,
      "image": "https://cdn.wearwhere.com/products/prod_abc123_1.jpg"
    }
  ],
  "subtotal": 139.98,
  "discount": 27.99,
  "shippingCost": 5.99,
  "tax": 11.20,
  "total": 129.18,
  "currency": "USD",
  "paymentUrl": "https://checkout.wearwhere.com/pay/ord_abc123",
  "createdAt": "2024-01-25T10:30:00Z"
}
```

---

### Get Order Details

**Endpoint:** `GET /orders/:orderId`

**Headers:** `Authorization: Bearer <accessToken>`

**Response:** `200 OK`
```json
{
  "id": "ord_abc123",
  "orderNumber": "WW-2024-00001",
  "status": "shipped",
  "items": [
    {
      "productId": "prod_abc123",
      "variantId": "var_002",
      "name": "Classic Denim Jacket",
      "size": "M",
      "color": "Blue",
      "quantity": 2,
      "unitPrice": 69.99,
      "totalPrice": 139.98,
      "image": "https://cdn.wearwhere.com/products/prod_abc123_1.jpg"
    }
  ],
  "subtotal": 139.98,
  "discount": 27.99,
  "shippingCost": 5.99,
  "tax": 11.20,
  "total": 129.18,
  "currency": "USD",
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "US"
  },
  "tracking": {
    "carrier": "FedEx",
    "trackingNumber": "794644790138",
    "trackingUrl": "https://www.fedex.com/track?tracknumbers=794644790138",
    "estimatedDelivery": "2024-01-30T18:00:00Z"
  },
  "timeline": [
    {
      "status": "placed",
      "timestamp": "2024-01-25T10:30:00Z"
    },
    {
      "status": "paid",
      "timestamp": "2024-01-25T10:32:00Z"
    },
    {
      "status": "processing",
      "timestamp": "2024-01-25T14:00:00Z"
    },
    {
      "status": "shipped",
      "timestamp": "2024-01-26T09:00:00Z"
    }
  ],
  "createdAt": "2024-01-25T10:30:00Z",
  "updatedAt": "2024-01-26T09:00:00Z"
}
```

---

### List User Orders

**Endpoint:** `GET /orders`

**Headers:** `Authorization: Bearer <accessToken>`

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | Filter by status: `pending_payment`, `paid`, `processing`, `shipped`, `delivered`, `cancelled` |

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "ord_abc123",
      "orderNumber": "WW-2024-00001",
      "status": "shipped",
      "itemCount": 2,
      "total": 129.18,
      "currency": "USD",
      "previewImage": "https://cdn.wearwhere.com/products/prod_abc123_1.jpg",
      "createdAt": "2024-01-25T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5,
    "totalPages": 1
  }
}
```

---

### Cancel Order

Hủy đơn hàng (chỉ được hủy khi status là `pending_payment` hoặc `paid`).

**Endpoint:** `POST /orders/:orderId/cancel`

**Headers:** `Authorization: Bearer <accessToken>`

**Request Body:**
```json
{
  "reason": "changed_mind",
  "note": "Tôi muốn đổi size khác"
}
```

**Reason options:** `changed_mind`, `found_better_price`, `ordered_by_mistake`, `delivery_too_long`, `other`

**Response:** `200 OK`
```json
{
  "id": "ord_abc123",
  "orderNumber": "WW-2024-00001",
  "status": "cancelled",
  "cancelledAt": "2024-01-25T12:00:00Z",
  "cancelReason": "changed_mind",
  "refundStatus": "processing",
  "refundAmount": 129.18
}
```

**Error Response:** `400 Bad Request`
```json
{
  "error": {
    "code": "ORDER_CANNOT_CANCEL",
    "message": "Order cannot be cancelled. Status must be pending_payment or paid."
  }
}
```

---

### Request Return/Refund

Yêu cầu trả hàng/hoàn tiền (chỉ cho đơn đã delivered, trong vòng 7 ngày).

**Endpoint:** `POST /orders/:orderId/return`

**Headers:**
- `Authorization: Bearer <accessToken>`
- `Content-Type: multipart/form-data`

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `items` | object[] | Yes | Danh sách sản phẩm muốn trả |
| `items[].productId` | string | Yes | Product ID |
| `items[].variantId` | string | Yes | Variant ID |
| `items[].quantity` | integer | Yes | Số lượng muốn trả |
| `reason` | string | Yes | Lý do trả hàng |
| `description` | string | No | Mô tả chi tiết |
| `images` | file[] | No | Ảnh chứng minh (max 5 ảnh) |
| `refundMethod` | string | Yes | Phương thức hoàn tiền: `original_payment`, `wallet` |

**Reason options:** `defective`, `wrong_item`, `not_as_described`, `size_not_fit`, `changed_mind`, `other`

**Request Example:**
```json
{
  "items": [
    {
      "productId": "prod_abc123",
      "variantId": "var_002",
      "quantity": 1
    }
  ],
  "reason": "size_not_fit",
  "description": "Size M quá rộng, muốn đổi size S",
  "refundMethod": "original_payment"
}
```

**Response:** `201 Created`
```json
{
  "id": "return_abc123",
  "orderId": "ord_abc123",
  "orderNumber": "WW-2024-00001",
  "status": "pending_approval",
  "items": [
    {
      "productId": "prod_abc123",
      "variantId": "var_002",
      "name": "Classic Denim Jacket",
      "size": "M",
      "color": "Blue",
      "quantity": 1,
      "refundAmount": 69.99
    }
  ],
  "reason": "size_not_fit",
  "description": "Size M quá rộng, muốn đổi size S",
  "images": [],
  "totalRefundAmount": 69.99,
  "refundMethod": "original_payment",
  "createdAt": "2024-02-05T10:00:00Z"
}
```

---

### Get Return Request Details

**Endpoint:** `GET /orders/:orderId/return`

**Headers:** `Authorization: Bearer <accessToken>`

**Response:** `200 OK`
```json
{
  "id": "return_abc123",
  "orderId": "ord_abc123",
  "orderNumber": "WW-2024-00001",
  "status": "approved",
  "items": [
    {
      "productId": "prod_abc123",
      "variantId": "var_002",
      "name": "Classic Denim Jacket",
      "size": "M",
      "color": "Blue",
      "quantity": 1,
      "refundAmount": 69.99
    }
  ],
  "reason": "size_not_fit",
  "totalRefundAmount": 69.99,
  "refundMethod": "original_payment",
  "refundStatus": "completed",
  "returnShipping": {
    "carrier": "FedEx",
    "trackingNumber": "794644790139",
    "label": "https://cdn.wearwhere.com/returns/return_abc123_label.pdf"
  },
  "timeline": [
    {
      "status": "pending_approval",
      "timestamp": "2024-02-05T10:00:00Z"
    },
    {
      "status": "approved",
      "timestamp": "2024-02-05T14:00:00Z"
    },
    {
      "status": "item_received",
      "timestamp": "2024-02-08T10:00:00Z"
    },
    {
      "status": "refund_completed",
      "timestamp": "2024-02-08T12:00:00Z"
    }
  ],
  "createdAt": "2024-02-05T10:00:00Z"
}
```

---

### List Return Requests

Lấy danh sách yêu cầu trả hàng của user.

**Endpoint:** `GET /users/me/returns`

**Headers:** `Authorization: Bearer <accessToken>`

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | Filter by status: `pending_approval`, `approved`, `rejected`, `item_received`, `refund_completed` |

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "return_abc123",
      "orderId": "ord_abc123",
      "orderNumber": "WW-2024-00001",
      "status": "refund_completed",
      "itemCount": 1,
      "totalRefundAmount": 69.99,
      "previewImage": "https://cdn.wearwhere.com/products/prod_abc123_1.jpg",
      "createdAt": "2024-02-05T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 2,
    "totalPages": 1
  }
}
```

---

### Reorder

Đặt lại đơn hàng cũ (thêm các sản phẩm vào giỏ hàng).

**Endpoint:** `POST /orders/:orderId/reorder`

**Headers:** `Authorization: Bearer <accessToken>`

**Response:** `200 OK`
```json
{
  "message": "Items added to cart",
  "addedItems": [
    {
      "productId": "prod_abc123",
      "variantId": "var_002",
      "name": "Classic Denim Jacket",
      "size": "M",
      "color": "Blue",
      "quantity": 2,
      "inStock": true
    }
  ],
  "unavailableItems": [],
  "cart": {
    "itemCount": 2,
    "subtotal": 139.98
  }
}
```

**Response với sản phẩm hết hàng:** `200 OK`
```json
{
  "message": "Some items are unavailable",
  "addedItems": [
    {
      "productId": "prod_abc123",
      "variantId": "var_002",
      "name": "Classic Denim Jacket",
      "size": "M",
      "color": "Blue",
      "quantity": 2,
      "inStock": true
    }
  ],
  "unavailableItems": [
    {
      "productId": "prod_def456",
      "variantId": "var_005",
      "name": "White Basic Tee",
      "size": "L",
      "color": "White",
      "reason": "out_of_stock"
    }
  ],
  "cart": {
    "itemCount": 2,
    "subtotal": 139.98
  }
}
```

---

## Payments

### Get Payment Methods

Lấy danh sách phương thức thanh toán có sẵn.

**Endpoint:** `GET /payments/methods`

**Headers:** `Authorization: Bearer <accessToken>`

**Response:** `200 OK`
```json
{
  "methods": [
    {
      "id": "cod",
      "name": "Cash on Delivery",
      "description": "Thanh toán khi nhận hàng",
      "icon": "https://cdn.wearwhere.com/icons/cod.png",
      "type": "cod",
      "available": true
    },
    {
      "id": "card",
      "name": "Credit/Debit Card",
      "description": "Visa, Mastercard, JCB",
      "icon": "https://cdn.wearwhere.com/icons/card.png",
      "type": "card",
      "available": true,
      "supportedCards": ["visa", "mastercard", "jcb", "amex"]
    },
    {
      "id": "bank_transfer",
      "name": "Bank Transfer",
      "description": "Chuyển khoản ngân hàng",
      "icon": "https://cdn.wearwhere.com/icons/bank.png",
      "type": "bank_transfer",
      "available": true
    },
    {
      "id": "momo",
      "name": "MoMo Wallet",
      "description": "Ví điện tử MoMo",
      "icon": "https://cdn.wearwhere.com/icons/momo.png",
      "type": "e_wallet",
      "available": true
    },
    {
      "id": "zalopay",
      "name": "ZaloPay",
      "description": "Ví điện tử ZaloPay",
      "icon": "https://cdn.wearwhere.com/icons/zalopay.png",
      "type": "e_wallet",
      "available": true
    }
  ],
  "savedCards": [
    {
      "id": "card_001",
      "type": "visa",
      "last4": "4242",
      "expiryMonth": 12,
      "expiryYear": 2025,
      "cardholderName": "JOHN DOE",
      "isDefault": true
    }
  ]
}
```

---

### Add Payment Card

Lưu thẻ thanh toán mới.

**Endpoint:** `POST /payments/cards`

**Headers:** `Authorization: Bearer <accessToken>`

**Request Body:**
```json
{
  "cardNumber": "4242424242424242",
  "expiryMonth": 12,
  "expiryYear": 2025,
  "cvv": "123",
  "cardholderName": "JOHN DOE",
  "isDefault": true
}
```

**Response:** `201 Created`
```json
{
  "id": "card_001",
  "type": "visa",
  "last4": "4242",
  "expiryMonth": 12,
  "expiryYear": 2025,
  "cardholderName": "JOHN DOE",
  "isDefault": true,
  "createdAt": "2024-01-25T10:00:00Z"
}
```

---

### Get Saved Cards

Lấy danh sách thẻ đã lưu.

**Endpoint:** `GET /payments/cards`

**Headers:** `Authorization: Bearer <accessToken>`

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "card_001",
      "type": "visa",
      "last4": "4242",
      "expiryMonth": 12,
      "expiryYear": 2025,
      "cardholderName": "JOHN DOE",
      "isDefault": true
    },
    {
      "id": "card_002",
      "type": "mastercard",
      "last4": "8888",
      "expiryMonth": 6,
      "expiryYear": 2026,
      "cardholderName": "JOHN DOE",
      "isDefault": false
    }
  ]
}
```

---

### Update Card

Cập nhật thẻ (set default).

**Endpoint:** `PATCH /payments/cards/:cardId`

**Headers:** `Authorization: Bearer <accessToken>`

**Request Body:**
```json
{
  "isDefault": true
}
```

**Response:** `200 OK`
```json
{
  "id": "card_002",
  "type": "mastercard",
  "last4": "8888",
  "isDefault": true
}
```

---

### Delete Card

Xóa thẻ đã lưu.

**Endpoint:** `DELETE /payments/cards/:cardId`

**Headers:** `Authorization: Bearer <accessToken>`

**Response:** `204 No Content`

---

### Process Payment

Thanh toán cho đơn hàng.

**Endpoint:** `POST /payments/process`

**Headers:** `Authorization: Bearer <accessToken>`

**Request Body (Card Payment):**
```json
{
  "orderId": "ord_abc123",
  "method": "card",
  "cardId": "card_001",
  "saveCard": false
}
```

**Request Body (New Card):**
```json
{
  "orderId": "ord_abc123",
  "method": "card",
  "card": {
    "cardNumber": "4242424242424242",
    "expiryMonth": 12,
    "expiryYear": 2025,
    "cvv": "123",
    "cardholderName": "JOHN DOE"
  },
  "saveCard": true
}
```

**Request Body (E-Wallet):**
```json
{
  "orderId": "ord_abc123",
  "method": "momo",
  "returnUrl": "https://wearwhere.com/payment/callback"
}
```

**Response:** `200 OK` (Direct Payment Success)
```json
{
  "paymentId": "pay_abc123",
  "orderId": "ord_abc123",
  "status": "completed",
  "amount": 129.18,
  "currency": "USD",
  "method": "card",
  "cardLast4": "4242",
  "transactionId": "txn_xyz789",
  "paidAt": "2024-01-25T10:35:00Z"
}
```

**Response:** `200 OK` (Redirect Required - E-Wallet/Bank)
```json
{
  "paymentId": "pay_abc123",
  "orderId": "ord_abc123",
  "status": "pending",
  "amount": 129.18,
  "currency": "USD",
  "method": "momo",
  "redirectUrl": "https://payment.momo.vn/pay?token=xyz...",
  "expiresAt": "2024-01-25T10:50:00Z"
}
```

---

### Get Payment Status

Kiểm tra trạng thái thanh toán.

**Endpoint:** `GET /payments/:paymentId`

**Headers:** `Authorization: Bearer <accessToken>`

**Response:** `200 OK`
```json
{
  "paymentId": "pay_abc123",
  "orderId": "ord_abc123",
  "orderNumber": "WW-2024-00001",
  "status": "completed",
  "amount": 129.18,
  "currency": "USD",
  "method": "card",
  "methodDetails": {
    "type": "visa",
    "last4": "4242"
  },
  "transactionId": "txn_xyz789",
  "createdAt": "2024-01-25T10:30:00Z",
  "paidAt": "2024-01-25T10:35:00Z"
}
```

**Payment Status Values:**
- `pending` - Đang chờ thanh toán
- `processing` - Đang xử lý
- `completed` - Thanh toán thành công
- `failed` - Thanh toán thất bại
- `cancelled` - Đã hủy
- `refunded` - Đã hoàn tiền

---

### Payment Callback (Webhook từ Payment Gateway)

Endpoint để payment gateway gọi callback sau khi thanh toán.

**Endpoint:** `POST /payments/callback/:provider`

**Provider:** `momo`, `zalopay`, `vnpay`, `stripe`

*(Internal - được gọi bởi payment gateway)*

---

### Get Payment History

Lấy lịch sử thanh toán.

**Endpoint:** `GET /payments/history`

**Headers:** `Authorization: Bearer <accessToken>`

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | Filter by status: `completed`, `failed`, `refunded` |
| `method` | string | Filter by method: `card`, `cod`, `e_wallet`, `bank_transfer` |
| `fromDate` | string | Filter từ ngày (ISO 8601) |
| `toDate` | string | Filter đến ngày (ISO 8601) |

**Response:** `200 OK`
```json
{
  "data": [
    {
      "paymentId": "pay_abc123",
      "orderId": "ord_abc123",
      "orderNumber": "WW-2024-00001",
      "status": "completed",
      "amount": 129.18,
      "currency": "USD",
      "method": "card",
      "methodDetails": {
        "type": "visa",
        "last4": "4242"
      },
      "createdAt": "2024-01-25T10:30:00Z",
      "paidAt": "2024-01-25T10:35:00Z"
    },
    {
      "paymentId": "pay_def456",
      "orderId": "ord_def456",
      "orderNumber": "WW-2024-00002",
      "status": "refunded",
      "amount": 59.99,
      "refundedAmount": 59.99,
      "currency": "USD",
      "method": "momo",
      "createdAt": "2024-01-20T14:00:00Z",
      "paidAt": "2024-01-20T14:05:00Z",
      "refundedAt": "2024-01-25T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 15,
    "totalPages": 1
  }
}
```

---

### Request Refund

Yêu cầu hoàn tiền (được gọi tự động khi cancel order hoặc return được approve).

**Endpoint:** `POST /payments/:paymentId/refund`

**Headers:** `Authorization: Bearer <accessToken>`

**Request Body:**
```json
{
  "amount": 69.99,
  "reason": "return_approved",
  "returnId": "return_abc123"
}
```

**Response:** `200 OK`
```json
{
  "refundId": "refund_abc123",
  "paymentId": "pay_abc123",
  "status": "processing",
  "amount": 69.99,
  "currency": "USD",
  "reason": "return_approved",
  "estimatedCompletionDate": "2024-02-10T00:00:00Z",
  "createdAt": "2024-02-05T12:00:00Z"
}
```

---

### Get Refund Status

Kiểm tra trạng thái hoàn tiền.

**Endpoint:** `GET /payments/refunds/:refundId`

**Headers:** `Authorization: Bearer <accessToken>`

**Response:** `200 OK`
```json
{
  "refundId": "refund_abc123",
  "paymentId": "pay_abc123",
  "orderId": "ord_abc123",
  "status": "completed",
  "amount": 69.99,
  "currency": "USD",
  "reason": "return_approved",
  "refundMethod": "original_payment",
  "refundDetails": {
    "type": "visa",
    "last4": "4242"
  },
  "createdAt": "2024-02-05T12:00:00Z",
  "completedAt": "2024-02-07T10:00:00Z"
}
```

**Refund Status Values:**
- `processing` - Đang xử lý hoàn tiền
- `completed` - Hoàn tiền thành công
- `failed` - Hoàn tiền thất bại

---

## Delivery Tracking

Hệ thống theo dõi đơn hàng đang vận chuyển realtime, bao gồm vị trí shipper và thời gian dự kiến.

### Get Delivery Status

Lấy trạng thái giao hàng của đơn hàng.

**Endpoint:** `GET /orders/:orderId/delivery`

**Headers:** `Authorization: Bearer <accessToken>`

**Response:** `200 OK`
```json
{
  "orderId": "ord_abc123",
  "orderNumber": "WW-2024-00001",
  "status": "in_transit",
  "carrier": {
    "id": "carrier_001",
    "name": "WearWhere Express",
    "logo": "https://cdn.wearwhere.com/carriers/ww_express.png",
    "phone": "1900-1234"
  },
  "trackingNumber": "WWX794644790138",
  "shipper": {
    "id": "shipper_abc123",
    "name": "Nguyễn Văn A",
    "phone": "+84912345678",
    "avatar": "https://cdn.wearwhere.com/shippers/shipper_abc123.jpg",
    "rating": 4.9,
    "vehicleType": "motorcycle",
    "vehiclePlate": "59-A1 12345"
  },
  "currentLocation": {
    "latitude": 10.7750,
    "longitude": 106.7020,
    "updatedAt": "2024-02-01T14:30:00Z",
    "address": "Đang di chuyển trên đường Nguyễn Huệ, Quận 1"
  },
  "destination": {
    "latitude": 10.7800,
    "longitude": 106.6950,
    "address": "123 Lê Lợi, Quận 1, TP.HCM"
  },
  "estimatedDelivery": {
    "time": "2024-02-01T15:00:00Z",
    "remainingMinutes": 30,
    "remainingDistance": {
      "value": 2500,
      "text": "2.5 km"
    }
  },
  "timeline": [
    {
      "status": "order_confirmed",
      "title": "Đơn hàng đã xác nhận",
      "timestamp": "2024-02-01T10:00:00Z",
      "completed": true
    },
    {
      "status": "preparing",
      "title": "Đang chuẩn bị hàng",
      "timestamp": "2024-02-01T10:30:00Z",
      "completed": true
    },
    {
      "status": "picked_up",
      "title": "Shipper đã lấy hàng",
      "description": "Đã lấy hàng tại kho WearWhere Q7",
      "timestamp": "2024-02-01T13:00:00Z",
      "completed": true
    },
    {
      "status": "in_transit",
      "title": "Đang giao hàng",
      "description": "Shipper đang trên đường giao",
      "timestamp": "2024-02-01T14:00:00Z",
      "completed": true,
      "current": true
    },
    {
      "status": "delivered",
      "title": "Giao hàng thành công",
      "timestamp": null,
      "completed": false
    }
  ],
  "proofOfDelivery": null
}
```

**Delivery Status Values:**
- `pending` - Chờ xử lý
- `confirmed` - Đã xác nhận
- `preparing` - Đang chuẩn bị hàng
- `ready_for_pickup` - Sẵn sàng để shipper lấy
- `picked_up` - Shipper đã lấy hàng
- `in_transit` - Đang vận chuyển
- `out_for_delivery` - Đang giao hàng (gần đến)
- `delivered` - Đã giao thành công
- `failed_attempt` - Giao không thành công
- `returned` - Đã trả hàng

---

### Get Shipper Location (Realtime)

Lấy vị trí realtime của shipper qua WebSocket hoặc polling.

**Endpoint:** `GET /orders/:orderId/delivery/location`

**Headers:** `Authorization: Bearer <accessToken>`

**Response:** `200 OK`
```json
{
  "shipperId": "shipper_abc123",
  "location": {
    "latitude": 10.7755,
    "longitude": 106.7025
  },
  "heading": 45,
  "speed": 25,
  "updatedAt": "2024-02-01T14:35:00Z",
  "estimatedArrival": "2024-02-01T14:55:00Z"
}
```

**WebSocket Connection:**
```
wss://api.wearwhere.com/v1/orders/{orderId}/delivery/live
```

**WebSocket Message Format:**
```json
{
  "type": "location_update",
  "data": {
    "latitude": 10.7760,
    "longitude": 106.7015,
    "heading": 90,
    "speed": 20,
    "estimatedMinutes": 25,
    "timestamp": "2024-02-01T14:36:00Z"
  }
}
```

---

### Get Delivery Updates

Lấy danh sách cập nhật của đơn hàng đang giao.

**Endpoint:** `GET /orders/:orderId/delivery/updates`

**Headers:** `Authorization: Bearer <accessToken>`

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "update_001",
      "type": "status_change",
      "status": "in_transit",
      "title": "Đang giao hàng",
      "message": "Shipper Nguyễn Văn A đang trên đường giao hàng đến bạn",
      "timestamp": "2024-02-01T14:00:00Z"
    },
    {
      "id": "update_002",
      "type": "location_milestone",
      "title": "Shipper đang đến gần",
      "message": "Shipper cách bạn khoảng 3km, dự kiến 15 phút nữa",
      "timestamp": "2024-02-01T14:20:00Z"
    },
    {
      "id": "update_003",
      "type": "delay_notice",
      "title": "Thông báo chậm trễ",
      "message": "Do kẹt xe, đơn hàng có thể chậm 10-15 phút",
      "timestamp": "2024-02-01T14:25:00Z"
    }
  ]
}
```

---

### Contact Shipper

Liên hệ với shipper đang giao hàng.

**Endpoint:** `POST /orders/:orderId/delivery/contact`

**Headers:** `Authorization: Bearer <accessToken>`

**Request Body:**
```json
{
  "type": "call"
}
```

**Type options:** `call`, `message`

**Response:** `200 OK` (for call)
```json
{
  "type": "call",
  "phoneNumber": "+84912345678",
  "maskedNumber": "+84912***678",
  "callId": "call_abc123",
  "expiresAt": "2024-02-01T15:30:00Z"
}
```

**Response:** `200 OK` (for message - opens in-app chat)
```json
{
  "type": "message",
  "chatId": "delivery_chat_abc123",
  "shipperName": "Nguyễn Văn A"
}
```

---

### Send Message to Shipper

Gửi tin nhắn cho shipper.

**Endpoint:** `POST /orders/:orderId/delivery/messages`

**Headers:** `Authorization: Bearer <accessToken>`

**Request Body:**
```json
{
  "message": "Anh ơi gọi em khi đến nha, em ở tầng 5"
}
```

**Response:** `201 Created`
```json
{
  "id": "msg_abc123",
  "chatId": "delivery_chat_abc123",
  "sender": "user",
  "message": "Anh ơi gọi em khi đến nha, em ở tầng 5",
  "createdAt": "2024-02-01T14:40:00Z",
  "read": false
}
```

---

### Get Delivery Chat

Lấy lịch sử chat với shipper.

**Endpoint:** `GET /orders/:orderId/delivery/messages`

**Headers:** `Authorization: Bearer <accessToken>`

**Response:** `200 OK`
```json
{
  "chatId": "delivery_chat_abc123",
  "shipper": {
    "id": "shipper_abc123",
    "name": "Nguyễn Văn A",
    "avatar": "https://cdn.wearwhere.com/shippers/shipper_abc123.jpg"
  },
  "messages": [
    {
      "id": "msg_001",
      "sender": "shipper",
      "message": "Em chào anh/chị, em đang trên đường giao hàng ạ",
      "createdAt": "2024-02-01T14:10:00Z",
      "read": true
    },
    {
      "id": "msg_002",
      "sender": "user",
      "message": "Anh ơi gọi em khi đến nha, em ở tầng 5",
      "createdAt": "2024-02-01T14:40:00Z",
      "read": true
    },
    {
      "id": "msg_003",
      "sender": "shipper",
      "message": "Dạ em nhận, khoảng 15p nữa em đến ạ",
      "createdAt": "2024-02-01T14:41:00Z",
      "read": false
    }
  ]
}
```

---

### Update Delivery Instructions

Cập nhật hướng dẫn giao hàng (khi shipper đang trên đường).

**Endpoint:** `PATCH /orders/:orderId/delivery/instructions`

**Headers:** `Authorization: Bearer <accessToken>`

**Request Body:**
```json
{
  "instructions": "Gọi điện trước khi đến. Giao tại sảnh tầng 1, không cần lên tầng.",
  "leaveAtDoor": false,
  "contactless": true
}
```

**Response:** `200 OK`
```json
{
  "message": "Delivery instructions updated",
  "instructions": "Gọi điện trước khi đến. Giao tại sảnh tầng 1, không cần lên tầng.",
  "leaveAtDoor": false,
  "contactless": true,
  "notifiedShipper": true
}
```

---

### Confirm Delivery

Xác nhận đã nhận hàng (user xác nhận).

**Endpoint:** `POST /orders/:orderId/delivery/confirm`

**Headers:** `Authorization: Bearer <accessToken>`

**Request Body:**
```json
{
  "rating": 5,
  "tip": 10000,
  "comment": "Giao hàng nhanh, shipper thân thiện",
  "receivedBy": "self"
}
```

**ReceivedBy options:** `self`, `family_member`, `security`, `reception`, `neighbor`

**Response:** `200 OK`
```json
{
  "message": "Delivery confirmed successfully",
  "orderId": "ord_abc123",
  "deliveredAt": "2024-02-01T14:55:00Z",
  "shipperRating": 5,
  "tipAmount": 10000,
  "tipCurrency": "VND"
}
```

---

### Report Delivery Issue

Báo cáo vấn đề với đơn hàng đang giao.

**Endpoint:** `POST /orders/:orderId/delivery/issues`

**Headers:** `Authorization: Bearer <accessToken>`

**Request Body:**
```json
{
  "type": "cannot_contact_shipper",
  "description": "Gọi điện nhiều lần nhưng shipper không nghe máy",
  "urgency": "high"
}
```

**Type options:**
- `cannot_contact_shipper` - Không liên lạc được với shipper
- `wrong_location` - Shipper đến sai địa chỉ
- `delayed` - Giao hàng chậm quá lâu
- `shipper_behavior` - Thái độ shipper không tốt
- `damaged_package` - Gói hàng bị hư hại
- `other` - Vấn đề khác

**Response:** `201 Created`
```json
{
  "issueId": "issue_abc123",
  "status": "received",
  "message": "Chúng tôi đã nhận được báo cáo của bạn. Đội ngũ hỗ trợ sẽ liên hệ trong vòng 5 phút.",
  "supportTicketId": "ticket_xyz789",
  "createdAt": "2024-02-01T14:50:00Z"
}
```

---

### Get Proof of Delivery

Lấy bằng chứng giao hàng (ảnh, chữ ký).

**Endpoint:** `GET /orders/:orderId/delivery/proof`

**Headers:** `Authorization: Bearer <accessToken>`

**Response:** `200 OK`
```json
{
  "orderId": "ord_abc123",
  "deliveredAt": "2024-02-01T14:55:00Z",
  "receivedBy": "self",
  "signature": {
    "url": "https://cdn.wearwhere.com/delivery/proof/ord_abc123_signature.png",
    "capturedAt": "2024-02-01T14:55:00Z"
  },
  "photos": [
    {
      "url": "https://cdn.wearwhere.com/delivery/proof/ord_abc123_photo1.jpg",
      "type": "package_handover",
      "capturedAt": "2024-02-01T14:54:00Z"
    }
  ],
  "location": {
    "latitude": 10.7800,
    "longitude": 106.6950,
    "address": "123 Lê Lợi, Quận 1, TP.HCM"
  },
  "shipper": {
    "id": "shipper_abc123",
    "name": "Nguyễn Văn A"
  }
}
```

---

### Get Active Deliveries

Lấy danh sách đơn hàng đang được giao.

**Endpoint:** `GET /users/me/active-deliveries`

**Headers:** `Authorization: Bearer <accessToken>`

**Response:** `200 OK`
```json
{
  "data": [
    {
      "orderId": "ord_abc123",
      "orderNumber": "WW-2024-00001",
      "status": "in_transit",
      "itemsCount": 2,
      "previewImage": "https://cdn.wearwhere.com/products/prod_abc123_1.jpg",
      "shipper": {
        "name": "Nguyễn Văn A",
        "phone": "+84912345678"
      },
      "estimatedDelivery": "2024-02-01T15:00:00Z",
      "remainingMinutes": 25
    }
  ],
  "total": 1
}
```

---

## News (Seller Promotions)

Hệ thống tin tức/bài viết quảng bá từ sellers. Sellers có thể đăng bài giới thiệu sản phẩm mới, khuyến mãi, lookbook, tips phối đồ, v.v.

### Get News Feed

Lấy danh sách tin tức.

**Endpoint:** `GET /news`

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `sellerId` | string | Lọc theo seller |
| `category` | string | Lọc theo category: `new_arrival`, `promotion`, `lookbook`, `tips`, `event` |
| `productId` | string | Lọc theo sản phẩm được tag |
| `sort` | string | Sort by: `newest`, `popular` |

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "news_abc123",
      "seller": {
        "id": "seller_001",
        "name": "WearWhere Originals",
        "logo": "https://cdn.wearwhere.com/sellers/seller_001_logo.jpg",
        "isVerified": true
      },
      "title": "BST Xuân Hè 2024 - Fresh & Vibrant",
      "thumbnail": "https://cdn.wearwhere.com/news/news_abc123_thumb.jpg",
      "excerpt": "Khám phá bộ sưu tập mới nhất với những gam màu tươi sáng...",
      "category": "new_arrival",
      "images": [
        {
          "id": "img_001",
          "url": "https://cdn.wearwhere.com/news/news_abc123_1.jpg"
        },
        {
          "id": "img_002",
          "url": "https://cdn.wearwhere.com/news/news_abc123_2.jpg"
        }
      ],
      "taggedProducts": [
        {
          "id": "prod_abc123",
          "name": "Classic Denim Jacket",
          "price": 89.99,
          "salePrice": 69.99,
          "image": "https://cdn.wearwhere.com/products/prod_abc123_1.jpg"
        }
      ],
      "promotion": {
        "type": "discount",
        "value": 20,
        "code": "SUMMER20",
        "validUntil": "2024-03-31T23:59:59Z"
      },
      "viewsCount": 1520,
      "likesCount": 234,
      "isLiked": false,
      "isSaved": false,
      "publishedAt": "2024-02-01T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

---

### Get News Detail

**Endpoint:** `GET /news/:newsId`

**Response:** `200 OK`
```json
{
  "id": "news_abc123",
  "seller": {
    "id": "seller_001",
    "name": "WearWhere Originals",
    "logo": "https://cdn.wearwhere.com/sellers/seller_001_logo.jpg",
    "isVerified": true,
    "followersCount": 15000,
    "isFollowing": false
  },
  "title": "BST Xuân Hè 2024 - Fresh & Vibrant",
  "content": "## Khám phá bộ sưu tập mới nhất\n\nMùa xuân hè năm nay, WearWhere Originals mang đến cho bạn những thiết kế tươi mới với gam màu rực rỡ...\n\n### Điểm nhấn của BST\n\n- Chất liệu cotton organic 100%\n- Màu sắc pastel trendy\n- Kiểu dáng oversized thoải mái",
  "category": "new_arrival",
  "images": [
    {
      "id": "img_001",
      "url": "https://cdn.wearwhere.com/news/news_abc123_1.jpg",
      "caption": "Lookbook Xuân Hè 2024"
    },
    {
      "id": "img_002",
      "url": "https://cdn.wearwhere.com/news/news_abc123_2.jpg",
      "caption": "Mix & Match cùng denim"
    }
  ],
  "taggedProducts": [
    {
      "id": "prod_abc123",
      "name": "Classic Denim Jacket",
      "price": 89.99,
      "salePrice": 69.99,
      "image": "https://cdn.wearwhere.com/products/prod_abc123_1.jpg",
      "inStock": true
    },
    {
      "id": "prod_def456",
      "name": "Pastel Linen Shirt",
      "price": 59.99,
      "image": "https://cdn.wearwhere.com/products/prod_def456_1.jpg",
      "inStock": true
    }
  ],
  "promotion": {
    "type": "discount",
    "value": 20,
    "code": "SUMMER20",
    "description": "Giảm 20% cho toàn bộ BST Xuân Hè",
    "validUntil": "2024-03-31T23:59:59Z"
  },
  "relatedNews": ["news_def456", "news_ghi789"],
  "viewsCount": 1520,
  "likesCount": 234,
  "commentsCount": 45,
  "isLiked": false,
  "isSaved": false,
  "publishedAt": "2024-02-01T10:00:00Z"
}
```

---

### Like/Unlike News

**Endpoint:** `POST /news/:newsId/like`

**Headers:** `Authorization: Bearer <accessToken>`

**Request Body:**
```json
{
  "like": true
}
```

**Response:** `200 OK`
```json
{
  "likesCount": 235,
  "isLiked": true
}
```

---

### Save/Unsave News

Lưu tin tức vào bộ sưu tập.

**Endpoint:** `POST /news/:newsId/save`

**Headers:** `Authorization: Bearer <accessToken>`

**Request Body:**
```json
{
  "save": true
}
```

**Response:** `200 OK`
```json
{
  "isSaved": true
}
```

---

### Get News Comments

**Endpoint:** `GET /news/:newsId/comments`

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "cmt_abc123",
      "user": {
        "id": "usr_xyz789",
        "firstName": "Jane",
        "lastName": "Smith",
        "username": "janesmith"
      },
      "content": "BST đẹp quá! Chờ mãi mới ra 😍",
      "likesCount": 12,
      "isLiked": false,
      "createdAt": "2024-02-01T11:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

---

### Add Comment to News

**Endpoint:** `POST /news/:newsId/comments`

**Headers:** `Authorization: Bearer <accessToken>`

**Request Body:**
```json
{
  "content": "Sản phẩm mới có ship free không shop?"
}
```

**Response:** `201 Created`
```json
{
  "id": "cmt_def456",
  "user": {
    "id": "usr_abc123",
    "firstName": "John",
    "lastName": "Doe",
    "username": "johndoe"
  },
  "content": "Sản phẩm mới có ship free không shop?",
  "likesCount": 0,
  "isLiked": false,
  "createdAt": "2024-02-01T12:00:00Z"
}
```

---

### Delete Comment

**Endpoint:** `DELETE /news/:newsId/comments/:commentId`

**Headers:** `Authorization: Bearer <accessToken>`

**Response:** `204 No Content`

---

### Like Comment

**Endpoint:** `POST /news/:newsId/comments/:commentId/like`

**Headers:** `Authorization: Bearer <accessToken>`

**Request Body:**
```json
{
  "like": true
}
```

**Response:** `200 OK`
```json
{
  "likesCount": 13,
  "isLiked": true
}
```

---

### Get Seller's News

Lấy tất cả tin tức của một seller.

**Endpoint:** `GET /sellers/:sellerId/news`

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `category` | string | Lọc theo category |

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "news_abc123",
      "title": "BST Xuân Hè 2024 - Fresh & Vibrant",
      "thumbnail": "https://cdn.wearwhere.com/news/news_abc123_thumb.jpg",
      "excerpt": "Khám phá bộ sưu tập mới nhất...",
      "category": "new_arrival",
      "viewsCount": 1520,
      "likesCount": 234,
      "publishedAt": "2024-02-01T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 25,
    "totalPages": 2
  }
}
```

---

### Get Product News

Lấy tất cả tin tức có tag sản phẩm cụ thể.

**Endpoint:** `GET /products/:productId/news`

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "news_abc123",
      "seller": {
        "id": "seller_001",
        "name": "WearWhere Originals",
        "logo": "https://cdn.wearwhere.com/sellers/seller_001_logo.jpg"
      },
      "title": "BST Xuân Hè 2024 - Fresh & Vibrant",
      "thumbnail": "https://cdn.wearwhere.com/news/news_abc123_thumb.jpg",
      "category": "new_arrival",
      "likesCount": 234,
      "publishedAt": "2024-02-01T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5,
    "totalPages": 1
  }
}
```

---

### Get Saved News

Lấy danh sách tin tức đã lưu.

**Endpoint:** `GET /users/me/saved-news`

**Headers:** `Authorization: Bearer <accessToken>`

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "news_abc123",
      "seller": {
        "id": "seller_001",
        "name": "WearWhere Originals",
        "logo": "https://cdn.wearwhere.com/sellers/seller_001_logo.jpg"
      },
      "title": "BST Xuân Hè 2024 - Fresh & Vibrant",
      "thumbnail": "https://cdn.wearwhere.com/news/news_abc123_thumb.jpg",
      "category": "new_arrival",
      "savedAt": "2024-02-01T15:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 8,
    "totalPages": 1
  }
}
```

---

### Follow/Unfollow Seller

Theo dõi seller để nhận tin tức mới.

**Endpoint:** `POST /sellers/:sellerId/follow`

**Headers:** `Authorization: Bearer <accessToken>`

**Request Body:**
```json
{
  "follow": true
}
```

**Response:** `200 OK`
```json
{
  "isFollowing": true,
  "followersCount": 15001
}
```

---

### Get Following Sellers

Lấy danh sách sellers đang follow.

**Endpoint:** `GET /users/me/following-sellers`

**Headers:** `Authorization: Bearer <accessToken>`

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "seller_001",
      "name": "WearWhere Originals",
      "logo": "https://cdn.wearwhere.com/sellers/seller_001_logo.jpg",
      "isVerified": true,
      "followersCount": 15001,
      "productsCount": 156,
      "followedAt": "2024-01-15T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 12,
    "totalPages": 1
  }
}
```

---

### Get Seller Profile

**Endpoint:** `GET /sellers/:sellerId`

**Response:** `200 OK`
```json
{
  "id": "seller_001",
  "name": "WearWhere Originals",
  "description": "Thương hiệu thời trang Việt Nam với phong cách trẻ trung, năng động",
  "logo": "https://cdn.wearwhere.com/sellers/seller_001_logo.jpg",
  "coverImage": "https://cdn.wearwhere.com/sellers/seller_001_cover.jpg",
  "isVerified": true,
  "rating": 4.8,
  "totalReviews": 2500,
  "followersCount": 15001,
  "productsCount": 156,
  "newsCount": 25,
  "joinedAt": "2023-01-01T00:00:00Z",
  "isFollowing": false,
  "contact": {
    "email": "support@wearwhereoriginals.com",
    "phone": "+84123456789"
  },
  "socialLinks": {
    "facebook": "https://facebook.com/wearwhereoriginals",
    "instagram": "https://instagram.com/wearwhereoriginals"
  }
}
```

---

### Report News

**Endpoint:** `POST /news/:newsId/report`

**Headers:** `Authorization: Bearer <accessToken>`

**Request Body:**
```json
{
  "reason": "misleading_content",
  "description": "Thông tin khuyến mãi không chính xác"
}
```

**Reason options:** `spam`, `misleading_content`, `inappropriate_content`, `fake_promotion`, `other`

**Response:** `200 OK`
```json
{
  "message": "News reported successfully. Our team will investigate."
}
```

---

## Posts (Social Reviews)

Hệ thống bài đăng theo phong cách mạng xã hội. Người dùng đăng ảnh kèm caption và tag sản phẩm.

### Get Feed

Lấy feed bài đăng (trang chủ).

**Endpoint:** `GET /posts`

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `following` | boolean | Chỉ lấy bài từ người đang follow (default: false) |
| `productId` | string | Lọc theo sản phẩm được tag |
| `userId` | string | Lọc theo người đăng |
| `sort` | string | Sort by: `newest`, `popular` |

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "post_abc123",
      "user": {
        "id": "usr_abc123",
        "firstName": "John",
        "lastName": "Doe",
        "username": "johndoe"
      },
      "images": [
        {
          "id": "img_001",
          "url": "https://cdn.wearwhere.com/posts/post_abc123_1.jpg",
          "thumbnail": "https://cdn.wearwhere.com/posts/post_abc123_1_thumb.jpg"
        },
        {
          "id": "img_002",
          "url": "https://cdn.wearwhere.com/posts/post_abc123_2.jpg",
          "thumbnail": "https://cdn.wearwhere.com/posts/post_abc123_2_thumb.jpg"
        }
      ],
      "caption": "Outfit hôm nay đi cafe ☕ Chiếc jacket này mix với gì cũng đẹp!",
      "taggedProducts": [
        {
          "id": "prod_abc123",
          "name": "Classic Denim Jacket",
          "price": 89.99,
          "salePrice": 69.99,
          "image": "https://cdn.wearwhere.com/products/prod_abc123_1.jpg"
        },
        {
          "id": "prod_def456",
          "name": "White Basic Tee",
          "price": 29.99,
          "image": "https://cdn.wearwhere.com/products/prod_def456_1.jpg"
        }
      ],
      "likesCount": 128,
      "commentsCount": 24,
      "isLiked": false,
      "isSaved": false,
      "createdAt": "2024-02-01T15:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 500,
    "totalPages": 25
  }
}
```

---

### Create Post

Tạo bài đăng mới với ảnh và tag sản phẩm.

**Endpoint:** `POST /posts`

**Headers:**
- `Authorization: Bearer <accessToken>`
- `Content-Type: multipart/form-data`

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `images` | file[] | Yes | Ảnh bài đăng (1-10 ảnh, mỗi ảnh max 10MB, JPEG/PNG/WebP) |
| `caption` | string | No | Caption bài đăng (max 2000 ký tự) |
| `taggedProductIds` | string[] | Yes | Danh sách ID sản phẩm được tag (1-10 sản phẩm) |

**Response:** `201 Created`
```json
{
  "id": "post_abc123",
  "user": {
    "id": "usr_abc123",
    "firstName": "John",
    "lastName": "Doe",
    "username": "johndoe"
  },
  "images": [
    {
      "id": "img_001",
      "url": "https://cdn.wearwhere.com/posts/post_abc123_1.jpg",
      "thumbnail": "https://cdn.wearwhere.com/posts/post_abc123_1_thumb.jpg"
    }
  ],
  "caption": "Outfit hôm nay đi cafe ☕",
  "taggedProducts": [
    {
      "id": "prod_abc123",
      "name": "Classic Denim Jacket",
      "price": 89.99,
      "salePrice": 69.99,
      "image": "https://cdn.wearwhere.com/products/prod_abc123_1.jpg"
    }
  ],
  "likesCount": 0,
  "commentsCount": 0,
  "isLiked": false,
  "isSaved": false,
  "createdAt": "2024-02-01T15:30:00Z"
}
```

---

### Get Post Detail

**Endpoint:** `GET /posts/:postId`

**Response:** `200 OK`
```json
{
  "id": "post_abc123",
  "user": {
    "id": "usr_abc123",
    "firstName": "John",
    "lastName": "Doe",
    "username": "johndoe",
    "followersCount": 1250,
    "isFollowing": false
  },
  "images": [
    {
      "id": "img_001",
      "url": "https://cdn.wearwhere.com/posts/post_abc123_1.jpg",
      "thumbnail": "https://cdn.wearwhere.com/posts/post_abc123_1_thumb.jpg"
    }
  ],
  "caption": "Outfit hôm nay đi cafe ☕ Chiếc jacket này mix với gì cũng đẹp!",
  "taggedProducts": [
    {
      "id": "prod_abc123",
      "name": "Classic Denim Jacket",
      "price": 89.99,
      "salePrice": 69.99,
      "image": "https://cdn.wearwhere.com/products/prod_abc123_1.jpg",
      "inStock": true
    }
  ],
  "likesCount": 128,
  "commentsCount": 24,
  "isLiked": false,
  "isSaved": false,
  "createdAt": "2024-02-01T15:30:00Z"
}
```

---

### Update Post

Cập nhật caption hoặc tagged products.

**Endpoint:** `PATCH /posts/:postId`

**Headers:** `Authorization: Bearer <accessToken>`

**Request Body:**
```json
{
  "caption": "Updated caption ✨",
  "taggedProductIds": ["prod_abc123", "prod_xyz789"]
}
```

**Response:** `200 OK`
```json
{
  "id": "post_abc123",
  "caption": "Updated caption ✨",
  "taggedProducts": [...],
  "updatedAt": "2024-02-05T10:00:00Z"
}
```

---

### Delete Post

**Endpoint:** `DELETE /posts/:postId`

**Headers:** `Authorization: Bearer <accessToken>`

**Response:** `204 No Content`

---

### Like/Unlike Post

**Endpoint:** `POST /posts/:postId/like`

**Headers:** `Authorization: Bearer <accessToken>`

**Request Body:**
```json
{
  "like": true
}
```

**Response:** `200 OK`
```json
{
  "likesCount": 129,
  "isLiked": true
}
```

---

### Save/Unsave Post

Lưu bài đăng vào bộ sưu tập.

**Endpoint:** `POST /posts/:postId/save`

**Headers:** `Authorization: Bearer <accessToken>`

**Request Body:**
```json
{
  "save": true
}
```

**Response:** `200 OK`
```json
{
  "isSaved": true
}
```

---

### Get Post Comments

**Endpoint:** `GET /posts/:postId/comments`

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "cmt_abc123",
      "user": {
        "id": "usr_xyz789",
        "firstName": "Jane",
        "lastName": "Smith",
        "username": "janesmith"
      },
      "content": "Đẹp quá bạn ơi! 😍",
      "likesCount": 5,
      "isLiked": false,
      "createdAt": "2024-02-01T16:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 24,
    "totalPages": 2
  }
}
```

---

### Add Comment

**Endpoint:** `POST /posts/:postId/comments`

**Headers:** `Authorization: Bearer <accessToken>`

**Request Body:**
```json
{
  "content": "Outfit xinh quá! 🔥"
}
```

**Response:** `201 Created`
```json
{
  "id": "cmt_def456",
  "user": {
    "id": "usr_abc123",
    "firstName": "John",
    "lastName": "Doe",
    "username": "johndoe"
  },
  "content": "Outfit xinh quá! 🔥",
  "likesCount": 0,
  "isLiked": false,
  "createdAt": "2024-02-01T17:00:00Z"
}
```

---

### Delete Comment

**Endpoint:** `DELETE /posts/:postId/comments/:commentId`

**Headers:** `Authorization: Bearer <accessToken>`

**Response:** `204 No Content`

---

### Like Comment

**Endpoint:** `POST /posts/:postId/comments/:commentId/like`

**Headers:** `Authorization: Bearer <accessToken>`

**Request Body:**
```json
{
  "like": true
}
```

**Response:** `200 OK`
```json
{
  "likesCount": 6,
  "isLiked": true
}
```

---

### Get Product Posts

Lấy tất cả bài đăng có tag sản phẩm cụ thể.

**Endpoint:** `GET /products/:productId/posts`

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "post_abc123",
      "user": {
        "id": "usr_abc123",
        "firstName": "John",
        "lastName": "Doe",
        "username": "johndoe"
      },
      "images": [...],
      "caption": "Outfit hôm nay...",
      "likesCount": 128,
      "commentsCount": 24,
      "createdAt": "2024-02-01T15:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

---

### Get User's Posts

**Endpoint:** `GET /users/:userId/posts`

**Response:** `200 OK`
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 32,
    "totalPages": 2
  }
}
```

---

### Get Saved Posts

Lấy danh sách bài đăng đã lưu.

**Endpoint:** `GET /users/me/saved-posts`

**Headers:** `Authorization: Bearer <accessToken>`

**Response:** `200 OK`
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 15,
    "totalPages": 1
  }
}
```

---

### Report Post

**Endpoint:** `POST /posts/:postId/report`

**Headers:** `Authorization: Bearer <accessToken>`

**Request Body:**
```json
{
  "reason": "inappropriate_content",
  "description": "Nội dung không phù hợp"
}
```

**Reason options:** `spam`, `inappropriate_content`, `fake_content`, `harassment`, `other`

**Response:** `200 OK`
```json
{
  "message": "Post reported successfully. Our team will investigate."
}
```

---

## Map & Nearby Shops

Hệ thống bản đồ hiển thị các shop quần áo gần người dùng và dẫn đường đến shop.

### Update User Location

Cập nhật vị trí realtime của người dùng.

**Endpoint:** `POST /location`

**Headers:** `Authorization: Bearer <accessToken>`

**Request Body:**
```json
{
  "latitude": 10.7769,
  "longitude": 106.7009,
  "accuracy": 10.5
}
```

**Response:** `200 OK`
```json
{
  "message": "Location updated successfully",
  "timestamp": "2024-02-01T10:00:00Z"
}
```

---

### Get Nearby Shops

Lấy danh sách shop quần áo gần vị trí người dùng.

**Endpoint:** `GET /shops/nearby`

**Headers:** `Authorization: Bearer <accessToken>`

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `latitude` | number | Vĩ độ (required) |
| `longitude` | number | Kinh độ (required) |
| `radius` | number | Bán kính tìm kiếm (km), default: 5, max: 50 |
| `category` | string | Lọc theo category sản phẩm |
| `sort` | string | Sort by: `distance`, `rating`, `popular` |

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "shop_abc123",
      "name": "WearWhere Store - Quận 1",
      "address": "123 Nguyễn Huệ, Quận 1, TP.HCM",
      "location": {
        "latitude": 10.7731,
        "longitude": 106.7030
      },
      "distance": 0.5,
      "distanceUnit": "km",
      "rating": 4.8,
      "totalReviews": 256,
      "images": [
        "https://cdn.wearwhere.com/shops/shop_abc123_1.jpg"
      ],
      "openingHours": {
        "today": {
          "open": "09:00",
          "close": "22:00",
          "isOpen": true
        },
        "schedule": [
          { "day": "monday", "open": "09:00", "close": "22:00" },
          { "day": "tuesday", "open": "09:00", "close": "22:00" },
          { "day": "sunday", "open": "10:00", "close": "21:00" }
        ]
      },
      "phone": "+84123456789",
      "sellerId": "seller_001",
      "categories": ["Áo", "Quần", "Phụ kiện"]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 15,
    "totalPages": 1
  }
}
```

---

### Get Shop Details

**Endpoint:** `GET /shops/:shopId`

**Response:** `200 OK`
```json
{
  "id": "shop_abc123",
  "name": "WearWhere Store - Quận 1",
  "description": "Cửa hàng thời trang WearWhere với đầy đủ các mẫu mới nhất",
  "address": "123 Nguyễn Huệ, Quận 1, TP.HCM",
  "location": {
    "latitude": 10.7731,
    "longitude": 106.7030
  },
  "rating": 4.8,
  "totalReviews": 256,
  "images": [
    "https://cdn.wearwhere.com/shops/shop_abc123_1.jpg",
    "https://cdn.wearwhere.com/shops/shop_abc123_2.jpg"
  ],
  "openingHours": {
    "today": {
      "open": "09:00",
      "close": "22:00",
      "isOpen": true
    },
    "schedule": [
      { "day": "monday", "open": "09:00", "close": "22:00" },
      { "day": "tuesday", "open": "09:00", "close": "22:00" },
      { "day": "wednesday", "open": "09:00", "close": "22:00" },
      { "day": "thursday", "open": "09:00", "close": "22:00" },
      { "day": "friday", "open": "09:00", "close": "22:00" },
      { "day": "saturday", "open": "09:00", "close": "22:00" },
      { "day": "sunday", "open": "10:00", "close": "21:00" }
    ]
  },
  "phone": "+84123456789",
  "email": "q1@wearwhere.com",
  "seller": {
    "id": "seller_001",
    "name": "WearWhere Originals",
    "logo": "https://cdn.wearwhere.com/sellers/seller_001_logo.jpg",
    "isVerified": true
  },
  "categories": ["Áo", "Quần", "Phụ kiện"],
  "amenities": ["parking", "wifi", "fitting_room", "air_conditioning"],
  "isFavorite": false
}
```

---

### Get Directions to Shop

Lấy chỉ đường từ vị trí hiện tại đến shop.

**Endpoint:** `GET /shops/:shopId/directions`

**Headers:** `Authorization: Bearer <accessToken>`

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `originLat` | number | Vĩ độ điểm xuất phát (required) |
| `originLng` | number | Kinh độ điểm xuất phát (required) |
| `mode` | string | Phương tiện: `driving`, `walking`, `bicycling`, `transit` (default: `driving`) |

**Response:** `200 OK`
```json
{
  "origin": {
    "latitude": 10.7769,
    "longitude": 106.7009,
    "address": "Vị trí của bạn"
  },
  "destination": {
    "latitude": 10.7731,
    "longitude": 106.7030,
    "address": "123 Nguyễn Huệ, Quận 1, TP.HCM",
    "shopName": "WearWhere Store - Quận 1"
  },
  "distance": {
    "value": 1200,
    "text": "1.2 km"
  },
  "duration": {
    "value": 480,
    "text": "8 phút"
  },
  "mode": "driving",
  "polyline": "encodedPolylineString...",
  "steps": [
    {
      "instruction": "Đi về hướng Đông trên Đường Lê Lợi",
      "distance": { "value": 500, "text": "500 m" },
      "duration": { "value": 120, "text": "2 phút" },
      "startLocation": { "latitude": 10.7769, "longitude": 106.7009 },
      "endLocation": { "latitude": 10.7750, "longitude": 106.7020 }
    },
    {
      "instruction": "Rẽ phải vào Nguyễn Huệ",
      "distance": { "value": 700, "text": "700 m" },
      "duration": { "value": 360, "text": "6 phút" },
      "startLocation": { "latitude": 10.7750, "longitude": 106.7020 },
      "endLocation": { "latitude": 10.7731, "longitude": 106.7030 }
    }
  ],
  "mapsUrl": "https://maps.google.com/maps?saddr=10.7769,106.7009&daddr=10.7731,106.7030"
}
```

---

### Add Shop to Favorites

**Endpoint:** `POST /shops/:shopId/favorite`

**Headers:** `Authorization: Bearer <accessToken>`

**Request Body:**
```json
{
  "favorite": true
}
```

**Response:** `200 OK`
```json
{
  "isFavorite": true
}
```

---

### Get Favorite Shops

**Endpoint:** `GET /users/me/favorite-shops`

**Headers:** `Authorization: Bearer <accessToken>`

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "shop_abc123",
      "name": "WearWhere Store - Quận 1",
      "address": "123 Nguyễn Huệ, Quận 1, TP.HCM",
      "image": "https://cdn.wearwhere.com/shops/shop_abc123_1.jpg",
      "rating": 4.8,
      "addedAt": "2024-02-01T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5,
    "totalPages": 1
  }
}
```

---

### Get Shop Products

Lấy sản phẩm có sẵn tại shop (inventory).

**Endpoint:** `GET /shops/:shopId/products`

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `category` | string | Lọc theo category |
| `inStock` | boolean | Chỉ hiển thị sản phẩm còn hàng |

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "prod_abc123",
      "name": "Classic Denim Jacket",
      "price": 89.99,
      "salePrice": 69.99,
      "image": "https://cdn.wearwhere.com/products/prod_abc123_1.jpg",
      "inStock": true,
      "availableSizes": ["S", "M", "L"]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "totalPages": 3
  }
}
```

---

## Chatbot (Fashion Assistant)

Chatbot AI hỗ trợ tư vấn phối đồ, trả lời câu hỏi về thời trang và sản phẩm.

### Start Chat Session

Tạo phiên chat mới với chatbot.

**Endpoint:** `POST /chatbot/sessions`

**Headers:** `Authorization: Bearer <accessToken>`

**Request Body:**
```json
{
  "context": "styling"
}
```

**Context options:** `styling` (phối đồ), `product_inquiry` (hỏi về sản phẩm), `general` (chung)

**Response:** `201 Created`
```json
{
  "sessionId": "chat_abc123",
  "context": "styling",
  "createdAt": "2024-02-01T10:00:00Z",
  "welcomeMessage": "Xin chào! Tôi là Fashion Assistant của WearWhere. Tôi có thể giúp bạn phối đồ, tư vấn style phù hợp. Bạn cần hỗ trợ gì hôm nay?"
}
```

---

### Send Message

Gửi tin nhắn và nhận phản hồi từ chatbot.

**Endpoint:** `POST /chatbot/sessions/:sessionId/messages`

**Headers:** `Authorization: Bearer <accessToken>`

**Request Body:**
```json
{
  "message": "Tôi có một chiếc áo sơ mi trắng, nên phối với quần gì?",
  "attachments": []
}
```

**Request Body với ảnh (hỏi về outfit):**
```json
{
  "message": "Outfit này của tôi có đẹp không? Cần cải thiện gì?",
  "attachments": [
    {
      "type": "image",
      "url": "https://cdn.wearwhere.com/uploads/user_outfit_123.jpg"
    }
  ]
}
```

**Request Body hỏi về sản phẩm:**
```json
{
  "message": "Chiếc áo này có những size nào?",
  "attachments": [
    {
      "type": "product",
      "productId": "prod_abc123"
    }
  ]
}
```

**Response:** `200 OK`
```json
{
  "id": "msg_abc123",
  "sessionId": "chat_abc123",
  "role": "assistant",
  "content": "Áo sơ mi trắng là item rất dễ phối đồ! Đây là một số gợi ý cho bạn:\n\n1. **Casual**: Quần jeans xanh + giày sneakers\n2. **Smart Casual**: Quần chinos màu be/navy + loafers\n3. **Formal**: Quần tây đen/xám + giày oxford\n\nBạn muốn xem những sản phẩm cụ thể nào không?",
  "suggestedProducts": [
    {
      "id": "prod_def456",
      "name": "Classic Blue Jeans",
      "price": 59.99,
      "image": "https://cdn.wearwhere.com/products/prod_def456_1.jpg",
      "matchReason": "Phối casual với áo sơ mi trắng"
    },
    {
      "id": "prod_ghi789",
      "name": "Beige Chinos",
      "price": 49.99,
      "image": "https://cdn.wearwhere.com/products/prod_ghi789_1.jpg",
      "matchReason": "Phối smart casual"
    }
  ],
  "quickReplies": [
    "Xem thêm quần jeans",
    "Tư vấn thêm về smart casual",
    "Gợi ý giày phù hợp"
  ],
  "createdAt": "2024-02-01T10:01:00Z"
}
```

---

### Get Chat History

Lấy lịch sử chat của một session.

**Endpoint:** `GET /chatbot/sessions/:sessionId/messages`

**Headers:** `Authorization: Bearer <accessToken>`

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `before` | string | Lấy tin nhắn trước message ID này |
| `limit` | number | Số tin nhắn tối đa (default: 50) |

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "msg_001",
      "role": "assistant",
      "content": "Xin chào! Tôi là Fashion Assistant...",
      "createdAt": "2024-02-01T10:00:00Z"
    },
    {
      "id": "msg_002",
      "role": "user",
      "content": "Tôi có một chiếc áo sơ mi trắng...",
      "createdAt": "2024-02-01T10:00:30Z"
    },
    {
      "id": "msg_003",
      "role": "assistant",
      "content": "Áo sơ mi trắng là item rất dễ phối đồ...",
      "suggestedProducts": [...],
      "createdAt": "2024-02-01T10:01:00Z"
    }
  ],
  "hasMore": false
}
```

---

### Get Chat Sessions

Lấy danh sách các phiên chat.

**Endpoint:** `GET /chatbot/sessions`

**Headers:** `Authorization: Bearer <accessToken>`

**Response:** `200 OK`
```json
{
  "data": [
    {
      "sessionId": "chat_abc123",
      "context": "styling",
      "lastMessage": "Áo sơ mi trắng là item rất dễ phối đồ...",
      "messagesCount": 10,
      "createdAt": "2024-02-01T10:00:00Z",
      "updatedAt": "2024-02-01T10:15:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5,
    "totalPages": 1
  }
}
```

---

### Delete Chat Session

**Endpoint:** `DELETE /chatbot/sessions/:sessionId`

**Headers:** `Authorization: Bearer <accessToken>`

**Response:** `204 No Content`

---

### Rate Chatbot Response

Đánh giá phản hồi của chatbot để cải thiện chất lượng.

**Endpoint:** `POST /chatbot/messages/:messageId/feedback`

**Headers:** `Authorization: Bearer <accessToken>`

**Request Body:**
```json
{
  "rating": "helpful",
  "comment": "Gợi ý rất hữu ích!"
}
```

**Rating options:** `helpful`, `not_helpful`, `incorrect`

**Response:** `200 OK`
```json
{
  "message": "Thank you for your feedback!"
}
```

---

## Smart Wardrobe (Tủ Đồ Thông Minh)

Hệ thống AI gợi ý phối đồ dựa trên sản phẩm đã mua của người dùng kết hợp với sản phẩm trên thị trường.

### Get My Wardrobe

Lấy danh sách đồ trong tủ đồ (sản phẩm đã mua).

**Endpoint:** `GET /wardrobe`

**Headers:** `Authorization: Bearer <accessToken>`

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `category` | string | Lọc theo category: `tops`, `bottoms`, `outerwear`, `shoes`, `accessories` |
| `color` | string | Lọc theo màu |
| `season` | string | Lọc theo mùa: `spring`, `summer`, `fall`, `winter`, `all_season` |

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "wardrobe_item_001",
      "product": {
        "id": "prod_abc123",
        "name": "Classic Denim Jacket",
        "brand": "WearWhere Originals",
        "image": "https://cdn.wearwhere.com/products/prod_abc123_1.jpg"
      },
      "variant": {
        "size": "M",
        "color": "Blue",
        "colorCode": "#4169E1"
      },
      "category": "outerwear",
      "seasons": ["spring", "fall"],
      "purchasedAt": "2024-01-15T10:00:00Z",
      "timesWorn": 5,
      "lastWornAt": "2024-02-01T08:00:00Z",
      "isFavorite": true
    },
    {
      "id": "wardrobe_item_002",
      "product": {
        "id": "prod_def456",
        "name": "White Basic Tee",
        "brand": "WearWhere Basics",
        "image": "https://cdn.wearwhere.com/products/prod_def456_1.jpg"
      },
      "variant": {
        "size": "M",
        "color": "White",
        "colorCode": "#FFFFFF"
      },
      "category": "tops",
      "seasons": ["all_season"],
      "purchasedAt": "2024-01-10T10:00:00Z",
      "timesWorn": 12,
      "lastWornAt": "2024-02-02T08:00:00Z",
      "isFavorite": false
    }
  ],
  "summary": {
    "totalItems": 25,
    "byCategory": {
      "tops": 10,
      "bottoms": 6,
      "outerwear": 3,
      "shoes": 4,
      "accessories": 2
    }
  },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 25,
    "totalPages": 2
  }
}
```

---

### Get AI Outfit Suggestions

Lấy gợi ý phối đồ từ AI dựa trên tủ đồ và sản phẩm trên thị trường.

**Endpoint:** `GET /wardrobe/suggestions`

**Headers:** `Authorization: Bearer <accessToken>`

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `occasion` | string | Dịp: `casual`, `work`, `date`, `party`, `sport`, `travel` |
| `weather` | string | Thời tiết: `hot`, `warm`, `cool`, `cold`, `rainy` |
| `style` | string | Phong cách: `minimalist`, `streetwear`, `classic`, `trendy`, `bohemian` |
| `baseItemId` | string | ID item trong tủ đồ làm base để phối |

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "suggestion_001",
      "name": "Casual Friday Look",
      "description": "Outfit thoải mái cho ngày thường, dễ mix-match",
      "occasion": "casual",
      "style": "minimalist",
      "items": {
        "fromWardrobe": [
          {
            "id": "wardrobe_item_001",
            "role": "outerwear",
            "product": {
              "id": "prod_abc123",
              "name": "Classic Denim Jacket",
              "image": "https://cdn.wearwhere.com/products/prod_abc123_1.jpg"
            }
          },
          {
            "id": "wardrobe_item_002",
            "role": "top",
            "product": {
              "id": "prod_def456",
              "name": "White Basic Tee",
              "image": "https://cdn.wearwhere.com/products/prod_def456_1.jpg"
            }
          }
        ],
        "suggested": [
          {
            "role": "bottom",
            "product": {
              "id": "prod_ghi789",
              "name": "Slim Fit Chinos",
              "price": 49.99,
              "salePrice": 39.99,
              "image": "https://cdn.wearwhere.com/products/prod_ghi789_1.jpg",
              "inStock": true
            },
            "reason": "Màu be trung tính phối đẹp với denim jacket"
          },
          {
            "role": "shoes",
            "product": {
              "id": "prod_jkl012",
              "name": "White Sneakers",
              "price": 79.99,
              "image": "https://cdn.wearwhere.com/products/prod_jkl012_1.jpg",
              "inStock": true
            },
            "reason": "Giày trắng clean, hoàn thiện look minimal"
          }
        ]
      },
      "previewImage": "https://cdn.wearwhere.com/ai/outfit_preview_001.jpg",
      "matchScore": 95,
      "tips": "Xắn tay áo jacket lên để tạo vẻ casual hơn. Có thể thêm đồng hồ hoặc vòng tay đơn giản."
    },
    {
      "id": "suggestion_002",
      "name": "Smart Casual Date",
      "description": "Outfit lịch sự nhưng không quá formal cho buổi hẹn",
      "occasion": "date",
      "style": "classic",
      "items": {
        "fromWardrobe": [...],
        "suggested": [...]
      },
      "previewImage": "https://cdn.wearwhere.com/ai/outfit_preview_002.jpg",
      "matchScore": 88,
      "tips": "Thêm nước hoa nhẹ và túi xách da sẽ hoàn thiện look này."
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 15,
    "totalPages": 2
  }
}
```

---

### Save Outfit

Lưu outfit vào bộ sưu tập.

**Endpoint:** `POST /wardrobe/outfits`

**Headers:** `Authorization: Bearer <accessToken>`

**Request Body:**
```json
{
  "name": "My Casual Friday",
  "suggestionId": "suggestion_001",
  "wardrobeItemIds": ["wardrobe_item_001", "wardrobe_item_002"],
  "suggestedProductIds": ["prod_ghi789", "prod_jkl012"],
  "notes": "Outfit cho đi làm ngày thường"
}
```

**Response:** `201 Created`
```json
{
  "id": "outfit_abc123",
  "name": "My Casual Friday",
  "items": {
    "fromWardrobe": [...],
    "suggested": [...]
  },
  "notes": "Outfit cho đi làm ngày thường",
  "createdAt": "2024-02-01T10:00:00Z"
}
```

---

### Get Saved Outfits

**Endpoint:** `GET /wardrobe/outfits`

**Headers:** `Authorization: Bearer <accessToken>`

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "outfit_abc123",
      "name": "My Casual Friday",
      "previewImage": "https://cdn.wearwhere.com/outfits/outfit_abc123_preview.jpg",
      "itemsCount": 4,
      "createdAt": "2024-02-01T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 8,
    "totalPages": 1
  }
}
```

---

### Get Outfit Detail

**Endpoint:** `GET /wardrobe/outfits/:outfitId`

**Headers:** `Authorization: Bearer <accessToken>`

**Response:** `200 OK`
```json
{
  "id": "outfit_abc123",
  "name": "My Casual Friday",
  "items": {
    "fromWardrobe": [
      {
        "id": "wardrobe_item_001",
        "role": "outerwear",
        "product": {
          "id": "prod_abc123",
          "name": "Classic Denim Jacket",
          "image": "https://cdn.wearwhere.com/products/prod_abc123_1.jpg"
        }
      }
    ],
    "suggested": [
      {
        "role": "bottom",
        "product": {
          "id": "prod_ghi789",
          "name": "Slim Fit Chinos",
          "price": 49.99,
          "image": "https://cdn.wearwhere.com/products/prod_ghi789_1.jpg",
          "inStock": true,
          "isPurchased": false
        }
      }
    ]
  },
  "notes": "Outfit cho đi làm ngày thường",
  "timesWorn": 3,
  "lastWornAt": "2024-02-05T08:00:00Z",
  "createdAt": "2024-02-01T10:00:00Z"
}
```

---

### Delete Outfit

**Endpoint:** `DELETE /wardrobe/outfits/:outfitId`

**Headers:** `Authorization: Bearer <accessToken>`

**Response:** `204 No Content`

---

### Log Outfit Worn

Ghi nhận đã mặc outfit (để AI học và gợi ý tốt hơn).

**Endpoint:** `POST /wardrobe/outfits/:outfitId/worn`

**Headers:** `Authorization: Bearer <accessToken>`

**Request Body:**
```json
{
  "wornAt": "2024-02-05T08:00:00Z",
  "occasion": "work",
  "weather": "warm",
  "rating": 5,
  "notes": "Rất thoải mái, được khen nhiều"
}
```

**Response:** `200 OK`
```json
{
  "message": "Outfit logged successfully",
  "timesWorn": 4,
  "lastWornAt": "2024-02-05T08:00:00Z"
}
```

---

### Update Wardrobe Item

Cập nhật thông tin item trong tủ đồ.

**Endpoint:** `PATCH /wardrobe/:itemId`

**Headers:** `Authorization: Bearer <accessToken>`

**Request Body:**
```json
{
  "isFavorite": true,
  "customCategory": "going_out",
  "seasons": ["spring", "summer"]
}
```

**Response:** `200 OK`
```json
{
  "id": "wardrobe_item_001",
  "isFavorite": true,
  "customCategory": "going_out",
  "seasons": ["spring", "summer"],
  "updatedAt": "2024-02-05T10:00:00Z"
}
```

---

### Get Style Analysis

Phân tích phong cách dựa trên tủ đồ của người dùng.

**Endpoint:** `GET /wardrobe/analysis`

**Headers:** `Authorization: Bearer <accessToken>`

**Response:** `200 OK`
```json
{
  "dominantStyles": [
    { "style": "minimalist", "percentage": 45 },
    { "style": "casual", "percentage": 30 },
    { "style": "streetwear", "percentage": 25 }
  ],
  "colorPalette": [
    { "color": "Blue", "colorCode": "#4169E1", "percentage": 30 },
    { "color": "White", "colorCode": "#FFFFFF", "percentage": 25 },
    { "color": "Black", "colorCode": "#000000", "percentage": 20 },
    { "color": "Beige", "colorCode": "#F5F5DC", "percentage": 15 },
    { "color": "Gray", "colorCode": "#808080", "percentage": 10 }
  ],
  "wardrobeGaps": [
    {
      "category": "accessories",
      "message": "Tủ đồ của bạn còn thiếu phụ kiện. Thêm đồng hồ hoặc túi xách sẽ giúp outfit hoàn thiện hơn.",
      "suggestedProducts": [
        {
          "id": "prod_mno345",
          "name": "Leather Watch",
          "price": 99.99,
          "image": "https://cdn.wearwhere.com/products/prod_mno345_1.jpg"
        }
      ]
    },
    {
      "category": "outerwear",
      "message": "Bạn chỉ có 1 áo khoác. Thêm blazer sẽ đa dạng hóa các outfit formal.",
      "suggestedProducts": [...]
    }
  ],
  "recommendations": [
    "Phong cách của bạn thiên về minimalist - hãy đầu tư vào những item chất lượng, màu trung tính",
    "Thêm 1-2 statement pieces để tạo điểm nhấn cho outfit",
    "Cân nhắc mua thêm giày formal để đa dạng hóa wardrobe"
  ]
}
```

---

## Error Handling

### Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 204 | No Content - Successful deletion |
| 400 | Bad Request - Invalid request data |
| 401 | Unauthorized - Invalid or missing authentication |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 422 | Unprocessable Entity - Validation error |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |

### Common Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Request validation failed |
| `AUTHENTICATION_ERROR` | Invalid credentials or token |
| `AUTHORIZATION_ERROR` | Insufficient permissions |
| `NOT_FOUND` | Resource not found |
| `ALREADY_EXISTS` | Resource already exists |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `INVALID_OPERATION` | Operation not allowed |
| `POST_LIMIT_EXCEEDED` | Maximum posts limit reached |
| `INVALID_PRODUCT_TAG` | Product ID not found |
| `CART_EMPTY` | Cart is empty |
| `ITEM_OUT_OF_STOCK` | Product variant is out of stock |
| `QUANTITY_EXCEEDED` | Requested quantity exceeds available stock |
| `VOUCHER_INVALID` | Voucher code is invalid |
| `VOUCHER_EXPIRED` | Voucher has expired |
| `VOUCHER_MIN_ORDER` | Order value does not meet minimum requirement |
| `ORDER_CANNOT_CANCEL` | Order cannot be cancelled at current status |
| `RETURN_WINDOW_EXPIRED` | Return window has expired (7 days) |
| `RETURN_NOT_ELIGIBLE` | Order is not eligible for return |
| `PAYMENT_FAILED` | Payment processing failed |
| `PAYMENT_DECLINED` | Payment was declined by bank/provider |
| `CARD_INVALID` | Invalid card information |
| `CARD_EXPIRED` | Card has expired |
| `INSUFFICIENT_FUNDS` | Insufficient funds |
| `REFUND_FAILED` | Refund processing failed |
| `PAYMENT_ALREADY_COMPLETED` | Payment already completed for this order |
| `LOCATION_REQUIRED` | User location is required |
| `SHOP_NOT_FOUND` | Shop not found |
| `DIRECTIONS_UNAVAILABLE` | Unable to calculate directions |
| `CHAT_SESSION_NOT_FOUND` | Chat session not found |
| `CHAT_SESSION_EXPIRED` | Chat session has expired |
| `MESSAGE_TOO_LONG` | Message exceeds maximum length |
| `WARDROBE_ITEM_NOT_FOUND` | Wardrobe item not found |
| `OUTFIT_NOT_FOUND` | Outfit not found |
| `AI_SERVICE_UNAVAILABLE` | AI service temporarily unavailable |
| `DELIVERY_NOT_FOUND` | Delivery information not found |
| `DELIVERY_NOT_ACTIVE` | No active delivery for this order |
| `SHIPPER_NOT_ASSIGNED` | Shipper has not been assigned yet |
| `DELIVERY_ALREADY_CONFIRMED` | Delivery has already been confirmed |
| `CANNOT_CONTACT_SHIPPER` | Unable to contact shipper at this time |
| `DELIVERY_INSTRUCTIONS_LOCKED` | Cannot update instructions at this delivery stage |

---

## Rate Limiting

API requests are limited to:
- **Authenticated users:** 1000 requests per hour
- **Unauthenticated users:** 100 requests per hour

Rate limit headers included in responses:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1706187600
```

---

## Webhooks (Optional)

For order and post events, webhooks can be configured in the merchant dashboard.

### Order Events

| Event | Description |
|-------|-------------|
| `order.created` | New order placed |
| `order.paid` | Order payment completed |
| `order.shipped` | Order has been shipped |
| `order.delivered` | Order has been delivered |
| `order.cancelled` | Order was cancelled |
| `return.requested` | Return/refund requested |
| `return.approved` | Return request approved |
| `return.completed` | Return and refund completed |
| `payment.completed` | Payment successful |
| `payment.failed` | Payment failed |
| `refund.completed` | Refund processed successfully |
| `delivery.shipper_assigned` | Shipper assigned to order |
| `delivery.picked_up` | Shipper picked up package |
| `delivery.in_transit` | Package in transit |
| `delivery.out_for_delivery` | Shipper nearby destination |
| `delivery.delivered` | Package delivered successfully |
| `delivery.failed` | Delivery attempt failed |

**Webhook Payload Example:**
```json
{
  "event": "order.shipped",
  "timestamp": "2024-01-26T09:00:00Z",
  "data": {
    "orderId": "ord_abc123",
    "orderNumber": "WW-2024-00001",
    "userId": "usr_abc123",
    "status": "shipped",
    "trackingNumber": "794644790138"
  }
}
```

---

### Post Events

| Event | Description |
|-------|-------------|
| `post.created` | New post published |
| `post.updated` | Post was updated |
| `post.deleted` | Post was deleted |
| `post.reported` | Post was reported |

### News Events

| Event | Description |
|-------|-------------|
| `news.published` | New news article published |
| `news.updated` | News article was updated |
| `news.deleted` | News article was deleted |

### Wardrobe Events

| Event | Description |
|-------|-------------|
| `wardrobe.item_added` | New item added to wardrobe (after purchase delivered) |
| `outfit.created` | New outfit saved |
| `outfit.worn` | User logged wearing an outfit |

**Webhook Payload Example:**
```json
{
  "event": "post.created",
  "timestamp": "2024-02-01T15:30:00Z",
  "data": {
    "postId": "post_abc123",
    "userId": "usr_abc123",
    "taggedProductIds": ["prod_abc123", "prod_def456"]
  }
}
```

---

## SDK Examples

### JavaScript/TypeScript

```javascript
// Create a post with images and tagged products
const formData = new FormData();
formData.append('images', imageFile1);
formData.append('images', imageFile2);
formData.append('caption', 'Outfit hôm nay đi cafe ☕');
formData.append('taggedProductIds', JSON.stringify(['prod_abc123', 'prod_def456']));

const response = await fetch('https://api.wearwhere.com/v1/posts', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  },
  body: formData
});

const post = await response.json();
```

### cURL

```bash
# Create a post
curl -X POST https://api.wearwhere.com/v1/posts \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.jpg" \
  -F "caption=Outfit hôm nay đi cafe ☕" \
  -F 'taggedProductIds=["prod_abc123", "prod_def456"]'
```

---

## Changelog

### v1.0.0 (2024-01-15)
- Initial API release
- Authentication endpoints
- User management with follow system
- Product catalog
- Order management
- Social posts system with image uploads and product tagging
