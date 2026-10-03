import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchProjectBySlug, fetchProjects, resolveAssetUrl } from '../api/client';
import {
  ArrowLeft,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Terminal,
  Loader2,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { GithubIcon } from '../components/ui/SocialIcons';

export const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const { data: project, isLoading, error } = useQuery({
    queryKey: ['project', slug],
    queryFn: () => fetchProjectBySlug(slug || ''),
    enabled: !!slug,
  });

  const { data: allProjects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => fetchProjects(),
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowLeft') {
        setActiveImageIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
      }
      if (e.key === 'ArrowRight') {
        setActiveImageIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen]);

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center pt-24">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
        <p className="font-mono text-xs uppercase tracking-wider text-text-secondary">
          Loading Case Study Specifications...
        </p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center pt-24 px-4 text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-4">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h2 className="font-display font-bold text-2xl text-text-primary mb-2">
          Project Not Found
        </h2>
        <p className="text-text-secondary text-sm max-w-sm mb-6 leading-relaxed">
          The requested project record could not be retrieved from the database.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-primary hover:bg-primary-light transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Portfolio</span>
        </Link>
      </div>
    );
  }

  // Calculate Next and Previous projects
  const currentIndex = allProjects.findIndex((p) => p.slug === slug);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : allProjects[allProjects.length - 1];
  const nextProject = currentIndex >= 0 && currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : allProjects[0];

  // Screenshots gallery
  const gallery = (project.gallery && project.gallery.length > 0
    ? project.gallery
    : [project.image || '/images/ai-skin-desktop.jpg']).map((img) => resolveAssetUrl(img));

  return (
    <article className="py-28 px-4 sm:px-6 lg:px-8 max-w-content mx-auto min-h-screen">
      {/* Back button */}
      <div className="mb-8">
        <Link
          to="/#projects"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors p-2 rounded-xl hover:bg-white/5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to all projects</span>
        </Link>
      </div>

      {/* Case Study Header Banner */}
      <div className="border-b border-border pb-10">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-medium text-secondary bg-secondary/10 border border-secondary/20">
            <Layers className="w-3.5 h-3.5" />
            <span>{project.category} Architecture Case Study</span>
          </span>
          {project.featured && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs font-mono font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
              <Sparkles className="w-3 h-3" />
              <span>Production Featured</span>
            </span>
          )}
        </div>

        <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-text-primary tracking-tight leading-tight">
          {project.title}
        </h1>

        <p className="mt-4 text-base sm:text-xl text-text-secondary leading-relaxed max-w-3xl">
          {project.summary}
        </p>

        {/* Live / Code Links */}
        <div className="mt-6 flex flex-wrap items-center gap-4">
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-primary hover:bg-primary-light transition-all shadow-sm"
            >
              <span>Live Demonstration</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
          {project.repo && (
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-text-primary bg-bg-card hover:bg-white/10 border border-border transition-all"
            >
              <GithubIcon className="w-4 h-4" />
              <span>Source Repository</span>
            </a>
          )}
        </div>
      </div>

      {/* Main Preview Image with Lightbox Trigger */}
      <div className="my-10 relative rounded-3xl overflow-hidden bg-bg-card border border-border shadow-xl group">
        <img
          src={gallery[0]}
          alt={project.title}
          className="w-full aspect-[16/9] object-cover"
        />
        <button
          onClick={() => {
            setActiveImageIndex(0);
            setLightboxOpen(true);
          }}
          className="absolute bottom-4 right-4 p-2.5 rounded-xl bg-black/70 backdrop-blur-md text-white border border-white/20 hover:bg-black/90 transition-colors flex items-center gap-1.5 text-xs font-medium"
          aria-label="Expand image in lightbox"
        >
          <Maximize2 className="w-4 h-4" />
          <span>Expand Preview</span>
        </button>
      </div>

      {/* Body: Problem, Solution, Architecture & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 py-6">
        {/* Left Column: Deep Dive Narrative */}
        <div className="lg:col-span-8 space-y-10">
          {/* Problem Statement */}
          <section className="p-7 rounded-3xl bg-bg-card border border-border">
            <h2 className="font-display font-bold text-xl sm:text-2xl text-text-primary mb-3">
              The Problem & Motivation
            </h2>
            <p className="text-text-secondary leading-relaxed text-sm sm:text-base">
              {project.problem}
            </p>
          </section>

          {/* Solution Design */}
          <section className="p-7 rounded-3xl bg-bg-card border border-border">
            <h2 className="font-display font-bold text-xl sm:text-2xl text-text-primary mb-3">
              Solution Design & Implementation
            </h2>
            <p className="text-text-secondary leading-relaxed text-sm sm:text-base">
              {project.solution}
            </p>
          </section>

          {/* Technical Architecture (when provided) */}
          {project.architecture && (
            <section className="p-7 rounded-3xl bg-bg-card border border-border">
              <div className="flex items-center gap-2 mb-3">
                <Terminal className="w-5 h-5 text-primary" />
                <h2 className="font-display font-bold text-xl sm:text-2xl text-text-primary">
                  System Architecture & Stack Integration
                </h2>
              </div>
              <p className="text-text-secondary leading-relaxed text-sm sm:text-base">
                {project.architecture}
              </p>
            </section>
          )}

          {/* Core System Features */}
          {project.features && project.features.length > 0 && (
            <section className="p-7 rounded-3xl bg-bg-card border border-border">
              <h2 className="font-display font-bold text-xl sm:text-2xl text-text-primary mb-5">
                Core System Features
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {project.features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-bg-surface border border-border flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                      {feat}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Key Challenges & Learnings (when provided) */}
          {project.learnings && (
            <section className="p-7 rounded-3xl bg-bg-card border border-border">
              <h2 className="font-display font-bold text-xl sm:text-2xl text-text-primary mb-3">
                Key Engineering Learnings & Insights
              </h2>
              <p className="text-text-secondary leading-relaxed text-sm sm:text-base">
                {project.learnings}
              </p>
            </section>
          )}

          {/* Screenshot Gallery with Lightbox Triggers */}
          <section className="p-7 rounded-3xl bg-bg-card border border-border">
            <h2 className="font-display font-bold text-xl sm:text-2xl text-text-primary mb-4">
              Interface & System Screenshots
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {gallery.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setActiveImageIndex(idx);
                    setLightboxOpen(true);
                  }}
                  className="relative aspect-video rounded-2xl overflow-hidden border border-border cursor-pointer group hover:border-primary/50 transition-colors"
                >
                  <img
                    src={img}
                    alt={`${project.title} screenshot ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <Maximize2 className="w-5 h-5" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Metadata Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl bg-bg-card border border-border shadow-sm space-y-5 sticky top-24">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-text-muted block mb-2.5">
                Tech Stack & Libraries
              </span>
              <div className="flex flex-wrap gap-1.5">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 text-xs font-mono font-medium rounded-lg bg-bg-surface border border-border text-text-primary"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <span className="text-xs font-mono uppercase tracking-wider text-text-muted block mb-1">
                Domain Classification
              </span>
              <p className="text-sm font-semibold text-primary">{project.category}</p>
            </div>

            <div className="pt-4 border-t border-border">
              <span className="text-xs font-mono uppercase tracking-wider text-text-muted block mb-1">
                Engineering Standard
              </span>
              <p className="text-sm text-emerald-400 flex items-center gap-1.5 font-medium">
                <Terminal className="w-4 h-4" />
                <span>Production Tested</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Next / Previous Project Navigation */}
      <div className="mt-14 pt-8 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-4">
        {prevProject && (
          <Link
            to={`/projects/${prevProject.slug}`}
            className="p-5 rounded-2xl bg-bg-card border border-border hover:border-primary/40 transition-colors flex items-center gap-4 group"
          >
            <div className="p-2 rounded-xl bg-white/5 border border-border group-hover:bg-primary group-hover:text-white transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase text-text-muted">Previous Project</span>
              <p className="font-display font-bold text-sm sm:text-base text-text-primary group-hover:text-primary transition-colors">
                {prevProject.title}
              </p>
            </div>
          </Link>
        )}

        {nextProject && (
          <Link
            to={`/projects/${nextProject.slug}`}
            className="p-5 rounded-2xl bg-bg-card border border-border hover:border-primary/40 transition-colors flex items-center justify-between group text-right sm:ml-auto w-full"
          >
            <div>
              <span className="text-[11px] font-mono uppercase text-text-muted">Next Project</span>
              <p className="font-display font-bold text-sm sm:text-base text-text-primary group-hover:text-primary transition-colors">
                {nextProject.title}
              </p>
            </div>
            <div className="p-2 rounded-xl bg-white/5 border border-border group-hover:bg-primary group-hover:text-white transition-colors ml-4">
              <ChevronRight className="w-5 h-5" />
            </div>
          </Link>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image Preview"
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Previous / Next buttons */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveImageIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveImageIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div
            className="max-w-5xl max-h-[85vh] overflow-hidden rounded-2xl border border-white/20 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={gallery[activeImageIndex]}
              alt={`Full preview ${activeImageIndex + 1}`}
              className="max-w-full max-h-[85vh] object-contain"
            />
          </div>
        </div>
      )}
    </article>
  );
};
