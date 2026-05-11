# VEDO Database Schema

## Overview
PostgreSQL schema via Supabase. Relationships support individual profiles, group profiles, swipes, matches, messaging, and blocking.

---

## Tables

### `auth.users` (Supabase Auth)
Extended with VEDO-specific fields.

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | UUID | N | Primary key, Supabase auth user |
| email | TEXT | N | Email (Supabase managed) |
| phone | TEXT | Y | Contact phone (hidden until match) |
| profile_type | TEXT | Y | 'individual' \| 'group' |
| group_id | UUID | Y | FK to groups (if group member) |
| neighborhood | TEXT | Y | NYC neighborhood (e.g., "Lower East Side", "Astoria") |
| verification_status | TEXT | N | 'pending' \| 'id_verified' \| 'photo_verified' \| 'completed' |
| photo_urls | TEXT[] | N | Array of photo URLs (min 3, max 10) |
| created_at | TIMESTAMP | N | User creation timestamp |
| updated_at | TIMESTAMP | N | Last update timestamp |

---

### `groups`
Container for group profiles (2-4 members).

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | UUID | N | Primary key |
| created_at | TIMESTAMP | N | Group creation |
| updated_at | TIMESTAMP | N | Last update |

---

### `group_members`
Many-to-many: links users to groups.

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| group_id | UUID | N | FK to groups |
| user_id | UUID | N | FK to auth.users |
| joined_at | TIMESTAMP | N | Member join date |

**Primary Key:** (group_id, user_id)

---

### `preferences`
User preference answers & non-negotiables.

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | UUID | N | Primary key |
| user_id | UUID | N | FK to auth.users (UNIQUE) |
| budget_min | INTEGER | Y | Min monthly budget ($) |
| budget_max | INTEGER | Y | Max monthly budget ($) |
| move_in_month | TEXT | Y | Move-in timeline (e.g., "June 2024") |
| room_type | TEXT | Y | 'single' \| 'shared' \| 'studio' |
| cleanliness_level | INTEGER | Y | 1-5 scale |
| social_preference | TEXT | Y | 'introvert' \| 'extrovert' \| 'ambivert' |
| dietary_preference | TEXT | Y | 'vegetarian' \| 'vegan' \| 'carnivore' \| 'flexible' |
| smoking_allowed | BOOLEAN | Y | Smoking policy |
| alcohol_allowed | BOOLEAN | Y | Alcohol policy |
| answers | JSONB | N | Flexible preference Q&A (key-value pairs) |
| created_at | TIMESTAMP | N | Creation |
| updated_at | TIMESTAMP | N | Last update |

---

### `swipes`
User swipe history (like/pass).

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | UUID | N | Primary key |
| swiper_id | UUID | N | FK to auth.users (who swiped) |
| swiped_id | UUID | N | FK to auth.users (who was swiped on) |
| direction | TEXT | N | 'like' \| 'pass' |
| created_at | TIMESTAMP | N | Swipe timestamp |

**Unique Constraint:** (swiper_id, swiped_id) — one swipe per pair

---

### `matches`
Mutual swipes (both swiped right).

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | UUID | N | Primary key |
| user_1_id | UUID | N | FK to auth.users (lower UUID) |
| user_2_id | UUID | N | FK to auth.users (higher UUID) |
| matched_at | TIMESTAMP | N | Mutual match timestamp |

**Unique Constraint:** (user_1_id, user_2_id)  
**Check Constraint:** user_1_id < user_2_id (prevents duplicate match pairs)

---

### `messages`
Chat messages in a match.

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | UUID | N | Primary key |
| match_id | UUID | N | FK to matches |
| sender_id | UUID | N | FK to auth.users |
| content | TEXT | N | Message text |
| is_read | BOOLEAN | N | Read status |
| created_at | TIMESTAMP | N | Message timestamp |

---

### `blocks`
Users blocked by other users.

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | UUID | N | Primary key |
| blocker_id | UUID | N | FK to auth.users (who blocked) |
| blocked_id | UUID | N | FK to auth.users (who was blocked) |
| created_at | TIMESTAMP | N | Block timestamp |

**Unique Constraint:** (blocker_id, blocked_id)

---

## Relationships

```
auth.users
├── (1) → (0+) group_members
├── (1) → (0..1) preferences
├── (1) → (0+) swipes (as swiper_id & swiped_id)
├── (1) → (0+) matches (as user_1_id & user_2_id)
├── (1) → (0+) messages (as sender_id)
└── (1) → (0+) blocks (as blocker_id & blocked_id)

groups
└── (1) → (2..4) group_members
    └── (0..1) → auth.users

matches
├── (1) → (1) user_1_id (auth.users)
└── (1) → (1) user_2_id (auth.users)

messages
├── (0+) → (1) match_id (matches)
└── (0+) → (1) sender_id (auth.users)
```

---

## Indexes
Performance optimizations for common queries:

- `idx_swipes_swiper_id` — Find user's swipes
- `idx_swipes_swiped_id` — Find who swiped on user
- `idx_matches_user_1_id` — Find user's matches
- `idx_matches_user_2_id` — Find user's matches
- `idx_messages_match_id` — Fetch messages for match (chat history)
- `idx_messages_sender_id` — Find user's messages
- `idx_blocks_blocker_id` — Check if user blocked someone
- `idx_group_members_user_id` — Find user's groups

---

## Matching Logic (Filter Query)

Hard filters applied before soft scoring:

```sql
SELECT u.* FROM auth.users u
JOIN preferences p ON u.id = p.user_id
WHERE 
  -- Profile type match
  u.profile_type = $1
  -- Budget overlap (±20%)
  AND p.budget_min <= $2 AND p.budget_max >= $3
  -- Move-in timeline overlap (within 3 months)
  AND p.move_in_month >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH)
  -- NYC neighborhood match (same or adjacent)
  AND u.neighborhood IN (SELECT neighborhood FROM neighborhood_adjacency WHERE ref_neighborhood = $5)
  -- Not blocked
  AND u.id NOT IN (SELECT blocked_id FROM blocks WHERE blocker_id = $4)
  -- Haven't swiped on yet
  AND NOT EXISTS (SELECT 1 FROM swipes WHERE swiper_id = $4 AND swiped_id = u.id)
  -- Not self
  AND u.id != $4;
```

---

## Data Migration Notes
- Existing `users` and `preferences` tables extended (no data loss)
- New tables created with cascading deletes for integrity
- Seed test data: See `supabase/seed.sql` (TBD)
