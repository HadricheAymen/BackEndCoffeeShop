# Coffee Shop Backend API Documentation

Complete documentation of all API endpoints, their inputs, and expected outputs.

---

## Table of Contents
1. [Authentication API](#authentication-api)
2. [Coffee API](#coffee-api)
3. [Category API](#category-api)
4. [Orders API](#orders-api)
5. [Favorites API](#favorites-api)
6. [Reviews API](#reviews-api)

---

## Authentication API

### 1. Register User
**Endpoint:** `POST /api/auth/register`

**Rate Limited:** Yes (5 attempts per 15 minutes)

**Authentication:** None

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "username": "john_doe"
}
```

**Input Validation:**
- `email` (required): Valid email format
- `password` (required): Minimum 6 characters
- `username` (required): Minimum 3 characters

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "username": "john_doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (409):**
```json
{
  "success": false,
  "message": "Email already registered" | "Username already taken"
}
```

---

### 2. Login User
**Endpoint:** `POST /api/auth/login`

**Rate Limited:** Yes (5 attempts per 15 minutes)

**Authentication:** None

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Input Validation:**
- `email` (required): Valid email format
- `password` (required): String

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "username": "john_doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

## Coffee API

### 1. Get All Coffees
**Endpoint:** `GET /api/coffees`

**Authentication:** None

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `is_available` | boolean | true | Filter by availability status |

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "House Blend",
      "description": "A smooth and balanced blend",
      "price": 3.50,
      "category_id": 1,
      "category_name": "Espresso",
      "is_available": true,
      "average_rating": 4.5
    },
    {
      "id": 2,
      "name": "Single Origin",
      "description": "Premium single origin coffee",
      "price": 4.50,
      "category_id": 1,
      "category_name": "Espresso",
      "is_available": true,
      "average_rating": 4.7
    }
  ]
}
```

---

### 2. Get Coffees by Category
**Endpoint:** `GET /api/coffees/category/:categoryId`

**Authentication:** None

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `categoryId` | integer | The ID of the category |

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `is_available` | boolean | true | Filter by availability status |

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "category": {
      "id": 1,
      "name": "Espresso",
      "description": "Strong and bold coffee drinks"
    },
    "coffees": [
      {
        "id": 1,
        "name": "House Blend",
        "description": "A smooth and balanced blend",
        "price": 3.50,
        "category_id": 1,
        "category_name": "Espresso",
        "is_available": true,
        "average_rating": 4.5
      }
    ]
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Category not found"
}
```

---

### 3. Get Coffee by ID
**Endpoint:** `GET /api/coffees/:id`

**Authentication:** None

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | integer | The ID of the coffee |

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "House Blend",
    "description": "A smooth and balanced blend",
    "price": 3.50,
    "category_id": 1,
    "category_name": "Espresso",
    "is_available": true,
    "average_rating": 4.5
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Coffee not found"
}
```

---

### 4. Calculate Coffee Price
**Endpoint:** `POST /api/coffees/calculate-price`

**Authentication:** None

**Request Body:**
```json
{
  "coffee_id": 1,
  "cup_size": "medium"
}
```

**Input Validation:**
- `coffee_id` (required): Integer, valid coffee ID
- `cup_size` (required): Enum - `small`, `medium`, or `large`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "coffee_id": 1,
    "coffee_name": "House Blend",
    "cup_size": "medium",
    "base_price": 3.50,
    "size_modifier": 1.2,
    "calculated_price": 4.20
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Invalid cup_size or missing fields"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Coffee not found or not available"
}
```

---

## Category API

### 1. Get All Categories
**Endpoint:** `GET /api/categories`

**Authentication:** None

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Espresso",
      "description": "Strong and bold coffee drinks",
      "product_count": 5
    },
    {
      "id": 2,
      "name": "Latte",
      "description": "Smooth milk-based coffees",
      "product_count": 8
    }
  ]
}
```

---

### 2. Get Coffees by Category
**Endpoint:** `GET /api/categories/:id/coffees`

**Authentication:** None

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | integer | The ID of the category |

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | integer | 50 | Maximum number of results |
| `offset` | integer | 0 | Number of results to skip |

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "category": {
      "id": 1,
      "name": "Espresso",
      "description": "Strong and bold coffee drinks"
    },
    "coffees": [
      {
        "id": 1,
        "name": "House Blend",
        "description": "A smooth and balanced blend",
        "price": 3.50,
        "category_id": 1,
        "category_name": "Espresso",
        "is_available": true,
        "average_rating": 4.5
      }
    ]
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Category not found"
}
```

---

## Orders API

### 1. Create Order
**Endpoint:** `POST /api/orders`

**Authentication:** Required (Bearer Token)

**Request Body:**
```json
{
  "items": [
    {
      "coffee_id": 1,
      "quantity": 2,
      "cup_size": "medium",
      "sugar_level": "low"
    },
    {
      "coffee_id": 3,
      "quantity": 1,
      "cup_size": "large",
      "sugar_level": "high"
    }
  ]
}
```

**Input Validation:**
- `items` (required): Array with at least 1 item
- `coffee_id` (required): Integer, valid coffee ID
- `quantity` (required): Integer, minimum 1
- `cup_size` (required): Enum - `small`, `medium`, or `large`
- `sugar_level` (required): Enum - `none`, `low`, `medium`, or `high`

**Success Response (201):**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "id": 42,
    "user_id": 1,
    "status": "pending",
    "subtotal": 16.80,
    "discount": {
      "amount": 2.00,
      "type": "value"
    },
    "final_total": 14.80,
    "created_at": "2025-01-15T10:30:00Z",
    "items": [
      {
        "id": 101,
        "order_id": 42,
        "coffee_id": 1,
        "coffee_name": "House Blend",
        "quantity": 2,
        "cup_size": "medium",
        "sugar_level": "low",
        "unit_price": 4.20,
        "item_total": 8.40
      }
    ]
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Invalid request data"
}
```

---

### 2. Calculate Order Price
**Endpoint:** `POST /api/orders/calculate-price`

**Authentication:** None

**Request Body:**
```json
{
  "items": [
    {
      "coffee_id": 1,
      "quantity": 2,
      "cup_size": "medium",
      "sugar_level": "low"
    },
    {
      "coffee_id": 3,
      "quantity": 1,
      "cup_size": "large",
      "sugar_level": "high"
    }
  ]
}
```

**Input Validation:**
- `items` (required): Array with at least 1 item
- `coffee_id` (required): Integer, minimum 1
- `quantity` (required): Integer, minimum 1
- `cup_size` (required): Enum - `small`, `medium`, or `large`
- `sugar_level` (required): Enum - `none`, `low`, `medium`, or `high`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "coffee_id": 1,
        "coffee_name": "House Blend",
        "quantity": 2,
        "cup_size": "medium",
        "sugar_level": "low",
        "base_price": 3.50,
        "size_modifier": 1.2,
        "unit_price": 4.20,
        "item_total": 8.40
      },
      {
        "coffee_id": 3,
        "coffee_name": "Macchiato",
        "quantity": 1,
        "cup_size": "large",
        "sugar_level": "high",
        "base_price": 4.00,
        "size_modifier": 1.5,
        "unit_price": 6.00,
        "item_total": 6.00
      }
    ],
    "subtotal": 14.40,
    "total_quantity": 3,
    "discount": {
      "amount": 2.00,
      "type": "value"
    },
    "final_total": 12.40
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Invalid request data"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Coffee not found or not available"
}
```

---

### 3. Get Order History
**Endpoint:** `GET /api/orders`

**Authentication:** Required (Bearer Token)

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | integer | 10 | Maximum number of orders |
| `offset` | integer | 0 | Number of orders to skip |

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": 42,
        "user_id": 1,
        "status": "completed",
        "subtotal": 16.80,
        "discount": {
          "amount": 2.00,
          "type": "value"
        },
        "final_total": 14.80,
        "created_at": "2025-01-15T10:30:00Z",
        "items": [
          {
            "id": 101,
            "order_id": 42,
            "coffee_id": 1,
            "coffee_name": "House Blend",
            "quantity": 2,
            "cup_size": "medium",
            "sugar_level": "low",
            "unit_price": 4.20,
            "item_total": 8.40
          }
        ]
      }
    ],
    "pagination": {
      "limit": 10,
      "offset": 0,
      "count": 1
    }
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

---

### 4. Get Order by ID
**Endpoint:** `GET /api/orders/:id`

**Authentication:** Required (Bearer Token)

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | integer | The ID of the order |

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 42,
    "user_id": 1,
    "status": "completed",
    "subtotal": 16.80,
    "discount": {
      "amount": 2.00,
      "type": "value"
    },
    "final_total": 14.80,
    "created_at": "2025-01-15T10:30:00Z",
    "items": [
      {
        "id": 101,
        "order_id": 42,
        "coffee_id": 1,
        "coffee_name": "House Blend",
        "quantity": 2,
        "cup_size": "medium",
        "sugar_level": "low",
        "unit_price": 4.20,
        "item_total": 8.40
      }
    ]
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Order not found"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

---

### 5. Update Order Status
**Endpoint:** `PATCH /api/orders/:id/status`

**Authentication:** Required (Bearer Token)

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | integer | The ID of the order |

**Request Body:**
```json
{
  "status": "preparing"
}
```

**Input Validation:**
- `status` (required): Enum - `pending`, `preparing`, `ready`, `completed`, or `cancelled`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Order status updated successfully",
  "data": {
    "id": 42,
    "user_id": 1,
    "status": "preparing",
    "subtotal": 16.80,
    "discount": {
      "amount": 2.00,
      "type": "value"
    },
    "final_total": 14.80,
    "created_at": "2025-01-15T10:30:00Z",
    "updated_at": "2025-01-15T10:35:00Z"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Invalid status value"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Order not found"
}
```

---

## Favorites API

### 1. Add to Favorites
**Endpoint:** `POST /api/favorites`

**Authentication:** Required (Bearer Token)

**Request Body:**
```json
{
  "coffee_id": 1,
  "preferred_size": "medium",
  "preferred_sugar": "low"
}
```

**Input Validation:**
- `coffee_id` (required): Integer, valid coffee ID
- `preferred_size` (optional): Enum - `small`, `medium`, or `large`
- `preferred_sugar` (optional): Enum - `none`, `low`, `medium`, or `high`

**Success Response (201):**
```json
{
  "success": true,
  "message": "Coffee added to favorites",
  "data": {
    "id": 15,
    "user_id": 1,
    "coffee_id": 1,
    "coffee_name": "House Blend",
    "preferred_size": "medium",
    "preferred_sugar": "low",
    "created_at": "2025-01-15T10:30:00Z"
  }
}
```

**Error Response (409):**
```json
{
  "success": false,
  "message": "Coffee already in favorites"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

---

### 2. Get Favorites
**Endpoint:** `GET /api/favorites`

**Authentication:** Required (Bearer Token)

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 15,
      "user_id": 1,
      "coffee_id": 1,
      "coffee_name": "House Blend",
      "coffee_description": "A smooth and balanced blend",
      "price": 3.50,
      "category_name": "Espresso",
      "is_available": true,
      "average_rating": 4.5,
      "preferred_size": "medium",
      "preferred_sugar": "low",
      "created_at": "2025-01-15T10:30:00Z"
    },
    {
      "id": 16,
      "user_id": 1,
      "coffee_id": 3,
      "coffee_name": "Macchiato",
      "coffee_description": "Rich espresso with velvety microfoam",
      "price": 4.00,
      "category_name": "Espresso",
      "is_available": true,
      "average_rating": 4.7,
      "preferred_size": "large",
      "preferred_sugar": "none",
      "created_at": "2025-01-15T09:15:00Z"
    }
  ]
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

---

### 3. Remove from Favorites
**Endpoint:** `DELETE /api/favorites/:id`

**Authentication:** Required (Bearer Token)

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | integer | The ID of the favorite |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Coffee removed from favorites"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Favorite not found"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

---

## Reviews API

### 1. Create Review
**Endpoint:** `POST /api/reviews`

**Authentication:** Required (Bearer Token)

**Request Body:**
```json
{
  "coffee_id": 1,
  "rating": 5,
  "comment": "Excellent coffee! Smooth and aromatic.",
  "order_id": 42
}
```

**Input Validation:**
- `coffee_id` (required): Integer, valid coffee ID
- `rating` (required): Integer, range 1-5
- `comment` (optional): String, maximum 1000 characters
- `order_id` (optional): Integer, valid order ID

**Success Response (201):**
```json
{
  "success": true,
  "message": "Review submitted successfully",
  "data": {
    "id": 89,
    "user_id": 1,
    "coffee_id": 1,
    "coffee_name": "House Blend",
    "rating": 5,
    "comment": "Excellent coffee! Smooth and aromatic.",
    "order_id": 42,
    "created_at": "2025-01-15T10:30:00Z"
  }
}
```

**Error Response (409):**
```json
{
  "success": false,
  "message": "User has already reviewed this coffee"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

---

### 2. Get Reviews by Coffee
**Endpoint:** `GET /api/reviews/coffee/:coffeeId`

**Authentication:** None

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `coffeeId` | integer | The ID of the coffee |

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | integer | 10 | Maximum number of reviews |
| `offset` | integer | 0 | Number of reviews to skip |

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "coffee": {
      "id": 1,
      "name": "House Blend",
      "average_rating": 4.5,
      "total_reviews": 8
    },
    "reviews": [
      {
        "id": 89,
        "user_id": 1,
        "username": "john_doe",
        "coffee_id": 1,
        "rating": 5,
        "comment": "Excellent coffee! Smooth and aromatic.",
        "order_id": 42,
        "created_at": "2025-01-15T10:30:00Z"
      },
      {
        "id": 90,
        "user_id": 2,
        "username": "jane_smith",
        "coffee_id": 1,
        "rating": 4,
        "comment": "Great taste, very consistent.",
        "order_id": 43,
        "created_at": "2025-01-14T15:20:00Z"
      }
    ],
    "pagination": {
      "limit": 10,
      "offset": 0,
      "count": 2
    }
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Coffee not found"
}
```

---

### 3. Get User's Reviews
**Endpoint:** `GET /api/reviews/user`

**Authentication:** Required (Bearer Token)

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | integer | 10 | Maximum number of reviews |
| `offset` | integer | 0 | Number of reviews to skip |

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "id": 89,
        "user_id": 1,
        "coffee_id": 1,
        "coffee_name": "House Blend",
        "rating": 5,
        "comment": "Excellent coffee! Smooth and aromatic.",
        "order_id": 42,
        "created_at": "2025-01-15T10:30:00Z"
      },
      {
        "id": 91,
        "user_id": 1,
        "coffee_id": 3,
        "coffee_name": "Macchiato",
        "rating": 4,
        "comment": "Nice espresso with good microfoam.",
        "order_id": 44,
        "created_at": "2025-01-14T12:45:00Z"
      }
    ],
    "pagination": {
      "limit": 10,
      "offset": 0,
      "count": 2
    }
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

---

### 4. Update Review
**Endpoint:** `PUT /api/reviews/:id`

**Authentication:** Required (Bearer Token)

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | integer | The ID of the review |

**Request Body:**
```json
{
  "rating": 4,
  "comment": "Good coffee, but a bit stronger than expected."
}
```

**Input Validation:**
- `rating` (optional): Integer, range 1-5
- `comment` (optional): String, maximum 1000 characters

**Success Response (200):**
```json
{
  "success": true,
  "message": "Review updated successfully",
  "data": {
    "id": 89,
    "user_id": 1,
    "coffee_id": 1,
    "coffee_name": "House Blend",
    "rating": 4,
    "comment": "Good coffee, but a bit stronger than expected.",
    "order_id": 42,
    "created_at": "2025-01-15T10:30:00Z",
    "updated_at": "2025-01-15T11:45:00Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Review not found or unauthorized"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

---

### 5. Delete Review
**Endpoint:** `DELETE /api/reviews/:id`

**Authentication:** Required (Bearer Token)

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | integer | The ID of the review |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Review deleted successfully"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Review not found or unauthorized"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

---

## Common Response Patterns

### Error Response Structure
All error responses follow this pattern:
```json
{
  "success": false,
  "message": "Error message describing what went wrong"
}
```

### HTTP Status Codes
- `200` - OK: Successful GET, POST, PUT, PATCH, DELETE operations
- `201` - Created: Successful resource creation
- `400` - Bad Request: Invalid input data or validation error
- `401` - Unauthorized: Missing or invalid authentication token
- `404` - Not Found: Resource does not exist
- `409` - Conflict: Resource already exists (e.g., duplicate email)
- `500` - Internal Server Error: Server-side error

### Authentication
Protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Discount Types
The discount object in order responses contains:
- `amount`: Numeric discount value
- `type`: One of:
  - `quantity` - Discount based on quantity of items
  - `value` - Discount based on order value
  - `none` - No discount applied

---

## Size Modifiers
Cup sizes apply modifiers to base coffee price:
- `small`: 0.8x base price
- `medium`: 1.2x base price
- `large`: 1.5x base price
