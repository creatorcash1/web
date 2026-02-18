-- CreatorCashCow Database Schema for Supabase
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- USERS TABLE (extends Supabase auth.users)
-- ============================================================================
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  avatar_url TEXT,
  is_suspended BOOLEAN DEFAULT FALSE<
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
CREATE TABLE public.courses (
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
CREATE TABLE public.course_modules (
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
-- USER ENROLLMENTS
-- ============================================================================
CREATE TABLE public.user_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  progress DECIMAL(5,2) DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
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

-- ============================================================================
-- PDFS / DIGITAL PRODUCTS
-- ============================================================================
CREATE TABLE public.pdfs (
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
CREATE TABLE public.user_pdf_purchases (
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
CREATE TABLE public.mentorship_products (
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
CREATE TABLE public.mentorship_bookings (
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
CREATE TABLE public.live_sessions (
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
CREATE TABLE public.session_participants (
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
CREATE TABLE public.payments (
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
-- ANALYTICS EVENTS
-- ============================================================================
CREATE TABLE public.analytics_events (
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
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pdfs_updated_at BEFORE UPDATE ON public.pdfs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mentorship_products_updated_at BEFORE UPDATE ON public.mentorship_products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

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
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- SEED DATA (Run after creating tables)
-- ============================================================================

-- Insert courses
INSERT INTO public.courses (id, title, description, price, thumbnail_url, duration_weeks, total_lessons) VALUES
('crs_001', 'UGC Mastery', 'Land brand deals, create scroll-stopping content, and build a UGC portfolio that brands pay for.', 199.00, 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=480', 6, 24),
('crs_002', 'Dropshipping Profits', 'Launch a profitable online store from scratch with no inventory — proven strategies.', 299.00, 'https://images.unsplash.com/photo-1556740758-90de940a6939?w=480', 8, 32),
('crs_003', 'TikTok Shop Blueprint', 'Turn TikTok into your personal storefront — master live selling, product launches, and viral hooks.', 249.00, 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=480', 5, 20),
('crs_004', 'Platform Builder Pro', 'Create your own digital platform — courses, membership sites, and automated revenue systems.', 449.00, 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=480', 10, 40),
('crs_005', 'PDF Empire', 'Design, market, and sell profitable digital downloads — guides, templates, workbooks, and more.', 149.00, 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=480', 4, 16);

-- Insert PDFs
INSERT INTO public.pdfs (id, title, description, price, thumbnail_url, file_url) VALUES
('pdf_001', 'Link-in-Bio Setup Guide', 'Step-by-step template for creating a high-converting link-in-bio page.', 14.99, 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=480', '/pdfs/link-in-bio-guide.pdf'),
('pdf_002', 'Brand Deal Email Templates', '10 plug-and-play email scripts to land your first brand partnership.', 19.99, 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=480', '/pdfs/brand-deal-templates.pdf'),
('pdf_003', 'Content Calendar Planner', '90-day content planner with prompts and analytics tracker.', 29.99, 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=480', '/pdfs/content-calendar.pdf');

-- Insert mentorship product
INSERT INTO public.mentorship_products (id, title, description, price, duration_minutes) VALUES
('mentorship-2hr', '2-Hour 1:1 Strategy Session with CC Mendel', 'Get personalized guidance on building your creator business. We'll audit your current setup, map out your monetization strategy, and create an actionable 90-day plan.', 950.00, 120);

-- Insert a default admin user (you'll need to sign up with this email in Supabase Auth first)
-- Then run: UPDATE public.users SET role = 'admin' WHERE email = 'ccmendel@creatorcashcow.com';
