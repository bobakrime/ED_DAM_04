'use client';

import { createClient } from '../utils/supabase-client';
import { useState, useEffect } from 'react';

export default function DebugEnvPage() {
    const supabase = createClient();
    const [url, setUrl] = useState('');
    const [key, setKey] = useState('');

    useEffect(() => {
        // Safe access to env vars
        setUrl(process.env.NEXT_PUBLIC_SUPABASE_URL || 'UNDEFINED');
        // Only show first/last few chars for security
        const keyVal = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'UNDEFINED';
        setKey(keyVal.length > 10 ? `${keyVal.substring(0, 5)}...${keyVal.substring(keyVal.length - 5)}` : keyVal);
    }, []);

    return (
        <div className="p-10 font-mono text-sm break-all">
            <h1 className="text-xl font-bold mb-4">Environment Debugger</h1>

            <div className="mb-4">
                <strong>Origin:</strong> {typeof window !== 'undefined' ? window.location.origin : 'Server'}
            </div>

            <div className="mb-4 bg-gray-100 p-2 rounded">
                <strong>NEXT_PUBLIC_SUPABASE_URL:</strong><br />
                {url}
            </div>

            <div className="mb-4 bg-gray-100 p-2 rounded">
                <strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong><br />
                {key}
            </div>

            <div className="mt-8 border-t pt-4">
                <strong>Instruction:</strong> verify that the URL matches the one in your Google Cloud Console redirect URI (pdysaahk...).
            </div>
        </div>
    );
}
