import React from 'react';
import { User, Terminal, Layers, Compass, GraduationCap, MapPin, CheckCircle2 } from 'lucide-react';
import type { Profile } from '../../types';

interface AboutSectionProps {
  profile: Profile;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ profile }) => {
  return (
    <section id="about" aria-label="About Section" className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-content mx-auto">
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 mb-3">
            <User className="w-3.5 h-3.5" />
            <span>Profile & Background</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-text-primary tracking-tight">
            {profile.about_heading || 'About'} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">{profile.about_heading ? '' : 'Me'}</span>
          </h2>
          <p className="mt-2 text-text-secondary text-sm sm:text-base max-w-lg">
            {profile.about_description || 'Engineering foundation, practical software development, and current technical focus.'}
          </p>
          <div className="w-12 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mt-3" />
        </div>

        {/* Structured 4-Pillar Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* 1. About Me (Span 7) */}
          <div className="md:col-span-7 p-6 sm:p-8 rounded-3xl bg-bg-card border border-border shadow-sm flex flex-col justify-between hover:border-primary/40 transition-colors">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-primary mb-3">
                <Terminal className="w-4 h-4" />
                <span>Background</span>
              </div>
              <h3 className="font-display font-bold text-xl sm:text-2xl text-text-primary mb-4 leading-snug">
                Computer Science Undergraduate & Full-Stack Developer
              </h3>
              <div className="space-y-3.5 text-text-secondary text-sm sm:text-base leading-relaxed">
                <p>
                  {profile.bio || 'I am a Computer Science Engineering undergraduate at GITAM Deemed to be University, Visakhapatnam. My work centers on building end-to-end web applications and practical AI systems that solve real problems.'}
                </p>
                <p>
                  I emphasize clean architecture, strong typing between frontend and backend, comprehensive test coverage, and intuitive user interfaces. I build with React, TypeScript, Python, FastAPI, and PostgreSQL.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-border/50 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-text-muted">
              <span className="flex items-center gap-1.5 text-text-secondary">
                <MapPin className="w-3.5 h-3.5 text-secondary" />
                <span>{profile.location || 'Visakhapatnam, India'}</span>
              </span>
              <span className="text-primary font-semibold">Expected Graduation: 2028</span>
            </div>
          </div>

          {/* 2. What I Build (Span 5) */}
          <div className="md:col-span-5 p-6 sm:p-8 rounded-3xl bg-bg-card border border-border shadow-sm flex flex-col justify-between hover:border-secondary/40 transition-colors">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-secondary mb-3">
                <Layers className="w-4 h-4" />
                <span>What I Build</span>
              </div>
              <h3 className="font-display font-bold text-xl text-text-primary mb-4 leading-snug">
                Practical Software & Scalable Systems
              </h3>
              <ul className="space-y-3 text-sm text-text-secondary">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Full-Stack Web Applications:</strong> High-performance APIs with FastAPI, responsive React/TypeScript user interfaces, and relational database schemas.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Offline-First Architectures:</strong> Mobile healthcare applications utilizing SQLite and conflict-tolerant sync engines (Smart India Hackathon).</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>AI & Vision Pipelines:</strong> Integrating PyTorch computer vision models into production REST services with typed inference schemas.</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-border/50 text-xs font-mono text-text-muted">
              Built with test coverage and typed contracts
            </div>
          </div>

          {/* 3. Current Focus (Span 6) */}
          <div className="md:col-span-6 p-6 sm:p-7 rounded-3xl bg-bg-card border border-border shadow-sm flex flex-col justify-between hover:border-primary/40 transition-colors">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-primary mb-3">
                <Compass className="w-4 h-4" />
                <span>Current Focus</span>
              </div>
              <h3 className="font-display font-bold text-lg sm:text-xl text-text-primary mb-3">
                Algorithmic Foundations & Scalable Architecture
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed mb-4">
                Actively strengthening core software engineering disciplines through daily practice and hands-on system building:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white/5 border border-border">
                  <div className="font-semibold text-text-primary mb-1">Data Structures & Algorithms</div>
                  <p className="text-text-muted">100+ LeetCode problems solved across arrays, trees, graphs, and dynamic programming.</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-border">
                  <div className="font-semibold text-text-primary mb-1">System Design & DevOps</div>
                  <p className="text-text-muted">Containerization with Docker, CI/CD automated pipelines, and modular API design.</p>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-border/50 flex items-center justify-between text-xs font-mono text-text-muted">
              <span>Goal</span>
              <span className="text-emerald-400 font-semibold">Software Engineering Roles</span>
            </div>
          </div>

          {/* 4. Education (Span 6) */}
          <div className="md:col-span-6 p-6 sm:p-7 rounded-3xl bg-bg-card border border-border shadow-sm flex flex-col justify-between hover:border-secondary/40 transition-colors">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-secondary mb-3">
                <GraduationCap className="w-4 h-4" />
                <span>Academic Education</span>
              </div>
              <h3 className="font-display font-bold text-lg sm:text-xl text-text-primary mb-4">
                Verified Credentials & Coursework
              </h3>
              <div className="space-y-4 text-sm">
                <div className="p-3.5 rounded-xl bg-white/5 border border-border">
                  <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                    <span className="font-bold text-text-primary">GITAM Deemed to be University</span>
                    <span className="font-mono text-xs text-secondary">2024 - 2028</span>
                  </div>
                  <div className="text-xs font-medium text-primary mb-1">Bachelor of Technology, Computer Science Engineering</div>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Coursework: Data Structures & Algorithms, Database Management Systems, Object-Oriented Programming, Operating Systems, Web Technologies.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-border">
                  <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                    <span className="font-bold text-text-primary">Sasi Junior College</span>
                    <span className="font-mono text-xs text-secondary">2022 - 2024</span>
                  </div>
                  <div className="text-xs font-medium text-emerald-400 mb-1">Intermediate (MPC) — 93.9%</div>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Mathematics, Physics, and Chemistry foundation with strong analytical and quantitative problem-solving score.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-border/50 text-xs font-mono text-text-muted">
              Affiliated with recognized academic institutions
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
