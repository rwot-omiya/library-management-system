# Library Management System

A NestJS, Prisma, and PostgreSQL backend for a library book catalog, including catalog CRUD, JWT authentication, and librarian-only book management.

The repository also includes a Vite React client for patron-facing catalog browsing, debounced search, genre filtering, and book details.

## Requirements implemented

- `Role` enum with `PATRON` and `LIBRARIAN` values.
- `User` model using the `Role` enum.
- `Genre` model with a one-to-many relation to `Book`.
- `Book` model with a required `genreId` foreign key and Prisma `@relation`.
- Seed data containing 4 genres and 16 books distributed evenly across those genres.
- NestJS-compatible `PrismaService` that connects during `onModuleInit`.
- Safe `api/.env.example` containing a `DATABASE_URL` placeholder.
- Full CRUD endpoints for genres and books.
- DTO validation with `class-validator` and a global `ValidationPipe`.
- Patron registration and login with bcrypt password hashing and JWTs.
- `RolesGuard` protection for book create, update, and delete routes.
- Postman collection covering every endpoint in `docs/postman_collection.json`.
- Responsive React catalog client with skeleton loading, error, and empty states.

## Project structure

```text
api/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── auth/
│   ├── books/
│   ├── genres/
│   ├── prisma/
│   └── users/
├── .env.example
└── package.json
docs/postman_collection.json
client/
├── src/components/
├── src/pages/
├── src/App.jsx
└── .env
```

## Setup

1. Install dependencies:

   ```bash
   cd api
   npm install
   ```

2. Create a private environment file from the example:

   ```bash
   cp .env.example .env
   ```

3. Replace the database placeholder and set a strong JWT secret:

   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE_NAME?schema=public"
   JWT_SECRET="a-long-random-secret"
   JWT_EXPIRES_IN="1h"
   ```

4. Format and validate the schema:

   ```bash
   npm run prisma:format
   npm run prisma:validate
   npm run prisma:generate
   ```

5. Create and apply the migration:

   ```bash
   npm run prisma:migrate
   ```

6. Seed the database:

   ```bash
   npm run prisma:seed
   ```

7. Inspect the data if needed:

   ```bash
   npx prisma studio
   ```

### Frontend

From the repository root:

```bash
npm install
npm run dev --workspace client
```

The client reads the backend origin from `client/.env`:

```env
VITE_API_URL=http://localhost:3000
```

The catalog is available at `/`, and selecting a book opens `/books/:id`.

## API endpoints

### Genres

| Method | Route | Purpose |
| --- | --- | --- |
| `POST` | `/genres` | Create a genre |
| `GET` | `/genres` | List genres with book counts |
| `GET` | `/genres/:id` | Get one genre and its books |
| `PATCH` | `/genres/:id` | Update a genre |
| `DELETE` | `/genres/:id` | Delete a genre without books |

### Books

| Method | Route | Purpose |
| --- | --- | --- |
| `POST` | `/books` | Create a book; librarian JWT required |
| `GET` | `/books` | Filter, search, and paginate books |
| `GET` | `/books/:id` | Get one book |
| `PATCH` | `/books/:id` | Update a book; librarian JWT required |
| `DELETE` | `/books/:id` | Delete a book; librarian JWT required |

`GET /books` accepts `genreId`, `search`, `page`, and `limit`. Search matches both title and author.

### Authentication and profile

| Method | Route | Purpose |
| --- | --- | --- |
| `POST` | `/auth/register` | Register a patron and receive a JWT |
| `POST` | `/auth/login` | Verify credentials and receive a JWT |
| `GET` | `/users/profile` | Return the authenticated JWT user |

Send protected requests with:

```http
Authorization: Bearer <access_token>
```

The `docs/postman_collection.json` file contains a request for every route and variables for `baseUrl`, `token`, `genreId`, and `bookId`.

## Authorization model

Registration always creates a `PATRON`. Only users whose JWT has the `LIBRARIAN` role may create, update, or delete books. Missing or invalid tokens return `401 Unauthorized`; valid patrons attempting librarian-only routes receive `403 Forbidden`.

## Schema Decisions

`Genre` is modeled as a separate relational table rather than embedding genre information directly in each `Book`. Each book stores a `genreId` foreign key and exposes a `genre` relation:

```prisma
genreId Int
genre   Genre @relation(fields: [genreId], references: [id])
```

This normalized design avoids repeating genre names across many book records, keeps genre names consistent, and allows a genre to be updated in one place. The foreign key also protects referential integrity and makes queries such as “list every book in this genre” straightforward.

The `Role` enum restricts users to the two supported application roles. The `available` field on `Book` gives the catalog a simple inventory status while keeping borrowing workflows extensible for future models.

### Prisma versus a document database

In Prisma with PostgreSQL, relationships are explicit: related records live in separate tables and connect through foreign keys. A document database could embed genre data inside each book document, but that would duplicate values and make updates less consistent. Prisma therefore encourages this normalized relational representation for shared catalog data.

## Hosted database note

The migration and seed commands require a reachable PostgreSQL `DATABASE_URL` in `api/.env`. The committed repository intentionally contains no real database credentials.
