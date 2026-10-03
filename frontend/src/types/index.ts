export interface StatItem {
  label: string;
  value: number;
}

export interface Socials {
  github?: string;
  linkedin?: string;
  twitter?: string;
  leetcode?: string;
  [key: string]: string | undefined;
}

export interface AboutHighlight {
  title: string;
  description: string;
  icon?: string;
  tag?: string;
  order?: number;
  is_active?: boolean;
}

export interface Profile {
  id?: number;
  name: string;
  short_name?: string;
  initials?: string;
  role: string[];
  roles?: string[];
  tagline: string;
  bio: string;
  location: string;
  email: string;
  resumeUrl: string;
  resume_url?: string;
  heroImage: string;
  hero_image?: string;
  heroImagePosition?: string;
  hero_image_position?: string;
  availability: string;
  open_to_work?: boolean;
  socials: Socials;
  stats: StatItem[];

  // Extended CMS Hero & About fields
  cta_text?: string;
  cta_url?: string;
  secondary_cta_text?: string;
  secondary_cta_url?: string;
  avatar_image?: string;
  about_heading?: string;
  about_description?: string;
  about_paragraphs?: string[];
  about_highlights?: AboutHighlight[];
  about_image?: string;
}

export interface SiteSettings {
  id?: number;
  open_to_work: boolean;
  work_status_text: string;
  resume_url: string;
  theme_default: string;
  contact_email: string;
  site_title?: string;
  site_description?: string;
  seo_title?: string;
  seo_description?: string;
  favicon_url?: string;
  og_image_url?: string;
  footer_text?: string;
  location?: string;
  default_profile_image?: string;
  default_resume_url?: string;
}

export interface SocialLink {
  id?: number;
  platform: string;
  url: string;
  icon: string;
  order?: number;
  is_active?: boolean;
}

export interface SkillItem {
  name: string;
  level?: string | number;
  logo?: string;
}

export interface SkillCategory {
  id?: number;
  category: string;
  items?: (string | SkillItem)[];
  chips?: string[];
  order?: number;
  is_published?: boolean;
}

export interface LearningItem {
  id?: number;
  name: string;
  category?: string;
  status?: string;
  order?: number;
  is_published?: boolean;
}

export interface JourneyMilestone {
  id?: number;
  year: string;
  title: string;
  description: string;
  tag?: string;
  order?: number;
  is_published?: boolean;
}

export interface Certification {
  id?: number;
  title: string;
  issuer: string;
  date: string;
  credential_url?: string;
  badge_image?: string;
  order?: number;
  is_published?: boolean;
}

export interface Achievement {
  id?: number;
  title: string;
  organization: string;
  description: string;
  date: string;
  url?: string;
  badge?: string;
  order?: number;
  is_published?: boolean;
}

export interface Experience {
  id?: number;
  company: string;
  title: string;
  role?: string;
  type?: string;
  period: string;
  points: string[];
  order?: number;
  is_published?: boolean;
  location?: string;
  start_date?: string;
  end_date?: string;
  is_current?: boolean;
  description?: string;
  technologies?: string[];
  company_logo?: string;
}

export interface Education {
  id?: number;
  school: string;
  degree: string;
  period: string;
  order?: number;
  is_published?: boolean;
  institution?: string;
  field_of_study?: string;
  grade_cgpa?: string;
  location?: string;
  logo_url?: string;
  start_date?: string;
  end_date?: string;
  description?: string;
}

export interface Project {
  id?: number;
  slug: string;
  title: string;
  summary: string;
  problem: string;
  solution: string;
  features: string[];
  architecture?: string;
  learnings?: string;
  tech: string[];
  category: string;
  status?: string;
  image: string;
  gallery?: string[];
  live?: string;
  repo?: string;
  featured?: boolean;
  order?: number;
  is_published?: boolean;
  short_description?: string;
  full_description?: string;
  start_date?: string;
  end_date?: string;
}

export interface MediaAsset {
  id: number;
  filename: string;
  public_id?: string;
  url: string;
  secure_url: string;
  format?: string;
  size_bytes?: number;
  width?: number;
  height?: number;
  content_type?: string;
  created_at?: string;
}

export interface ContactSubmission {
  name: string;
  email: string;
  subject: string;
  message: string;
  honeypot?: string;
}

export interface ContactMessage extends ContactSubmission {
  id: number;
  created_at: string;
  is_read: boolean;
  is_handled?: boolean;
}
