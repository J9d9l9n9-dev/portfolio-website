from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, EmailStr, Field, ConfigDict

# Profile Schemas
class ProfileBase(BaseModel):
    name: str
    short_name: Optional[str] = "Lakshmi Narayana"
    initials: Optional[str] = "JDLN"
    role: List[str]
    roles: Optional[List[str]] = None
    tagline: str
    bio: str
    location: str
    email: EmailStr
    resume_url: str
    hero_image: str
    hero_image_position: Optional[str] = "center 20%"
    availability: Optional[str] = "Open to internships, hackathons, research opportunities, and software development opportunities"
    open_to_work: Optional[bool] = True
    socials: Dict[str, str]
    stats: List[Dict[str, Any]]

    # Extended CMS fields
    cta_text: Optional[str] = "View Projects"
    cta_url: Optional[str] = "#projects"
    secondary_cta_text: Optional[str] = "Contact Me"
    secondary_cta_url: Optional[str] = "#contact"
    avatar_image: Optional[str] = ""
    about_heading: Optional[str] = "About Me"
    about_description: Optional[str] = "Engineering foundation, practical software development, and current technical focus."
    about_paragraphs: Optional[List[str]] = []
    about_highlights: Optional[List[Dict[str, Any]]] = []
    about_image: Optional[str] = ""

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    short_name: Optional[str] = None
    initials: Optional[str] = None
    role: Optional[List[str]] = None
    roles: Optional[List[str]] = None
    tagline: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    email: Optional[EmailStr] = None
    resume_url: Optional[str] = None
    hero_image: Optional[str] = None
    hero_image_position: Optional[str] = None
    availability: Optional[str] = None
    open_to_work: Optional[bool] = None
    socials: Optional[Dict[str, str]] = None
    stats: Optional[List[Dict[str, Any]]] = None
    cta_text: Optional[str] = None
    cta_url: Optional[str] = None
    secondary_cta_text: Optional[str] = None
    secondary_cta_url: Optional[str] = None
    avatar_image: Optional[str] = None
    about_heading: Optional[str] = None
    about_description: Optional[str] = None
    about_paragraphs: Optional[List[str]] = None
    about_highlights: Optional[List[Dict[str, Any]]] = None
    about_image: Optional[str] = None

class ProfileOut(ProfileBase):
    id: int
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

# Site Settings Schemas
class SiteSettingsBase(BaseModel):
    open_to_work: bool = True
    work_status_text: str = "Open to internships, hackathons, research opportunities, and software development opportunities"
    resume_url: str = "/resume.pdf"
    theme_default: str = "dark"
    contact_email: str = "jampadurgalakshminarayana@gmail.com"
    site_title: Optional[str] = "JDLN Portfolio"
    site_description: Optional[str] = "Placement-Ready Engineering Portfolio"
    seo_title: Optional[str] = "Jampa Durga Lakshmi Narayana | Full-Stack & AI Engineer"
    seo_description: Optional[str] = "Portfolio of Jampa Durga Lakshmi Narayana - Full-Stack Developer & AI Systems Engineer"
    favicon_url: Optional[str] = "/favicon.svg"
    og_image_url: Optional[str] = "/images/hero.jpg"
    footer_text: Optional[str] = "Engineered with precision. All rights reserved."
    location: Optional[str] = "Visakhapatnam, Andhra Pradesh, India"
    default_profile_image: Optional[str] = "/images/hero.jpg"
    default_resume_url: Optional[str] = "/resume.pdf"

class SiteSettingsUpdate(BaseModel):
    open_to_work: Optional[bool] = None
    work_status_text: Optional[str] = None
    resume_url: Optional[str] = None
    theme_default: Optional[str] = None
    contact_email: Optional[str] = None
    site_title: Optional[str] = None
    site_description: Optional[str] = None
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    favicon_url: Optional[str] = None
    og_image_url: Optional[str] = None
    footer_text: Optional[str] = None
    location: Optional[str] = None
    default_profile_image: Optional[str] = None
    default_resume_url: Optional[str] = None

class SiteSettingsOut(SiteSettingsBase):
    id: int
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

# Social Link Schemas
class SocialLinkBase(BaseModel):
    platform: str
    url: str
    icon: str
    order: Optional[int] = 0
    is_active: Optional[bool] = True

class SocialLinkCreate(SocialLinkBase):
    pass

class SocialLinkUpdate(BaseModel):
    platform: Optional[str] = None
    url: Optional[str] = None
    icon: Optional[str] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None

class SocialLinkOut(SocialLinkBase):
    id: int

    model_config = ConfigDict(from_attributes=True)

# Skills Schemas
class SkillBase(BaseModel):
    category: str
    items: Optional[List[Any]] = []
    chips: Optional[List[str]] = []
    order: Optional[int] = 0
    is_published: Optional[bool] = True

class SkillCreate(SkillBase):
    pass

class SkillUpdate(BaseModel):
    category: Optional[str] = None
    items: Optional[List[Any]] = None
    chips: Optional[List[str]] = None
    order: Optional[int] = None
    is_published: Optional[bool] = None

class SkillOut(SkillBase):
    id: int

    model_config = ConfigDict(from_attributes=True)

# Learning Item Schemas
class LearningItemBase(BaseModel):
    name: str
    category: Optional[str] = "Backend & Systems"
    status: Optional[str] = "Exploring"
    order: Optional[int] = 0
    is_published: Optional[bool] = True

class LearningItemCreate(LearningItemBase):
    pass

class LearningItemUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    status: Optional[str] = None
    order: Optional[int] = None
    is_published: Optional[bool] = None

class LearningItemOut(LearningItemBase):
    id: int

    model_config = ConfigDict(from_attributes=True)

# Journey Milestone Schemas
class JourneyMilestoneBase(BaseModel):
    year: str
    title: str
    description: str
    tag: Optional[str] = "Milestone"
    order: Optional[int] = 0
    is_published: Optional[bool] = True

class JourneyMilestoneCreate(JourneyMilestoneBase):
    pass

class JourneyMilestoneUpdate(BaseModel):
    year: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    tag: Optional[str] = None
    order: Optional[int] = None
    is_published: Optional[bool] = None

class JourneyMilestoneOut(JourneyMilestoneBase):
    id: int

    model_config = ConfigDict(from_attributes=True)

# Experience Schemas
class ExperienceBase(BaseModel):
    company: Optional[str] = None
    title: str
    role: Optional[str] = None
    type: Optional[str] = "project"
    period: str
    points: List[str]
    order: Optional[int] = 0
    is_published: Optional[bool] = True
    location: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    is_current: Optional[bool] = False
    description: Optional[str] = None
    technologies: Optional[List[str]] = []
    company_logo: Optional[str] = None

class ExperienceCreate(ExperienceBase):
    pass

class ExperienceUpdate(BaseModel):
    company: Optional[str] = None
    title: Optional[str] = None
    role: Optional[str] = None
    type: Optional[str] = None
    period: Optional[str] = None
    points: Optional[List[str]] = None
    order: Optional[int] = None
    is_published: Optional[bool] = None
    location: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    is_current: Optional[bool] = None
    description: Optional[str] = None
    technologies: Optional[List[str]] = None
    company_logo: Optional[str] = None

class ExperienceOut(ExperienceBase):
    id: int

    model_config = ConfigDict(from_attributes=True)

# Education Schemas
class EducationBase(BaseModel):
    school: str
    degree: str
    period: str
    order: Optional[int] = 0
    is_published: Optional[bool] = True
    institution: Optional[str] = None
    field_of_study: Optional[str] = None
    grade_cgpa: Optional[str] = None
    location: Optional[str] = None
    logo_url: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    description: Optional[str] = None

class EducationCreate(EducationBase):
    pass

class EducationUpdate(BaseModel):
    school: Optional[str] = None
    degree: Optional[str] = None
    period: Optional[str] = None
    order: Optional[int] = None
    is_published: Optional[bool] = None
    institution: Optional[str] = None
    field_of_study: Optional[str] = None
    grade_cgpa: Optional[str] = None
    location: Optional[str] = None
    logo_url: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    description: Optional[str] = None

class EducationOut(EducationBase):
    id: int

    model_config = ConfigDict(from_attributes=True)

# Project Schemas
class ProjectBase(BaseModel):
    slug: str
    title: str
    summary: str
    problem: str
    solution: str
    features: List[str]
    architecture: Optional[str] = ""
    learnings: Optional[str] = ""
    tech: List[str]
    category: str
    status: Optional[str] = ""
    image: Optional[str] = ""
    gallery: Optional[List[str]] = []
    live: Optional[str] = None
    repo: Optional[str] = None
    featured: Optional[bool] = False
    order: Optional[int] = 0
    is_published: Optional[bool] = True
    short_description: Optional[str] = None
    full_description: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    slug: Optional[str] = None
    title: Optional[str] = None
    summary: Optional[str] = None
    problem: Optional[str] = None
    solution: Optional[str] = None
    features: Optional[List[str]] = None
    architecture: Optional[str] = None
    learnings: Optional[str] = None
    tech: Optional[List[str]] = None
    category: Optional[str] = None
    status: Optional[str] = None
    image: Optional[str] = None
    gallery: Optional[List[str]] = None
    live: Optional[str] = None
    repo: Optional[str] = None
    featured: Optional[bool] = None
    order: Optional[int] = None
    is_published: Optional[bool] = None
    short_description: Optional[str] = None
    full_description: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None

class ProjectOut(ProjectBase):
    id: int

    model_config = ConfigDict(from_attributes=True)

# Media Asset Schemas
class MediaAssetBase(BaseModel):
    filename: str
    public_id: Optional[str] = None
    url: str
    secure_url: str
    format: Optional[str] = None
    size_bytes: Optional[int] = None
    width: Optional[int] = None
    height: Optional[int] = None
    content_type: Optional[str] = None

class MediaAssetCreate(MediaAssetBase):
    pass

class MediaAssetOut(MediaAssetBase):
    id: int
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

# Certification Schemas
class CertificationBase(BaseModel):
    title: str
    issuer: str
    date: str
    credential_url: Optional[str] = ""
    badge_image: Optional[str] = ""
    order: Optional[int] = 0
    is_published: Optional[bool] = True

class CertificationCreate(CertificationBase):
    pass

class CertificationUpdate(BaseModel):
    title: Optional[str] = None
    issuer: Optional[str] = None
    date: Optional[str] = None
    credential_url: Optional[str] = None
    badge_image: Optional[str] = None
    order: Optional[int] = None
    is_published: Optional[bool] = None

class CertificationOut(CertificationBase):
    id: int

    model_config = ConfigDict(from_attributes=True)

# Achievement Schemas
class AchievementBase(BaseModel):
    title: str
    organization: Optional[str] = ""
    description: str
    date: Optional[str] = ""
    url: Optional[str] = None
    badge: Optional[str] = "Hackathon"
    order: Optional[int] = 0
    is_published: Optional[bool] = True

class AchievementCreate(AchievementBase):
    pass

class AchievementUpdate(BaseModel):
    title: Optional[str] = None
    organization: Optional[str] = None
    description: Optional[str] = None
    date: Optional[str] = None
    url: Optional[str] = None
    badge: Optional[str] = None
    order: Optional[int] = None
    is_published: Optional[bool] = None

class AchievementOut(AchievementBase):
    id: int

    model_config = ConfigDict(from_attributes=True)

# Contact Message Schemas
class ContactMessageCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    subject: str = Field(..., min_length=3, max_length=200)
    message: str = Field(..., min_length=10, max_length=2000)
    honeypot: Optional[str] = None

class ContactMessageOut(BaseModel):
    id: int
    name: str
    email: str
    subject: str
    message: str
    created_at: datetime
    is_read: bool
    is_handled: bool

    model_config = ConfigDict(from_attributes=True)

# Auth Schemas
class Token(BaseModel):
    access_token: str
    refresh_token: Optional[str] = None
    token_type: str = "bearer"
    expires_in: int = 1800

class TokenData(BaseModel):
    username: Optional[str] = None

class AdminLogin(BaseModel):
    email: str
    password: str

class RefreshTokenRequest(BaseModel):
    refresh_token: Optional[str] = None
