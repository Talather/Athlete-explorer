import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = "https://veoivkpeywpcyxaikgng.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlb2l2a3BleXdwY3l4YWlrZ25nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0MTg3NjIsImV4cCI6MjA1Nzk5NDc2Mn0.fDjREiYtZq9n4gWDnAhLGzZKCCMBHJ-UYsYLJXxMzYE";

export const createClient = () => {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}
