# FOT News Backend

A Node.js backend for a mobile news app that provides user authentication and news management using a SQLite database.

---

## 🚀 Features

- User registration and login with bcrypt password hashing
- News article management (CRUD)
- RESTful API with JSON responses
- SQLite3 database (`fot-news-db`)
- CORS support for cross-origin requests

---

## 🛠 Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v14+)
- [Postman](https://postman.com/) or similar API client

### Setup Steps

```bash
# 1. Create and enter project directory
mkdir fot-news-backend
cd fot-news-backend

# 2. Initialize Node.js project
npm init -y

# 3. Install required dependencies
npm install express sqlite3 body-parser cors bcrypt

# 4. Add your server.js file to this directory

# 5. Start the server
node server.js
```

If everything works, the console will show:

```
Server running on port 3001
```

---

## 📡 API Endpoints

**Base URL:** `http://localhost:3001`

### User Endpoints

#### Register a New User

- **POST** `/register`
- **Request Body:**
  ```json
  {
    "username": "your_username",
    "email" : "your_email",
    "password": "your_password"
  }
  ```
- **Success Response:**
  ```json
  {
    "message": "User registered successfully"
  }
  ```

#### Login

- **POST** `/login`
- **Request Body:**
  ```json
  {
    "username": "your_username",
    "password": "your_password"
  }
  ```
- **Success Response:**
  ```json
  {
    "message": "Login successful"
  }
  ```

---

### News Endpoints

#### Get All News

- **GET** `/news`
- **Response:**
  ```json
  [
    {
      "id": 1,
      "title": "News Title",
      "content": "News Content",
      "author": "username"
    },
    ...
  ]
  ```

#### Create News

- **POST** `/news`
- **Request Body:**
  ```json
  {
    "title": "News Title",
    "content": "News Content",
    "author": "username"
  }
  ```
- **Success Response:**
  ```json
  {
    "message": "News created successfully"
  }
  ```

#### Get News by ID

- **GET** `/news/:id`
- **Response:**
  ```json
  {
    "id": 1,
    "title": "News Title",
    "content": "News Content",
    "author": "username"
  }
  ```

#### Update News by ID

- **PUT** `/news/:id`
- **Request Body:**
  ```json
  {
    "title": "Updated Title",
    "content": "Updated Content"
  }
  ```
- **Success Response:**
  ```json
  {
    "message": "News updated successfully"
  }
  ```

#### Delete News by ID

- **DELETE** `/news/:id`
- **Success Response:**
  ```json
  {
    "message": "News deleted successfully"
  }
  ```

---