---
slug: postgresql-data-types
title: PostgreSQL Data Types
authors: mahmudur
tags: [mysql, postgres, idatatypes]
time: 2025-01-23T11:00
---
PostgreSQL offers a wide range of data types that can be broadly categorized as follows:

---

### **1. Numeric Types**
- **Small Integer:** `SMALLINT` (2 bytes, range: -32,768 to +32,767)
- **Integer:** `INTEGER` or `INT` (4 bytes, range: -2,147,483,648 to +2,147,483,647)
- **Big Integer:** `BIGINT` (8 bytes, range: -9,223,372,036,854,775,808 to +9,223,372,036,854,775,807)
- **Decimal/Numeric:** `DECIMAL(p, s)` or `NUMERIC(p, s)` (User-defined precision)
- **Real:** `REAL` (4 bytes, single-precision floating-point)
- **Double Precision:** `DOUBLE PRECISION` (8 bytes, double-precision floating-point)
- **Serial:** `SERIAL`, `BIGSERIAL`, `SMALLSERIAL` (Auto-incrementing integers)

---

### **2. Character Types**
- **Fixed Length:** `CHAR(n)` or `CHARACTER(n)` (Fixed-length string, padded with spaces)
- **Variable Length:** `VARCHAR(n)` or `CHARACTER VARYING(n)` (Variable-length string, with length limit)
- **Text:** `TEXT` (Unlimited length string)

---

### **3. Date/Time Types**
- **DATE:** Stores calendar date (Year, Month, Day)
- **TIME:** Stores time of day (hours, minutes, seconds)
- **TIMESTAMP:** Stores date and time (without time zone)
- **TIMESTAMPTZ:** `TIMESTAMP WITH TIME ZONE` (Includes time zone information)
- **INTERVAL:** Stores a time span or duration

---

### **4. Boolean Type**
- **BOOLEAN:** `TRUE`, `FALSE`, or `NULL`

---

### **5. Enumerated Type**
- **ENUM:** User-defined list of values (e.g., `CREATE TYPE mood AS ENUM ('happy', 'sad', 'neutral');`)

---

### **6. Geometric Types**
- **Point:** `POINT` (x, y coordinate pair)
- **Line:** `LINE` (Infinite line)
- **LSEG:** (Line segment)
- **BOX:** (Rectangular box)
- **Path:** `PATH` (Closed or open path)
- **Polygon:** `POLYGON` (Closed polygon)
- **Circle:** `CIRCLE` (Circle with center and radius)

---

### **7. Network Address Types**
- **CIDR:** IPv4 or IPv6 networks
- **INET:** IPv4 or IPv6 hosts and networks
- **MACADDR:** MAC address
- **MACADDR8:** MAC address (8-byte)

---

### **8. JSON Types**
- **JSON:** Stores JSON data as a text string
- **JSONB:** Stores JSON data in a binary format (better for indexing)

---

### **9. Array Type**
- **ARRAY:** Stores arrays of any data type (e.g., `INTEGER[]` or `TEXT[]`)

---

### **10. Composite Type**
- **Row/Record Types:** Used to store rows or structures (e.g., returned by functions).

---

### **11. Range Types**
- **INT4RANGE:** Range of integers
- **NUMRANGE:** Range of numerics
- **TSRANGE:** Range of timestamps (without time zone)
- **TSTZRANGE:** Range of timestamps (with time zone)
- **DATERANGE:** Range of dates

---

### **12. UUID**
- **UUID:** Universally unique identifier (128-bit)

---

### **13. XML**
- **XML:** Stores XML data

---

### **14. Full-Text Search Types**
- **TSVECTOR:** Text search vector
- **TSQUERY:** Text search query

---

### **15. Monetary Types**
- **MONEY:** Currency amounts (locale-aware formatting)

---

### **16. Binary Types**
- **BYTEA:** Stores binary data ("byte array")

---

### **17. Custom Types**
- **Composite Types:** Define your own data structure with `CREATE TYPE`
- **Domain Types:** Define constraints on existing types (e.g., `CREATE DOMAIN positive_int AS INTEGER CHECK (VALUE > 0);`)

Let me know if you’d like more details or examples for any of these!