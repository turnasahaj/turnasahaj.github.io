import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm"

const supabaseUrl = "https://ndicmhrzgqpkvzegajqv.supabase.co"
const supabaseAnonKey = "sb_publishable_T3GicFHij8XeMaBT8qUQ2g_R2mxEev3"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
