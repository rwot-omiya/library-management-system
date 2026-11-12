# Library Management System

A Prisma and PostgreSQL data layer for a library book catalog.

## Requirements implemented

- `Role` enum with `PATRON` and `LIBRARIAN` values.
- `User` model using the `Role` enum.
- `Genre` model with a one-to-many relation to `Book`.
- `Book` model with a required `genreId` foreign key and Prisma `@relation`.
- Seed data containing 4 genres and 16 books distributed evenly across those genres.
- NestJS-compatible `PrismaService` that connects during `onModuleInit`.
- Safe `api/.env.example` containing a `DATABASE_URL` placeholder.

## Project structure

```text
api/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── src/prisma/prisma.service.ts
├── .env.example
└── package.json
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

3. Replace the placeholder in `.env` with the connection string for the hosted PostgreSQL database:

   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE_NAME?schema=public"
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
