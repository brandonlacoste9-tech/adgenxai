// Server-side authentication utilities
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

/**
 * Get authenticated user from server-side context
 * Returns null if not authenticated or Supabase not configured
 */
export async function getUser() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // Supabase not configured - return null
    return null;
  }

  try {
    // Get cookies to extract session
    const cookieStore = await cookies();
    const authCookie = cookieStore.get("sb-auth-token");

    if (!authCookie) {
      return null;
    }

    // Create Supabase client with session
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Get user from session
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    return user;
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getUser();
  return user !== null;
}

/**
 * Get user ID for scoping queries
 */
export async function getUserId(): Promise<string | null> {
  const user = await getUser();
  return user?.id || null;
}
