'use client';

import { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { createClient } from '../utils/supabase-client';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signOut: () => Promise<void>;
    refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    signOut: async () => { },
    refreshSession: async () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Use singleton supabase client
    const supabase = useMemo(() => createClient(), []);

    // Refresh session function
    const refreshSession = useCallback(async () => {
        try {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error) {
                console.error('Error refreshing session:', error);
                setUser(null);
            } else {
                setUser(session?.user ?? null);
            }
        } catch (err) {
            console.error('Exception refreshing session:', err);
            setUser(null);
        }
        setLoading(false);
    }, [supabase]);

    useEffect(() => {
        // Initial session check
        refreshSession();

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            console.log('[AuthContext] Auth state change:', event, session?.user?.email);
            setUser(session?.user ?? null);
            setLoading(false);
            // Note: Removed router.refresh() here as it was causing navigation issues
        });

        return () => subscription.unsubscribe();
    }, [supabase, refreshSession]);

    const signOut = useCallback(async () => {
        await supabase.auth.signOut();
        setUser(null);
        router.refresh();
    }, [supabase, router]);

    return (
        <AuthContext.Provider value={{ user, loading, signOut, refreshSession }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    return useContext(AuthContext);
};
