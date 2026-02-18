# 🚀 Production Launch Setup Guide

## Time Required: ~30 minutes

Follow these steps IN ORDER to get CreatorCashCow ready for tonight's launch.

---

## 1. Supabase Setup (10 minutes)

### Create Project
1. Go to [https://supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose a name: `creatorcash` 
4. Set a secure database password (save it!)
5. Select region closest to your users
6. Wait for project to provision (~2 minutes)

### Run Database Schema
1. In Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Open `supabase-schema.sql` from your project root
4. Copy the ENTIRE file content
5. Paste into SQL Editor
6. Click **Run** button
7. ✅ You should see "Success. No rows returned"

### Get API Keys
1. Go to **Project Settings** → **API**
2. Copy these values:
   - `Project URL` → This is your `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → This is your `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)

### Configure Auth
1. Go to **Authentication** → **URL Configuration**
2. Add these redirect URLs:
   ```
   http://localhost:3000/auth/callback
   https://yourmaindomain.com/auth/callback
   ```
3. Go to **Authentication** → **Providers**
4. Enable **Email** provider
5. Disable email confirmation (for faster signup):
   - Go to **Authentication** → **Settings**
   - Turn OFF "Enable email confirmations"

---

## 2. Stripe Setup (10 minutes)

### Create Account
1. Go to [https://stripe.com](https://stripe.com) and sign up
2. Complete business verification (can use "test mode" for tonight)

### Get API Keys
1. Go to **Developers** → **API Keys**
2. Copy these:
   - `Publishable key` → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `Secret key` → `STRIPE_SECRET_KEY`

### Create Products (Important!)
1. Go to **Products** → **Add Product**
2. Create these 5 courses (match the IDs in our code):
   - **UGC Mastery** - $199 - ID: `crs_001`
   - **Dropshipping Profits** - $299 - ID: `crs_002`
   - **TikTok Shop Blueprint** - $249 - ID: `crs_003`
   - **Platform Builder Pro** - $449 - ID: `crs_004`
   - **PDF Empire** - $149 - ID: `crs_005`

3. Create these 3 PDFs:
   - **Link-in-Bio Setup Guide** - $14.99 - ID: `pdf_001`
   - **Brand Deal Email Templates** - $19.99 - ID: `pdf_002`
   - **Content Calendar Planner** - $29.99 - ID: `pdf_003`

4. Create mentorship:
   - **2-Hour 1:1 Strategy Session** - $950 - ID: `mentorship-2hr`

### Create Webhook (for production)
1. Go to **Developers** → **Webhooks**
2. Click "Add Endpoint"
3. URL: `https://yourdomain.com/api/webhooks/stripe`
4. Select these events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy the **Signing Secret** → `STRIPE_WEBHOOK_SECRET`

---

## 3. Environment Variables (2 minutes)

1. Open `.env.local` in your project root
2. Fill in ALL the values you copied:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000  # Change to your domain for production
JWT_SECRET=your-super-secret-random-string-min-32-chars

# Admin
ADMIN_EMAIL=ccmendel@creatorcashcow.com
```

3. **Generate JWT Secret**: Run this in PowerShell:
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

---

## 4. Create Admin Account (3 minutes)

1. Start your dev server:
```bash
npm run dev
```

2. Go to `http://localhost:3000/register`

3. Sign up with your admin email:
   - Name: CC Mendel
   - Email: `ccmendel@creatorcashcow.com` (or whatever you set as ADMIN_EMAIL)
   - Password: (choose a strong password)

4. Go back to **Supabase Dashboard** → **SQL Editor**

5. Run this query to make yourself admin:
```sql
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'ccmendel@creatorcashcow.com';
```

6. Refresh your browser and go to `/admin` - you should have access!

---

## 5. Test the System (5 minutes)

### Test Authentication
- ✅ Sign up a test user
- ✅ Sign out
- ✅ Sign in again
- ✅ Access dashboard

### Test Dashboard
- ✅ Dashboard loads without errors
- ✅ No courses shown (new user)
- ✅ AI Brain section visible

### Test Admin
- ✅ Go to `/admin`
- ✅ Can see admin dashboard
- ✅ Stats load correctly

### Test Payment Flow (Test Mode)
- ✅ Click "Get Full Access" on homepage
- ✅ Redirects to register
- ✅ After registration, can see checkout page
- ✅ Use Stripe test card: `4242 4242 4242 4242`, exp: any future date, CVC: any 3 digits
- ✅ Payment processes successfully
- ⚠️ Note: Real enrollment will work once we complete Stripe webhook handler

---

## 6. Deploy to Production

### Option A: Vercel (Recommended - 5 minutes)
1. Push code to GitHub
2. Go to [https://vercel.com](https://vercel.com)
3. Import your repository
4. Add all environment variables from `.env.local`
5. Update `NEXT_PUBLIC_APP_URL` to your production domain
6. Deploy!

### Option B: Other Platforms
- **Netlify**: Similar to Vercel
- **Railway**: Good for full-stack apps
- **DigitalOcean App Platform**: More control

### Post-Deployment
1. Update Stripe webhook URL to production domain
2. Update Supabase redirect URLs to production domain  
3. Switch Stripe to **Live Mode** when ready for real payments
4. Test the entire flow on production

---

## 🎉 You're Live!

Your platform is now ready to accept:
- ✅ Real user signups
- ✅ Secure authentication
- ✅ Real payments (Stripe)
- ✅ Course enrollments
- ✅ PDF purchases
- ✅ Mentorship bookings

---

## Need Help?

### Common Issues

**"Invalid API Key" error**
- Double-check environment variables are exact copies
- Make sure no extra spaces
- Restart dev server after changing `.env.local`

**"Row Level Security" errors**
- Make sure you ran the ENTIRE schema file
- Check that RLS policies were created
- Try re-running the schema

**"User not found" in dashboard**
- Sign out completely
- Clear browser cookies
- Sign in again

**Payments not working**
- Verify Stripe keys are in test mode (start with `pk_test_` and `sk_test_`)
- Check that product IDs in Stripe match code exactly
- Look at Stripe Dashboard → Logs for errors

---

## Next Steps (After Launch)

1. **Email Integration**: Add SendGrid/Resend for transactional emails
2. **Video Hosting**: Integrate Vimeo/Mux for course videos
3. **Analytics**: Add Google Analytics, Mixpanel, or PostHog
4. **Live Sessions**: Integrate Zoom/StreamYard for live calls
5. **PDF Storage**: Upload PDFs to Supabase Storage
6. **Custom Domain**: Point your domain to Vercel
7. **SSL Certificate**: Vercel provides this automatically

---

**Remember**: Start in Stripe **Test Mode** tonight. Switch to Live Mode only when you're confident everything works!
