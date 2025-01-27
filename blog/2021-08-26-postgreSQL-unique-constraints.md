---
slug: postgresql-unique-constraints
title: PostgreSQL Unique Constraints
authors: mahmudur
tags: [postgresql, unique, constraints]
time: 2025-01-23T13:00
---
In PostgreSQL, a **unique constraint** ensures that the values in one or more columns of a table are unique across all rows. This means that no two rows in the table can have the same value(s) for the specified column(s). It's a common feature used to enforce data integrity and ensure that duplicate data cannot be stored.

---

### **How It Works**
- A unique constraint creates an **implicit index** on the column(s) it is applied to. This index is used to enforce the uniqueness of the values.
- A unique constraint can be defined on a single column or a combination of multiple columns.

---

### **Key Characteristics**
1. **Single-Column Uniqueness:**
   Ensures that no two rows have the same value in a single column.
   ```sql
   CREATE TABLE users (
       id SERIAL PRIMARY KEY,
       email VARCHAR(255) UNIQUE
   );
   ```
   In this example:
   - The `email` column must have unique values.
<!-- truncate -->
2. **Multi-Column Uniqueness (Composite Unique Constraint):**
   Ensures uniqueness across a combination of multiple columns.
   ```sql
   CREATE TABLE orders (
       order_id SERIAL PRIMARY KEY,
       customer_id INT,
       product_id INT,
       UNIQUE (customer_id, product_id)
   );
   ```
   Here:
   - The combination of `customer_id` and `product_id` must be unique, meaning a customer cannot order the same product more than once.

3. **Implicit Index:**
   When a unique constraint is created, PostgreSQL automatically creates a **unique B-tree index** to enforce the constraint.

4. **NULL Handling:**
   - In PostgreSQL, `NULL` values are **not considered equal** to each other.
   - This means you can have multiple rows with `NULL` in a column with a unique constraint, as long as the other values are unique.

   Example:
   ```sql
   CREATE TABLE items (
       id SERIAL PRIMARY KEY,
       serial_number VARCHAR(255) UNIQUE
   );

   INSERT INTO items (serial_number) VALUES 
   (NULL), 
   (NULL), 
   ('ABC123'); -- Valid, because NULL != NULL
   ```

5. **Custom Error:**
   If an attempt is made to insert or update a row that violates the unique constraint, PostgreSQL will throw an error:
   ```
   ERROR:  duplicate key value violates unique constraint "constraint_name"
   ```

---

### **Adding a Unique Constraint**
You can add a unique constraint to an existing table using the `ALTER TABLE` command:
```sql
ALTER TABLE table_name
ADD CONSTRAINT constraint_name UNIQUE (column_name);
```

---

### **Removing a Unique Constraint**
To remove a unique constraint, use the `ALTER TABLE` command with `DROP CONSTRAINT`:
```sql
ALTER TABLE table_name
DROP CONSTRAINT constraint_name;
```

---

### **Unique Index vs. Unique Constraint**
Although similar, there are subtle differences:
- **Unique Constraint**: A declarative way to ensure uniqueness. It integrates directly with PostgreSQL's constraint system and provides better semantic clarity.
- **Unique Index**: A lower-level mechanism for enforcing uniqueness, primarily used when working directly with indexes.

---

### **Practical Examples**

#### Single-Column Unique Constraint:
```sql
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE
);
```

#### Multi-Column Unique Constraint:
```sql
CREATE TABLE reservations (
    id SERIAL PRIMARY KEY,
    room_number INT,
    reservation_date DATE,
    UNIQUE (room_number, reservation_date)
);
```

#### Using `ALTER TABLE`:
```sql
ALTER TABLE students
ADD CONSTRAINT unique_roll_number UNIQUE (roll_number);
```

---

### **Use Cases**
- Preventing duplicate entries in critical fields (e.g., emails, usernames, or product SKUs).
- Enforcing data integrity in relational tables where composite uniqueness is required.
- Improving query performance with the automatically created unique index.

Let me know if you'd like a deeper dive into any specific use case!