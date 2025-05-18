
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://qlhlctnewasecayjnitr.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsaGxjdG5ld2FzZWNheWpuaXRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczNTQ3ODEsImV4cCI6MjA2MjkzMDc4MX0.Dr7WTegg96VpxMKLD3rC5cbhexAGGs3ITyR1T1pxcxA";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
