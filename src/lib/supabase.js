import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nargvalmcrunehnemvpa.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hcmd2YWxtY3J1bmVobmVtdnBhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1NjQwMDYsImV4cCI6MjA1NzE0MDAwNn0.H02c_h7UThRWp683e55sRWLiMxRedTuhXhIxyf_O4p4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
