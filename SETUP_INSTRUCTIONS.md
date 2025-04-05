# Supabase Authentication Setup Instructions

This application has been configured to use Supabase for authentication and user profiles. Follow these steps to get everything working.

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com/) and sign up for a free account
2. Create a new project
3. Choose a name, password, and region for your project
4. Wait for your project to be created (this may take a few minutes)

## Step 2: Configure Environment Variables

1. Copy the `.env.example` file to `.env`
2. Go to your Supabase project dashboard
3. Navigate to Project Settings → API
4. Copy the "Project URL" and "anon/public" key
5. Update your `.env` file with these values:
   ```
   VITE_SUPABASE_URL=your-supabase-project-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

## Step 3: Create the Profiles Table

1. Go to your Supabase dashboard
2. Navigate to the SQL Editor tab
3. Create a new query
4. Copy and paste the following SQL code:

```sql
-- First, drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS create_profile_for_user();

-- Create or update the profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  job_title TEXT,
  company TEXT,
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create a secure RLS policy
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- Create policies
CREATE POLICY "Users can insert their own profile" 
  ON profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view their own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Create improved trigger function with error handling
CREATE OR REPLACE FUNCTION create_profile_for_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert with error handling
  BEGIN
    INSERT INTO profiles (id, name, email, first_name, last_name)
    VALUES (
      NEW.id, 
      COALESCE(NEW.raw_user_meta_data->>'name', 'User'), 
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'name', ''),
      ''
    );
    EXCEPTION WHEN OTHERS THEN
      -- Log error but don't fail the transaction
      RAISE NOTICE 'Error creating profile for user %: %', NEW.id, SQLERRM;
  END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_profile_for_user();
```

5. Run the query to create the profiles table and trigger

## Step 4: Configure Authentication Settings

1. Go to Authentication → Providers → Email
2. Consider disabling "Email confirmation" during development if you want users to log in immediately
3. Go to Authentication → URL Configuration
4. Set the Site URL to `http://localhost:5173` (or your actual development URL)
5. Set Redirect URLs to include `http://localhost:5173/*` for development

## Step 5: Start the App

1. Install dependencies if you haven't already:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm run dev
   ```

3. Visit `http://localhost:5173` in your browser
4. Navigate to the signup page and create an account
5. After signing in, you should be able to view and update your profile

## Troubleshooting

### Database Errors When Saving a User

If you see errors when saving a user, check:
- That you've run the SQL query correctly
- That the RLS policies are set up properly
- Try dropping and recreating the profiles table and trigger

### CORS Errors

If you see CORS errors:
- Go to Project Settings → API → CORS
- Add `http://localhost:5173` (without trailing slash) to the list of allowed origins

### Authentication Issues

If login/signup isn't working:
- Check your environment variables are set correctly
- Ensure you're using the right API URL and key
- Look at the browser console for error messages

## Next Steps

Once authentication and profiles are working:
1. Implement additional profile fields
2. Add avatar upload functionality
3. Create admin-only views
4. Add social login providers 