---
slug: mysql-to-postgresql
title: MySQL to PostgreSQL Guide
authors: mahmudur
tags: [mysql, postgres, into]
---
This is a comprehensive PostgreSQL learning guide for someone familiar with MySQL:

## 1. Install PostgreSQL
### On Ubuntu:
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

### On Docker:
```bash
docker run --name postgres -e POSTGRES_USER=your_user -e POSTGRES_PASSWORD=your_password -p 5432:5432 -d postgres
```

---

## 2. Start PostgreSQL Service
### On Ubuntu:
```bash
sudo service postgresql start
```

---

## 3. Login to PostgreSQL
### Open `psql` Command Line:
```bash
sudo -u postgres psql
```
OR
```bash
psql -U your_user -h localhost -d postgres
```

---

## 4. Create a New Database
```sql
CREATE DATABASE your_database;
```

---

## 5. Create a New User
```sql
CREATE USER your_user WITH PASSWORD 'your_password';
```

---

## 6. Grant Privileges to the User
```sql
GRANT ALL PRIVILEGES ON DATABASE your_database TO your_user;
```

---

## 7. Connect to a Database
```bash
psql -U your_user -h localhost -d your_database
```

---

## 8. Common SQL Syntax Differences
### Data Types:
- `VARCHAR`: Same as MySQL.
- `TEXT`: Unlimited-length string.
- `SERIAL`: Auto-increment integer (like MySQL's `AUTO_INCREMENT`).
- `TIMESTAMP`: Includes date and time (like `DATETIME` in MySQL).
- `BOOLEAN`: Accepts `TRUE`, `FALSE`, and `NULL` (MySQL uses `TINYINT`).

---

### Auto-Increment Primary Key:
```sql
CREATE TABLE example (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255)
);
```

---

### JSON Support:
```sql
CREATE TABLE example (
  id SERIAL PRIMARY KEY,
  data JSON
);
```

---

### LIMIT and OFFSET:
```sql
SELECT * FROM table_name LIMIT 10 OFFSET 5;
```

---

## 9. Import and Export Data
### Export:
```bash
pg_dump -U your_user -h localhost your_database > backup.sql
```

### Import:
```bash
psql -U your_user -h localhost -d your_database -f backup.sql
```

---

## 10. Useful Commands in `psql`
### List Databases:
```bash
\l
```

### Connect to a Database:
```bash
\c database_name
```

### List Tables:
```bash
\dt
```

### Describe a Table:
```bash
\d table_name
```

### Quit `psql`:
```bash
\q
```

---

## 11. Learn PostgreSQL Queries
Start practicing SQL queries for PostgreSQL. The syntax is mostly similar to MySQL, but with powerful features like:
- **CTEs (WITH clauses):**  
  ```sql
  WITH cte AS (SELECT * FROM table WHERE condition)
  SELECT * FROM cte WHERE other_condition;
  ```

- **Window Functions:**  
  ```sql
  SELECT name, rank() OVER (PARTITION BY department ORDER BY salary DESC) FROM employees;
  ```

---

## 12. Learn Admin Tools
Install **pgAdmin** for a GUI-based PostgreSQL management tool or use CLI utilities like `pg_dump` and `psql`.

---

## 13. Explore Extensions
PostgreSQL supports powerful extensions. Examples:
- **PostGIS:** Spatial data.
- **pg_stat_statements:** Query statistics.
- **Full-Text Search.**

---

## 14. Resources
- Official Docs: https://www.postgresql.org/docs/
- Tutorials: https://www.tutorialspoint.com/postgresql/
- Interactive Practice: https://pgexercises.com/

---

Start with these steps and gradually explore PostgreSQL's advanced features like indexing, replication, and stored procedures!


## What is a Tablespace in PostgreSQL
A **tablespace** in PostgreSQL is a storage location on the filesystem where database objects (like tables, indexes, etc.) are stored. It allows you to manage and organize data storage by specifying where specific data files should reside. This is especially useful for controlling disk usage and performance optimization.

### Key Points:
- By default, PostgreSQL stores all data in the `pg_default` tablespace.
- You can create additional tablespaces to store data on different disks or directories.

### Syntax:
1. **Create a Tablespace**:
   ```sql
   CREATE TABLESPACE mytablespace LOCATION '/path/to/directory';
   ```

2. **Create a Table in a Tablespace**:
   ```sql
   CREATE TABLE mytable (
       id SERIAL PRIMARY KEY,
       name VARCHAR(100)
   ) TABLESPACE mytablespace;
   ```

3. **Set Default Tablespace for a Database**:
   ```sql
   CREATE DATABASE mydb TABLESPACE mytablespace;
   ```

### Notes:
- You need sufficient permissions on the directory specified for the tablespace.
- Tablespaces are managed at the PostgreSQL instance level, not tied to a specific database.


## What is COLLATE

In PostgreSQL, `COLLATE` specifies the **collation** for a column, expression, or operation. A collation determines how text data is sorted and compared, particularly for operations like `ORDER BY`, `GROUP BY`, and text comparison (e.g., `<`, `=`, `>`).

---

### Key Concepts of `COLLATE`

1. **Sorting and Comparison Rules**:
   - Collation defines the rules for:
     - **Sorting order** (e.g., alphabetical order for letters, numeric order for digits).
     - **Case sensitivity** (whether "A" and "a" are treated as equal or different).
     - **Locale-specific behavior** (e.g., "ä" might be treated differently in German vs. English).

2. **Default Collation**:
   - Each database in PostgreSQL has a default collation, which is used if no specific collation is specified.

3. **Locale-Dependent**:
   - Collation is locale-sensitive, meaning the same string may be sorted differently in different locales (e.g., `en_US` vs. `de_DE`).

4. **Case-Sensitivity**:
   - Collations can be case-sensitive (e.g., "apple" ≠ "Apple") or case-insensitive (e.g., "apple" = "Apple").

---

### When and Why to Use `COLLATE`

- To handle locale-specific sorting and comparison.
- To enforce a specific collation different from the database default.
- To make string comparison case-sensitive or case-insensitive.

---

### Examples of Using `COLLATE`

#### 1. Specifying Collation When Creating a Table
You can set a collation for a specific column:
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT COLLATE "en_US" -- Use English (US) collation for sorting/comparison
);
```

#### 2. Specifying Collation for an Expression
You can apply a collation to an expression in a query:
```sql
SELECT name
FROM users
ORDER BY name COLLATE "de_DE"; -- Sort using German collation
```

#### 3. Using Collation in String Comparisons
```sql
SELECT 'apple' = 'Apple' COLLATE "C";   -- Case-sensitive comparison (returns FALSE)
SELECT 'apple' = 'Apple' COLLATE "en_US"; -- Case-insensitive comparison (depends on locale)
```

---

### Common Collations in PostgreSQL

1. **`C` and `C.UTF-8`**:
   - `C`: Performs binary comparisons based on raw byte values. Fast but not locale-aware.
   - `C.UTF-8`: Similar to `C`, but supports Unicode.

2. **Locale-Specific Collations**:
   - Locale-specific collations (e.g., `en_US.UTF-8`, `fr_FR.UTF-8`) are provided based on the system's locale settings.

3. **Default Collation**:
   - When a database is created, it inherits the default collation of the system unless overridden.

---

### Viewing Available Collations
You can view all collations supported by your PostgreSQL installation:
```sql
SELECT * FROM pg_collation;
```

---

### Changing Collation
You cannot change a column's collation directly after it is created. You need to recreate the column or use a workaround (e.g., create a new column with the desired collation and migrate data).

---

### Example Use Case: Case-Insensitive Sorting
To sort names in a case-insensitive manner:
```sql
SELECT name
FROM users
ORDER BY name COLLATE "en_US";
```

---

Let me know if you'd like further examples or clarification!