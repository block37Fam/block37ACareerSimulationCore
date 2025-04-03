# block37ACareerSimulationCore

### Definitions
- `PK`: PRIMARY KEY
- `FK`: FOREIGN KEY
- `VARCHAR`: Variable-length character string (specify maximum length)

---

## Tables & Relationships

### USERS (stores user information)
```sql
id              UUID PRIMARY KEY UNIQUE
username        VARCHAR(50) UNIQUE NOT NULL
email           VARCHAR(100) UNIQUE NOT NULL
password_hash   TEXT NOT NULL
created_at      TIMESTAMP DEFAULT NOW()
updated_at      TIMESTAMP DEFAULT NOW()
```

### ITEMS (stores reviewed items)
```sql
id              UUID PRIMARY KEY UNIQUE
name            VARCHAR(100) NOT NULL
description     TEXT
average_rating  FLOAT DEFAULT 0
created_at      TIMESTAMP DEFAULT NOW()
updated_at      TIMESTAMP DEFAULT NOW()
```

### REVIEWS (stores user reviews for items)
```sql
id              UUID PRIMARY KEY UNIQUE
user_id         UUID REFERENCES USERS(id) ON DELETE CASCADE
item_id         UUID REFERENCES ITEMS(id) ON DELETE CASCADE
rating          INTEGER CHECK(rating >= 1 AND rating <= 5) NOT NULL
review_text     TEXT NOT NULL
created_at      TIMESTAMP DEFAULT NOW()
updated_at      TIMESTAMP DEFAULT NOW()

-- Unique Constraint to prevent duplicate reviews per user per item
UNIQUE (user_id, item_id)
```

### COMMENTS (stores user comments on reviews)
```sql
id              UUID PRIMARY KEY UNIQUE
user_id         UUID REFERENCES USERS(id) ON DELETE CASCADE
review_id       UUID REFERENCES REVIEWS(id) ON DELETE CASCADE
comment_text    TEXT NOT NULL
created_at      TIMESTAMP DEFAULT NOW()
updated_at      TIMESTAMP DEFAULT NOW()
```

---

## Indexes & Constraints

- **Index** on `average_rating` in `ITEMS` table for sorting performance.
- **Foreign Key Constraints** (`ON DELETE CASCADE`) to maintain referential integrity.
- **Unique Constraint** on `(user_id, item_id)` in `REVIEWS` table to ensure each user can only review an item once.
