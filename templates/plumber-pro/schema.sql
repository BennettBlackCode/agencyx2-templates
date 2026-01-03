-- ================================================
-- BOLDSLATE SITE TEMPLATE SCHEMA v2
-- CMS-driven website with full theming support
-- ================================================

-- ================================================
-- TOKENS (Theme Configuration)
-- ================================================
CREATE TABLE tokens (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),

  -- Mode
  color_mode TEXT DEFAULT 'dark' CHECK (color_mode IN ('light', 'dark')),

  -- Brand Colors
  primary_color TEXT DEFAULT '#2563eb',
  primary_hover TEXT DEFAULT '#1d4ed8',
  secondary_color TEXT DEFAULT '#0ea5e9',
  accent_color TEXT DEFAULT '#f59e0b',

  -- Light Mode Colors
  light_background TEXT DEFAULT '#ffffff',
  light_surface TEXT DEFAULT '#f8fafc',
  light_surface_alt TEXT DEFAULT '#f1f5f9',
  light_text TEXT DEFAULT '#0f172a',
  light_text_body TEXT DEFAULT '#334155',
  light_text_muted TEXT DEFAULT '#64748b',
  light_border TEXT DEFAULT '#e2e8f0',

  -- Dark Mode Colors
  dark_background TEXT DEFAULT '#0f172a',
  dark_surface TEXT DEFAULT '#1e293b',
  dark_surface_alt TEXT DEFAULT '#334155',
  dark_text TEXT DEFAULT '#f8fafc',
  dark_text_body TEXT DEFAULT '#cbd5e1',
  dark_text_muted TEXT DEFAULT '#64748b',
  dark_border TEXT DEFAULT '#334155',

  -- Typography (Google Fonts)
  font_heading TEXT DEFAULT 'Inter',
  font_body TEXT DEFAULT 'Inter',

  -- Border Radius
  radius TEXT DEFAULT '0.5rem',

  updated_at TEXT DEFAULT (datetime('now'))
);

-- ================================================
-- SITE INFO (Business Details)
-- ================================================
CREATE TABLE site_info (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  name TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  logo_url TEXT,
  favicon_url TEXT,
  social_facebook TEXT,
  social_instagram TEXT,
  social_twitter TEXT,
  social_linkedin TEXT,
  social_youtube TEXT,
  social_google TEXT, -- Google Business Profile
  business_hours TEXT, -- JSON string
  year_established INTEGER,
  license_number TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- ================================================
-- PAGES (Static Pages Content)
-- ================================================
CREATE TABLE pages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  hero_headline TEXT,
  hero_subheadline TEXT,
  hero_image TEXT,
  hero_image_prompt TEXT,
  content TEXT, -- WYSIWYG/Markdown content
  content_image TEXT,
  content_image_prompt TEXT,
  show_reviews INTEGER DEFAULT 1,
  show_cta INTEGER DEFAULT 1,
  is_published INTEGER DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  show_in_nav INTEGER DEFAULT 1,
  nav_label TEXT, -- Override for nav display
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- ================================================
-- SERVICES
-- ================================================
CREATE TABLE services (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  short_description TEXT,
  full_description TEXT,
  icon TEXT DEFAULT 'wrench',
  hero_image TEXT,
  hero_image_prompt TEXT,
  content_image TEXT,
  content_image_prompt TEXT,
  meta_title TEXT,
  meta_description TEXT,
  is_published INTEGER DEFAULT 1,
  is_featured INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- ================================================
-- SERVICE AREAS
-- ================================================
CREATE TABLE service_areas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  short_description TEXT,
  full_description TEXT,
  hero_image TEXT,
  hero_image_prompt TEXT,
  content_image TEXT,
  content_image_prompt TEXT,
  city TEXT,
  state TEXT,
  zip_codes TEXT, -- JSON array
  meta_title TEXT,
  meta_description TEXT,
  is_published INTEGER DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- ================================================
-- TESTIMONIALS (Global Reviews)
-- ================================================
CREATE TABLE testimonials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_name TEXT NOT NULL,
  client_location TEXT,
  client_photo TEXT,
  content TEXT NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  service_id INTEGER REFERENCES services(id),
  source TEXT DEFAULT 'direct',
  source_url TEXT,
  is_published INTEGER DEFAULT 1,
  is_featured INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  review_date TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- ================================================
-- FAQS
-- ================================================
CREATE TABLE faqs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  page_slug TEXT, -- NULL = global, specific slug = page-specific
  service_id INTEGER REFERENCES services(id),
  service_area_id INTEGER REFERENCES service_areas(id),
  is_published INTEGER DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

-- ================================================
-- MEDIA LIBRARY
-- ================================================
CREATE TABLE media (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  filename TEXT NOT NULL,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  alt_text TEXT,
  width INTEGER,
  height INTEGER,
  size_bytes INTEGER,
  mime_type TEXT DEFAULT 'image/jpeg',
  category TEXT DEFAULT 'general',
  ai_prompt TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- ================================================
-- TEAM MEMBERS
-- ================================================
CREATE TABLE team (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  role TEXT,
  bio TEXT,
  photo TEXT,
  photo_prompt TEXT,
  email TEXT,
  phone TEXT,
  is_published INTEGER DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

-- ================================================
-- CONTACT SUBMISSIONS
-- ================================================
CREATE TABLE contact_submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  service TEXT,
  message TEXT,
  source_page TEXT,
  is_read INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

-- ================================================
-- GLOBAL CONTENT (Reusable Text Blocks)
-- ================================================
CREATE TABLE global_content (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  ai_prompt TEXT, -- Prompt for regenerating this content
  description TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- ================================================
-- INDEXES
-- ================================================
CREATE INDEX idx_services_published ON services(is_published, sort_order);
CREATE INDEX idx_service_areas_published ON service_areas(is_published, sort_order);
CREATE INDEX idx_testimonials_published ON testimonials(is_published, is_featured, sort_order);
CREATE INDEX idx_faqs_page ON faqs(page_slug, is_published, sort_order);
CREATE INDEX idx_media_slug ON media(slug);
CREATE INDEX idx_pages_slug ON pages(slug, is_published);
CREATE INDEX idx_pages_nav ON pages(show_in_nav, sort_order);

-- ================================================
-- DEFAULT DATA
-- ================================================
INSERT INTO tokens (id) VALUES (1);

INSERT INTO global_content (key, value, description) VALUES
  ('cta_headline', 'Ready to Get Started?', 'CTA section headline'),
  ('cta_subheadline', 'Contact us today for a free estimate. We are available 24/7 for emergencies.', 'CTA section subtext'),
  ('cta_button_primary', 'Call Now', 'Primary CTA button text'),
  ('cta_button_secondary', 'Get Free Estimate', 'Secondary CTA button text'),
  ('reviews_headline', 'What Our Customers Say', 'Reviews section headline'),
  ('reviews_subheadline', 'See why our customers trust us for all their needs.', 'Reviews section subtext'),
  ('services_headline', 'Our Services', 'Services section headline'),
  ('services_subheadline', 'Professional solutions for every need.', 'Services section subtext'),
  ('footer_tagline', 'Licensed, insured, and available 24/7.', 'Footer description');
