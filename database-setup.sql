-- Database setup for user profile functionality

-- Create or update users table with profile fields
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT,
    email TEXT,
    phone TEXT,
    profilePicture TEXT,
    language TEXT DEFAULT 'en',
    currency TEXT DEFAULT 'USD',
    country TEXT,
    -- Notification preferences
    notifications_email BOOLEAN DEFAULT true,
    notifications_sms BOOLEAN DEFAULT false,
    notifications_browser BOOLEAN DEFAULT true,
    notifications_events BOOLEAN DEFAULT true,
    notifications_messages BOOLEAN DEFAULT true,
    notifications_subscriptions BOOLEAN DEFAULT true,
    notifications_marketing BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add columns if they don't exist (for existing users table)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'username') THEN
        ALTER TABLE users ADD COLUMN username TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'email') THEN
        ALTER TABLE users ADD COLUMN email TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'phone') THEN
        ALTER TABLE users ADD COLUMN phone TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'profilePicture') THEN
        ALTER TABLE users ADD COLUMN profilePicture TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'language') THEN
        ALTER TABLE users ADD COLUMN language TEXT DEFAULT 'en';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'currency') THEN
        ALTER TABLE users ADD COLUMN currency TEXT DEFAULT 'USD';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'country') THEN
        ALTER TABLE users ADD COLUMN country TEXT;
    END IF;
    
    -- Add notification preference columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'notifications_email') THEN
        ALTER TABLE users ADD COLUMN notifications_email BOOLEAN DEFAULT true;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'notifications_sms') THEN
        ALTER TABLE users ADD COLUMN notifications_sms BOOLEAN DEFAULT false;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'notifications_browser') THEN
        ALTER TABLE users ADD COLUMN notifications_browser BOOLEAN DEFAULT true;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'notifications_events') THEN
        ALTER TABLE users ADD COLUMN notifications_events BOOLEAN DEFAULT true;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'notifications_messages') THEN
        ALTER TABLE users ADD COLUMN notifications_messages BOOLEAN DEFAULT true;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'notifications_subscriptions') THEN
        ALTER TABLE users ADD COLUMN notifications_subscriptions BOOLEAN DEFAULT true;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'notifications_marketing') THEN
        ALTER TABLE users ADD COLUMN notifications_marketing BOOLEAN DEFAULT false;
    END IF;
END $$;

-- Create storage bucket for user assets (run this in Supabase dashboard)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('user-assets', 'user-assets', true);

-- Set up RLS policies for users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy for users to read their own data
CREATE POLICY IF NOT EXISTS "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid()::text = id);

-- Policy for users to update their own data
CREATE POLICY IF NOT EXISTS "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id);

-- Policy for users to insert their own data
CREATE POLICY IF NOT EXISTS "Users can insert their own profile" ON users
    FOR INSERT WITH CHECK (auth.uid()::text = id);

-- Storage policies for user-assets bucket (run these in Supabase dashboard)
-- CREATE POLICY "Users can upload their own profile pictures" ON storage.objects
--     FOR INSERT WITH CHECK (bucket_id = 'user-assets' AND auth.uid()::text = (storage.foldername(name))[1]);

-- CREATE POLICY "Users can view profile pictures" ON storage.objects
--     FOR SELECT USING (bucket_id = 'user-assets');

-- CREATE POLICY "Users can update their own profile pictures" ON storage.objects
--     FOR UPDATE USING (bucket_id = 'user-assets' AND auth.uid()::text = (storage.foldername(name))[1]);

-- CREATE POLICY "Users can delete their own profile pictures" ON storage.objects
--     FOR DELETE USING (bucket_id = 'user-assets' AND auth.uid()::text = (storage.foldername(name))[1]);
