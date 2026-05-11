# VEDO MVP - Implementation Roadmap

## Overview
Build on existing codebase. Timeline: 1-2 weeks. Tech: React + TS + Zustand + Supabase.

---

## Phase 1: Setup ✅
- [x] Create `jane-dev` branch
- [x] Save PRD to `docs/PRD.md`
- [ ] Ensure ESLint + TypeScript strict mode enabled
- [ ] Setup pre-commit hooks (lint check)

**Status:** In Progress

---

## Phase 2: Database Schema (Est. 2-3 hours)

### Tasks
- [ ] Design Supabase migrations
  - [ ] Users table schema (add: phone, photo_urls, verification_status, group_id, profile_type)
  - [ ] Groups table (group_id, member_ids[], created_at)
  - [ ] Preferences table (user_id, answers JSON, budget_min/max, move_in_month)
  - [ ] Swipes table (swiper_id, swiped_id, direction, timestamp)
  - [ ] Matches table (user_1_id, user_2_id, matched_at)
  - [ ] Messages table (match_id, sender_id, content, created_at, is_read)
  - [ ] Blocks table (blocker_id, blocked_id, created_at)
- [ ] Create migration files (version controlled in `supabase/migrations/`)
- [ ] Update TypeScript types (`src/types/index.ts`)
- [ ] Seed test data (mock profiles, users, groups)

**Status:** Pending

---

## Phase 3: Matching Algorithm (Est. 3-4 hours)

### Tasks
- [ ] Implement hard filters
  - [ ] Profile type matching (individual ↔ individual, group ↔ group, or cross-match)
  - [ ] Budget range overlap (±20%)
  - [ ] Move-in timeline overlap (±3 months)
  - [ ] University/city filtering
  - [ ] Block list filtering (don't show blocked users)
- [ ] Implement soft scoring
  - [ ] Preference overlap calculation (% match)
  - [ ] Non-negotiable alignment scoring
  - [ ] Text similarity (bio matching, optional)
- [ ] Handle group-specific logic
  - [ ] Show all group members when matched with group
  - [ ] Allow individual to match with group (if looking for groups)
- [ ] Unit tests for matching algorithm
  - [ ] Test hard filters
  - [ ] Test soft scoring
  - [ ] Test edge cases (groups, blocks, empty preferences)

**Status:** Pending

---

## Phase 4: UI & Component Updates (Est. 4-6 hours)

### Tasks
- [ ] Onboarding updates
  - [ ] Add preference questions form (9-12 questions TBD)
  - [ ] Add non-negotiables (budget, move-in, room type)
  - [ ] Group member verification flow (each member ID + photo)
  - [ ] Profile type selection (looking for individual/group)
- [ ] Profile page updates
  - [ ] Display all preferences & photos
  - [ ] Make all fields editable (inline edit or edit mode)
  - [ ] Add block/unblock functionality
  - [ ] Add pause/delete account options
  - [ ] Add safety guidelines section
- [ ] Swipe deck updates
  - [ ] Integrate matching algorithm (hard filters)
  - [ ] Add filter menu (top bar: budget, timeline, lifestyle, etc.)
  - [ ] Show full profile (photos carousel + preferences below)
  - [ ] Implement swipe logic (left = pass, right = like)
  - [ ] House collapse animation on right swipe
- [ ] Likes section
  - [ ] Create new Likes page
  - [ ] Show profiles that swiped right on you
  - [ ] Allow swipe right/left on likes
  - [ ] Track mutual matches

**Status:** Pending

---

## Phase 5: Messaging Backend (Est. 3-4 hours)

### Tasks
- [ ] Supabase Realtime setup
  - [ ] Enable Realtime for messages table
  - [ ] Setup subscriptions in chat component
- [ ] Message persistence
  - [ ] Create message send function (Supabase insert)
  - [ ] Fetch message history for match
  - [ ] Mark messages as read
- [ ] Chat UI integration
  - [ ] Update Messages page
  - [ ] Show unread messages section (with badge count)
  - [ ] Show waiting for reply section
  - [ ] Real-time message delivery (socket listening)
  - [ ] Add quick reply suggestions
- [ ] Edge cases
  - [ ] Don't show messages between blocked users
  - [ ] Handle deleted matches (delete messages cascade)

**Status:** Pending

---

## Phase 6: Testing & QA (Est. 2-3 hours)

### Tasks
- [ ] Unit tests
  - [ ] Matching algorithm (all edge cases)
  - [ ] Filter logic (budget, timeline, profile type)
  - [ ] Block/unblock logic
- [ ] Integration tests (Supabase queries)
  - [ ] User creation & swipes
  - [ ] Match creation (mutual swipes)
  - [ ] Message sending/receiving
- [ ] Manual testing checklist
  - [ ] Individual onboarding → swipe deck → messaging
  - [ ] Group onboarding (all members verify) → group matching → messaging
  - [ ] Blocking users (shouldn't appear in swipe deck)
  - [ ] Pause/delete account (can't swipe, messages hidden)
  - [ ] Filter by budget, timeline (hard filters working)
- [ ] Staging deployment
  - [ ] Deploy to staging environment
  - [ ] Final regression testing
  - [ ] Performance check (message realtime, swipe deck loading)

**Status:** Pending

---

## Phase 7: Pre-Launch (Est. 1 hour)

- [ ] Code review (PR to main)
- [ ] Squash commits for clean history
- [ ] Deploy to production
- [ ] Monitor for errors (Sentry if setup)

---

## Priority Order
1. **Database schema** (blocks all other work)
2. **Matching algorithm** (core feature)
3. **UI updates** (user-facing)
4. **Messaging backend** (engagement feature)
5. **Testing** (quality gate)

---

## Known Constraints
- 1-2 week timeline (aggressive)
- Group verification is complex (may ship as v1.1)
- Soft scoring (preference overlap %) is optional for MVP
- Realtor profiles deferred to Phase 2

---

## Team Notes
- **Jane:** All phases (or coordinate with team)
- **Developers:** Phases 2-6
- **QA/Tester:** Phase 6 (manual testing checklist)
- **DevOps:** Phase 7 (deployment)
