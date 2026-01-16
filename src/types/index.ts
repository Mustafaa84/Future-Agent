// ============================================================================
// src/types/index.ts - Comprehensive Type Definitions for Future Agent
// ============================================================================

// ============================================================================
// ERROR HANDLING
// ============================================================================

export type ErrorHandler = Error | { message: string };

export interface ApiError {
  error: string;
  message?: string;
  code?: string;
  status?: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ============================================================================
// REACT & EVENT TYPES
// ============================================================================

export type FormEvent = React.FormEvent<HTMLFormElement>;
export type ChangeEvent<T = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> = React.ChangeEvent<T>;
export type MouseEvent = React.MouseEvent<HTMLButtonElement>;

// ============================================================================
// SUPABASE & DATABASE
// ============================================================================

export interface SupabaseError {
  message: string;
  code?: string;
  details?: string;
  hint?: string;
}

export interface SupabaseResponse<T> {
  data: T | null;
  error: SupabaseError | null;
}

// ============================================================================
// TOOL-RELATED TYPES
// ============================================================================

export interface Tool {
  id: string;
  name: string;
  slug: string;
  description?: string;
  published: boolean;
  [key: string]: unknown;
}

export interface ToolFormData {
  name: string;
  slug: string;
  category: string;
  tags: string;
  description?: string;
  website_url?: string;
  pricing_model?: string;
  [key: string]: unknown;
}

// ============================================================================
// BLOG-RELATED TYPES
// ============================================================================

export interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  author?: string;
  category?: string;
  tags?: string[];
  featured_image?: string;
  meta_title?: string;
  meta_description?: string;
  status: 'draft' | 'published' | 'scheduled';
  scheduled_at?: string;
  reading_time?: number;
  created_at?: string;
  updated_at?: string;
}

export interface BlogPostFormData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  tags: string;
  featured_image: string;
  status: 'draft' | 'published' | 'scheduled';
  scheduled_at: string;
  meta_title: string;
  meta_description: string;
  reading_time: string;
  keywords: string;
  tone: 'neutral' | 'friendly' | 'expert';
  length: 'short' | 'standard' | 'long';
}

// ============================================================================
// COMMENT-RELATED TYPES
// ============================================================================

export interface Comment {
  id: string;
  post_id: string;
  author_name: string;
  author_email?: string;
  content: string;
  created_at: string;
  updated_at?: string;
}

export interface CommentFormData {
  author_name: string;
  author_email: string;
  content: string;
}

// ============================================================================
// GENERIC UTILITY TYPES
// ============================================================================

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;

export interface PageParams {
  [key: string]: string | string[];
}

export interface SearchParams {
  [key: string]: string | string[] | undefined;
}

// ============================================================================
// NEXT.JS SPECIFIC TYPES
// ============================================================================

export interface NextPageParams {
  params: Promise<{ [key: string]: string | string[] }>;
}

export interface NextSearchParams {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// ============================================================================
// FORM-RELATED TYPES
// ============================================================================

export interface FormState {
  [key: string]: string | number | boolean | object | null | undefined;
}

export interface ValidationError {
  field: string;
  message: string;
}

// ============================================================================
// UPLOAD & FILE TYPES
// ============================================================================

export interface UploadResponse {
  success: boolean;
  url?: string;
  error?: string;
}

export interface ImageUploadParams {
  file: File;
  folder: string;
  onProgress?: (progress: number) => void;
}