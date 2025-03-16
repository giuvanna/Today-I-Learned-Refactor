import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://wsaxaeixjhqxwfijzkew.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndzYXhhZWl4amhxeHdmaWp6a2V3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDExMjY0MDEsImV4cCI6MjA1NjcwMjQwMX0.Bbm-sAWdFnTYrLkxQ57IU8gVIGEFdxzLF-2uO42OyPw";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
