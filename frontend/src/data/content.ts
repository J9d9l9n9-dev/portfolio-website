export interface StatItem {
  label: string;
  value: number | string;
  suffix?: string;
}

export interface ExperienceItem {
  company: string;
  title: string;
  period: string;
  points: string[];
}

export interface EducationItem {
  school: string;
  degree: string;
  period: string;
}

export interface ProjectItem {
  title: string;
  description: string;
  tech: string[];
  image: string;
  live: string;
  repo: string;
  category: string;
  longDescription?: string;
  keyFeatures?: string[];
}

export interface TestimonialItem {
  name: string;
  role: string;
  quote: string;
  avatar?: string;
}

export interface PortfolioContent {
  name: string;
  role: string[];
  tagline: string;
  bio: string;
  location: string;
  email: string;
  resumeUrl: string;
  socials: {
    github: string;
    linkedin: string;
    twitter: string;
    leetcode?: string;
  };
  stats: StatItem[];
  skills: {
    [category: string]: string[];
  };
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  testimonials: TestimonialItem[];
}

export const content: PortfolioContent = {
  name: "Jampa Durga Lakshmi Narayana",
  role: [
    "Full-Stack Developer",
    "AI Software Engineer",
    "Computer Science Undergraduate"
  ],
  tagline: "Building practical full-stack applications, robust backend APIs, and AI-powered software systems.",
  bio: "Computer Science undergraduate at GITAM Deemed to be University with a strong foundation in Data Structures & Algorithms, Object-Oriented Programming, and Full-Stack Engineering. Passionate about building practical software systems, backend APIs, and integrating Artificial Intelligence into real-world applications.",
  location: "Visakhapatnam, Andhra Pradesh, India",
  email: "jampadurgalakshminarayana@gmail.com",
  resumeUrl: "/resume.pdf",
  socials: {
    github: "https://github.com/J9d9l9n9-dev",
    linkedin: "https://www.linkedin.com/in/durgalakshminarayanajampa/",
    twitter: "",
    leetcode: "https://leetcode.com/u/J9d9l9n9/",
  },
  stats: [
    { label: "B.Tech CGPA", value: "8.17/10" },
    { label: "Intermediate", value: "93.9%" },
    { label: "DSA Solved", value: "100", suffix: "+" },
    { label: "Graduation", value: 2028 },
  ],
  skills: {
    "Languages": ["Java", "Python", "JavaScript", "TypeScript", "C", "SQL"],
    "Frontend": ["React", "HTML5", "CSS3", "Tailwind CSS", "Bootstrap", "Vite"],
    "Backend": ["FastAPI", "Node.js", "REST APIs", "Fastify", "JWT"],
    "Databases": ["PostgreSQL", "SQLite", "SQLAlchemy", "MySQL"],
    "AI & ML": ["PyTorch", "EfficientNet", "Computer Vision", "LangChain", "Machine Learning"],
    "Tools & DevOps": ["Git", "GitHub", "Linux", "Docker", "Postman", "VS Code"],
  },
  experience: [
    {
      company: "GITAM Deemed to be University",
      title: "Software Developer & Technical Community Member",
      period: "2024 - Present",
      points: [
        "Engineered database-driven applications including Java JDBC and modern FastAPI/React full-stack architectures.",
        "Solved 100+ Data Structures & Algorithms problems across coding platforms focusing on arrays, strings, and OOP design.",
        "Collaborated in hackathons developing practical solutions such as rural healthcare synchronization engines.",
        "Consistently expanding expertise in Full-Stack Web Development, modern TypeScript, and Applied AI/PyTorch systems.",
      ],
    },
  ],
  education: [
    {
      school: "GITAM Deemed to be University, Visakhapatnam",
      degree: "B.Tech in Computer Science and Engineering (CGPA: 8.17/10)",
      period: "2024 - 2028",
    },
    {
      school: "Sasi Junior College, Mandapeta",
      degree: "Intermediate (MPC - Mathematics, Physics, Chemistry) - 93.9%",
      period: "2022 - 2024",
    },
  ],
  projects: [
    {
      title: "AI Skin Intelligence & Personalized Skincare Planner",
      description: "Computer vision and deep learning diagnostic system utilizing PyTorch EfficientNet-B0 to analyze facial skin conditions and generate personalized routines.",
      tech: ["React", "FastAPI", "Python", "PyTorch", "EfficientNet-B0", "PostgreSQL", "SQLAlchemy", "JWT"],
      image: "/images/ai-skin-desktop.jpg",
      live: "https://ai-skin-intelligence-lakshmi-narayana-jampa.vercel.app/",
      repo: "https://github.com/springboardmentor23232a-eng/AI_Skin-Intelligence-Personalized-Skincare-Planner/tree/durga-laskshmi-narayana-jampa",
      category: "Full-Stack",
      longDescription: "A full-stack diagnostic system combining deep learning computer vision with a FastAPI backend to assess facial skin conditions and curate allergy-safe routines.",
      keyFeatures: [
        "PyTorch EfficientNet-B0 inference engine evaluating acne, dryness, and pigmentation",
        "Personalized morning, evening, weekly, and seasonal routine generation engine",
        "Ingredient intelligence algorithm screening contraindications and allergens",
        "Role-based access control and JWT authentication securing clinical data",
      ],
    },
    {
      title: "ASHA EHR Companion",
      description: "Offline-first electronic health record system designed for rural healthcare workers with deterministic background conflict sync.",
      tech: ["React Native", "Expo", "Fastify", "Node.js", "SQLite", "Sync Engine"],
      image: "/images/project-vision.jpg",
      live: "",
      repo: "",
      category: "Backend",
      longDescription: "Engineered for rural community healthcare workers operating in zero-connectivity regions, featuring local SQLite caching and background synchronization.",
      keyFeatures: [
        "Offline-first client architecture persisting maternal, immunization, and visit records locally",
        "Deterministic conflict resolution engine syncing data on network reconnection",
        "High-throughput Fastify Node.js synchronization endpoints",
      ],
    },
    {
      title: "Full-Stack Developer Portfolio",
      description: "Production-ready personal portfolio application engineered with React 19, TypeScript, Tailwind CSS v4, and a FastAPI backend with owner CMS.",
      tech: ["React 19", "TypeScript", "Tailwind CSS v4", "FastAPI", "SQLAlchemy", "JWT", "Docker"],
      image: "/images/projects/developer-portfolio/hero.png",
      live: "",
      repo: "https://github.com/J9d9l9n9-dev/portfolio-website",
      category: "Full-Stack",
      longDescription: "A high-performance full-stack web application showcasing engineering capabilities, featuring authenticated admin management, rate-limited inquiries, and automated tests.",
      keyFeatures: [
        "Resilient offline fallback layer ensuring 100% uptime when backend is offline",
        "Owner administrative CMS with JWT authentication and file upload validations",
        "IP-based rate limiting and honeypot protection on contact inquiries",
      ],
    },
  ],
  testimonials: [],
};
