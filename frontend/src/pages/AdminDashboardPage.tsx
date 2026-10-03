import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  loginAdmin,
  logoutAdmin,
  fetchContactMessages,
  deleteContactMessage,
  toggleMessageHandled,
  fetchProfile,
  updateProfile,
  fetchSiteSettings,
  updateSiteSettings,
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
  duplicateProject,
  toggleProjectPublish,
  fetchSkills,
  createSkill,
  updateSkill,
  deleteSkill,
  fetchExperience,
  createExperience,
  updateExperience,
  deleteExperience,
  fetchEducation,
  createEducation,
  updateEducation,
  deleteEducation,
  fetchSocialLinks,
  createSocialLink,
  updateSocialLink,
  deleteSocialLink,
  uploadResume,
  exportBackupJson,
  getAdminToken,
  resolveAssetUrl,
} from '../api/client';
import { MediaPickerModal } from '../components/admin/MediaPickerModal';
import { useToast } from '../components/ui/Toast';
import {
  ShieldCheck,
  Lock,
  User,
  LogOut,
  Mail,
  AlertCircle,
  Loader2,
  Trash2,
  Edit2,
  Plus,
  Upload,
  FolderGit2,
  Cpu,
  Briefcase,
  Copy,
  X,
  Download,
  Check,
  LayoutDashboard,
  Sparkles,
  FileText,
  Image as ImageIcon,
  Share2,
  GraduationCap,
  ExternalLink,
  Eye,
  EyeOff,
  Search,
  CheckCircle2,
  Settings as SettingsIcon
} from 'lucide-react';
import type {
  ContactMessage, Profile, Project, SkillCategory, Experience,
  Education, SiteSettings, SocialLink
} from '../types';

export const AdminDashboardPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const [token, setToken] = useState<string | null>(() => getAdminToken());
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Active admin tab (matching target structure)
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'hero' | 'about' | 'skills' | 'projects' | 'education' | 'experience' | 'resume' | 'media' | 'socials' | 'messages' | 'settings'
  >('dashboard');

  // Media Picker Modal State
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaPickerTitle, setMediaPickerTitle] = useState('Select Image');
  const [onMediaSelectedCallback, setOnMediaSelectedCallback] = useState<(url: string) => void>(() => () => {});

  const openMediaPicker = (title: string, callback: (url: string) => void) => {
    setMediaPickerTitle(title);
    setOnMediaSelectedCallback(() => callback);
    setMediaPickerOpen(true);
  };

  // Contact messages state
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messageSearch, setMessageSearch] = useState('');
  const [messageFilter, setMessageFilter] = useState<'all' | 'unread' | 'read'>('all');

  // Queries
  const { data: profile } = useQuery({ queryKey: ['profile'], queryFn: fetchProfile, enabled: !!token });
  const { data: siteSettings } = useQuery({ queryKey: ['site-settings'], queryFn: fetchSiteSettings, enabled: !!token });
  const { data: projects = [] } = useQuery({ queryKey: ['projects'], queryFn: () => fetchProjects(), enabled: !!token });
  const { data: skills = [] } = useQuery({ queryKey: ['skills'], queryFn: fetchSkills, enabled: !!token });
  const { data: experience = [] } = useQuery({ queryKey: ['experience'], queryFn: fetchExperience, enabled: !!token });
  const { data: education = [] } = useQuery({ queryKey: ['education'], queryFn: fetchEducation, enabled: !!token });
  const { data: socialLinks = [] } = useQuery({ queryKey: ['social-links'], queryFn: () => fetchSocialLinks(true), enabled: !!token });

  // Form states
  const [profileForm, setProfileForm] = useState<Partial<Profile>>({});
  const [settingsForm, setSettingsForm] = useState<Partial<SiteSettings>>({});
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);

  // Resume Upload State
  const [resumeUploading, setResumeUploading] = useState(false);

  // Project Modal & State
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [projectSearch, setProjectSearch] = useState('');
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectForm, setProjectForm] = useState<Partial<Project>>({
    title: '', slug: '', summary: '', problem: '', solution: '',
    category: 'Full-Stack', image: '/images/hero.jpg',
    gallery: [], live: '', repo: '', tech: [], features: [],
    start_date: '', end_date: '', featured: false, is_published: true
  });

  // Skill Modal
  const [skillModalOpen, setSkillModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<SkillCategory | null>(null);
  const [skillForm, setSkillForm] = useState<{ category: string; itemsStr: string }>({ category: '', itemsStr: '' });

  // Experience Modal
  const [expModalOpen, setExpModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [expForm, setExpForm] = useState<Partial<Experience> & { pointsStr: string; techStr: string }>({
    company: '', title: '', location: '', start_date: '', end_date: '', is_current: false,
    company_logo: '', description: '', pointsStr: '', techStr: ''
  });

  // Education Modal
  const [eduModalOpen, setEduModalOpen] = useState(false);
  const [editingEdu, setEditingEdu] = useState<Education | null>(null);
  const [eduForm, setEduForm] = useState<Partial<Education>>({
    school: '', degree: '', institution: '', field_of_study: '', grade_cgpa: '',
    location: '', start_date: '', end_date: '', logo_url: '', description: ''
  });

  // Social Link Modal
  const [socialModalOpen, setSocialModalOpen] = useState(false);
  const [editingSocial, setEditingSocial] = useState<SocialLink | null>(null);
  const [socialForm, setSocialForm] = useState<Partial<SocialLink>>({
    platform: '', url: '', icon: 'globe', order: 0, is_active: true
  });

  // Sync profile & settings into form state
  useEffect(() => {
    if (profile) setProfileForm(profile);
  }, [profile]);

  useEffect(() => {
    if (siteSettings) setSettingsForm(siteSettings);
  }, [siteSettings]);

  // Load inquiries
  useEffect(() => {
    if (token) loadMessages();
  }, [token]);

  const loadMessages = async () => {
    setLoadingMessages(true);
    try {
      const data = await fetchContactMessages();
      setMessages(data);
    } catch {
      showToast('Could not fetch inquiries.', 'error');
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);
    try {
      const res = await loginAdmin(email, password);
      setToken(res.access_token);
      showToast('Signed in successfully with JWT token.', 'success');
    } catch (err: any) {
      setLoginError(err.message || 'Login failed');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await logoutAdmin();
    setToken(null);
    showToast('Signed out of admin dashboard.', 'info');
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const updated = await updateProfile(profileForm);
      setProfileForm(updated);
      showToast('Hero & Profile changes saved! Public site updated immediately.', 'success');
      await queryClient.invalidateQueries({ queryKey: ['profile'] });
    } catch (err: any) {
      showToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await updateSiteSettings(settingsForm);
      showToast('Website Settings saved successfully!', 'success');
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
    } catch (err: any) {
      showToast(err.message || 'Failed to update site settings', 'error');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleResumeFileUpload = async (file: File) => {
    setResumeUploading(true);
    try {
      const res = await uploadResume(file);
      showToast(`Resume uploaded successfully! URL: ${res.secure_url || res.url}`, 'success');
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    } catch (err: any) {
      showToast(err.message || 'Resume upload failed', 'error');
    } finally {
      setResumeUploading(false);
    }
  };

  // If not logged in, render authentication portal
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-bg-primary">
        <div className="w-full max-w-md p-8 rounded-3xl bg-bg-card border border-border shadow-2xl">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4 border border-primary/20 shadow-inner">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="font-display font-bold text-2xl text-text-primary">Portfolio Admin CMS</h1>
            <p className="text-xs font-mono text-text-muted mt-1">
              Secured with JWT authentication & lockout protection
            </p>
          </div>

          {loginError && (
            <div className="p-3.5 mb-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-bg-input border border-border text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-bg-input border border-border text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-hover transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
            >
              {loginLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Sign In to CMS</span>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-border/50 text-center">
            <a href="/" className="text-xs text-text-muted hover:text-primary transition-colors flex items-center justify-center gap-1.5">
              <span>Return to Public Portfolio</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Navigation Items
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'hero', label: 'Hero Section', icon: Sparkles },
    { id: 'about', label: 'About & Highlights', icon: User },
    { id: 'skills', label: 'Skills & Tech', icon: Cpu },
    { id: 'projects', label: 'Projects CMS', icon: FolderGit2, badge: projects.length },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'resume', label: 'Resume PDF', icon: FileText },
    { id: 'media', label: 'Media Library', icon: ImageIcon },
    { id: 'socials', label: 'Social Links', icon: Share2 },
    { id: 'messages', label: 'Inquiries', icon: Mail, badge: messages.filter(m => !m.is_handled).length },
    { id: 'settings', label: 'Website Settings', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-bg-card border-r border-border flex flex-col shrink-0">
        {/* Brand */}
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-display font-bold text-base border border-primary/20">
              CMS
            </div>
            <div>
              <h2 className="font-display font-bold text-sm text-text-primary">Portfolio Admin</h2>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Production
              </span>
            </div>
          </div>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            title="Open Live Website"
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Navigation list */}
        <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-text-muted'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Footer */}
        <div className="p-4 border-t border-border flex items-center justify-between bg-bg-card/50">
          <div className="flex items-center gap-2 truncate">
            <div className="w-7 h-7 rounded-full bg-secondary/10 text-secondary flex items-center justify-center font-bold text-xs">
              AD
            </div>
            <span className="text-xs font-medium text-text-secondary truncate">Owner</span>
          </div>
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="p-2 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen">
        {/* Top Header */}
        <header className="h-16 px-6 border-b border-border bg-bg-card/30 backdrop-blur flex items-center justify-between shrink-0">
          <div>
            <h1 className="font-display font-bold text-lg text-text-primary capitalize">
              {activeTab === 'socials' ? 'Social Links CMS' : `${activeTab} Management`}
            </h1>
            <p className="text-xs text-text-muted">
              Changes made here are stored in the database and immediately appear on the public portfolio.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => exportBackupJson()}
              className="px-3 py-1.5 rounded-lg border border-border text-xs font-semibold text-text-secondary hover:bg-bg-hover flex items-center gap-1.5 transition-colors"
              title="Download full JSON backup of portfolio content"
            >
              <Download className="w-3.5 h-3.5 text-primary" />
              <span>Export Backup</span>
            </button>
          </div>
        </header>

        {/* Tab Views */}
        <div className="p-6 max-w-6xl w-full mx-auto space-y-6 flex-1">
          {/* 1. DASHBOARD VIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Quick Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-bg-card border border-border shadow-sm">
                  <div className="flex items-center justify-between text-text-muted mb-2">
                    <span className="text-xs font-mono uppercase">Projects</span>
                    <FolderGit2 className="w-4 h-4 text-primary" />
                  </div>
                  <div className="font-display font-bold text-2xl text-text-primary">{projects.length}</div>
                  <span className="text-[11px] text-text-muted">{projects.filter(p => p.featured).length} featured</span>
                </div>

                <div className="p-5 rounded-2xl bg-bg-card border border-border shadow-sm">
                  <div className="flex items-center justify-between text-text-muted mb-2">
                    <span className="text-xs font-mono uppercase">Skills</span>
                    <Cpu className="w-4 h-4 text-secondary" />
                  </div>
                  <div className="font-display font-bold text-2xl text-text-primary">{skills.length}</div>
                  <span className="text-[11px] text-text-muted">categories defined</span>
                </div>

                <div className="p-5 rounded-2xl bg-bg-card border border-border shadow-sm">
                  <div className="flex items-center justify-between text-text-muted mb-2">
                    <span className="text-xs font-mono uppercase">Inquiries</span>
                    <Mail className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="font-display font-bold text-2xl text-text-primary">{messages.length}</div>
                  <span className="text-[11px] text-amber-400 font-semibold">{messages.filter(m => !m.is_handled).length} unhandled</span>
                </div>

                <div className="p-5 rounded-2xl bg-bg-card border border-border shadow-sm">
                  <div className="flex items-center justify-between text-text-muted mb-2">
                    <span className="text-xs font-mono uppercase">System</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="font-display font-bold text-2xl text-emerald-400">Active</div>
                  <span className="text-[11px] text-text-muted">PostgreSQL Connected</span>
                </div>
              </div>

              {/* Quick Actions Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-secondary/10 to-transparent border border-primary/20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-display font-bold text-lg text-text-primary">Welcome to your Portfolio CMS</h3>
                    <p className="text-xs text-text-secondary mt-1 max-w-xl">
                      Manage every detail of your placement-grade portfolio in real-time. Upload images directly from your computer, create projects, adjust skills, and reply to hiring inquiries.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingProject(null);
                        setProjectForm({
                          title: '', slug: '', summary: '', problem: '', solution: '',
                          category: 'Full-Stack', image: '/images/hero.jpg', gallery: [],
                          live: '', repo: '', tech: [], features: [], is_published: true
                        });
                        setProjectModalOpen(true);
                      }}
                      className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-colors flex items-center gap-1.5 shadow-md"
                    >
                      <Plus className="w-4 h-4" />
                      <span>New Project</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('media')}
                      className="px-4 py-2 rounded-xl border border-border bg-bg-card text-text-primary text-xs font-semibold hover:bg-bg-hover transition-colors flex items-center gap-1.5"
                    >
                      <ImageIcon className="w-4 h-4 text-primary" />
                      <span>Media Library</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Inquiries Preview */}
              <div className="p-6 rounded-2xl bg-bg-card border border-border shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-bold text-base text-text-primary flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary" />
                    <span>Recent Hiring & Collaboration Inquiries</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('messages')}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    View all ({messages.length})
                  </button>
                </div>
                {messages.length === 0 ? (
                  <p className="text-xs text-text-muted py-4">No contact messages received yet.</p>
                ) : (
                  <div className="divide-y divide-border/50">
                    {messages.slice(0, 3).map((m) => (
                      <div key={m.id} className="py-3 flex items-center justify-between gap-4">
                        <div className="truncate">
                          <p className="text-xs font-bold text-text-primary truncate">{m.name} &bull; <span className="font-normal text-text-secondary">{m.subject}</span></p>
                          <p className="text-[11px] text-text-muted truncate">{m.message}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold shrink-0 ${m.is_handled ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                          {m.is_handled ? 'Handled' : 'New'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 2. HERO SECTION CMS */}
          {activeTab === 'hero' && (
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="p-6 rounded-2xl bg-bg-card border border-border shadow-sm space-y-6">
                <div className="border-b border-border pb-4">
                  <h3 className="font-display font-bold text-base text-text-primary">Hero Banner & Identity</h3>
                  <p className="text-xs text-text-muted mt-0.5">Control the main headline, subtitle, avatar image, and primary call-to-actions.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileForm.name || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-bg-input border border-border text-sm text-text-primary focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-1">
                      Short / Display Name
                    </label>
                    <input
                      type="text"
                      value={profileForm.short_name || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, short_name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-bg-input border border-border text-sm text-text-primary focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-1">
                      Professional Tagline / Subtitle
                    </label>
                    <input
                      type="text"
                      value={profileForm.tagline || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, tagline: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-bg-input border border-border text-sm text-text-primary focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-1">
                      Hero Background Image URL
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={profileForm.hero_image || profileForm.heroImage || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, hero_image: e.target.value, heroImage: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-bg-input border border-border text-sm text-text-primary focus:border-primary focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => openMediaPicker('Select Hero Background Image', (url) => setProfileForm({ ...profileForm, hero_image: url, heroImage: url }))}
                        className="px-3 py-2 rounded-xl border border-border bg-bg-hover text-xs font-semibold hover:bg-bg-input transition-colors shrink-0 flex items-center gap-1.5"
                      >
                        <ImageIcon className="w-3.5 h-3.5 text-primary" />
                        <span>Choose</span>
                      </button>
                    </div>
                    {(profileForm.hero_image || profileForm.heroImage) && (
                      <div className="mt-2 flex items-center gap-3 p-2 rounded-xl bg-bg-card border border-border">
                        <img
                          src={resolveAssetUrl(profileForm.hero_image || profileForm.heroImage)}
                          alt="Hero Preview"
                          className="w-16 h-16 rounded-lg object-cover border border-border/60 bg-black/20"
                          onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-mono text-emerald-400 font-medium">Hero Image Active</p>
                          <p className="text-xs text-text-muted truncate">{profileForm.hero_image || profileForm.heroImage}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-1">
                      Avatar / Profile Portrait URL
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={profileForm.avatar_image || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, avatar_image: e.target.value })}
                        placeholder="/images/avatar.jpg"
                        className="w-full px-3.5 py-2 rounded-xl bg-bg-input border border-border text-sm text-text-primary focus:border-primary focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => openMediaPicker('Select Avatar Portrait', (url) => setProfileForm({ ...profileForm, avatar_image: url }))}
                        className="px-3 py-2 rounded-xl border border-border bg-bg-hover text-xs font-semibold hover:bg-bg-input transition-colors shrink-0 flex items-center gap-1.5"
                      >
                        <ImageIcon className="w-3.5 h-3.5 text-secondary" />
                        <span>Choose</span>
                      </button>
                    </div>
                    {profileForm.avatar_image && (
                      <div className="mt-2 flex items-center gap-3 p-2 rounded-xl bg-bg-card border border-border">
                        <img
                          src={resolveAssetUrl(profileForm.avatar_image)}
                          alt="Avatar Preview"
                          className="w-12 h-12 rounded-full object-cover border border-border/60 bg-black/20"
                          onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-mono text-secondary font-medium">Avatar Active</p>
                          <p className="text-xs text-text-muted truncate">{profileForm.avatar_image}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Primary CTA */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-1">
                      Primary CTA Text
                    </label>
                    <input
                      type="text"
                      value={profileForm.cta_text || 'View Projects'}
                      onChange={(e) => setProfileForm({ ...profileForm, cta_text: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-bg-input border border-border text-sm text-text-primary focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-1">
                      Primary CTA Link URL
                    </label>
                    <input
                      type="text"
                      value={profileForm.cta_url || '#projects'}
                      onChange={(e) => setProfileForm({ ...profileForm, cta_url: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-bg-input border border-border text-sm text-text-primary focus:border-primary focus:outline-none"
                    />
                  </div>

                  {/* Secondary CTA */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-1">
                      Secondary CTA Text
                    </label>
                    <input
                      type="text"
                      value={profileForm.secondary_cta_text || 'Contact Me'}
                      onChange={(e) => setProfileForm({ ...profileForm, secondary_cta_text: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-bg-input border border-border text-sm text-text-primary focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-1">
                      Secondary CTA Link URL
                    </label>
                    <input
                      type="text"
                      value={profileForm.secondary_cta_url || '#contact'}
                      onChange={(e) => setProfileForm({ ...profileForm, secondary_cta_url: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-bg-input border border-border text-sm text-text-primary focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-1">
                      Availability / Status Text
                    </label>
                    <input
                      type="text"
                      value={profileForm.availability || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, availability: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-bg-input border border-border text-sm text-text-primary focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={profileForm.location || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-bg-input border border-border text-sm text-text-primary focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex justify-end">
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="px-6 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-hover shadow-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {savingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    <span>Save Hero Changes</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* 3. ABOUT CMS */}
          {activeTab === 'about' && (
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="p-6 rounded-2xl bg-bg-card border border-border shadow-sm space-y-6">
                <div className="border-b border-border pb-4">
                  <h3 className="font-display font-bold text-base text-text-primary">About Section & Engineering Highlights</h3>
                  <p className="text-xs text-text-muted mt-0.5">Edit biographical text, sub-headings, and highlight pillars.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-1">
                      Section Heading
                    </label>
                    <input
                      type="text"
                      value={profileForm.about_heading || 'About Me'}
                      onChange={(e) => setProfileForm({ ...profileForm, about_heading: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-bg-input border border-border text-sm text-text-primary focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-1">
                      Sub-Description
                    </label>
                    <input
                      type="text"
                      value={profileForm.about_description || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, about_description: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-bg-input border border-border text-sm text-text-primary focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-1">
                      Full Bio
                    </label>
                    <textarea
                      rows={4}
                      value={profileForm.bio || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-bg-input border border-border text-sm text-text-primary focus:border-primary focus:outline-none leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-1">
                      About Illustration / Image URL
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={profileForm.about_image || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, about_image: e.target.value })}
                        placeholder="/images/about.jpg"
                        className="w-full px-3.5 py-2 rounded-xl bg-bg-input border border-border text-sm text-text-primary focus:border-primary focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => openMediaPicker('Select About Image', (url) => setProfileForm({ ...profileForm, about_image: url }))}
                        className="px-3 py-2 rounded-xl border border-border bg-bg-hover text-xs font-semibold hover:bg-bg-input transition-colors shrink-0 flex items-center gap-1.5"
                      >
                        <ImageIcon className="w-3.5 h-3.5 text-primary" />
                        <span>Choose</span>
                      </button>
                    </div>
                    {profileForm.about_image && (
                      <div className="mt-2 flex items-center gap-3 p-2 rounded-xl bg-bg-card border border-border">
                        <img
                          src={resolveAssetUrl(profileForm.about_image)}
                          alt="About Preview"
                          className="w-16 h-12 rounded-lg object-cover border border-border/60 bg-black/20"
                          onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-mono text-primary font-medium">About Image Active</p>
                          <p className="text-xs text-text-muted truncate">{profileForm.about_image}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex justify-end">
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="px-6 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-hover shadow-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {savingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    <span>Save About Changes</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* 4. SKILLS CMS */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-base text-text-primary">Skills & Technologies</h3>
                  <p className="text-xs text-text-muted">Manage technical competency categories, skill items, and tools.</p>
                </div>
                <button
                  onClick={() => {
                    setEditingSkill(null);
                    setSkillForm({ category: '', itemsStr: '' });
                    setSkillModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-colors flex items-center gap-1.5 shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Skill Group</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {skills.map((s) => (
                  <div key={s.id} className="p-5 rounded-2xl bg-bg-card border border-border shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-display font-bold text-sm text-text-primary">{s.category}</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setEditingSkill(s);
                              const itemsStr = s.items
                                ? s.items.map((i: any) => typeof i === 'string' ? i : i.name).join(', ')
                                : (s.chips || []).join(', ');
                              setSkillForm({ category: s.category, itemsStr });
                              setSkillModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={async () => {
                              if (confirm(`Delete skill group '${s.category}'?`)) {
                                await deleteSkill(s.id!);
                                queryClient.invalidateQueries({ queryKey: ['skills'] });
                                showToast('Skill group removed', 'info');
                              }
                            }}
                            className="p-1.5 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {(s.items || s.chips || []).map((item: any, idx: number) => (
                          <span key={idx} className="px-2.5 py-1 rounded-lg bg-bg-input border border-border text-xs font-mono text-text-secondary">
                            {typeof item === 'string' ? item : item.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. PROJECTS CMS */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-display font-bold text-base text-text-primary">Projects CMS</h3>
                  <p className="text-xs text-text-muted">Create, edit, duplicate, and publish project case studies.</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
                    <input
                      type="text"
                      placeholder="Search projects..."
                      value={projectSearch}
                      onChange={(e) => setProjectSearch(e.target.value)}
                      className="pl-9 pr-3 py-1.5 rounded-xl bg-bg-input border border-border text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
                    />
                  </div>
                  <button
                    onClick={() => {
                      setEditingProject(null);
                      setProjectForm({
                        title: '', slug: '', summary: '', problem: '', solution: '',
                        category: 'Full-Stack', image: '/images/hero.jpg', gallery: [],
                        live: '', repo: '', tech: [], features: [], is_published: true
                      });
                      setProjectModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-colors flex items-center gap-1.5 shadow-md shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Project</span>
                  </button>
                </div>
              </div>

              {/* Projects Table / Grid */}
              <div className="space-y-3">
                {projects
                  .filter(p => !projectSearch || p.title.toLowerCase().includes(projectSearch.toLowerCase()) || p.category.toLowerCase().includes(projectSearch.toLowerCase()))
                  .map((p) => (
                    <div
                      key={p.id}
                      className="p-4 rounded-2xl bg-bg-card border border-border shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-primary/30 transition-all"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <img
                          src={resolveAssetUrl(p.image) || '/images/hero.jpg'}
                          alt={p.title}
                          className="w-16 h-12 rounded-xl object-cover border border-border shrink-0 bg-black/20"
                          onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-display font-bold text-sm text-text-primary truncate">{p.title}</h4>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${p.is_published ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                              {p.is_published ? 'Published' : 'Draft'}
                            </span>
                            {p.featured && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-primary/10 text-primary">
                                Featured
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-text-muted truncate mt-0.5 max-w-xl">{p.summary}</p>
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {p.tech?.slice(0, 4).map((t, idx) => (
                              <span key={idx} className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-bg-input text-text-secondary border border-border/50">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                        {/* Toggle Publish */}
                        <button
                          type="button"
                          onClick={async () => {
                            await toggleProjectPublish(p.id!);
                            queryClient.invalidateQueries({ queryKey: ['projects'] });
                            showToast(`Project ${p.is_published ? 'unpublished' : 'published'}!`, 'info');
                          }}
                          className="p-2 rounded-xl border border-border text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors"
                          title={p.is_published ? 'Unpublish to Draft' : 'Publish to Live'}
                        >
                          {p.is_published ? <EyeOff className="w-3.5 h-3.5 text-amber-400" /> : <Eye className="w-3.5 h-3.5 text-emerald-400" />}
                        </button>

                        {/* Duplicate */}
                        <button
                          type="button"
                          onClick={async () => {
                            await duplicateProject(p.id!);
                            queryClient.invalidateQueries({ queryKey: ['projects'] });
                            showToast('Project duplicated as draft!', 'success');
                          }}
                          className="p-2 rounded-xl border border-border text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors"
                          title="Duplicate Project"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        {/* Edit */}
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProject(p);
                            setProjectForm(p);
                            setProjectModalOpen(true);
                          }}
                          className="p-2 rounded-xl border border-border text-text-muted hover:text-primary hover:bg-primary/10 transition-colors"
                          title="Edit Project"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={async () => {
                            if (confirm(`Delete project '${p.title}' permanently?`)) {
                              await deleteProject(p.id!);
                              queryClient.invalidateQueries({ queryKey: ['projects'] });
                              showToast('Project deleted', 'info');
                            }
                          }}
                          className="p-2 rounded-xl border border-border text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Delete Project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* 6. EDUCATION CMS */}
          {activeTab === 'education' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-base text-text-primary">Education Records</h3>
                  <p className="text-xs text-text-muted">Manage academic background, degrees, CGPA, and institution logos.</p>
                </div>
                <button
                  onClick={() => {
                    setEditingEdu(null);
                    setEduForm({ school: '', degree: '', period: '', location: '', grade_cgpa: '', logo_url: '' });
                    setEduModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-colors flex items-center gap-1.5 shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Education</span>
                </button>
              </div>

              <div className="space-y-3">
                {education.map((ed) => (
                  <div key={ed.id} className="p-5 rounded-2xl bg-bg-card border border-border shadow-sm flex items-center justify-between">
                    <div>
                      <h4 className="font-display font-bold text-sm text-text-primary">{ed.school || ed.institution}</h4>
                      <p className="text-xs text-text-secondary mt-0.5">{ed.degree} &bull; <span className="font-mono text-text-muted">{ed.period}</span></p>
                      {ed.grade_cgpa && <p className="text-xs text-primary font-mono mt-1">CGPA / Grade: {ed.grade_cgpa}</p>}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setEditingEdu(ed);
                          setEduForm(ed);
                          setEduModalOpen(true);
                        }}
                        className="p-2 rounded-xl border border-border text-text-muted hover:text-primary hover:bg-primary/10 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm(`Delete education record '${ed.school}'?`)) {
                            await deleteEducation(ed.id!);
                            queryClient.invalidateQueries({ queryKey: ['education'] });
                            showToast('Education record deleted', 'info');
                          }
                        }}
                        className="p-2 rounded-xl border border-border text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. EXPERIENCE CMS */}
          {activeTab === 'experience' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-base text-text-primary">Experience & Roles</h3>
                  <p className="text-xs text-text-muted">Manage roles, responsibilities, timeline, and company logos.</p>
                </div>
                <button
                  onClick={() => {
                    setEditingExp(null);
                    setExpForm({ company: '', title: '', location: '', period: '', pointsStr: '', techStr: '' });
                    setExpModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-colors flex items-center gap-1.5 shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Experience</span>
                </button>
              </div>

              <div className="space-y-3">
                {experience.map((exp) => (
                  <div key={exp.id} className="p-5 rounded-2xl bg-bg-card border border-border shadow-sm flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-display font-bold text-sm text-text-primary">{exp.title}</h4>
                        <span className="text-xs text-text-muted font-normal">at {exp.company}</span>
                      </div>
                      <p className="text-xs font-mono text-text-muted mt-0.5">{exp.period}</p>
                      <ul className="mt-2 space-y-1 text-xs text-text-secondary list-disc list-inside">
                        {(exp.points || []).map((pt, idx) => (
                          <li key={idx} className="truncate max-w-xl">{pt}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => {
                          setEditingExp(exp);
                          setExpForm({
                            ...exp,
                            pointsStr: (exp.points || []).join('\n'),
                            techStr: (exp.technologies || []).join(', ')
                          });
                          setExpModalOpen(true);
                        }}
                        className="p-2 rounded-xl border border-border text-text-muted hover:text-primary hover:bg-primary/10 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm(`Delete experience '${exp.title}'?`)) {
                            await deleteExperience(exp.id!);
                            queryClient.invalidateQueries({ queryKey: ['experience'] });
                            showToast('Experience record deleted', 'info');
                          }
                        }}
                        className="p-2 rounded-xl border border-border text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 8. RESUME MANAGEMENT */}
          {activeTab === 'resume' && (
            <div className="p-6 rounded-2xl bg-bg-card border border-border shadow-sm space-y-6">
              <div className="border-b border-border pb-4">
                <h3 className="font-display font-bold text-base text-text-primary">Resume Document Management</h3>
                <p className="text-xs text-text-muted mt-0.5">Upload, replace, and verify your official resume PDF.</p>
              </div>

              <div className="p-6 rounded-2xl border border-dashed border-border flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  <FileText className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-text-primary">Current Active Resume</h4>
                  <p className="text-xs font-mono text-text-muted mt-0.5">
                    {siteSettings?.resume_url || profile?.resume_url || '/resume.pdf'}
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <a
                    href={siteSettings?.resume_url || profile?.resume_url || '/resume.pdf'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl border border-border text-xs font-semibold text-text-secondary hover:bg-bg-hover transition-colors flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-primary" />
                    <span>Preview Current PDF</span>
                  </a>
                  <label className="cursor-pointer px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-colors flex items-center gap-1.5 shadow-md">
                    {resumeUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    <span>Upload New Resume (PDF)</span>
                    <input
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleResumeFileUpload(e.target.files[0]);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* 9. MEDIA LIBRARY CMS */}
          {activeTab === 'media' && (
            <div className="p-6 rounded-2xl bg-bg-card border border-border shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <h3 className="font-display font-bold text-base text-text-primary">Media Library</h3>
                  <p className="text-xs text-text-muted mt-0.5">Persistent cloud and local media assets repository.</p>
                </div>
                <button
                  onClick={() => openMediaPicker('Upload / Manage Media', () => {})}
                  className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-colors flex items-center gap-1.5 shadow-md"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Open Media Browser & Uploader</span>
                </button>
              </div>

              <div className="p-8 rounded-2xl border border-dashed border-border text-center space-y-3">
                <ImageIcon className="w-12 h-12 text-primary/40 mx-auto" />
                <h4 className="font-display font-bold text-sm text-text-primary">Visual Media Asset Manager</h4>
                <p className="text-xs text-text-muted max-w-md mx-auto">
                  Click the button above to upload new images directly from your computer, inspect dimensions and filesizes, and pick images for projects or hero sections with zero downtime.
                </p>
              </div>
            </div>
          )}

          {/* 10. SOCIAL LINKS CMS */}
          {activeTab === 'socials' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-base text-text-primary">Social & Professional Links</h3>
                  <p className="text-xs text-text-muted">Manage GitHub, LinkedIn, LeetCode, Email, and custom external profiles.</p>
                </div>
                <button
                  onClick={() => {
                    setEditingSocial(null);
                    setSocialForm({ platform: '', url: '', icon: 'globe', order: 0, is_active: true });
                    setSocialModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-colors flex items-center gap-1.5 shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Social Link</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {socialLinks.map((sl) => (
                  <div key={sl.id} className="p-4 rounded-2xl bg-bg-card border border-border shadow-sm flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-sm text-text-primary">{sl.platform}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${sl.is_active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-500/10 text-zinc-400'}`}>
                          {sl.is_active ? 'Active' : 'Disabled'}
                        </span>
                      </div>
                      <a href={sl.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary truncate hover:underline mt-0.5 block max-w-xs">
                        {sl.url}
                      </a>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingSocial(sl);
                          setSocialForm(sl);
                          setSocialModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm(`Delete social link '${sl.platform}'?`)) {
                            await deleteSocialLink(sl.id!);
                            queryClient.invalidateQueries({ queryKey: ['social-links'] });
                            showToast('Social link deleted', 'info');
                          }
                        }}
                        className="p-1.5 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 11. INQUIRIES CMS */}
          {activeTab === 'messages' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-display font-bold text-base text-text-primary">Contact Messages & Inquiries</h3>
                  <p className="text-xs text-text-muted">Review, filter, and respond to incoming recruiter messages.</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
                    <input
                      type="text"
                      placeholder="Search messages..."
                      value={messageSearch}
                      onChange={(e) => setMessageSearch(e.target.value)}
                      className="pl-9 pr-3 py-1.5 rounded-xl bg-bg-input border border-border text-xs text-text-primary focus:outline-none focus:border-primary"
                    />
                  </div>
                  <select
                    value={messageFilter}
                    onChange={(e) => setMessageFilter(e.target.value as any)}
                    className="px-3 py-1.5 rounded-xl bg-bg-input border border-border text-xs text-text-primary focus:outline-none focus:border-primary"
                  >
                    <option value="all">All Status</option>
                    <option value="unread">Unhandled</option>
                    <option value="read">Handled</option>
                  </select>
                </div>
              </div>

              {loadingMessages ? (
                <div className="flex items-center justify-center py-16 text-text-muted gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Loading inquiries...</span>
                </div>
              ) : messages.length === 0 ? (
                <div className="p-8 rounded-2xl bg-bg-card border border-border text-center text-text-muted">
                  No inquiries received yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {messages
                    .filter((m) => {
                      if (messageFilter === 'unread') return !m.is_handled;
                      if (messageFilter === 'read') return m.is_handled;
                      return true;
                    })
                    .filter((m) => {
                      if (!messageSearch) return true;
                      const q = messageSearch.toLowerCase();
                      return m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.subject.toLowerCase().includes(q) || m.message.toLowerCase().includes(q);
                    })
                    .map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-5 rounded-2xl border transition-all ${
                          msg.is_handled
                            ? 'bg-bg-card border-border opacity-80'
                            : 'bg-primary/5 border-primary/30 shadow-sm'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-display font-bold text-sm text-text-primary">{msg.name}</span>
                            <span className="text-xs font-mono text-text-muted">&lt;{msg.email}&gt;</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-mono text-text-muted">{new Date(msg.created_at).toLocaleDateString()}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${msg.is_handled ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                              {msg.is_handled ? 'Handled' : 'New'}
                            </span>
                          </div>
                        </div>
                        <h5 className="text-xs font-bold text-text-primary mb-1">{msg.subject}</h5>
                        <p className="text-xs text-text-secondary leading-relaxed bg-bg-input/40 p-3 rounded-xl border border-border/40 whitespace-pre-wrap">
                          {msg.message}
                        </p>
                        <div className="flex items-center justify-end gap-2 mt-3 pt-2 border-t border-border/40">
                          <button
                            type="button"
                            onClick={async () => {
                              await toggleMessageHandled(msg.id);
                              loadMessages();
                              showToast('Inquiry status updated', 'info');
                            }}
                            className="px-3 py-1.5 rounded-lg border border-border text-xs font-semibold text-text-secondary hover:bg-bg-hover transition-colors"
                          >
                            {msg.is_handled ? 'Mark Unhandled' : 'Mark as Handled'}
                          </button>
                          <a
                            href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                            className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-colors flex items-center gap-1.5"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            <span>Reply via Email</span>
                          </a>
                          <button
                            type="button"
                            onClick={async () => {
                              if (confirm('Delete this inquiry?')) {
                                await deleteContactMessage(msg.id);
                                loadMessages();
                                showToast('Inquiry deleted', 'info');
                              }
                            }}
                            className="p-1.5 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* 12. WEBSITE SETTINGS CMS */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div className="p-6 rounded-2xl bg-bg-card border border-border shadow-sm space-y-6">
                <div className="border-b border-border pb-4">
                  <h3 className="font-display font-bold text-base text-text-primary">Website & Global SEO Settings</h3>
                  <p className="text-xs text-text-muted mt-0.5">Configure site metadata, contact email, Open Graph image, and footer text.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-1">
                      Site Title
                    </label>
                    <input
                      type="text"
                      value={settingsForm.site_title || 'JDLN Portfolio'}
                      onChange={(e) => setSettingsForm({ ...settingsForm, site_title: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-bg-input border border-border text-sm text-text-primary focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-1">
                      Primary Contact Email
                    </label>
                    <input
                      type="email"
                      value={settingsForm.contact_email || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, contact_email: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-bg-input border border-border text-sm text-text-primary focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-1">
                      SEO Meta Title
                    </label>
                    <input
                      type="text"
                      value={settingsForm.seo_title || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, seo_title: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-bg-input border border-border text-sm text-text-primary focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-1">
                      SEO Meta Description
                    </label>
                    <textarea
                      rows={2}
                      value={settingsForm.seo_description || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, seo_description: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-bg-input border border-border text-sm text-text-primary focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-1">
                      Open Graph (Social Share) Image URL
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={settingsForm.og_image_url || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, og_image_url: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-bg-input border border-border text-sm text-text-primary focus:border-primary focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => openMediaPicker('Select Open Graph Image', (url) => setSettingsForm({ ...settingsForm, og_image_url: url }))}
                        className="px-3 py-2 rounded-xl border border-border bg-bg-hover text-xs font-semibold hover:bg-bg-input transition-colors shrink-0 flex items-center gap-1.5"
                      >
                        <ImageIcon className="w-3.5 h-3.5 text-primary" />
                        <span>Choose</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-1">
                      Favicon URL
                    </label>
                    <input
                      type="text"
                      value={settingsForm.favicon_url || '/favicon.svg'}
                      onChange={(e) => setSettingsForm({ ...settingsForm, favicon_url: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-bg-input border border-border text-sm text-text-primary focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-1">
                      Footer Copyright Text
                    </label>
                    <input
                      type="text"
                      value={settingsForm.footer_text || 'Engineered with precision. All rights reserved.'}
                      onChange={(e) => setSettingsForm({ ...settingsForm, footer_text: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-bg-input border border-border text-sm text-text-primary focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex justify-end">
                  <button
                    type="submit"
                    disabled={savingSettings}
                    className="px-6 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-hover shadow-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {savingSettings ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    <span>Save Settings Changes</span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </main>

      {/* PROJECT CREATE / EDIT MODAL */}
      {projectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-bg-card border border-border w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border bg-bg-card/50">
              <h3 className="font-display font-bold text-lg text-text-primary">
                {editingProject ? 'Edit Project' : 'Create New Project'}
              </h3>
              <button
                onClick={() => setProjectModalOpen(false)}
                className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  if (editingProject && editingProject.id) {
                    await updateProject(editingProject.id, projectForm);
                    showToast('Project updated successfully!', 'success');
                  } else {
                    await createProject(projectForm);
                    showToast('Project created successfully!', 'success');
                  }
                  queryClient.invalidateQueries({ queryKey: ['projects'] });
                  setProjectModalOpen(false);
                } catch (err: any) {
                  showToast(err.message || 'Failed to save project', 'error');
                }
              }}
              className="p-6 overflow-y-auto space-y-4 flex-1"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-1">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={projectForm.title || ''}
                    onChange={(e) => {
                      const title = e.target.value;
                      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                      setProjectForm({ ...projectForm, title, slug: projectForm.slug || slug });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-bg-input border border-border text-sm text-text-primary focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-1">
                    Slug (URL identifier) *
                  </label>
                  <input
                    type="text"
                    required
                    value={projectForm.slug || ''}
                    onChange={(e) => setProjectForm({ ...projectForm, slug: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-bg-input border border-border text-sm text-text-primary focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-1">
                    Category *
                  </label>
                  <select
                    value={projectForm.category || 'Full-Stack'}
                    onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-bg-input border border-border text-sm text-text-primary focus:border-primary focus:outline-none"
                  >
                    <option value="Full-Stack">Full-Stack</option>
                    <option value="Full-Stack + AI">Full-Stack + AI</option>
                    <option value="Mobile + Backend">Mobile + Backend</option>
                    <option value="AI / Systems">AI / Systems</option>
                    <option value="DevOps">DevOps</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-1">
                    Main Showcase Image URL *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={projectForm.image || ''}
                      onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-bg-input border border-border text-sm text-text-primary focus:border-primary focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => openMediaPicker('Select Project Showcase Image', (url) => setProjectForm({ ...projectForm, image: url }))}
                      className="px-3 py-2 rounded-xl border border-border bg-bg-hover text-xs font-semibold hover:bg-bg-input transition-colors shrink-0 flex items-center gap-1"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-primary" />
                      <span>Choose</span>
                    </button>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-1">
                    Short Summary (Hero Card) *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={projectForm.summary || ''}
                    onChange={(e) => setProjectForm({ ...projectForm, summary: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-bg-input border border-border text-sm text-text-primary focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-1">
                    Problem Statement *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={projectForm.problem || ''}
                    onChange={(e) => setProjectForm({ ...projectForm, problem: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-bg-input border border-border text-sm text-text-primary focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-1">
                    Engineered Solution *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={projectForm.solution || ''}
                    onChange={(e) => setProjectForm({ ...projectForm, solution: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-bg-input border border-border text-sm text-text-primary focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-1">
                    Technologies (comma-separated) *
                  </label>
                  <input
                    type="text"
                    required
                    value={Array.isArray(projectForm.tech) ? projectForm.tech.join(', ') : ''}
                    onChange={(e) => setProjectForm({ ...projectForm, tech: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                    placeholder="React 19, FastAPI, PostgreSQL, PyTorch"
                    className="w-full px-3 py-2 rounded-xl bg-bg-input border border-border text-sm text-text-primary focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-1">
                    Key Features (comma-separated) *
                  </label>
                  <input
                    type="text"
                    required
                    value={Array.isArray(projectForm.features) ? projectForm.features.join(', ') : ''}
                    onChange={(e) => setProjectForm({ ...projectForm, features: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                    placeholder="Auth with JWT, Offline-first sync"
                    className="w-full px-3 py-2 rounded-xl bg-bg-input border border-border text-sm text-text-primary focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-1">
                    Live Demo URL
                  </label>
                  <input
                    type="url"
                    value={projectForm.live || ''}
                    onChange={(e) => setProjectForm({ ...projectForm, live: e.target.value })}
                    placeholder="https://my-app.vercel.app"
                    className="w-full px-3 py-2 rounded-xl bg-bg-input border border-border text-sm text-text-primary focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-1">
                    GitHub Repo URL
                  </label>
                  <input
                    type="url"
                    value={projectForm.repo || ''}
                    onChange={(e) => setProjectForm({ ...projectForm, repo: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2 rounded-xl bg-bg-input border border-border text-sm text-text-primary focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-6 sm:col-span-2 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-text-primary">
                    <input
                      type="checkbox"
                      checked={projectForm.featured ?? false}
                      onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })}
                      className="rounded border-border text-primary focus:ring-primary w-4 h-4"
                    />
                    <span>Featured Project</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-text-primary">
                    <input
                      type="checkbox"
                      checked={projectForm.is_published ?? true}
                      onChange={(e) => setProjectForm({ ...projectForm, is_published: e.target.checked })}
                      className="rounded border-border text-primary focus:ring-primary w-4 h-4"
                    />
                    <span>Published (Visible on site)</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setProjectModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border text-text-secondary hover:bg-bg-hover text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-hover shadow-md transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingProject ? 'Update Project' : 'Create Project'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SKILL MODAL */}
      {skillModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-bg-card border border-border w-full max-w-md rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="font-display font-bold text-base text-text-primary">
              {editingSkill ? 'Edit Skill Group' : 'Add Skill Group'}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-mono uppercase text-text-secondary mb-1">Category Name</label>
                <input
                  type="text"
                  value={skillForm.category}
                  onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
                  placeholder="e.g. Backend, Frontend, Cloud"
                  className="w-full px-3 py-2 rounded-xl bg-bg-input border border-border text-sm text-text-primary focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-text-secondary mb-1">Skills (comma-separated)</label>
                <textarea
                  rows={3}
                  value={skillForm.itemsStr}
                  onChange={(e) => setSkillForm({ ...skillForm, itemsStr: e.target.value })}
                  placeholder="Java, Python, FastAPI, Docker"
                  className="w-full px-3 py-2 rounded-xl bg-bg-input border border-border text-sm text-text-primary focus:border-primary focus:outline-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-border">
              <button
                type="button"
                onClick={() => setSkillModalOpen(false)}
                className="px-3.5 py-1.5 rounded-xl border border-border text-xs font-medium text-text-secondary hover:bg-bg-hover"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  const items = skillForm.itemsStr.split(',').map(s => s.trim()).filter(Boolean).map(name => ({ name, level: 'Intermediate' }));
                  if (editingSkill && editingSkill.id) {
                    await updateSkill(editingSkill.id, { category: skillForm.category, items });
                    showToast('Skill group updated', 'success');
                  } else {
                    await createSkill({ category: skillForm.category, items });
                    showToast('Skill group created', 'success');
                  }
                  queryClient.invalidateQueries({ queryKey: ['skills'] });
                  setSkillModalOpen(false);
                }}
                className="px-4 py-1.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDUCATION MODAL */}
      {eduModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-bg-card border border-border w-full max-w-lg rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="font-display font-bold text-base text-text-primary">
              {editingEdu ? 'Edit Education' : 'Add Education Record'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-mono uppercase text-text-secondary mb-1">Institution / School *</label>
                <input
                  type="text"
                  required
                  value={eduForm.school || ''}
                  onChange={(e) => setEduForm({ ...eduForm, school: e.target.value, institution: e.target.value })}
                  placeholder="GITAM Deemed to be University"
                  className="w-full px-3 py-2 rounded-xl bg-bg-input border border-border text-sm text-text-primary focus:border-primary focus:outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-mono uppercase text-text-secondary mb-1">Degree / Course *</label>
                <input
                  type="text"
                  required
                  value={eduForm.degree || ''}
                  onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
                  placeholder="B.Tech in Computer Science and Engineering"
                  className="w-full px-3 py-2 rounded-xl bg-bg-input border border-border text-sm text-text-primary focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-text-secondary mb-1">Timeline / Period *</label>
                <input
                  type="text"
                  required
                  value={eduForm.period || ''}
                  onChange={(e) => setEduForm({ ...eduForm, period: e.target.value })}
                  placeholder="2024 - 2028 (Expected)"
                  className="w-full px-3 py-2 rounded-xl bg-bg-input border border-border text-sm text-text-primary focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-text-secondary mb-1">CGPA / Percentage</label>
                <input
                  type="text"
                  value={eduForm.grade_cgpa || ''}
                  onChange={(e) => setEduForm({ ...eduForm, grade_cgpa: e.target.value })}
                  placeholder="8.17 / 10"
                  className="w-full px-3 py-2 rounded-xl bg-bg-input border border-border text-sm text-text-primary focus:border-primary focus:outline-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-border">
              <button
                type="button"
                onClick={() => setEduModalOpen(false)}
                className="px-3.5 py-1.5 rounded-xl border border-border text-xs font-medium text-text-secondary hover:bg-bg-hover"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (editingEdu && editingEdu.id) {
                    await updateEducation(editingEdu.id, eduForm);
                    showToast('Education record updated', 'success');
                  } else {
                    await createEducation(eduForm);
                    showToast('Education record created', 'success');
                  }
                  queryClient.invalidateQueries({ queryKey: ['education'] });
                  setEduModalOpen(false);
                }}
                className="px-4 py-1.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EXPERIENCE MODAL */}
      {expModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-bg-card border border-border w-full max-w-lg rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="font-display font-bold text-base text-text-primary">
              {editingExp ? 'Edit Experience' : 'Add Experience Record'}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-mono uppercase text-text-secondary mb-1">Company / Organization *</label>
                <input
                  type="text"
                  required
                  value={expForm.company || ''}
                  onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
                  placeholder="GITAM / Organization"
                  className="w-full px-3 py-2 rounded-xl bg-bg-input border border-border text-sm text-text-primary focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-text-secondary mb-1">Role Title *</label>
                <input
                  type="text"
                  required
                  value={expForm.title || ''}
                  onChange={(e) => setExpForm({ ...expForm, title: e.target.value })}
                  placeholder="Full-Stack Developer"
                  className="w-full px-3 py-2 rounded-xl bg-bg-input border border-border text-sm text-text-primary focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-text-secondary mb-1">Period *</label>
                <input
                  type="text"
                  required
                  value={expForm.period || ''}
                  onChange={(e) => setExpForm({ ...expForm, period: e.target.value })}
                  placeholder="2024 - Present"
                  className="w-full px-3 py-2 rounded-xl bg-bg-input border border-border text-sm text-text-primary focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-text-secondary mb-1">Responsibilities / Bullet Points (one per line) *</label>
                <textarea
                  rows={4}
                  required
                  value={expForm.pointsStr || ''}
                  onChange={(e) => setExpForm({ ...expForm, pointsStr: e.target.value })}
                  placeholder="Engineered high-performance REST APIs with FastAPI..."
                  className="w-full px-3 py-2 rounded-xl bg-bg-input border border-border text-sm text-text-primary focus:border-primary focus:outline-none leading-relaxed"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-border">
              <button
                type="button"
                onClick={() => setExpModalOpen(false)}
                className="px-3.5 py-1.5 rounded-xl border border-border text-xs font-medium text-text-secondary hover:bg-bg-hover"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  const points = expForm.pointsStr ? expForm.pointsStr.split('\n').map(s => s.trim()).filter(Boolean) : [];
                  const payload = { ...expForm, points };
                  delete (payload as any).pointsStr;
                  delete (payload as any).techStr;

                  if (editingExp && editingExp.id) {
                    await updateExperience(editingExp.id, payload);
                    showToast('Experience record updated', 'success');
                  } else {
                    await createExperience(payload);
                    showToast('Experience record created', 'success');
                  }
                  queryClient.invalidateQueries({ queryKey: ['experience'] });
                  setExpModalOpen(false);
                }}
                className="px-4 py-1.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SOCIAL LINK MODAL */}
      {socialModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-bg-card border border-border w-full max-w-md rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="font-display font-bold text-base text-text-primary">
              {editingSocial ? 'Edit Social Link' : 'Add Social Link'}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-mono uppercase text-text-secondary mb-1">Platform Name *</label>
                <input
                  type="text"
                  required
                  value={socialForm.platform || ''}
                  onChange={(e) => setSocialForm({ ...socialForm, platform: e.target.value })}
                  placeholder="LeetCode, GitHub, LinkedIn, Twitter"
                  className="w-full px-3 py-2 rounded-xl bg-bg-input border border-border text-sm text-text-primary focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-text-secondary mb-1">Profile URL *</label>
                <input
                  type="url"
                  required
                  value={socialForm.url || ''}
                  onChange={(e) => setSocialForm({ ...socialForm, url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl bg-bg-input border border-border text-sm text-text-primary focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-text-secondary mb-1">Icon Key</label>
                <input
                  type="text"
                  value={socialForm.icon || 'globe'}
                  onChange={(e) => setSocialForm({ ...socialForm, icon: e.target.value })}
                  placeholder="github, linkedin, leetcode, mail, globe"
                  className="w-full px-3 py-2 rounded-xl bg-bg-input border border-border text-sm text-text-primary focus:border-primary focus:outline-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-border">
              <button
                type="button"
                onClick={() => setSocialModalOpen(false)}
                className="px-3.5 py-1.5 rounded-xl border border-border text-xs font-medium text-text-secondary hover:bg-bg-hover"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (editingSocial && editingSocial.id) {
                    await updateSocialLink(editingSocial.id, socialForm);
                    showToast('Social link updated', 'success');
                  } else {
                    await createSocialLink(socialForm);
                    showToast('Social link created', 'success');
                  }
                  queryClient.invalidateQueries({ queryKey: ['social-links'] });
                  setSocialModalOpen(false);
                }}
                className="px-4 py-1.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REUSABLE MEDIA PICKER MODAL */}
      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={(url) => {
          onMediaSelectedCallback(url);
          showToast('Media selected successfully!', 'success');
        }}
        title={mediaPickerTitle}
      />
    </div>
  );
};
