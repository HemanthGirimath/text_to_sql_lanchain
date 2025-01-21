'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Session } from '@supabase/supabase-js';

interface User {
    id: string;
    email?: string;
}

export function useUser() {
    const [user, setUser] = useState<User | null>(null);
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser({
                    id: user.id,
                    email: user.email || undefined
                });
            }
        };

        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event: string, session: Session | null) => {
            if (session?.user) {
                setUser({
                    id: session.user.id,
                    email: session.user.email || undefined
                });
            } else {
                setUser(null);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [supabase.auth]);

    return { user };
}
