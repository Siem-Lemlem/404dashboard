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