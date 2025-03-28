# block37ACareerSimulationCore

TABLES & RELATATIONSHIPS

---

-USERS (stores user information)

id (PK, UUID, unique)

username (VARCHAR, unique, not null)

email (VARCHAR, unique, not null)

password_hash (TEXT, not null)

created_at (TIMESTAMP, default now())

pdated_at (TIMESTAMP, default now())

---

-ITEMS (stores reviewed items)

id (PK, UUID, unique)

name (VARCHAR, not null)

description (TEXT)

average_rating (FLOAT, default 0)

created_at (TIMESTAMP, default now())

updated_at (TIMESTAMP, default now())

---

-REVIEWS (stores user reviews for items)

id (PK, UUID, unique)

user_id (FK → Users.id, on delete CASCADE)

item_id (FK → Items.id, on delete CASCADE)

rating (INTEGER, 1-5, not null)

review_text (TEXT, not null)

created_at (TIMESTAMP, default now())

updated_at (TIMESTAMP, default now())

(Unique Constraint: user_id + item_id to prevent duplicate reviews per user per item)

---

-COMMENTS (stores user comments on reviews)

id (PK, UUID, unique)

user_id (FK → Users.id, on delete CASCADE)

review_id (FK → Reviews.id, on delete CASCADE)

comment_text (TEXT, not null)

created_at (TIMESTAMP, default now())

updated_at (TIMESTAMP, default now())

---

-INDEXES & CONSTRAINTS

Index on average_rating in Items for sorting performance.

Foreign key constraints for cascading deletions.

Unique constraint on (user_id, item_id) in Reviews to prevent multiple reviews per item by the same user.
