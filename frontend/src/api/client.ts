import type {
  Profile, SkillCategory, Experience, Education, Project,
  ContactSubmission, ContactMessage, SiteSettings,
  JourneyMilestone, Certification, Achievement, LearningItem,
  MediaAsset, SocialLink
} from '../types';

const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api/v1' : 'http://localhost:8000/api/v1');

// Resilient offline fallback data layer
export const FALLBACK_PROFILE: Profile = {
  name: "Jampa Durga Lakshmi Narayana",
  role: [
    "Full-Stack Developer",
    "AI Software Engineer",
    "Computer Science Undergraduate"
  ],
  tagline: "Computer Science Undergraduate at GITAM passionate about Full-Stack Development, Scalable Software, and AI-Driven Applications.",
  bio: "Computer Science undergraduate at GITAM Deemed to be University with a strong foundation in Data Structures & Algorithms, Object-Oriented Programming, Software Engineering, and Full-Stack Web Development. Passionate about building scalable software solutions and integrating Artificial Intelligence into real-world applications. Seeking Software Engineer or Full-Stack Developer opportunities to contribute to innovative products and continuously expand expertise in AI-driven software development.",
  location: "Visakhapatnam, Andhra Pradesh, India",
  email: "jampadurgalakshminarayana@gmail.com",
  resumeUrl: "/resume.pdf",
  heroImage: "/images/hero.jpg",
  heroImagePosition: "center 20%",
  availability: "Available for Internships & Full-Stack Roles",
  socials: {
    github: "https://github.com/J9d9l9n9-dev",
    linkedin: "https://www.linkedin.com/in/durgalakshminarayanajampa/",
    twitter: "",
    leetcode: "https://leetcode.com/u/J9d9l9n9/"
  },
  stats: [
    { label: "Featured Projects", value: 3 },
    { label: "SIH Hackathon", value: 1 },
    { label: "DSA Solved", value: 100 }
  ]
};

export const FALLBACK_SITE_SETTINGS: SiteSettings = {
  open_to_work: true,
  work_status_text: "Available for Internships & Full-Stack Roles",
  resume_url: "/resume.pdf",
  theme_default: "dark",
  contact_email: "jampadurgalakshminarayana@gmail.com"
};

export const FALLBACK_SKILLS: SkillCategory[] = [
  {
    category: "Programming",
    items: [
      { name: "Java", level: "Intermediate", logo: "java" },
      { name: "JavaScript", level: "Intermediate", logo: "javascript" },
      { name: "TypeScript", level: "Intermediate", logo: "typescript" },
      { name: "Python", level: "Intermediate", logo: "python" },
      { name: "C", level: "Intermediate", logo: "c" },
      { name: "SQL", level: "Intermediate", logo: "sql" },
    ],
    order: 1
  },
  {
    category: "Frontend",
    items: [
      { name: "React", level: "Intermediate", logo: "react" },
      { name: "HTML5", level: "Intermediate", logo: "html5" },
      { name: "CSS3", level: "Intermediate", logo: "css3" },
      { name: "Tailwind CSS", level: "Intermediate", logo: "tailwind" },
      { name: "Bootstrap", level: "Intermediate", logo: "bootstrap" },
      { name: "Vite", level: "Intermediate", logo: "vite" },
    ],
    order: 2
  },
  {
    category: "Backend",
    items: [
      { name: "Node.js", level: "Intermediate", logo: "nodejs" },
      { name: "FastAPI", level: "Intermediate", logo: "fastapi" },
      { name: "Fastify", level: "Beginner-Intermediate", logo: "fastify" },
      { name: "REST APIs", level: "Intermediate", logo: "api" },
      { name: "JWT", level: "Intermediate", logo: "jwt" },
      { name: "RBAC", level: "Beginner-Intermediate", logo: "rbac" },
    ],
    order: 3
  },
  {
    category: "Databases",
    items: [
      { name: "PostgreSQL", level: "Intermediate", logo: "postgresql" },
      { name: "SQLite", level: "Intermediate", logo: "sqlite" },
      { name: "SQLAlchemy", level: "Intermediate", logo: "sqlalchemy" },
      { name: "Prisma", level: "Beginner-Intermediate", logo: "prisma" },
      { name: "Drizzle", level: "Beginner-Intermediate", logo: "drizzle" },
    ],
    order: 4
  },
  {
    category: "AI / ML",
    items: [
      { name: "Machine Learning", level: "Intermediate", logo: "ml" },
      { name: "PyTorch", level: "Beginner-Intermediate", logo: "pytorch" },
      { name: "Computer Vision", level: "Beginner-Intermediate", logo: "cv" },
      { name: "EfficientNet", level: "Beginner-Intermediate", logo: "efficientnet" },
      { name: "LLM Applications", level: "Beginner-Intermediate", logo: "llm" },
      { name: "LangChain", level: "Beginner", logo: "langchain" },
      { name: "AI Workflows", level: "Beginner-Intermediate", logo: "ai" },
    ],
    order: 5
  },
  {
    category: "Tools & DevOps",
    chips: [
      "Git",
      "GitHub",
      "Linux",
      "Docker",
      "Postman",
      "Wireshark",
      "n8n",
      "VS Code"
    ],
    order: 6
  }
];

export const FALLBACK_LEARNING: LearningItem[] = [
  { id: 1, name: "Generative AI & LLM Integration", category: "Artificial Intelligence", status: "In Progress" },
  { id: 2, name: "Advanced Full-Stack Engineering (React & Node.js)", category: "Web Architecture", status: "In Progress" },
  { id: 3, name: "AI-Driven Software Architecture", category: "Systems Engineering", status: "In Progress" }
];

export const FALLBACK_JOURNEY: JourneyMilestone[] = [
  {
    id: 1,
    year: "2022 - 2024",
    title: "Academic Distinction in Intermediate (MPC)",
    description: "Graduated with 93.9% from Sasi Junior College, Mandapeta, building a rigorous analytical foundation in Mathematics, Physics, and logical problem-solving.",
    tag: "Foundation"
  },
  {
    id: 2,
    year: "2024",
    title: "Joined GITAM CSE & First Code in C / Java",
    description: "Commenced B.Tech in Computer Science and Engineering at GITAM Deemed to be University, Visakhapatnam. Mastered programming in C, Java, and Object-Oriented principles.",
    tag: "Milestone"
  },
  {
    id: 3,
    year: "2025",
    title: "Full-Stack Systems & Database Engineering",
    description: "Engineered Java JDBC CRUD applications with MySQL databases and developed responsive modern web frontends using HTML5, CSS3, JavaScript, and React.js.",
    tag: "Project Milestone"
  },
  {
    id: 4,
    year: "2025 - 2026",
    title: "DSA Mastery (100+ Solved), Hackathons & AI Integration",
    description: "Solved 100+ Data Structures & Algorithms problems across coding platforms, participated in engineering hackathons, and began integrating Generative AI into real-world software applications.",
    tag: "Current Focus"
  }
];

export const FALLBACK_CERTIFICATIONS: Certification[] = [];

export const FALLBACK_ACHIEVEMENTS: Achievement[] = [
  {
    id: 1,
    title: "100+ DSA Problems Solved",
    organization: "Coding Platforms (LeetCode / GeeksforGeeks)",
    description: "Solved 100+ Data Structures & Algorithms problems on coding platforms, building a strong foundation in algorithmic analysis and optimization.",
    date: "2024 - Present",
    url: "https://leetcode.com/u/J9d9l9n9/",
    badge: "100+ Solved"
  },
  {
    id: 2,
    title: "Hackathon Participation & Project Building",
    organization: "Engineering Technical Communities",
    description: "Participated in collegiate hackathons (including Smart India Hackathon internal rounds) and continuously build software applications collaborating in team sprints.",
    date: "2024 - 2025",
    url: "https://github.com/J9d9l9n9-dev",
    badge: "Hackathon Builder"
  },
  {
    id: 3,
    title: "Continuous Skill Expansion in Full-Stack & AI",
    organization: "Technical Exploration",
    description: "Consistently expanding technical depth across modern Full-Stack Web Development, React, FastAPI, PostgreSQL, and Applied AI/PyTorch systems.",
    date: "2025",
    url: "https://github.com/J9d9l9n9-dev",
    badge: "Continuous Learner"
  }
];

export const FALLBACK_EXPERIENCE: Experience[] = [
  {
    id: 1,
    company: "GITAM Deemed to be University",
    title: "Software Developer & Technical Community Member",
    period: "2024 - Present",
    points: [
      "Engineered database-driven applications including high-performance REST APIs and modern web apps.",
      "Solved 100+ Data Structures & Algorithms problems across coding platforms focusing on arrays, strings, and OOP design.",
      "Actively participated in collegiate hackathons, collaborating to build software applications under tight time constraints.",
      "Consistently expanding expertise in Full-Stack Web Development, modern JavaScript/React, and Generative AI technologies."
    ]
  }
];

export const FALLBACK_EDUCATION: Education[] = [
  {
    id: 1,
    school: "GITAM Deemed to be University, Visakhapatnam",
    degree: "B.Tech in Computer Science and Engineering (CGPA: 8.17/10)",
    period: "2024 - 2028 (Expected)"
  },
  {
    id: 2,
    school: "Sasi Junior College, Mandapeta",
    degree: "Intermediate (MPC - Mathematics, Physics, Chemistry) - 93.9%",
    period: "2022 - 2024"
  }
];

export const FALLBACK_PROJECTS: Project[] = [
  {
    id: 1,
    slug: "ai-skin-intelligence",
    title: "AI Skin Intelligence & Personalized Skincare Planner",
    summary: "AI-powered skincare platform analyzing skin characteristics and generating personalized daily routines and ingredient recommendations.",
    problem: "Generic skincare recommendations often fail to account for individual skin characteristics, concerns, lifestyle, environmental factors, allergies, and previous assessments.",
    solution: "Built an AI-powered platform that combines skin image analysis, user profiles, health/lifestyle information, ingredient intelligence, and recommendation logic to generate personalized skincare routines.",
    architecture: "Dual-tier decoupled architecture: React 18 client communicating with a high-performance FastAPI backend. Image inference pipeline leverages PyTorch with an EfficientNet-B0 backbone for skin feature classification, coupled with SQLAlchemy 2.0 ORM, PostgreSQL persistence, and JWT-authenticated session control.",
    learnings: "Implemented computer vision inference pipelines in production, managed ML model weight loading in ASGI lifespans, designed structured relational schemas with Alembic migrations, and enforced fine-grained RBAC authorization.",
    features: [
      "AI skin assessment with webcam capture & image upload",
      "Personalized morning, evening, weekly, and seasonal routines",
      "Ingredient intelligence & allergen conflict analysis",
      "Skin health scoring metrics",
      "JWT authentication with role-based access control (RBAC)",
      "High-speed FastAPI REST API & PostgreSQL database"
    ],
    tech: ["React 18", "Vite", "TypeScript", "FastAPI", "Python", "PyTorch", "EfficientNet-B0", "SQLAlchemy", "PostgreSQL", "JWT"],
    category: "Full-Stack + AI",
    image: "/images/ai-skin-desktop.jpg",
    gallery: ["/images/ai-skin-desktop.jpg", "/images/ai-skin-mobile.jpg"],
    live: "https://ai-skin-intelligence-lakshmi-narayana-jampa.vercel.app/",
    repo: "https://github.com/springboardmentor23232a-eng/AI_Skin-Intelligence-Personalized-Skincare-Planner/tree/durga-laskshmi-narayana-jampa",
    featured: true,
  },
  {
    id: 2,
    slug: "asha-ehr-companion",
    title: "ASHA EHR Companion",
    summary: "Offline-first mobile EHR application helping rural healthcare workers manage patient records and health visits with bidirectional sync.",
    problem: "Healthcare workers in rural environments need to collect and access patient records reliably even in areas with zero or intermittent internet connectivity.",
    solution: "Designed an offline-first mobile EHR system with local device storage and intelligent delta synchronization between the mobile app and backend server.",
    architecture: "Offline-first mobile architecture utilizing React Native (Expo) and local SQLite storage on device. Employs a bidirectional synchronization engine with Fastify backend, executing queued batch payloads, delta reconciliations, and timestamp conflict-resolution protocols.",
    learnings: "Deepened understanding of offline-first mobile state synchronization, network intermittent resilience, transactional SQLite migrations, and designing low-latency healthcare workflows for rural health workers.",
    features: [
      "Offline-first patient profile and visit record management",
      "ANC (Antenatal Care) and immunization tracking",
      "Local SQLite persistence on mobile client",
      "Sync queue with automatic batch and delta synchronization",
      "Conflict logging and server reconciliation"
    ],
    tech: ["React Native", "Expo", "Node.js", "Fastify", "TypeScript", "SQLite", "Drizzle ORM", "Zustand", "JWT"],
    category: "Mobile + Backend",
    image: "/images/project-vision.jpg",
    gallery: ["/images/project-vision.jpg"],
    live: undefined,
    repo: undefined,
    featured: true,
  },
  {
    id: 3,
    slug: "developer-portfolio",
    title: "Full-Stack Developer Portfolio",
    summary: "Production-grade portfolio web application featuring a managed FastAPI backend, owner-only admin CMS, and automated testing.",
    problem: "A software engineer needs an always-current, dynamic platform to demonstrate engineering depth across frontend, backend, databases, security, and automated tests.",
    solution: "Built a responsive React 19 + TypeScript frontend backed by a FastAPI REST API with SQLAlchemy ORM, JWT-secured owner CMS, rate-limited inquiry handling, and containerized deployment.",
    architecture: "Production-grade decoupled full-stack architecture: React 19 + TypeScript + Tailwind CSS v4 frontend paired with a FastAPI + SQLAlchemy 2.0 backend. Utilizes TanStack Query for server state caching with resilient offline fallback data, JWT authentication with rate-limited login, and Docker containerization.",
    learnings: "Mastered strict type contracts between TypeScript and Pydantic v2 schemas, automated testing across Pytest and Vitest, WCAG AA accessibility, Docker Compose multi-service orchestrations, and owner-only admin CMS architecture.",
    features: [
      "Responsive UI with dark/light WCAG AA theme system",
      "Dynamic case studies with deep problem and architecture insights",
      "Contact form with IP rate limiting and anti-spam honeypot",
      "Owner-only admin CMS for content and image upload management",
      "Global Command Palette (Ctrl+K) for rapid navigation",
      "Full automated testing suite across backend and frontend"
    ],
    tech: ["React 19", "TypeScript", "Vite", "Tailwind CSS", "FastAPI", "Python", "SQLAlchemy", "PostgreSQL", "Docker", "JWT", "Vitest", "Pytest"],
    category: "Full-Stack",
    image: "/images/projects/developer-portfolio/hero.png",
    gallery: ["/images/projects/developer-portfolio/hero.png"],
    live: undefined,
    repo: "https://github.com/J9d9l9n9-dev/portfolio-website",
    featured: true,
  }
];

export const FALLBACK_TESTIMONIALS: any[] = [];


// Token Helpers
export function getAdminToken(): string | null {
  return sessionStorage.getItem('admin_token');
}

export function setAdminToken(token: string): void {
  sessionStorage.setItem('admin_token', token);
}

export function clearAdminToken(): void {
  sessionStorage.removeItem('admin_token');
}

export function getAuthHeaders(): HeadersInit {
  const token = getAdminToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

// Public API Fetchers
export async function fetchProfile(): Promise<Profile> {
  try {
    const res = await fetch(`${API_BASE}/profile`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return {
      ...data,
      resumeUrl: data.resume_url || data.resumeUrl || '/resume.pdf',
      heroImage: data.hero_image || data.heroImage || '/images/hero.jpg',
      heroImagePosition: data.hero_image_position || data.heroImagePosition || 'center 20%'
    };
  } catch (err) {
    console.warn('API fallback for profile:', err);
    return FALLBACK_PROFILE;
  }
}

export async function fetchSiteSettings(): Promise<SiteSettings> {
  try {
    const res = await fetch(`${API_BASE}/settings`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('API fallback for settings:', err);
    return FALLBACK_SITE_SETTINGS;
  }
}

export async function fetchSkills(): Promise<SkillCategory[]> {
  try {
    const res = await fetch(`${API_BASE}/skills`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('API fallback for skills:', err);
    return FALLBACK_SKILLS;
  }
}

export async function fetchLearningItems(): Promise<LearningItem[]> {
  try {
    const res = await fetch(`${API_BASE}/skills/learning/items`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('API fallback for learning items:', err);
    return FALLBACK_LEARNING;
  }
}

export async function fetchJourneyMilestones(): Promise<JourneyMilestone[]> {
  try {
    const res = await fetch(`${API_BASE}/journey`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('API fallback for journey:', err);
    return FALLBACK_JOURNEY;
  }
}

export async function fetchCertifications(): Promise<Certification[]> {
  try {
    const res = await fetch(`${API_BASE}/certifications`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('API fallback for certifications:', err);
    return FALLBACK_CERTIFICATIONS;
  }
}

export async function fetchAchievements(): Promise<Achievement[]> {
  try {
    const res = await fetch(`${API_BASE}/achievements`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('API fallback for achievements:', err);
    return FALLBACK_ACHIEVEMENTS;
  }
}

export async function fetchExperience(): Promise<Experience[]> {
  try {
    const res = await fetch(`${API_BASE}/experience`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('API fallback for experience:', err);
    return FALLBACK_EXPERIENCE;
  }
}

export async function fetchEducation(): Promise<Education[]> {
  try {
    const res = await fetch(`${API_BASE}/education`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('API fallback for education:', err);
    return FALLBACK_EDUCATION;
  }
}

export async function fetchProjects(category?: string): Promise<Project[]> {
  try {
    const url = category && category !== 'All' 
      ? `${API_BASE}/projects?category=${encodeURIComponent(category)}`
      : `${API_BASE}/projects`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('API fallback for projects:', err);
    if (category && category !== 'All') {
      return FALLBACK_PROJECTS.filter(p => p.category === category);
    }
    return FALLBACK_PROJECTS;
  }
}

export async function fetchProjectBySlug(slug: string): Promise<Project> {
  try {
    const res = await fetch(`${API_BASE}/projects/${slug}`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`API fallback for project slug ${slug}:`, err);
    const p = FALLBACK_PROJECTS.find(item => item.slug === slug);
    if (p) return p;
    throw new Error('Project not found');
  }
}

export async function submitContact(data: ContactSubmission): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Failed to submit' }));
    throw new Error(err.detail || 'Failed to submit message');
  }
  return { success: true, message: 'Message sent successfully!' };
}

// Admin API Operations
export async function loginAdmin(email: string, password: string): Promise<{ access_token: string }> {
  const res = await fetch(`${API_BASE}/auth/login-json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Login failed' }));
    throw new Error(err.detail || 'Invalid email or password');
  }
  const data = await res.json();
  setAdminToken(data.access_token);
  return data;
}

export async function logoutAdmin(): Promise<void> {
  try {
    await fetch(`${API_BASE}/auth/logout`, { method: 'POST' });
  } catch {
    // Ignore network error during logout
  }
  clearAdminToken();
}

export async function checkAdminAuth(): Promise<boolean> {
  const token = getAdminToken();
  if (!token) return false;
  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function updateSiteSettings(data: Partial<SiteSettings>): Promise<SiteSettings> {
  const res = await fetch(`${API_BASE}/settings`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update site settings');
  return await res.json();
}

export async function updateProfile(data: Partial<Profile>): Promise<Profile> {
  const d = data as any;
  const payload = {
    ...data,
    resume_url: data.resumeUrl || d.resume_url,
    hero_image: data.heroImage || d.hero_image,
    hero_image_position: data.heroImagePosition || d.hero_image_position
  };
  const res = await fetch(`${API_BASE}/profile`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to update profile');
  return await res.json();
}

export async function exportBackupJson(): Promise<void> {
  const res = await fetch(`${API_BASE}/backup/export`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to export backup');
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `portfolio_backup_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

// Admin Project CRUD
export async function createProject(data: Partial<Project>): Promise<Project> {
  const res = await fetch(`${API_BASE}/projects`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create project');
  return await res.json();
}

export async function updateProject(id: number, data: Partial<Project>): Promise<Project> {
  const res = await fetch(`${API_BASE}/projects/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update project');
  return await res.json();
}

export async function deleteProject(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/projects/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete project');
}

// Admin Skills CRUD
export async function createSkill(data: Partial<SkillCategory>): Promise<SkillCategory> {
  const res = await fetch(`${API_BASE}/skills`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create skill group');
  return await res.json();
}

export async function updateSkill(id: number, data: Partial<SkillCategory>): Promise<SkillCategory> {
  const res = await fetch(`${API_BASE}/skills/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update skill group');
  return await res.json();
}

export async function deleteSkill(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/skills/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete skill group');
}

// Admin Learning Items CRUD
export async function createLearningItem(data: Partial<LearningItem>): Promise<LearningItem> {
  const res = await fetch(`${API_BASE}/skills/learning/items`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create learning item');
  return await res.json();
}

export async function updateLearningItem(id: number, data: Partial<LearningItem>): Promise<LearningItem> {
  const res = await fetch(`${API_BASE}/skills/learning/items/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update learning item');
  return await res.json();
}

export async function deleteLearningItem(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/skills/learning/items/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete learning item');
}

// Admin Journey CRUD
export async function createJourneyMilestone(data: Partial<JourneyMilestone>): Promise<JourneyMilestone> {
  const res = await fetch(`${API_BASE}/journey`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create milestone');
  return await res.json();
}

export async function updateJourneyMilestone(id: number, data: Partial<JourneyMilestone>): Promise<JourneyMilestone> {
  const res = await fetch(`${API_BASE}/journey/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update milestone');
  return await res.json();
}

export async function deleteJourneyMilestone(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/journey/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete milestone');
}

// Admin Certifications CRUD
export async function createCertification(data: Partial<Certification>): Promise<Certification> {
  const res = await fetch(`${API_BASE}/certifications`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create certification');
  return await res.json();
}

export async function updateCertification(id: number, data: Partial<Certification>): Promise<Certification> {
  const res = await fetch(`${API_BASE}/certifications/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update certification');
  return await res.json();
}

export async function deleteCertification(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/certifications/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete certification');
}

// Admin Achievements CRUD
export async function createAchievement(data: Partial<Achievement>): Promise<Achievement> {
  const res = await fetch(`${API_BASE}/achievements`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create achievement');
  return await res.json();
}

export async function updateAchievement(id: number, data: Partial<Achievement>): Promise<Achievement> {
  const res = await fetch(`${API_BASE}/achievements/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update achievement');
  return await res.json();
}

export async function deleteAchievement(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/achievements/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete achievement');
}

// Admin Experience CRUD
export async function createExperience(data: Partial<Experience>): Promise<Experience> {
  const res = await fetch(`${API_BASE}/experience`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create experience');
  return await res.json();
}

export async function updateExperience(id: number, data: Partial<Experience>): Promise<Experience> {
  const res = await fetch(`${API_BASE}/experience/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update experience');
  return await res.json();
}

export async function deleteExperience(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/experience/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete experience');
}

// Admin Education CRUD
export async function createEducation(data: Partial<Education>): Promise<Education> {
  const res = await fetch(`${API_BASE}/education`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create education record');
  return await res.json();
}

export async function updateEducation(id: number, data: Partial<Education>): Promise<Education> {
  const res = await fetch(`${API_BASE}/education/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update education record');
  return await res.json();
}

export async function deleteEducation(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/education/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete education record');
}

// Admin Contact Inquiries
export async function fetchContactMessages(): Promise<ContactMessage[]> {
  const res = await fetch(`${API_BASE}/contact`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to load inquiries');
  return await res.json();
}

export async function toggleMessageHandled(id: number): Promise<ContactMessage> {
  const res = await fetch(`${API_BASE}/contact/${id}/handle`, {
    method: 'PATCH',
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to toggle handled status');
  return await res.json();
}

export async function deleteContactMessage(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/contact/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete inquiry');
}

// Image & File Upload
export async function uploadImage(file: File): Promise<{ url: string; secure_url: string; id: number; filename: string; width?: number; height?: number }> {
  const formData = new FormData();
  formData.append('file', file);

  const token = getAdminToken();
  const res = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: formData
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Upload failed' }));
    throw new Error(err.detail || 'Upload failed');
  }
  return await res.json();
}

export async function uploadResume(file: File): Promise<{ url: string; secure_url: string; filename: string; size: number }> {
  const formData = new FormData();
  formData.append('file', file);

  const token = getAdminToken();
  const res = await fetch(`${API_BASE}/upload/resume`, {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: formData
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Resume upload failed' }));
    throw new Error(err.detail || 'Resume upload failed');
  }
  return await res.json();
}

// Media Library API Operations
export async function fetchMediaAssets(q?: string): Promise<MediaAsset[]> {
  const url = q ? `${API_BASE}/media?q=${encodeURIComponent(q)}` : `${API_BASE}/media`;
  const res = await fetch(url, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to load media assets');
  return await res.json();
}

export async function deleteMediaAsset(id: number, force: boolean = false): Promise<void> {
  const url = force ? `${API_BASE}/media/${id}?force=true` : `${API_BASE}/media/${id}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Failed to delete media asset' }));
    throw new Error(err.detail || 'Failed to delete media asset');
  }
}

// Project Actions: Duplicate & Publish
export async function duplicateProject(id: number): Promise<Project> {
  const res = await fetch(`${API_BASE}/projects/${id}/duplicate`, {
    method: 'POST',
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to duplicate project');
  return await res.json();
}

export async function toggleProjectPublish(id: number): Promise<Project> {
  const res = await fetch(`${API_BASE}/projects/${id}/publish`, {
    method: 'PATCH',
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to toggle project publish state');
  return await res.json();
}

// Social Links CRUD Operations
export async function fetchSocialLinks(all: boolean = false): Promise<SocialLink[]> {
  try {
    const url = all ? `${API_BASE}/social-links?all_links=true` : `${API_BASE}/social-links`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch social links');
    return await res.json();
  } catch (err) {
    console.warn('API fallback for social links:', err);
    return [];
  }
}

export async function createSocialLink(data: Partial<SocialLink>): Promise<SocialLink> {
  const res = await fetch(`${API_BASE}/social-links`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create social link');
  return await res.json();
}

export async function updateSocialLink(id: number, data: Partial<SocialLink>): Promise<SocialLink> {
  const res = await fetch(`${API_BASE}/social-links/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update social link');
  return await res.json();
}

export async function deleteSocialLink(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/social-links/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete social link');
}
