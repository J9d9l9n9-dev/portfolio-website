import React, { useState } from 'react';
import { FolderGit2, ExternalLink, ArrowRight, Layers, Sparkles } from 'lucide-react';
import { GithubIcon } from '../ui/SocialIcons';
import { Link } from 'react-router-dom';
import { resolveAssetUrl } from '../../api/client';
import type { Project } from '../../types';

interface ProjectsSectionProps {
  projects: Project[];
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(projects.map((p) => p.category)))];

  const filteredProjects =
    selectedCategory === 'All'
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

  return (
    <section id="projects" aria-label="Featured Projects Section" className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-content mx-auto">
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-secondary bg-secondary/10 border border-secondary/20 mb-3">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Engineering Portfolio</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-text-primary tracking-tight">
            Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">Projects</span>
          </h2>
          <p className="mt-2 text-text-secondary text-sm sm:text-base max-w-lg">
            Production systems, architectural decisions, and open-source contributions.
          </p>
          <div className="w-12 h-1 bg-gradient-to-r from-secondary to-primary rounded-full mt-3" />

          {/* Category Filter Pills (rendered dynamically only when more than 3 projects exist) */}
          {projects.length > 3 && categories.length > 1 && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
                    selectedCategory === cat
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-bg-card border border-border text-text-secondary hover:text-text-primary hover:border-primary/40'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Projects Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const imgSrc = resolveAssetUrl(project.image) || '/images/ai-skin-desktop.jpg';
            return (
              <div
                key={project.slug}
                className="group rounded-3xl bg-bg-card border border-border shadow-sm hover:border-primary/50 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden"
              >
                <div>
                  {/* Screenshot Preview with Subtle Hover Zoom */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-bg-secondary border-b border-border/60">
                    <img
                      src={imgSrc}
                      alt={project.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/ai-skin-desktop.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-card/90 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />

                    {/* Category Chip & Featured Indicator */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-medium text-white bg-black/60 backdrop-blur-md border border-white/10">
                        {project.category}
                      </span>
                      {project.featured && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-mono font-medium text-emerald-300 bg-emerald-950/80 backdrop-blur-md border border-emerald-500/30">
                          <Sparkles className="w-3 h-3 text-emerald-400" />
                          <span>Featured</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-6">
                    <h3 className="font-display font-bold text-xl text-text-primary group-hover:text-primary transition-colors">
                      <Link to={`/projects/${project.slug}`} className="hover:underline flex items-center justify-between">
                        <span>{project.title}</span>
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </Link>
                    </h3>

                    {/* One-Line Impact Summary */}
                    <p className="mt-2.5 text-sm text-text-secondary leading-relaxed line-clamp-2">
                      {project.summary}
                    </p>

                    {/* Tech Chips */}
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {project.tech.map((t) => (
                        <span
                          key={t}
                          className="px-2.5 py-0.5 text-xs font-mono rounded bg-white/5 border border-border text-text-muted"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-border/40 mt-auto">
                  <Link
                    to={`/projects/${project.slug}`}
                    className="text-xs font-semibold text-primary hover:text-primary-light inline-flex items-center gap-1.5 transition-colors"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>View Case Study</span>
                  </Link>

                  <div className="flex items-center gap-1.5">
                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Live demo for ${project.title}`}
                        className="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-white/10 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    {project.repo && (
                      <a
                        href={project.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Source repository for ${project.title}`}
                        className="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-white/10 transition-colors"
                      >
                        <GithubIcon className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
