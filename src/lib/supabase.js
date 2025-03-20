import { createClient } from "@supabase/supabase-js";

// const supabaseUrl = "https://nargvalmcrunehnemvpa.supabase.co";
// const supabaseAnonKey =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hcmd2YWxtY3J1bmVobmVtdnBhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1NjQwMDYsImV4cCI6MjA1NzE0MDAwNn0.H02c_h7UThRWp683e55sRWLiMxRedTuhXhIxyf_O4p4";
  const supabaseUrl = "https://veoivkpeywpcyxaikgng.supabase.co";
  const supabaseAnonKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlb2l2a3BleXdwY3l4YWlrZ25nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0MTg3NjIsImV4cCI6MjA1Nzk5NDc2Mn0.fDjREiYtZq9n4gWDnAhLGzZKCCMBHJ-UYsYLJXxMzYE";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
