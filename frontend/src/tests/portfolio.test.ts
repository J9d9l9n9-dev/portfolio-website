import { describe, it, expect } from 'vitest';
import { FALLBACK_PROFILE, FALLBACK_PROJECTS, FALLBACK_SKILLS, fetchProjectBySlug, resolveAssetUrl, BACKEND_ORIGIN } from '../api/client';

describe('Asset URL Normalization & Storage Resilience', () => {
  it('resolves relative backend uploads to absolute backend origin', () => {
    const url = '/uploads/b04805a21959.jpeg';
    const resolved = resolveAssetUrl(url);
    expect(resolved).toBe(`${BACKEND_ORIGIN}/uploads/b04805a21959.jpeg`);
  });

  it('preserves absolute URLs (Cloudinary / HTTPS)', () => {
    const cloudinaryUrl = 'https://res.cloudinary.com/demo/image/upload/sample.jpg';
    expect(resolveAssetUrl(cloudinaryUrl)).toBe(cloudinaryUrl);
  });

  it('preserves frontend local static assets', () => {
    expect(resolveAssetUrl('/images/hero.jpg')).toBe('/images/hero.jpg');
    expect(resolveAssetUrl('/resume.pdf')).toBe('/resume.pdf');
  });

  it('handles empty and null values gracefully', () => {
    expect(resolveAssetUrl('')).toBe('');
    expect(resolveAssetUrl(null)).toBe('');
    expect(resolveAssetUrl(undefined)).toBe('');
  });
});

describe('Portfolio Fallback Data Integrity', () => {
  it('loads valid profile fallback with required fields', () => {
    expect(FALLBACK_PROFILE.name).toBe('Jampa Durga Lakshmi Narayana');
    expect(FALLBACK_PROFILE.role.length).toBeGreaterThan(0);
    expect(FALLBACK_PROFILE.email).toBe('jampadurgalakshminarayana@gmail.com');
    expect(FALLBACK_PROFILE.stats.length).toBeGreaterThanOrEqual(3);
  });

  it('loads featured projects with case study attributes', () => {
    expect(FALLBACK_PROJECTS.length).toBe(3);
    expect(FALLBACK_PROJECTS.map(p => p.slug)).toEqual([
      'ai-skin-intelligence',
      'asha-ehr-companion',
      'developer-portfolio'
    ]);
    for (const proj of FALLBACK_PROJECTS) {
      expect(proj.slug).toBeTruthy();
      expect(proj.title).toBeTruthy();
      expect(proj.problem).toBeTruthy();
      expect(proj.solution).toBeTruthy();
      expect(proj.tech.length).toBeGreaterThan(0);
    }
  });

  it('loads structured skills categories', () => {
    expect(FALLBACK_SKILLS.length).toBeGreaterThanOrEqual(4);
    const categories = FALLBACK_SKILLS.map((s) => s.category);
    expect(categories).toContain('Programming');
    expect(categories).toContain('Frontend');
    expect(categories).toContain('Backend');
  });

  it('retrieves project by slug fallback and rejects removed slugs', async () => {
    const aiProject = await fetchProjectBySlug('ai-skin-intelligence');
    expect(aiProject).toBeDefined();
    expect(aiProject.title).toContain('AI Skin Intelligence');
    expect(aiProject.category).toBe('Full-Stack + AI');

    const project = await fetchProjectBySlug('developer-portfolio');
    expect(project).toBeDefined();
    expect(project.title).toBe('Full-Stack Developer Portfolio');
    expect(project.category).toBe('Full-Stack');

    // Removed projects must reject with Project not found
    await expect(fetchProjectBySlug('attendance-management-system')).rejects.toThrow('Project not found');
    await expect(fetchProjectBySlug('currency-converter')).rejects.toThrow('Project not found');
    await expect(fetchProjectBySlug('student-management-system')).rejects.toThrow('Project not found');
  });
});
