# VEDO - Product Requirements Document

## 1. Overview

**VEDO** is a swipe-based roommate matching app for people in NYC looking for compatible living situations. Users create profiles (individual or group), set preferences, and swipe through potential roommates. Matches unlock messaging.

**MVP Scope:** Core matching, messaging, profile management. No realtor profiles, subscriptions, or gamification (Phase 2).

---

## 2. User Types

- **Individual Profile**: Single person looking for 1-4 roommates
- **Group Profile**: 2-4 people looking for additional roommates (each member verified)

---

## 3. Onboarding Flow

### Phase 1: Authentication
- OTP verification via email
- Phone number collection (contact only, not visible until match)

### Phase 2: Verification (Identical for Individual & Group)
- **ID Verification** (optional): Government ID photo
- **Photo Verification** (mandatory): Clear headshot + min 2 additional photos
- *For groups*: Each member completes ID & photo verification individually

### Phase 3: Profile Building
1. Upload photos (min 3, max 10)
2. Answer preference questions (see section 5)
3. Set non-negotiables (budget range, move-in timeline, lifestyle preferences)
4. Confirm profile type (individual looking for individuals/groups, or group looking for individuals/groups)

### Phase 4: Profile Review
- User reviews all data before going live
- Can edit any field before final submission

---

## 4. Profile Management

### View & Edit
- All photos, preference answers, non-negotiables visible and editable
- "Pause account" / "Delete account" options
- Block/unblock users
- Logout functionality

### Safety & Resources
- In-app guidelines for safe roommate matching
- Links to resources (background check info, safety tips)

---

## 5. Preference Questions & Filters

### TBD Pre-Launch (Iterate Post-Launch)
*Based on user interviews, finalize:*
- Lifestyle questions (sleep schedule, party habits, cleanliness, guests)
- Financial questions (bill-splitting preferences, shared groceries)
- Habit questions (smoking, cooking, noise level)
- Personal questions (study hours, work schedule, pet-friendly)

### Initial Placeholder Questions
- Budget range (hardcoded example: $300-$800/month)
- Move-in timeline (month range)
- Room type preference (single, shared, studio)
- Cleanliness level (1-5 scale)
- Social preference (introvert/extrovert)
- Dietary preferences (vegetarian, vegan, carnivore, flexible)
- Smoking/alcohol policy preference

---

## 6. Swipe Deck (Main Discovery Page)

### UI/UX
- One profile displayed at a time
- **Photos first** (scrollable carousel)
- Below: Preferences, non-negotiables, budget, timeline, etc.
- **Filter menu** (top bar): Filter by budget, timeline, lifestyle, etc.

### Interaction
- **Swipe right** → "Like" (card collapses into house animation)
- **Swipe left** → "Pass" (card disappears)
- Both gesture and button support

### Matching Logic
**Hard Filters (Pre-Show):**
- Profile type match (individual looking for individuals shows only individuals; group looking for groups shows groups, etc.)
- Budget overlap (±20% acceptable range)
- Move-in timeline overlap (within 3 months)
- NYC location (same neighborhood or adjacent neighborhoods)

**Soft Scoring (For ranking, TBD post-launch):**
- Preference overlap % (e.g., if 70%+ match, boost ranking)
- Non-negotiable alignment
- Bio/description similarity (text-based)

**Group-Specific:**
- When 3-person group swipes on 1-person profile: 1-person sees all 3 members
- When 1-person profile swipes on group: Show as "Group Match" with all members visible
- Groups filtered out from individual swipe decks if individual isn't "looking for groups"

---

## 7. Messaging

### Match Section
- All mutual matches (both swiped right) visible here

### Sub-sections
1. **Unread Messages** - Conversations with new messages
2. **Waiting for Reply** - Conversations awaiting user's response

### Chat UI
- Message threads with timestamps
- Quick reply suggestions
- Unread badge counts

### Backend Requirements
- Message persistence in Supabase
- Real-time message delivery (Supabase Realtime)
- Last message preview in list

---

## 8. Likes Section

### View
- List of all profiles that swiped right on you but you haven't acted on
- Shows profile photos, name, key preferences

### Interaction
- Swipe right to match → Messaging unlocked
- Swipe left to reject
- Can re-evaluate later if account unpaused

---

## 9. Technical Implementation Notes

### Build On Existing Codebase
- Keep React + Vite + TypeScript + Zustand + Supabase stack
- Reuse auth flow, onboarding structure, swipe UI
- Extend as needed (don't rebuild)

### Supabase Schema Changes Needed
- **Users table**: Add phone, photo_urls, verification_status, group_id, profile_type
- **Groups table**: group_id, member_ids[], created_at
- **Preferences table**: user_id, answers (JSON), budget_min/max, move_in_month, etc.
- **Swipes table**: swiper_id, swiped_id, direction, timestamp
- **Matches table**: user_1_id, user_2_id, matched_at (when both swipe right)
- **Messages table**: match_id, sender_id, content, created_at
- **Blocks table**: blocker_id, blocked_id, created_at

### Phase 1 Build Priority
1. ✅ Preference questions & profile data model
2. ✅ Matching algorithm (hard filters + soft scoring)
3. ✅ Swipe deck filtering logic
4. ✅ Message backend integration
5. ✅ Likes section UI
6. ⚠️ Group verification flow (complex, can ship v1.1 if time-constrained)

---

## 10. Out of Scope (Phase 2+)

- Realtor profiles & property listings
- Subscription tiers & paywall
- Gamification (cooking game, room decor game)
- AI recommendations
- Hotline support
- Admin dashboard

---

## 11. Success Metrics (Post-Launch)

- Onboarding completion rate (target: >70%)
- Match rate (% of swipes that result in mutual match)
- Message engagement (% of matches that exchange >3 messages)
- Account activity (DAU, 7-day retention)
