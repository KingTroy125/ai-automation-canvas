# Setting Up Supabase Authentication

This application uses Supabase for authentication. Follow these steps to set up your own Supabase project and connect it to the application.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com/) and sign up for a free account if you don't have one.
2. Create a new project from the Supabase dashboard.
3. Choose a name for your project and set a secure database password.
4. Select a region closest to your target audience.
5. Wait for your project to be created (this may take a few minutes).

## 2. Configure Authentication

1. In your Supabase project dashboard, go to **Authentication** → **Providers**.
2. Ensure that **Email** provider is enabled.
3. You can configure additional providers like Google, GitHub, etc. if needed.

## 3. Configure Email Templates (Optional)

1. Go to **Authentication** → **Email Templates**.
2. Customize the email templates for confirmation emails, magic links, etc.

## 4. Get API Keys

1. Go to **Project Settings** → **API**.
2. Find your project URL and anon/public key.

## 5. Set Up Environment Variables

1. Create a `.env` file in the root of your project (or copy `.env.example` to `.env`).
2. Add the following environment variables:

```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Replace `your-supabase-url` and `your-supabase-anon-key` with the values from your Supabase project.

## 6. Run the Application

Start the application with:

```bash
npm run dev
```

## Additional Configuration (Optional)

### Email Confirmation

By default, Supabase requires email confirmation. You can change this behavior:

1. Go to **Authentication** → **Providers** → **Email**.
2. Toggle "Enable email confirmations" on or off according to your preference.

### User Profiles Table

For more user data, create a profiles table with the following SQL:

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

## Troubleshooting

- **Confirmation Emails Not Arriving**: Check your spam folder or configure your email settings in Supabase.
- **Authentication Errors**: Check that your environment variables are correctly set and that you're using the correct API keys.
- **CORS Errors**: Make sure your site's URL is added to the allowed list in Supabase project settings under **API** → **Settings** → **CORS**.

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth) 