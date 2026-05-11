// VEDO Database Types
// Auto-generated from Supabase schema

export type VerificationStatus = 'pending' | 'id_verified' | 'photo_verified' | 'completed';
export type ProfileType = 'individual' | 'group';
export type SwipeDirection = 'like' | 'pass';
export type SocialPreference = 'introvert' | 'extrovert' | 'ambivert';
export type DietaryPreference = 'vegetarian' | 'vegan' | 'carnivore' | 'flexible';
export type RoomType = 'single' | 'shared' | 'studio';

// Users (auth.users extended)
export interface User {
  id: string;
  email: string;
  phone?: string;
  profile_type?: ProfileType;
  group_id?: string;
  verification_status: VerificationStatus;
  photo_urls: string[];
  created_at: string;
  updated_at: string;
}

// Groups
export interface Group {
  id: string;
  created_at: string;
  updated_at: string;
}

// Group Members
export interface GroupMember {
  group_id: string;
  user_id: string;
  joined_at: string;
}

// Preferences
export interface Preference {
  id: string;
  user_id: string;
  budget_min?: number;
  budget_max?: number;
  move_in_month?: string;
  room_type?: RoomType;
  cleanliness_level?: number; // 1-5
  social_preference?: SocialPreference;
  dietary_preference?: DietaryPreference;
  smoking_allowed?: boolean;
  alcohol_allowed?: boolean;
  answers: Record<string, any>; // Flexible Q&A storage
  created_at: string;
  updated_at: string;
}

// Swipes
export interface Swipe {
  id: string;
  swiper_id: string;
  swiped_id: string;
  direction: SwipeDirection;
  created_at: string;
}

// Matches
export interface Match {
  id: string;
  user_1_id: string;
  user_2_id: string;
  matched_at: string;
}

// Messages
export interface Message {
  id: string;
  match_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

// Blocks
export interface Block {
  id: string;
  blocker_id: string;
  blocked_id: string;
  created_at: string;
}

// Combined types for convenience
export interface UserProfile extends User {
  preferences?: Preference;
  group?: Group;
  group_members?: GroupMember[];
}

export interface MatchWithProfiles extends Match {
  user_1?: UserProfile;
  user_2?: UserProfile;
  messages?: Message[];
}
