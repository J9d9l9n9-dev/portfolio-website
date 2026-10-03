import { test, expect } from '@playwright/test';

test.describe('FINAL REAL-USER FUNCTIONAL QA & PRODUCTION HARDENING', () => {

  test('Complete End-to-End Real Visitor Journey & Interactive Audit', async ({ page, request }) => {
    test.setTimeout(90000);
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        // Filter out harmless favicon or intentional 404 test probes
        const text = msg.text();
        if (!text.includes('404') && !text.includes('favicon') && !text.includes('401')) {
          consoleErrors.push(text);
        }
      }
    });
    page.on('pageerror', err => {
      consoleErrors.push(err.message);
    });

    // =========================================================================
    // 1. APPLICATION BOOTSTRAP & HOMEPAGE LOAD
    // =========================================================================
    await page.setViewportSize({ width: 1440, height: 900 });
    const response = await page.goto('http://localhost:5173/');
    expect(response?.status()).toBe(200);
    await page.waitForLoadState('networkidle');

    // Verify Title & Meta
    await expect(page).toHaveTitle(/Jampa Durga Lakshmi Narayana — Full-Stack Developer & AI Software Engineer/);

    // =========================================================================
    // 2. NAVBAR NAVIGATION & INTERACTION
    // =========================================================================
    const navItems = [
      { name: 'About', hash: '#about' },
      { name: 'Skills', hash: '#skills' },
      { name: 'Experience', hash: '#experience' },
      { name: 'Projects', hash: '#projects' },
      { name: 'Contact', hash: '#contact' },
    ];

    for (const item of navItems) {
      const link = page.locator(`header nav a[href="${item.hash}"]`);
      await expect(link).toBeVisible();
      await link.click();
      await page.waitForTimeout(300);
      const section = page.locator(item.hash);
      await expect(section).toBeInViewport();
    }

    // =========================================================================
    // 3. HERO SECTION FUNCTIONALITY
    // =========================================================================
    // Scroll back to top
    await page.goto('http://localhost:5173/#hero');
    await page.waitForTimeout(200);

    // Profile Image
    const profileImg = page.locator('#hero img[alt*="Jampa Durga Lakshmi Narayana"]');
    await expect(profileImg).toBeVisible();
    const naturalWidth = await profileImg.evaluate((img: HTMLImageElement) => img.naturalWidth);
    expect(naturalWidth).toBeGreaterThan(0);

    // CTA 1: View Projects
    const viewProjectsBtn = page.locator('#hero a:has-text("View Projects")');
    await expect(viewProjectsBtn).toBeVisible();
    await viewProjectsBtn.click();
    await page.waitForTimeout(400);
    await expect(page.locator('#projects')).toBeInViewport();

    // CTA 2: Contact Me
    const contactMeBtn = page.locator('#hero a:has-text("Contact Me")');
    await expect(contactMeBtn).toBeVisible();
    await contactMeBtn.click();
    await page.waitForTimeout(400);
    await expect(page.locator('#contact')).toBeInViewport();

    // CTA 3: Resume Button (Deep Test)
    const heroResumeBtn = page.locator('#hero a:has-text("Resume")');
    await expect(heroResumeBtn).toBeVisible();
    const resumeHref = await heroResumeBtn.getAttribute('href');
    expect(resumeHref).toBe('/resume.pdf');
    expect(await heroResumeBtn.getAttribute('target')).toBe('_blank');

    // Fetch resume via HTTP to verify authentic PDF
    const resumeRes = await request.get(`http://localhost:5173${resumeHref}`);
    expect(resumeRes.status()).toBe(200);
    expect(resumeRes.headers()['content-type']).toContain('application/pdf');
    const pdfBuffer = await resumeRes.body();
    expect(pdfBuffer.length).toBeGreaterThan(50000);
    expect(pdfBuffer.toString('utf8', 0, 5)).toBe('%PDF-');

    // =========================================================================
    // 4. SOCIAL LINKS VERIFICATION
    // =========================================================================
    const githubLink = page.locator('#hero a[aria-label="GitHub Profile"]');
    await expect(githubLink).toHaveAttribute('href', 'https://github.com/J9d9l9n9-dev');
    await expect(githubLink).toHaveAttribute('target', '_blank');
    await expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');

    const linkedinLink = page.locator('#hero a[aria-label="LinkedIn Profile"]');
    await expect(linkedinLink).toHaveAttribute('href', 'https://www.linkedin.com/in/durgalakshminarayanajampa/');
    await expect(linkedinLink).toHaveAttribute('target', '_blank');
    await expect(linkedinLink).toHaveAttribute('rel', 'noopener noreferrer');

    const leetcodeLink = page.locator('#hero a[aria-label="LeetCode Profile"]');
    await expect(leetcodeLink).toHaveAttribute('href', 'https://leetcode.com/u/J9d9l9n9/');
    await expect(leetcodeLink).toHaveAttribute('target', '_blank');
    await expect(leetcodeLink).toHaveAttribute('rel', 'noopener noreferrer');

    // =========================================================================
    // 5. ABOUT SECTION 4-PILLAR CHECK
    // =========================================================================
    const aboutSection = page.locator('#about');
    await aboutSection.scrollIntoViewIfNeeded();
    await expect(aboutSection.locator('span:has-text("Background")').first()).toBeVisible();
    await expect(aboutSection.getByText(/What I Build/i)).toBeVisible();
    await expect(aboutSection.getByText(/Current Focus/i)).toBeVisible();
    await expect(aboutSection.getByText(/Academic Education/i)).toBeVisible();
    await expect(aboutSection.getByText(/GITAM Deemed to be University/i).first()).toBeVisible();

    // =========================================================================
    // 6. SKILLS SECTION CHECK
    // =========================================================================
    const skillsSection = page.locator('#skills');
    await skillsSection.scrollIntoViewIfNeeded();
    await expect(skillsSection.getByText('Programming', { exact: true })).toBeVisible();
    await expect(skillsSection.getByText('Frontend', { exact: true })).toBeVisible();
    await expect(skillsSection.getByText('Backend', { exact: true })).toBeVisible();
    await expect(skillsSection.getByText(/AI/i).first()).toBeVisible();

    // =========================================================================
    // 7. PROJECTS SECTION & EXACT 3 PROJECTS
    // =========================================================================
    const projectsSection = page.locator('#projects');
    await projectsSection.scrollIntoViewIfNeeded();
    const projectCards = page.locator('#projects .grid > div');
    await expect(projectCards).toHaveCount(3);

    // Verify Titles
    await expect(page.locator('#projects h3', { hasText: 'AI Skin Intelligence' })).toBeVisible();
    await expect(page.locator('#projects h3', { hasText: 'ASHA EHR Companion' })).toBeVisible();
    await expect(page.locator('#projects h3', { hasText: 'Full-Stack Developer Portfolio' })).toBeVisible();

    // Verify AI Skin Intelligence has Live Demo & GitHub
    const aiCard = page.locator('#projects .grid > div', { hasText: 'AI Skin Intelligence' });
    const aiLive = aiCard.locator('a[aria-label*="Live demo"]');
    await expect(aiLive).toHaveAttribute('href', 'https://ai-skin-intelligence-lakshmi-narayana-jampa.vercel.app/');
    const aiRepo = aiCard.locator('a[aria-label*="Source repository"]');
    await expect(aiRepo).toHaveAttribute('href', /github\.com.*AI_Skin/);

    // Verify ASHA EHR Companion does NOT show fake Live demo
    const ashaCard = page.locator('#projects .grid > div', { hasText: 'ASHA EHR Companion' });
    await expect(ashaCard.locator('a[aria-label*="Live demo"]')).toHaveCount(0);

    // Verify Portfolio does NOT show fake Live demo
    const portfolioCard = page.locator('#projects .grid > div', { hasText: 'Full-Stack Developer Portfolio' });
    await expect(portfolioCard.locator('a[aria-label*="Live demo"]')).toHaveCount(0);
    const portfolioRepo = portfolioCard.locator('a[aria-label*="Source repository"]');
    await expect(portfolioRepo).toHaveAttribute('href', 'https://github.com/J9d9l9n9-dev/portfolio-website');

    // =========================================================================
    // 8. PROJECT DETAIL CASE STUDY PAGES
    // =========================================================================
    const projectSlugs = [
      { slug: 'ai-skin-intelligence', title: 'AI Skin Intelligence & Personalized Skincare Planner' },
      { slug: 'asha-ehr-companion', title: 'ASHA EHR Companion' },
      { slug: 'developer-portfolio', title: 'Full-Stack Developer Portfolio' },
    ];

    for (const p of projectSlugs) {
      await page.goto(`http://localhost:5173/projects/${p.slug}`);
      await page.waitForLoadState('networkidle');
      await expect(page.locator('h1')).toContainText(p.title);

      // Verify direct refresh works
      await page.reload();
      await page.waitForLoadState('networkidle');
      await expect(page.locator('h1')).toContainText(p.title);

      // Test Back Link
      const backLink = page.locator('a:has-text("Back to all projects")');
      await expect(backLink).toBeVisible();
    }

    // Lightbox Modal Test on developer-portfolio
    await page.goto('http://localhost:5173/projects/developer-portfolio');
    await page.waitForLoadState('networkidle');
    const thumb = page.locator('div.cursor-pointer').first();
    await thumb.click();
    const lightbox = page.locator('div[role="dialog"][aria-label="Image Preview"]');
    await expect(lightbox).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(lightbox).not.toBeVisible();

    // 404 on invalid project slug
    await page.goto('http://localhost:5173/projects/non-existent-project');
    await expect(page.getByText(/Project Not Found/i)).toBeVisible();
    await expect(page.getByText(/Back to Portfolio/i)).toBeVisible();

    // =========================================================================
    // 9. CONTACT FORM INTERACTION & VALIDATION
    // =========================================================================
    await page.goto('http://localhost:5173/#contact');
    await page.waitForLoadState('networkidle');
    const contactForm = page.locator('#contact form');
    await expect(contactForm).toBeVisible();

    // Test Submit Button Text
    const submitBtn = page.locator('#contact button[type="submit"]');
    await expect(submitBtn).toContainText('Send Message');

    // Fill valid form
    await page.fill('#contact input[name="name"]', 'Sarah Jenkins');
    await page.fill('#contact input[name="email"]', 'sarah.jenkins@techrecruiter.com');
    await page.fill('#contact input[name="subject"]', 'Engineering Interview Inquiry');
    await page.fill('#contact textarea[name="message"]', 'Hello Durga, we reviewed your full-stack projects and would love to connect.');

    // Submit and verify API response & success state
    await submitBtn.click();
    await expect(page.getByRole('heading', { name: /Message Sent Successfully!/i })).toBeVisible({ timeout: 5000 });

    // =========================================================================
    // 10. ADMIN CONSOLE AUTHENTICATION & SESSION
    // =========================================================================
    await page.goto('http://localhost:5173/admin');
    await page.evaluate(() => sessionStorage.removeItem('admin_token'));
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Should show login form
    await expect(page.getByText(/Owner Admin Console/i)).toBeVisible();

    // Test Invalid Login
    await page.fill('input[type="email"]', 'jampadurgalakshminarayana@gmail.com');
    await page.fill('input[type="password"]', 'WrongPassword123!');
    await page.click('button[type="submit"]:has-text("Sign In to Console")');
    await expect(page.getByText(/Incorrect email or password/i).first()).toBeVisible({ timeout: 4000 });

    // Test Valid Login
    await page.fill('input[type="password"]', 'AdminPass123!');
    await page.click('button[type="submit"]:has-text("Sign In to Console")');
    await expect(page.getByText(/Admin Control Center/i)).toBeVisible({ timeout: 8000 });

    // Verify contact message received from Sarah Jenkins
    await expect(page.getByText(/Sarah Jenkins/i).first()).toBeVisible();

    // Test Logout
    const logoutBtn = page.locator('button:has-text("Sign Out")');
    await logoutBtn.click();
    await expect(page.getByText(/Owner Admin Console/i)).toBeVisible();

    // =========================================================================
    // 11. COMMAND PALETTE (CTRL+K / BUTTON) FUNCTIONALITY
    // =========================================================================
    await page.goto('http://localhost:5173/');
    await page.waitForLoadState('networkidle');
    const cmdTrigger = page.locator('button[aria-label="Open Command Palette"]').first();
    await cmdTrigger.click();
    const cmdDialog = page.locator('div[role="dialog"][aria-label="Command Palette"]');
    await expect(cmdDialog).toBeVisible();

    // Verify search works
    const cmdInput = cmdDialog.locator('input');
    await cmdInput.fill('Skin');
    await expect(cmdDialog.getByText(/AI Skin Intelligence/i)).toBeVisible();

    // Verify no removed projects appear
    await cmdInput.fill('Currency');
    await expect(cmdDialog.getByText(/Currency Converter/i)).toHaveCount(0);

    // Escape closes palette
    await page.keyboard.press('Escape');
    await expect(cmdDialog).not.toBeVisible();

    // =========================================================================
    // 12. THEME SWITCHING (DARK / LIGHT)
    // =========================================================================
    await page.evaluate(() => localStorage.setItem('portfolio-theme', 'dark'));
    await page.reload();
    await page.waitForLoadState('networkidle');
    expect(await page.evaluate(() => document.documentElement.classList.contains('dark'))).toBe(true);

    const themeBtn = page.locator('button[aria-label*="Switch to" i]').first();
    await themeBtn.click();
    await page.waitForTimeout(300);
    expect(await page.evaluate(() => document.documentElement.classList.contains('light'))).toBe(true);

    // Toggle back to dark
    await themeBtn.click();
    await page.waitForTimeout(300);
    expect(await page.evaluate(() => document.documentElement.classList.contains('dark'))).toBe(true);

    // =========================================================================
    // 13. MOBILE RESPONSIVENESS & HAMBURGER MENU
    // =========================================================================
    const viewports = [
      { width: 375, height: 667 },
      { width: 390, height: 844 },
      { width: 430, height: 932 },
      { width: 768, height: 1024 },
      { width: 1024, height: 768 },
      { width: 1440, height: 900 },
      { width: 1920, height: 1080 },
    ];

    for (const vp of viewports) {
      await page.setViewportSize(vp);
      await page.goto('http://localhost:5173/');
      await page.waitForLoadState('networkidle');

      // Assert zero horizontal overflow
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
      expect(overflow).toBe(false);

      // On mobile viewports (< 768px), test hamburger menu
      if (vp.width < 768) {
        const menuBtn = page.locator('button[aria-label="Open Menu"]');
        if (await menuBtn.isVisible()) {
          await menuBtn.click();
          const mobileDialog = page.locator('div[aria-label="Mobile Navigation Menu"]');
          await expect(mobileDialog).toBeVisible();

          // Check mobile resume link exists
          const mobileResume = mobileDialog.locator('a:has-text("Download Resume")');
          await expect(mobileResume).toBeVisible();

          // Close mobile menu
          const closeBtn = page.locator('button[aria-label="Close menu"]');
          await closeBtn.click();
          await expect(mobileDialog).not.toBeVisible();
        }
      }
    }

    // =========================================================================
    // 14. ROUTING ERROR HANDLING (404 PAGE)
    // =========================================================================
    await page.goto('http://localhost:5173/some-random-broken-url-404');
    await expect(page.getByText(/404/i).or(page.getByText(/Page Not Found/i))).toBeVisible();
    const homeLink = page.getByRole('link', { name: /Return Home/i });
    await expect(homeLink).toBeVisible();
    await homeLink.click();
    await expect(page.locator('#hero')).toBeVisible();

    // =========================================================================
    // 15. CONSOLE ERROR ASSERTION
    // =========================================================================
    console.log('Detected Console Errors during entire journey:', consoleErrors);
    expect(consoleErrors.length).toBe(0);

    console.log('ALL 15 FUNCTIONAL AUDIT PHASES PASSED WITH ZERO ERRORS!');
  });

});
