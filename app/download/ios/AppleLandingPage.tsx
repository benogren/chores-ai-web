'use client';
import { LoaderCircle } from 'lucide-react';
import { useEffect } from 'react';

export default function AppleLandingPage() {
    
    useEffect(() => {
        // Redirect to the Apple App Store link
        window.location.href = 'https://apps.apple.com/us/app/choresai-smart-family-tasks/id6747013648'; // Replace with your actual App Store link
    }, []);
    
    return (
        <div className='container mx-auto text-center p-4'>
            <div className='flex flex-col items-center justify-center min-h-screen'>
                <LoaderCircle className="animate-spin mx-auto my-4 text-gray-300" size={32} />
                <p className='bg-gradient-to-br from-purple-600 to-teal-600 bg-clip-text text-transparent'>Redirecting to the Apple App Store...</p>
            </div>
        </div>
    );
}