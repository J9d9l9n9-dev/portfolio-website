import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, JSON
from app.database import Base

def utcnow():
    return datetime.datetime.now(datetime.timezone.utc)

class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    short_name = Column(String(100), default="Lakshmi Narayana")
    initials = Column(String(20), default="JDLN")
    role = Column(JSON, nullable=False)  # List[str]
    roles = Column(JSON, nullable=True)  # List[str]
    tagline = Column(String(255), nullable=False)
    bio = Column(Text, nullable=False)
    location = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False)
    resume_url = Column(String(255), nullable=False)
    hero_image = Column(String(255), nullable=False)
    hero_image_position = Column(String(50), default="center 20%")
    availability = Column(String(150), default="Open to internships, hackathons, research opportunities, and software development opportunities")
    open_to_work = Column(Boolean, default=True)
    socials = Column(JSON, nullable=False)  # {"github": "...", "linkedin": "..."}
    stats = Column(JSON, nullable=False)    # [{"label": "...", "value": 3}]

    # Extended CMS Hero & About fields (nullable with safe defaults)
    cta_text = Column(String(100), nullable=True, default="View Projects")
    cta_url = Column(String(255), nullable=True, default="#projects")
    secondary_cta_text = Column(String(100), nullable=True, default="Contact Me")
    secondary_cta_url = Column(String(255), nullable=True, default="#contact")
    avatar_image = Column(String(255), nullable=True, default="")
    about_heading = Column(String(255), nullable=True, default="About Me")
    about_description = Column(Text, nullable=True, default="Engineering foundation, practical software development, and current technical focus.")
    about_paragraphs = Column(JSON, nullable=True, default=list)
    about_highlights = Column(JSON, nullable=True, default=list)
    about_image = Column(String(255), nullable=True, default="")

    updated_at = Column(DateTime, default=utcnow, onupdate=utcnow)

class SiteSettings(Base):
    __tablename__ = "site_settings"

    id = Column(Integer, primary_key=True, index=True)
    open_to_work = Column(Boolean, default=True)
    work_status_text = Column(String(150), default="Open to internships, hackathons, research opportunities, and software development opportunities")
    resume_url = Column(String(255), default="/resume.pdf")
    theme_default = Column(String(20), default="dark")
    contact_email = Column(String(100), default="jampadurgalakshminarayana@gmail.com")

    # Extended CMS Website & SEO Settings (nullable with safe defaults)
    site_title = Column(String(150), nullable=True, default="JDLN Portfolio")
    site_description = Column(Text, nullable=True, default="Placement-Ready Engineering Portfolio")
    seo_title = Column(String(150), nullable=True, default="Jampa Durga Lakshmi Narayana | Full-Stack & AI Engineer")
    seo_description = Column(Text, nullable=True, default="Portfolio of Jampa Durga Lakshmi Narayana - Full-Stack Developer & AI Systems Engineer")
    favicon_url = Column(String(255), nullable=True, default="/favicon.svg")
    og_image_url = Column(String(255), nullable=True, default="/images/hero.jpg")
    footer_text = Column(String(255), nullable=True, default="Engineered with precision. All rights reserved.")
    location = Column(String(150), nullable=True, default="Visakhapatnam, Andhra Pradesh, India")
    default_profile_image = Column(String(255), nullable=True, default="/images/hero.jpg")
    default_resume_url = Column(String(255), nullable=True, default="/resume.pdf")

    updated_at = Column(DateTime, default=utcnow, onupdate=utcnow)

class SocialLink(Base):
    __tablename__ = "social_links"

    id = Column(Integer, primary_key=True, index=True)
    platform = Column(String(50), nullable=False)
    url = Column(String(255), nullable=False)
    icon = Column(String(50), nullable=False)
    order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)

class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String(100), nullable=False)
    items = Column(JSON, nullable=True)  # List[{"name": "...", "level": "Intermediate", "logo": "..."}]
    chips = Column(JSON, nullable=True)  # List[str]
    order = Column(Integer, default=0)
    is_published = Column(Boolean, default=True)

class LearningItem(Base):
    __tablename__ = "learning_items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    category = Column(String(50), default="AI & Systems")
    status = Column(String(50), default="Active")
    order = Column(Integer, default=0)
    is_published = Column(Boolean, default=True)

class JourneyMilestone(Base):
    __tablename__ = "journey_milestones"

    id = Column(Integer, primary_key=True, index=True)
    year = Column(String(20), nullable=False)
    title = Column(String(150), nullable=False)
    description = Column(Text, nullable=False)
    tag = Column(String(50), default="Milestone")
    order = Column(Integer, default=0)
    is_published = Column(Boolean, default=True)

class Experience(Base):
    __tablename__ = "experience"

    id = Column(Integer, primary_key=True, index=True)
    company = Column(String(150), nullable=True)
    title = Column(String(150), nullable=False)
    role = Column(String(150), nullable=True)
    type = Column(String(50), default="project")
    period = Column(String(100), nullable=False)
    points = Column(JSON, nullable=False)  # List[str]
    order = Column(Integer, default=0)
    is_published = Column(Boolean, default=True)

    # Extended CMS fields
    location = Column(String(100), nullable=True)
    start_date = Column(String(50), nullable=True)
    end_date = Column(String(50), nullable=True)
    is_current = Column(Boolean, default=False)
    description = Column(Text, nullable=True)
    technologies = Column(JSON, nullable=True, default=list)
    company_logo = Column(String(255), nullable=True)

class Education(Base):
    __tablename__ = "education"

    id = Column(Integer, primary_key=True, index=True)
    school = Column(String(150), nullable=False)
    degree = Column(String(150), nullable=False)
    period = Column(String(100), nullable=False)
    order = Column(Integer, default=0)
    is_published = Column(Boolean, default=True)

    # Extended CMS fields
    institution = Column(String(150), nullable=True)
    field_of_study = Column(String(150), nullable=True)
    grade_cgpa = Column(String(50), nullable=True)
    location = Column(String(100), nullable=True)
    logo_url = Column(String(255), nullable=True)
    start_date = Column(String(50), nullable=True)
    end_date = Column(String(50), nullable=True)
    description = Column(Text, nullable=True)

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    title = Column(String(150), nullable=False)
    summary = Column(Text, nullable=False)
    problem = Column(Text, nullable=False)
    solution = Column(Text, nullable=False)
    features = Column(JSON, nullable=False)       # List[str]
    architecture = Column(Text, default="")
    learnings = Column(Text, default="")
    tech = Column(JSON, nullable=False)           # List[str]
    category = Column(String(50), nullable=False)
    status = Column(String(100), default="")
    image = Column(String(255), nullable=True, default="")
    gallery = Column(JSON, default=list)          # List[str] of screenshot URLs
    live = Column(String(255), nullable=True, default=None)
    repo = Column(String(255), nullable=True, default=None)
    featured = Column(Boolean, default=False)
    order = Column(Integer, default=0)
    is_published = Column(Boolean, default=True)

    # Extended CMS fields
    short_description = Column(Text, nullable=True)
    full_description = Column(Text, nullable=True)
    start_date = Column(String(50), nullable=True)
    end_date = Column(String(50), nullable=True)

class Certification(Base):
    __tablename__ = "certifications"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(150), nullable=False)
    issuer = Column(String(100), nullable=False)
    date = Column(String(50), nullable=False)
    credential_url = Column(String(255), default="")
    badge_image = Column(String(255), default="")
    order = Column(Integer, default=0)
    is_published = Column(Boolean, default=True)

class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(150), nullable=False)
    organization = Column(String(100), nullable=True, default="")
    description = Column(Text, nullable=False)
    date = Column(String(50), nullable=True, default="")
    url = Column(String(255), nullable=True, default=None)
    badge = Column(String(50), default="Hackathon")
    order = Column(Integer, default=0)
    is_published = Column(Boolean, default=True)

class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False)
    subject = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, default=utcnow)
    is_read = Column(Boolean, default=False)
    is_handled = Column(Boolean, default=False)

class AdminUser(Base):
    __tablename__ = "admin_users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    failed_login_attempts = Column(Integer, default=0)
    locked_until = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=utcnow)

class MediaAsset(Base):
    __tablename__ = "media_assets"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), nullable=False)
    public_id = Column(String(255), nullable=True)
    url = Column(String(500), nullable=False)
    secure_url = Column(String(500), nullable=False)
    format = Column(String(50), nullable=True)
    size_bytes = Column(Integer, nullable=True)
    width = Column(Integer, nullable=True)
    height = Column(Integer, nullable=True)
    content_type = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=utcnow)
