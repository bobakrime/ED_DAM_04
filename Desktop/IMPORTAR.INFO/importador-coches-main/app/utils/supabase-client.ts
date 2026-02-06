import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

// Singleton instance - crucial for session synchronization
let browserClient: SupabaseClient | null = null;

export const createClient = () => {
    if (browserClient) {
        return browserClient;
    }

    browserClient = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            auth: {
                flowType: 'implicit',
                detectSessionInUrl: true,
                persistSession: true,
                autoRefreshToken: true,
            }
        }
    );

    return browserClient;
};
