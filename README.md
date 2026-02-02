# Chat App API

A modern, robust Chat Application API built with Node.js, Express, and MySQL. It supports private direct messages, group chats, and real-time-ready message history.

## Features

- **Authentication**: Secure registration and login using JWT and Bcrypt.
- **Conversations**: Create direct (1-on-1) or group chats.
- **Participants**: Manage group chat members.
- **Messages**: Send and retrieve message history with sender information.
- **User Search**: Search users by email for easy connection.
- **Robust Error Handling**: Standardized JSON responses for all success and error cases.
- **Security**: Rate limiting and secure password hashing.

## Prerequisites

- **Node.js**: v18 or higher recommended.
- **MySQL**: v8.0 or higher.
- **Postman/Curl**: For API testing.

## Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd node-day-5-api
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Configuration**:
   Create a `.env` file in the root directory (you can copy from `.env.example`):
   ```env
   NODE_ENV=development
   PORT=3000
   
   # Database configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASS=your_password
   DB_NAME=chat_app_db
   
   # Auth configuration
   AUTH_JWT_SECRET=your_super_secret_key
   AUTH_ACCESS_TOKEN_TTL=3600
   ```

## Database Schema

Run the following SQL commands to set up your database structure:

```sql
CREATE DATABASE IF NOT EXISTS chat_app_db;
USE chat_app_db;

-- 1. Users table
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Conversations table
CREATE TABLE IF NOT EXISTS `conversations` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `created_by` bigint unsigned NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `type` enum('group','direct') NOT NULL DEFAULT 'direct',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_conversations_created_by` (`created_by`),
  CONSTRAINT `fk_conversations_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Conversation Participants table
CREATE TABLE IF NOT EXISTS `conversation_participants` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `conversation_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_participant` (`conversation_id`,`user_id`),
  KEY `fk_participants_user_id` (`user_id`),
  CONSTRAINT `fk_participants_conversation_id` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_participants_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Messages table
CREATE TABLE IF NOT EXISTS `messages` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `conversation_id` bigint unsigned NOT NULL,
  `sender_id` bigint unsigned NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_messages_conversation_id` (`conversation_id`),
  KEY `fk_messages_sender_id` (`sender_id`),
  CONSTRAINT `fk_messages_conversation_id` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_messages_sender_id` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## Running the Application

- **Development Mode** (with auto-reload):
  ```bash
  npm run dev
  ```

- **Production Mode**:
  ```bash
  npm start
  ```

The API will be available at `http://localhost:3000/api`.

## API Documentation & Demo

### 1. Authentication

**Register a new user:**
- `POST /api/auth/register`
- Body: `{"email": "user@example.com", "password": "password123"}`

**Login:**
- `POST /api/auth/login`
- Body: `{"email": "user@example.com", "password": "password123"}`
- Returns: `accessToken`

### 2. Conversations

**Create a new conversation:**
- `POST /api/conversations` (Auth Required)
- Body: `{"name": "Project Group", "type": "group", "participant_ids": [2, 3]}`

**Get all conversations for current user:**
- `GET /api/conversations` (Auth Required)

**Add a participant to a conversation:**
- `POST /api/conversations/:id/participants` (Auth Required)
- Body: `{"user_id": 4}`

### 3. Messages

**Send a message:**
- `POST /api/conversations/:id/messages` (Auth Required)
- Body: `{"content": "Hello everyone!"}`

**Get message history:**
- `GET /api/conversations/:id/messages` (Auth Required)

### 4. Users

**Search users by email:**
- `GET /api/users/search?q=user@example.com` (Auth Required)

## Response Format

All responses follow a consistent format:

**Success:**
```json
{
  "status": "success",
  "data": { ... }
}
```

**Error:**
```json
{
  "status": "error",
  "message": "Error description here",
  "error": { ... }
}
```
