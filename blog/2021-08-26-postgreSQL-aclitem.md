---
slug: postgresql-acl-item
title: PostgreSQL ACL Item
authors: mahmudur
tags: [postgres, aclitem]
time: 2025-01-23T12:00
---
In PostgreSQL, **`aclitem`** is a specialized data type used internally to represent **access control lists (ACLs)** for database objects, such as tables, views, sequences, functions, and schemas. It defines who (roles or users) has specific privileges on a database object.

Although it's not commonly used directly in application-level development, it's stored in PostgreSQL system catalogs like `pg_class`, `pg_proc`, and `pg_namespace` to manage permissions.

---

### **Structure of `aclitem`**
An `aclitem` entry typically consists of:
1. **Grantee (Role/User):** The role or user to whom the privileges are granted.
2. **Privileges:** Specific permissions granted or denied (e.g., SELECT, INSERT, UPDATE, etc.).
3. **Grantor:** The role or user who granted the privileges.

Example of an `aclitem` entry:
```
username=arwdDxt/owner
```

Here:
- `username` is the role that has privileges.
- `arwdDxt` represents the granted privileges:
  - **`a`**: INSERT
  - **`r`**: SELECT
  - **`w`**: UPDATE
  - **`d`**: DELETE
  - **`D`**: TRUNCATE
  - **`x`**: REFERENCES
  - **`t`**: TRIGGER
- `/owner` indicates the role that granted these privileges.

---

### **Where is `aclitem` used?**
The `aclitem` type is typically found in system catalogs, such as:
- **`pg_class`**: Stores ACLs for tables, indexes, sequences, etc.
- **`pg_namespace`**: Stores ACLs for schemas.
- **`pg_proc`**: Stores ACLs for functions.

---

### **How to Query ACLs in PostgreSQL**
You can inspect ACLs using `pg_catalog` views or specific system columns like `relacl`, `nspacl`, or `proacl`. For example:
```sql
SELECT relname, relacl FROM pg_class WHERE relname = 'your_table_name';
```

This would return something like:
```
 relname  |            relacl            
----------+------------------------------
 your_table_name | {user1=arwdDxt/user2, user2=r/user1}
```

---

### **Grant and Revoke Privileges**
The `aclitem` entries are managed via SQL commands like `GRANT` and `REVOKE`. For example:
```sql
GRANT SELECT, UPDATE ON your_table_name TO user1;
REVOKE INSERT ON your_table_name FROM user1;
```

These commands update the internal `aclitem` representation in the system catalogs.

---

### **Conclusion**
While `aclitem` is not something you usually manipulate directly, it plays an essential role in PostgreSQL's permission system. If you are delving into PostgreSQL internals or writing advanced administrative queries, you may encounter it in system tables.