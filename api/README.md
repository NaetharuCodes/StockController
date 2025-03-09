# Hono Based API service for Stock Controller

This is a hono based API. It uses Postgresqsl with Prisma.

# Setting Up PostgreSQL with Prisma

This guide walks through setting up PostgreSQL on Ubuntu for use with Prisma in a Node.js application.

## Installing PostgreSQL on Ubuntu

1. Update your package lists:

   ```bash
   sudo apt update
   ```

2. Install PostgreSQL and its contrib package:

   ```bash
   sudo apt install postgresql postgresql-contrib
   ```

3. Verify the installation:

   ```bash
   sudo systemctl status postgresql
   ```

4. Make sure PostgreSQL is running and enabled at boot:
   ```bash
   sudo systemctl start postgresql
   sudo systemctl enable postgresql
   ```

## Creating a Database User and Database

1. Switch to the postgres user:

   ```bash
   sudo -i -u postgres
   ```

2. Access the PostgreSQL command line:

   ```bash
   psql
   ```

3. Create a dedicated user for your application:

   ```sql
   CREATE USER appuser WITH ENCRYPTED PASSWORD 'your_password_here';
   ```

4. Create a database for your project:

   ```sql
   CREATE DATABASE your_database_name;
   ```

5. Grant privileges to the user on the database:

   ```sql
   GRANT ALL PRIVILEGES ON DATABASE your_database_name TO appuser;
   ```

6. Connect to the database to set schema privileges:

   ```sql
   \c your_database_name
   ```

7. Grant privileges on the public schema to your user:

   ```sql
   GRANT ALL ON SCHEMA public TO appuser;
   ```

8. For Prisma migrations, grant database creation privileges:

   ```sql
   ALTER USER appuser CREATEDB;
   ```

9. Exit psql:

   ```sql
   \q
   ```

10. Return to your user:
    ```bash
    exit
    ```

## Verifying Connection

Test the connection with your new user:

```bash
psql -U appuser -d your_database_name -h localhost
```

Enter the password when prompted. You should see the PostgreSQL prompt:

```
your_database_name=>
```

## Setting Up Prisma with PostgreSQL

1. Install Prisma in your project:

   ```bash
   npm install prisma @prisma/client
   ```

2. Initialize Prisma:

   ```bash
   npx prisma init
   ```

3. Configure the database connection in the `.env` file:

   ```
   DATABASE_URL="postgresql://appuser:your_password_here@localhost:5432/your_database_name?schema=public"
   ```

4. Create a basic schema in `prisma/schema.prisma`:

   ```prisma
   generator client {
     provider = "prisma-client-js"
   }

   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }

   model Site {
     id          String   @id @default(uuid())
     name        String
     description String?
     createdAt   DateTime @default(now())
     updatedAt   DateTime @updatedAt
   }
   ```

5. Run your first migration:

   ```bash
   npx prisma migrate dev --name init
   ```

6. Create a Prisma client service (in src/services/prisma.js):

   ```javascript
   import { PrismaClient } from "@prisma/client";

   // Create a singleton Prisma client instance
   const prisma = new PrismaClient();

   export default prisma;
   ```

## Important Notes

- Remember to use `.js` extension in imports when working with ESM:

  ```javascript
  import prisma from "../services/prisma.js";
  ```

- PostgreSQL configuration files on Ubuntu:

  - Main config: `/etc/postgresql/[version]/main/postgresql.conf`
  - Client authentication: `/etc/postgresql/[version]/main/pg_hba.conf`

- After making any configuration changes, restart PostgreSQL:
  ```bash
  sudo systemctl restart postgresql
  ```

## Common Issues

1. **Authentication Failed**:

   - Check if the username is exactly correct (PostgreSQL is case-sensitive)
   - Verify the password is correct
   - Ensure the user has proper permissions

2. **Cannot Create Shadow Database**:

   - Make sure the user has CREATEDB privileges
   - Alternatively, manually create a shadow database and specify its URL in the schema

3. **Connection Refused**:
   - Check if PostgreSQL is running (`sudo systemctl status postgresql`)
   - Verify PostgreSQL is configured to accept connections (`pg_hba.conf`)

## Next Steps

With PostgreSQL and Prisma set up, you can now:

- Expand your database schema
- Create and run migrations as your app evolves
- Use the Prisma client to interact with your database
