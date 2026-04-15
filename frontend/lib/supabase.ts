import { createBrowserClient } from "@supabase/ssr";

/**
 * Singleton Supabase browser client for use in Client Components.
 * For Server Components / Route Handlers, create a new server client
 * using createServerClient() from @supabase/ssr with cookie handling.
 */
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
