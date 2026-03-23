-- CreatorCashCow Database Schema for Supabase
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Cleanup existing policies so this script can be safely re-run
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN
    SELECT policyname, tablename
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN (
        'users',
        'courses',
        'course_modules',
        'user_enrollments',
        'promo_redemptions',
        'pdfs',
        'user_pdf_purchases',
        'mentorship_products',
        'mentorship_bookings',
        'live_sessions',
        'session_participants',
        'payments',
        'tiktok_requests',
        'tiktok_groups',
        'tiktok_group_members',
        'analytics_events'
      )
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.policyname, pol.tablename);
  END LOOP;
END
$$;

-- ============================================================================
-- USERS TABLE (extends Supabase auth.users)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  avatar_url TEXT,
  is_suspended BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can read own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Admins can read all users
CREATE POLICY "Admins can read all users" ON public.users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================================
-- COURSES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.courses (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  thumbnail_url TEXT,
  duration_weeks INTEGER,
  total_lessons INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Anyone can read published courses
CREATE POLICY "Anyone can read published courses" ON public.courses
  FOR SELECT USING (is_published = TRUE);

-- Admins can do everything
CREATE POLICY "Admins can manage courses" ON public.courses
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================================
-- COURSE MODULES (Lessons)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.course_modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id TEXT NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  duration_minutes INTEGER,
  order_index INTEGER NOT NULL,
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- USER ENROLLMENTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.user_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  progress DECIMAL(5,2) DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  access_source TEXT DEFAULT 'purchase' CHECK (access_source IN ('purchase', 'promo', 'admin_grant')),
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, course_id)
);

ALTER TABLE public.user_enrollments ENABLE ROW LEVEL SECURITY;

-- Users can read their own enrollments
CREATE POLICY "Users can read own enrollments" ON public.user_enrollments
  FOR SELECT USING (auth.uid() = user_id);

-- Admins can read all enrollments
CREATE POLICY "Admins can read all enrollments" ON public.user_enrollments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Users can read modules if they're enrolled or it's free
CREATE POLICY "Users can read enrolled modules" ON public.course_modules
  FOR SELECT USING (
    is_premium = FALSE OR
    EXISTS (
      SELECT 1 FROM public.user_enrollments
      WHERE user_id = auth.uid() AND course_id = course_modules.course_id
    )
  );

-- ============================================================================
-- PROMO REDEMPTIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.promo_redemptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  promo_code TEXT NOT NULL,
  redeemed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE public.promo_redemptions ENABLE ROW LEVEL SECURITY;

-- Users can read their own redemptions
CREATE POLICY "Users can read own promo redemptions" ON public.promo_redemptions
  FOR SELECT USING (auth.uid() = user_id);

-- Admins can read all redemptions
CREATE POLICY "Admins can read all promo redemptions" ON public.promo_redemptions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================================
-- PDFS / DIGITAL PRODUCTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.pdfs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  thumbnail_url TEXT,
  file_url TEXT NOT NULL,
  download_count INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.pdfs ENABLE ROW LEVEL SECURITY;

-- Anyone can read published PDFs
CREATE POLICY "Anyone can read published pdfs" ON public.pdfs
  FOR SELECT USING (is_published = TRUE);

-- Admins can manage PDFs
CREATE POLICY "Admins can manage pdfs" ON public.pdfs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================================
-- USER PDF PURCHASES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.user_pdf_purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  pdf_id TEXT NOT NULL REFERENCES public.pdfs(id) ON DELETE CASCADE,
  purchased_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, pdf_id)
);

ALTER TABLE public.user_pdf_purchases ENABLE ROW LEVEL SECURITY;

-- Users can read their own purchases
CREATE POLICY "Users can read own pdf purchases" ON public.user_pdf_purchases
  FOR SELECT USING (auth.uid() = user_id);

-- ============================================================================
-- MENTORSHIP PRODUCTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.mentorship_products (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  duration_minutes INTEGER NOT NULL,
  meeting_url_template TEXT,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.mentorship_products ENABLE ROW LEVEL SECURITY;

-- Anyone can read published mentorship products
CREATE POLICY "Anyone can read mentorship products" ON public.mentorship_products
  FOR SELECT USING (is_published = TRUE);

-- ============================================================================
-- MENTORSHIP BOOKINGS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.mentorship_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  mentorship_product_id TEXT NOT NULL REFERENCES public.mentorship_products(id),
  scheduled_date TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  meeting_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.mentorship_bookings ENABLE ROW LEVEL SECURITY;

-- Users can read their own bookings
CREATE POLICY "Users can read own bookings" ON public.mentorship_bookings
  FOR SELECT USING (auth.uid() = user_id);

-- Admins can read all bookings
CREATE POLICY "Admins can read all bookings" ON public.mentorship_bookings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================================
-- LIVE SESSIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.live_sessions (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  scheduled_date TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL,
  meeting_url TEXT NOT NULL,
  replay_url TEXT,
  thumbnail_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  max_participants INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.live_sessions ENABLE ROW LEVEL SECURITY;

-- Anyone can read active sessions
CREATE POLICY "Anyone can read live sessions" ON public.live_sessions
  FOR SELECT USING (is_active = TRUE);

-- ============================================================================
-- SESSION PARTICIPANTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.session_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT NOT NULL REFERENCES public.live_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(session_id, user_id)
);

ALTER TABLE public.session_participants ENABLE ROW LEVEL SECURITY;

-- Users can read their own participation
CREATE POLICY "Users can read own participation" ON public.session_participants
  FOR SELECT USING (auth.uid() = user_id);

-- ============================================================================
-- PAYMENTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  stripe_payment_intent_id TEXT UNIQUE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'refunded')),
  payment_method TEXT,
  product_type TEXT CHECK (product_type IN ('course', 'pdf', 'mentorship', 'bundle')),
  product_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Users can read their own payments
CREATE POLICY "Users can read own payments" ON public.payments
  FOR SELECT USING (auth.uid() = user_id);

-- Admins can read all payments
CREATE POLICY "Admins can read all payments" ON public.payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================================
-- TIKTOK ACCOUNT REQUESTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.tiktok_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  desired_password TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
  group_id UUID,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.tiktok_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own tiktok requests" ON public.tiktok_requests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tiktok requests" ON public.tiktok_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can read all tiktok requests" ON public.tiktok_requests
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update tiktok requests" ON public.tiktok_requests
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================================================
-- TIKTOK GROUPS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.tiktok_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  order_index INTEGER NOT NULL,
  max_members INTEGER DEFAULT 250,
  invite_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.tiktok_groups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage tiktok groups" ON public.tiktok_groups
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================================================
-- TIKTOK GROUP MEMBERS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.tiktok_group_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES public.tiktok_groups(id) ON DELETE CASCADE,
  request_id UUID NOT NULL REFERENCES public.tiktok_requests(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(group_id, position),
  UNIQUE(group_id, request_id)
);

ALTER TABLE public.tiktok_group_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage group members" ON public.tiktok_group_members
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Seed 50 TikTok groups
INSERT INTO public.tiktok_groups (name, order_index)
VALUES
  ('TikTok Builders 1', 1),
  ('TikTok Builders 2', 2),
  ('TikTok Builders 3', 3),
  ('TikTok Builders 4', 4),
  ('TikTok Builders 5', 5),
  ('Scale on TikTok 1', 6),
  ('Scale on TikTok 2', 7),
  ('Scale on TikTok 3', 8),
  ('Scale on TikTok 4', 9),
  ('Scale on TikTok 5', 10),
  ('Grow on TikTok 1', 11),
  ('Grow on TikTok 2', 12),
  ('Grow on TikTok 3', 13),
  ('Grow on TikTok 4', 14),
  ('Grow on TikTok 5', 15),
  ('Creators to Cash 1', 16),
  ('Creators to Cash 2', 17),
  ('Creators to Cash 3', 18),
  ('Creators to Cash 4', 19),
  ('Creators to Cash 5', 20),
  ('Post & Prosper 1', 21),
  ('Post & Prosper 2', 22),
  ('Post & Prosper 3', 23),
  ('Post & Prosper 4', 24),
  ('Post & Prosper 5', 25),
  ('TikTok Momentum 1', 26),
  ('TikTok Momentum 2', 27),
  ('TikTok Momentum 3', 28),
  ('TikTok Momentum 4', 29),
  ('TikTok Momentum 5', 30),
  ('Audience Accelerators 1', 31),
  ('Audience Accelerators 2', 32),
  ('Audience Accelerators 3', 33),
  ('Audience Accelerators 4', 34),
  ('Audience Accelerators 5', 35),
  ('Viral Builders 1', 36),
  ('Viral Builders 2', 37),
  ('Viral Builders 3', 38),
  ('Viral Builders 4', 39),
  ('Viral Builders 5', 40),
  ('TikTok Launchpad 1', 41),
  ('TikTok Launchpad 2', 42),
  ('TikTok Launchpad 3', 43),
  ('TikTok Launchpad 4', 44),
  ('TikTok Launchpad 5', 45),
  ('Scale Creators 1', 46),
  ('Scale Creators 2', 47),
  ('Scale Creators 3', 48),
  ('Scale Creators 4', 49),
  ('Scale Creators 5', 50)
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- ANALYTICS EVENTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  event_name TEXT NOT NULL,
  event_data JSONB,
  user_agent TEXT,
  ip_address TEXT,
  referrer TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Only admins can read analytics
CREATE POLICY "Only admins can read analytics" ON public.analytics_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Allow anyone to insert analytics (for tracking)
CREATE POLICY "Anyone can insert analytics" ON public.analytics_events
  FOR INSERT WITH CHECK (TRUE);

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_courses_updated_at ON public.courses;
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_pdfs_updated_at ON public.pdfs;
CREATE TRIGGER update_pdfs_updated_at BEFORE UPDATE ON public.pdfs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_mentorship_products_updated_at ON public.mentorship_products;
CREATE TRIGGER update_mentorship_products_updated_at BEFORE UPDATE ON public.mentorship_products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_live_sessions_updated_at ON public.live_sessions;
CREATE TRIGGER update_live_sessions_updated_at BEFORE UPDATE ON public.live_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically create user profile after signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, full_name, email, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NULL)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- SEED DATA (Run after creating tables)
-- ============================================================================

-- Insert courses
INSERT INTO public.courses (id, title, description, price, thumbnail_url, duration_weeks, total_lessons) VALUES
('crs_001', 'How to Turn What You Know Into $10k Monthly', 'Master the complete system for transforming your knowledge and skills into consistent $10,000+ monthly income. Includes 2 step-by-step video trainings and 1 comprehensive implementation ebook.', 57.99, 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=480', 2, 3)
ON CONFLICT (id) DO NOTHING;

-- Insert PDFs
INSERT INTO public.pdfs (id, title, description, price, thumbnail_url, file_url) VALUES
('pdf_001', 'Link-in-Bio Setup Guide', 'Step-by-step template for creating a high-converting link-in-bio page.', 14.99, 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=480', '/pdfs/link-in-bio-guide.pdf'),
('pdf_002', 'Brand Deal Email Templates', '10 plug-and-play email scripts to land your first brand partnership.', 19.99, 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=480', '/pdfs/brand-deal-templates.pdf'),
('pdf_003', 'Content Calendar Planner', '90-day content planner with prompts and analytics tracker.', 29.99, 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=480', '/pdfs/content-calendar.pdf')
ON CONFLICT (id) DO NOTHING;

-- Insert mentorship product
INSERT INTO public.mentorship_products (id, title, description, price, duration_minutes) VALUES
('mentorship-2hr', '2-Hour 1:1 Strategy Session with CC Mendel', 'Get personalized guidance on building your creator business. We''ll audit your current setup, map out your monetization strategy, and create an actionable 90-day plan.', 950.00, 120)
ON CONFLICT (id) DO NOTHING;

-- Insert a default admin user (you'll need to sign up with this email in Supabase Auth first)
-- Then run: UPDATE public.users SET role = 'admin' WHERE email = 'ccmendel@creatorcashcow.com';
