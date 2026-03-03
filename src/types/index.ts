import { User as FirebaseUser } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';

export type User = FirebaseUser;


// Resource type
export interface Resource {
  id: string;
  name: string;
  url: string;
  description: string;
  category: Category;
  tags: string[];
  createdAt: Timestamp;
  updateAt?: Timestamp;
  pinned?: boolean;
  collectionIds?: string[];
  lastAccessedAt?: Timestamp;
}

// Categories
export type Category =
  | 'Documentation'
  | 'Tools'
  | 'UI/UX'
  | 'Backend'
  | 'Frontend'
  | 'Community'
  | 'Learning'
  | 'APIs';

// Form data (before submission)
export interface ResourceFormData {
  name: string;
  url: string;
  description: string;
  category: Category;
  tags: string;
}

// User profile
export interface UserProfile {
  email: string;
  displayName: string | null;
  photoURL: string | null;
  createdAt: Timestamp;
  hasCompletedOnboarding: boolean;
}

// Sample resource (without id and timestamps)
export interface SampleResource {
  name: string;
  url: string;
  description: string;
  category: Category;
  tags: string[];
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  resourceIds: string[];
  createAt: Timestamp;
  updatedAt?: Timestamp;
}

export const COLLECTION_COLORS = [
  { name: 'Purple', value: 'purple', class: 'bg-purple-500' },
  { name: 'Blue', value: 'blue', class: 'bg-blue-500' },
  { name: 'Green', value: 'green', class: 'bg-green-500' },
  { name: 'Orange', value: 'orange', class: 'bg-orange-500' },
  { name: 'Pink', value: 'pink', class: 'bg-pink-500' },
  { name: 'Teal', value: 'teal', class: 'bg-teal-500' },
  { name: 'Red', value: 'red', class: 'bg-red-500' },
  { name: 'Yellow', value: 'yellow', class: 'bg-yellow-500' },
];