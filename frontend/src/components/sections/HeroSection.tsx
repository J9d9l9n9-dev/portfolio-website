import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Eye, FileText, MapPin, ChevronDown, Mail } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../ui/SocialIcons';
import { TechLogo } from '../ui/TechLogos';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import type { Profile, SiteSettings, Project } from '../../types';

interface HeroSectionProps {
  profile: Profile;
  siteSettings?: SiteSettings;
  projects?: Project[];
}

function StatCounterItem({ targetValue, label }: { targetValue: number; label: string }) {
  const numericTarget = typeof targetValue === 'number' && !isNaN(targetValue) ? targetValue : (parseInt(String(targetValue), 10) || 0);
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !animatedRef.current) {
          animatedRef.current = true;
          const duration = 1200;
          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentVal = Math.floor(easeProgress * numericTarget);
            setCount(isNaN(currentVal) ? 0 : currentVal);
            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(numericTarget);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [numericTarget]);

  const showPlus = label.toLowerCase().indexOf('grad') === -1 && label.toLowerCase().indexOf('year') === -1;

  return (
    <div ref={ref} className="flex flex-col">
      <div className="font-display font-bold text-2xl sm:text-3xl text-text-primary flex items-baseline">
        <span>{isNaN(count) ? 0 : count}</span>
        {showPlus && <span className="text-secondary font-semibold ml-0.5">+</span>}
      </div>
      <span className="text-[11px] sm:text-xs font-mono uppercase text-text-muted mt-0.5">
        {label}
      </span>
    </div>
  );
}

export const HeroSection: React.FC<HeroSectionProps> = ({ profile, siteSettings, projects }) => {
  const [imageError, setImageError] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const getInitials = (name: string) => {
    if (!name) return 'JDLN';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const techStack = [
    { name: 'React', label: 'React 19' },
    { name: 'TypeScript', label: 'TypeScript' },
    { name: 'Python', label: 'Python' },
    { name: 'FastAPI', label: 'FastAPI' },
    { name: 'PyTorch', label: 'PyTorch' },
    { name: 'PostgreSQL', label: 'PostgreSQL' },
    { name: 'Docker', label: 'Docker' },
    { name: 'TailwindCSS', label: 'Tailwind CSS' },
  ];

  const heroImgSrc = profile.heroImage || (profile as any).hero_image || '/images/hero.jpg';

  const availabilityText = siteSettings?.open_to_work ?? true
    ? "Available for Internships & Full-Stack Roles"
    : "Focusing on Academic Studies";

  return (
    <section
      id="hero"
      aria-label="Hero Introduction"
      className="relative min-h-[100svh] flex flex-col justify-center pt-24 pb-8 px-4 sm:px-6 lg:px-8 max-w-content mx-auto w-full"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center flex-grow my-auto">
        {/* Left Column: Headline, Roles, Summary, Actions, Stats, Tech */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          {/* Status Indicator */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-bg-card/90 border border-border shadow-sm mb-5 text-text-secondary backdrop-blur-md">
            <span className={`w-2 h-2 rounded-full ${siteSettings?.open_to_work ?? true ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span className="font-semibold text-text-primary">
              {availabilityText}
            </span>
            <span className="text-border">|</span>
            <span className="flex items-center gap-1 text-text-muted">
              <MapPin className="w-3.5 h-3.5 text-secondary" />
              <span>{profile.location || 'Visakhapatnam, India'}</span>
            </span>
          </div>

          {/* Name Headline */}
          <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-text-primary tracking-tight leading-[1.08]">
            Hi, I'm{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-light to-secondary">
              {profile.name}
            </span>
          </h1>

          {/* Clean Role & Positioning Hierarchy */}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xl sm:text-2xl font-display font-bold">
            <span className="text-text-primary">Full-Stack Developer</span>
            <span className="text-secondary font-mono text-base font-normal">/</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">
              AI & Software Engineering
            </span>
          </div>

          {/* Concise Factual Introduction */}
          <p className="mt-4 text-base sm:text-lg text-text-secondary leading-relaxed max-w-xl">
            {profile.tagline || 'Computer Science undergraduate at GITAM building scalable full-stack web applications and AI-powered software with modern frontend and backend technologies.'}
          </p>

          {/* Focused Primary Actions (Driven by CMS) */}
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a
              href={profile.cta_url || '#projects'}
              className="btn-glow inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white bg-primary hover:bg-primary-light transition-all duration-200 shadow-md"
            >
              <Eye className="w-4 h-4" />
              <span>{profile.cta_text || 'View Projects'}</span>
            </a>

            <a
              href={profile.secondary_cta_url || '#contact'}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm text-text-primary bg-bg-card hover:bg-white/10 border border-border hover:border-primary/40 transition-all duration-200"
            >
              <Mail className="w-4 h-4 text-primary" />
              <span>{profile.secondary_cta_text || 'Contact Me'}</span>
            </a>

            <a
              href={profile.resumeUrl || profile.resume_url || '/resume.pdf'}
              download="JDLN_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm text-text-secondary hover:text-text-primary bg-bg-card hover:bg-white/10 border border-border transition-all duration-200"
            >
              <FileText className="w-4 h-4 text-secondary" />
              <span>Resume</span>
            </a>

            {/* Subtle Social Links */}
            <div className="flex items-center gap-1.5 ml-1">
              {profile.socials?.github && (
                <a
                  href={profile.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub Profile"
                  className="p-2.5 rounded-xl text-text-secondary hover:text-text-primary hover:bg-white/5 border border-border/60 transition-colors"
                >
                  <GithubIcon className="w-4 h-4" />
                </a>
              )}
              {profile.socials?.linkedin && (
                <a
                  href={profile.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn Profile"
                  className="p-2.5 rounded-xl text-text-secondary hover:text-text-primary hover:bg-white/5 border border-border/60 transition-colors"
                >
                  <LinkedinIcon className="w-4 h-4" />
                </a>
              )}
              {profile.socials?.leetcode && (
                <a
                  href={profile.socials.leetcode}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LeetCode Profile"
                  className="p-2.5 rounded-xl text-text-secondary hover:text-text-primary hover:bg-white/5 border border-border/60 transition-colors font-mono text-xs font-bold"
                >
                  LC
                </a>
              )}
            </div>
          </div>

          {/* Authentic Stat Row */}
          <div className="mt-8 pt-6 border-t border-border/60 w-full grid grid-cols-3 gap-4 max-w-lg">
            <StatCounterItem targetValue={projects?.length || 3} label="Featured Projects" />
            <StatCounterItem targetValue={1} label="SIH Hackathon" />
            <StatCounterItem targetValue={100} label="DSA Solved" />
          </div>

          {/* Core Technologies Row */}
          <div className="mt-6 pt-4 border-t border-border/40 w-full">
            <span className="text-[11px] font-mono uppercase tracking-wider text-text-muted block mb-2.5">
              Core Technologies:
            </span>
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              {techStack.map((tech) => (
                <div
                  key={tech.name}
                  title={tech.label}
                  className="group flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-bg-card/70 border border-border hover:border-primary/50 transition-all duration-200 cursor-default"
                >
                  <div className="filter grayscale group-hover:grayscale-0 transition-all duration-200">
                    <TechLogo name={tech.name} className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-medium text-text-muted group-hover:text-text-primary transition-colors">
                    {tech.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Redesigned Animated Profile Image Presentation */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end relative">
          <motion.div
            animate={
              prefersReducedMotion
                ? false
                : {
                    y: [-4, 4, -4],
                  }
            }
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="relative w-full max-w-[320px] sm:max-w-[360px]"
          >
            {/* Ambient Background Glow */}
            <div
              className="absolute -inset-1.5 rounded-3xl bg-gradient-to-tr from-primary/30 via-secondary/20 to-accent/30 blur-xl opacity-70 transition-opacity duration-500 group-hover:opacity-100"
              aria-hidden="true"
            />

            {/* Animated Gradient Border Frame */}
            <div className="relative rounded-3xl p-[2px] bg-gradient-to-b from-primary/60 via-border to-secondary/50 shadow-2xl transition-all duration-300">
              <div className="relative rounded-[22px] overflow-hidden bg-bg-card border border-white/10 aspect-[4/5] flex items-center justify-center group">
                {!imageError ? (
                  <picture className="w-full h-full">
                    <source srcSet={heroImgSrc} type="image/jpeg" />
                    <img
                      src={heroImgSrc}
                      alt="Jampa Durga Lakshmi Narayana - Full-Stack Developer & AI Software Engineer"
                      width="480"
                      height="600"
                      fetchPriority="high"
                      decoding="async"
                      style={{
                        objectPosition: profile.heroImagePosition || (profile as any).hero_image_position || 'center 20%',
                      }}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      onError={() => setImageError(true)}
                    />
                  </picture>
                ) : (
                  /* Fallback Initials Avatar */
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-bg-secondary to-bg-card p-6 text-center">
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg mb-4">
                      <span className="font-display font-extrabold text-3xl text-white">
                        {getInitials(profile.name)}
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-lg text-text-primary">
                      {profile.name}
                    </h3>
                  </div>
                )}

                {/* Subtle Bottom Ambient Gradient Overlay for Depth */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-bg-card/40 via-transparent to-transparent pointer-events-none"
                  aria-hidden="true"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Subtle Static Chevron to scroll to About */}
      <div className="mt-2 flex justify-center pb-2">
        <a
          href="#about"
          aria-label="Scroll to About Section"
          className="p-1.5 text-text-muted/60 hover:text-primary transition-colors focus:outline-none"
        >
          <ChevronDown className="w-5 h-5" />
        </a>
      </div>
    </section>
  );
};
